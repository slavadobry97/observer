'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Article } from '../lib/types';
import { X, Search, FileText } from 'lucide-react';
import { getArticleImageUrl } from '../lib/utils';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    articles: Article[];
    onArticleSelect: (article: Article) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, articles, onArticleSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = articles.filter(article =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery) ||
            article.author.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered);
    }, [query, articles]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-paper w-full max-w-5xl min-h-screen md:min-h-[70vh] md:max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 border-x border-gray-300 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-10"></div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-gray-200 rounded-full transition-colors z-50 text-ink border border-black/10 shadow-sm"
                >
                    <X size={24} />
                </button>

                <div className="p-6 md:p-12 relative z-20 flex flex-col h-full grow">
                    <div className="border-b-4 border-double border-black pb-8 mb-12 text-center">
                        <h2 className="font-masthead text-2xl md:text-3xl mb-2 tracking-[0.2em] uppercase font-black">Цифровой Архив</h2>
                        <p className="font-serif italic text-sm text-gray-500 mb-8">Поиск по всем выпускам газеты &quot;Студенческий Обозреватель&quot;</p>

                        <div className="relative max-w-3xl mx-auto">
                            <div className="absolute inset-0 bg-white/40 -rotate-1 translate-x-1 translate-y-1 border border-black/5 pointer-events-none"></div>

                            <div className="relative bg-white border-2 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ключевые слова, автор или тема..."
                                    className="w-full bg-transparent border-none outline-none font-serif text-2xl md:text-4xl font-bold placeholder-ink/10 text-ink italic pr-12"
                                />
                                <Search className="absolute right-6 text-ink/20" size={32} />
                            </div>
                        </div>
                    </div>

                    <div className="grow">
                        {query && results.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                                {results.map(article => (
                                    <div
                                        key={article.id}
                                        onClick={() => { onArticleSelect(article); onClose(); }}
                                        className="group cursor-pointer flex gap-5 items-start border-b border-gray-200 pb-8 hover:bg-black/2 transition-colors p-2 -m-2"
                                    >
                                        <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 border border-black shadow-sm overflow-hidden bg-gray-100">
                                            <img
                                                src={getArticleImageUrl(article)}
                                                alt=""
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex flex-col items-start overflow-hidden">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-uni-red border-b border-uni-red/30">
                                                    {article.category}
                                                </span>
                                            </div>
                                            <h3 className="font-serif text-xl md:text-2xl font-bold mb-2 group-hover:text-uni-red transition-colors decoration-uni-red underline-offset-4 leading-tight">
                                                {article.title}
                                            </h3>
                                            <p className="font-body text-xs md:text-sm text-gray-600 line-clamp-2 italic mb-3 leading-relaxed">
                                                {article.excerpt}
                                            </p>
                                            <div className="text-[10px] font-sans text-gray-400 uppercase tracking-tighter mt-auto flex items-center gap-2">
                                                <span className="font-bold text-gray-500">{article.date}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>{article.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200">
                                <p className="font-serif text-2xl italic text-gray-400 mb-2">В архивах ничего не найдено по этому запросу.</p>
                                <p className="font-sans text-[10px] uppercase tracking-widest text-gray-300">Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 opacity-10">
                                <Search size={80} strokeWidth={1} />
                                <p className="font-serif text-3xl italic mt-6">Введите запрос для поиска</p>
                                <div className="mt-4 h-px bg-black w-32"></div>
                            </div>
                        )}
                    </div>

                    <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="font-sans text-[9px] text-gray-400 uppercase tracking-[0.3em]">
                            Студенческий Обозреватель • Независимое издание
                        </div>
                        <div className="font-serif italic text-xs text-gray-400">
                            &quot;История пишется сегодня&quot;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
