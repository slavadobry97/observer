import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GEMINI_API_KEY not configured' },
            { status: 500 }
        );
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { action, article } = body;

        if (action === 'briefing') {
            const result = await generateBriefing(ai);
            return NextResponse.json({ text: result });
        }

        if (action === 'article' && article) {
            const result = await generateArticle(ai, article);
            return NextResponse.json({ text: result });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Gemini API error:', error);
        const isRateLimit = error?.message?.includes('429') ||
            error?.status === 429 ||
            error?.message?.includes('RESOURCE_EXHAUSTED');

        if (isRateLimit) {
            return NextResponse.json(
                {
                    text: `<p>К сожалению, серверы университета перегружены (Ошибка 429).</p>
                    <p>Пожалуйста, подождите минуту. Наши редакторы-роботы уже пьют кофе в "Кофейке" и скоро вернутся к работе.</p>`,
                    error: 'rate_limit'
                },
                { status: 429 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1500): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        const msg = error?.message || '';
        const isRateLimit = msg.includes('429') ||
            error?.status === 429 ||
            msg.includes('RESOURCE_EXHAUSTED');
        const isNetworkError = msg.includes('fetch failed') ||
            msg.includes('UND_ERR_SOCKET') ||
            msg.includes('ECONNRESET') ||
            error?.cause?.code === 'UND_ERR_SOCKET';
        const isRetryable = isRateLimit || isNetworkError;

        if (retries > 0 && isRetryable) {
            const reason = isRateLimit ? 'Rate limit' : 'Network error';
            console.warn(`${reason}. Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

async function generateBriefing(ai: GoogleGenAI): Promise<string> {
    try {
        return await withRetry(async () => {
            const prompt = `
      Напиши короткую сводку новостей (1-2 предложения) для бегущей строки университетской газеты.
      Соблюдай строгую субординацию (Имя Отчество) при упоминании администрации и сотрудников.
      Сделай это весело и жизненно.
    `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text || "В ОСО сегодня ажиотаж, а Ирина Олеговна распорядилась завезти новые пуфики в коридоры.";
        });
    } catch (error: any) {
        if (error?.message?.includes('User location is not supported') || error?.status === 400) {
            console.warn("Gemini API is not available in this region (Geo-blocked). Using fallback.");
            return "В ОСО сегодня ажиотаж, а Ирина Олеговна распорядилась завезти новые пуфики в коридоры.";
        }
        console.error("Gemini Briefing failed:", error);
        return "В ОСО сегодня ажиотаж, а Ирина Олеговна распорядилась завезти новые пуфики в коридоры.";
    }
}

async function generateArticle(ai: GoogleGenAI, article: { title: string }): Promise<string> {
    try {
        return await withRetry(async () => {
            const prompt = `
      Ты — студент-журналист университетского издания "Студенческий Обозреватель".
      Напиши полную статью на русском языке на основе заголовка: "${article.title}".
      
      АВТОР: Придумай творческий псевдоним, состоящий из реального популярного имени и тематической фамилии 
      (например: Евгений Репортажный, Иван Инсайдов, Вера Вестникова, Максим Дедлайнов, Егор Свистков).
      
      КОНТЕКСТ УНИВЕРСИТЕТА (ОБЯЗАТЕЛЬНО):
      - Университет — это одно компактное здание на 4 этажа.
      
      РОЛИ ПЕРСОНАЛА (ВАЖНО):
      - Ауд. 201: Вальтер Валерия Яновна, Рослик Елизавета Юрьевна.
      - Смоляк Светлана Алексеевна (ведущий специалист, ауд. 201): Организатор, вместе со Студсоветом (ауд. 207) отвечает за ВСЮ подготовку мероприятий (включая "Важную перемену").
      - Исбанов Эмиль Эмильевич (ауд. 201): Дизайнер и ФОТОГРАФ. Рисует афиши, делает заставки для сайта/ТГ, проводит фотосессии. Он НЕ делает технические заставки для экранов на мероприятиях.
      - Добринец Вячеслав Викторович (ауд. 201): Техник-программист, отвечает за код, сервера и стабильность сети.
      
      АДМИНИСТРАЦИЯ (СУБОРДИНАЦИЯ):
      - Ирина Олеговна Селезнева (Директор), Виолета Валентиновна Пакштайте (Идеология), Дмитрий Валерьевич Бабинский (Цифра).
      
      ПРАВИЛО СТИЛЯ:
      - Профессиональный студенческий репортаж. Субординация (Имя Отчество) для всех сотрудников.
      - Длина: 400-500 слов. HTML разметка.
    `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text || "<p>Приносим извинения, но цифровая печатная машина университета временно не работает.</p>";
        });
    } catch (error) {
        console.error("Gemini Article failed:", error);
        return "<p>Приносим извинения, но цифровая печатная машина университета временно не работает (ИИ недоступен).</p>";
    }
}
