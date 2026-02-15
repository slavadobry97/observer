import { WeatherData } from "./types";

/**
 * Получает текущую погоду для Минска (53.9, 27.5667)
 */
export const fetchMinskWeather = async (): Promise<WeatherData> => {
    try {
        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=53.9&longitude=27.5667&current=temperature_2m,weather_code&windspeed_unit=ms&timezone=Europe%2FMoscow"
        );
        const data = await response.json();

        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;

        const conditions: Record<number, string> = {
            0: "Ясно",
            1: "Преимущественно ясно",
            2: "Переменная облачность",
            3: "Пасмурно",
            45: "Туман",
            48: "Иней",
            51: "Легкая морось",
            53: "Морось",
            55: "Плотная морось",
            61: "Слабый дождь",
            63: "Дождь",
            65: "Сильный дождь",
            71: "Слабый снегопад",
            73: "Снегопад",
            75: "Сильный снегопад",
            77: "Снежные зерна",
            80: "Слабый ливень",
            81: "Ливень",
            82: "Сильный ливень",
            85: "Слабый снежный ливень",
            86: "Сильный снежный ливень",
            95: "Гроза",
        };

        return {
            temp,
            condition: conditions[code] || "Облачно",
        };
    } catch (error) {
        console.error("Ошибка при получении погоды:", error);
        return { temp: 18, condition: "Облачно" };
    }
};
