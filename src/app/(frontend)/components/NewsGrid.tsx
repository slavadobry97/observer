'use client';

import React, { useState } from 'react';
import { Article, ArticleCategory, Ad } from '../lib/types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getArticleImageUrl } from '../lib/utils';

interface NewsGridProps {
    articles: Article[];
    ads: Ad[];
    onArticleClick: (article: Article) => void;
    onArchiveClick: () => void;
    categoryTitle?: ArticleCategory;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const NewsGrid: React.FC<NewsGridProps> = ({
    articles,
    ads,
    onArticleClick,
    onArchiveClick,
    categoryTitle,
    currentPage,
    totalPages,
    onPageChange
}) => {
    const [adPageIndex, setAdPageIndex] = useState(0);
    const adsPerPage = 2;
    const totalAdPages = Math.ceil(ads.length / adsPerPage);

    const currentAds = ads.slice(
        adPageIndex * adsPerPage,
        adPageIndex * adsPerPage + adsPerPage
    );

    const nextAds = () => {
        if (totalAdPages > 0) {
            setAdPageIndex((prev) => (prev + 1) % totalAdPages);
        }
    };

    const prevAds = () => {
        if (totalAdPages > 0) {
            setAdPageIndex((prev) => (prev - 1 + totalAdPages) % totalAdPages);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Main Content Column */}
                <div className={`w-full ${categoryTitle ? 'lg:w-full' : 'lg:w-2/3'}`}>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 ${!categoryTitle ? 'border-r border-gray-200 pr-0 lg:pr-10' : ''}`}>
                        {articles.map((article) => (
                            <div key={article.id} className="group cursor-pointer flex flex-col h-full" onClick={() => onArticleClick(article)}>
                                <div className="overflow-hidden mb-5 border border-gray-300 shadow-md relative aspect-video">
                                    <img
                                        src={getArticleImageUrl(article)}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 bg-uni-red text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-lg">
                                        {article.category}
                                    </div>
                                </div>
                                <h3 className="font-serif text-2xl font-bold leading-tight mb-3 group-hover:text-uni-red transition-colors decoration-uni-red group-hover:underline decoration-2 underline-offset-4">
                                    {article.title}
                                </h3>
                                <p className="font-body text-sm text-gray-700 leading-relaxed mb-6 grow line-clamp-3 italic">
                                    &quot;{article.excerpt}&quot;
                                </p>
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] font-sans text-gray-400 uppercase tracking-widest">
                                    <span className="font-bold text-ink">{article.author}</span>
                                    <div className="flex items-center text-uni-red font-black">
                                        <span>Читать статью</span>
                                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="mt-16 pt-8 border-t-2 border-black flex items-center justify-between">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center space-x-2 font-sans font-bold uppercase tracking-widest text-xs py-2 px-4 transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-ink hover:text-white'}`}
                            >
                                <ChevronLeft size={16} />
                                <span>Предыдущая</span>
                            </button>

                            <div className="flex items-center space-x-2 font-serif italic text-lg">
                                <span className="text-uni-red font-bold">{currentPage}</span>
                                <span className="text-gray-300">из</span>
                                <span>{totalPages}</span>
                            </div>

                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`flex items-center space-x-2 font-sans font-bold uppercase tracking-widest text-xs py-2 px-4 transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-ink hover:text-white'}`}
                            >
                                <span>Следующая</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                {!categoryTitle && (
                    <div className="w-full lg:w-1/3 space-y-12">
                        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transition-all duration-500">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-uni-red/5 -mr-8 -mt-8 rotate-45"></div>
                            <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-8">
                                <h4 className="font-sans font-black text-xl uppercase tracking-tighter">
                                    ОБЪЯВЛЕНИЯ
                                </h4>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={prevAds}
                                        disabled={totalAdPages <= 1}
                                        className={`p-1 rounded-sm border border-black/10 transition-colors ${totalAdPages <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                        aria-label="Назад"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="font-sans text-[10px] font-bold text-gray-400 tabular-nums">
                                        {totalAdPages > 0 ? adPageIndex + 1 : 0}/{totalAdPages}
                                    </span>
                                    <button
                                        onClick={nextAds}
                                        disabled={totalAdPages <= 1}
                                        className={`p-1 rounded-sm border border-black/10 transition-colors ${totalAdPages <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                        aria-label="Вперед"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 min-h-[180px]">
                                {currentAds.length > 0 ? (
                                    currentAds.map((ad) => (
                                        <div key={ad.id} className="border-b border-gray-100 last:border-none pb-6 last:pb-0 animate-in fade-in duration-500">
                                            <p className="font-serif italic text-base text-ink leading-tight mb-2">&quot;{ad.text}&quot;</p>
                                            <span className="text-[10px] font-sans font-black uppercase text-uni-red tracking-widest">{ad.contact}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                                        Нет объявлений
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-center">
                                <div className="flex space-x-1">
                                    {[...Array(totalAdPages)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 w-4 rounded-full transition-all duration-300 ${i === adPageIndex ? 'bg-uni-red w-8' : 'bg-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-4 border-double border-gray-200 text-center">
                            <h4 className="font-masthead text-lg mb-4">АРХИВ НОМЕРОВ</h4>
                            <p className="font-serif text-sm italic text-gray-500 mb-6">Все выпуски &quot;Студенческого Обозревателя&quot; доступны в цифровом архиве университетской библиотеки.</p>
                            <button
                                onClick={onArchiveClick}
                                className="w-full py-3 border border-black font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-ink hover:text-white transition-colors"
                            >
                                Перейти в архив
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
