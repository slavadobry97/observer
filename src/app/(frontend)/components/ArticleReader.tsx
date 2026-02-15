'use client';

import React, { useEffect, useState } from 'react';
import { Article } from '../lib/types';
import { getArticleImageUrl } from '../lib/utils';
import { X, Printer, Share2, Check, RefreshCw } from 'lucide-react';

interface ArticleReaderProps {
    article: Article | null;
    onClose: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchContent = async (art: Article) => {
        setLoading(true);
        setError(false);
        setContent('');
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'article', article: { title: art.title } }),
            });
            const data = await res.json();
            if (res.status === 429 || data.error === 'rate_limit') {
                setError(true);
            }
            setContent(data.text || '');
        } catch (err) {
            setError(true);
            setContent('<p>Ошибка загрузки статьи.</p>');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (article) {
            if (article.content) {
                setContent(article.content);
                setLoading(false);
            } else {
                fetchContent(article);
            }
        }
    }, [article]);

    const handlePrint = () => {
        if (loading || error) return;
        window.print();
    };

    const handleShare = async () => {
        if (!article) return;

        const shareData = {
            title: `Студенческий Обозреватель: ${article.title}`,
            text: article.excerpt,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.url}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    if (!article) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            {copied && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-60 bg-ink text-paper px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top-4 duration-300 no-print">
                    <Check size={18} className="text-green-400" />
                    <span className="font-sans text-sm font-bold uppercase tracking-widest">Ссылка скопирована!</span>
                </div>
            )}

            <div
                className="bg-paper w-full max-w-4xl min-h-screen md:min-h-[80vh] md:max-h-[95vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 border-x border-gray-300 printing-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-10 no-print"></div>

                <button
                    onClick={onClose}
                    className="fixed md:absolute top-4 right-4 p-3 md:p-2 bg-paper/80 md:bg-transparent hover:bg-gray-200 rounded-full transition-colors z-50 text-ink no-print shadow-lg md:shadow-none"
                    aria-label="Закрыть"
                >
                    <X size={24} />
                </button>

                <div className="p-6 md:p-16 lg:px-24 relative z-20">
                    <div className="border-b-4 border-double border-black pb-8 mb-10 text-center">
                        <span className="inline-block px-3 py-1 mb-8 border border-black text-[10px] font-bold uppercase tracking-[0.2em] bg-ink text-white">
                            {article.category}
                        </span>
                        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black leading-[1.15] mb-8 text-ink tracking-tight">
                            {article.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] md:text-xs font-sans text-gray-400 uppercase tracking-widest mb-10">
                            <span>{article.date}</span>
                            <span className="hidden md:inline text-gray-300">•</span>
                            <span className="font-bold italic text-ink/70">Автор: {article.author}</span>
                            <span className="hidden md:inline text-gray-300">•</span>
                            <span className="font-bold">Университет</span>
                        </div>

                        <div className="max-w-3xl mx-auto border-t border-black/10 pt-10">
                            <p className="font-body text-xl md:text-2xl font-medium italic text-gray-800 leading-relaxed">
                                {article.excerpt}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center md:justify-end space-x-8 md:space-x-6 mb-12 text-gray-400 no-print border-y border-gray-100 py-4 md:border-none md:py-0">
                        <button
                            onClick={handlePrint}
                            disabled={loading || error}
                            className={`flex items-center space-x-2 hover:text-uni-red transition-colors group ${(loading || error) ? 'opacity-30 cursor-not-allowed' : ''}`}
                            title="Распечатать статью"
                        >
                            <Printer size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Распечатать</span>
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 hover:text-uni-red transition-colors group"
                            title="Поделиться"
                        >
                            <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Поделиться</span>
                        </button>
                    </div>

                    <figure className="mb-14">
                        <div className="overflow-hidden border border-gray-200 shadow-xl">
                            <img
                                src={getArticleImageUrl(article)}
                                alt={article.title}
                                className="w-full h-auto max-h-[650px] object-cover"
                            />
                        </div>
                        {article.imageCaption && (
                            <figcaption className="mt-5 text-xs md:text-sm font-body text-gray-500 italic text-center border-b border-gray-100 pb-3">
                                {article.imageCaption}
                            </figcaption>
                        )}
                    </figure>

                    <div className="max-w-3xl mx-auto prose prose-stone font-body text-ink leading-relaxed text-lg md:text-xl tracking-normal text-justify">
                        {loading ? (
                            <div className="space-y-6 animate-pulse no-print">
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12 bg-red-50/50 border border-red-100 p-8 rounded-sm">
                                <p className="font-body text-lg text-red-800 mb-8 italic" dangerouslySetInnerHTML={{ __html: content }} />
                                <button
                                    onClick={() => article && fetchContent(article)}
                                    className="flex items-center mx-auto space-x-3 bg-ink text-white px-8 py-4 font-sans font-bold uppercase tracking-[0.2em] hover:bg-uni-red transition-all shadow-lg active:scale-95"
                                >
                                    <RefreshCw size={18} />
                                    <span>Повторить запрос</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10 font-sans font-bold uppercase tracking-[0.3em] text-[10px] text-uni-red/60 border-b border-uni-red/10 pb-2 inline-block">
                                    Специальный репортаж
                                </div>
                                <div
                                    className="drop-cap"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </>
                        )}
                    </div>

                    <div className="mt-20 pt-10 border-t border-black/10 text-center font-sans text-[9px] text-gray-400 uppercase tracking-[0.3em]">
                        <p>© {new Date().getFullYear()} Студенческий Обозреватель • Независимое издание университета</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
