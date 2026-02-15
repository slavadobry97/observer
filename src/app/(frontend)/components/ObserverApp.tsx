'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Masthead } from './Masthead';
import { Footer } from './Footer';
import { HeroSection } from './HeroSection';
import { NewsGrid } from './NewsGrid';
import { ArticleReader } from './ArticleReader';
import { SearchOverlay } from './SearchOverlay';
import { Article, ArticleCategory, WeatherData, Ad } from '../lib/types';
import { fetchMinskWeather } from '../lib/weather';
import { X, Calendar, User, ArrowRight } from 'lucide-react';

const ARTICLES_PER_PAGE = 4;

interface ObserverAppProps {
    initialArticles: Article[];
    initialAds: Ad[];
}

const ObserverApp: React.FC<ObserverAppProps> = ({ initialArticles, initialAds }) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [dailyBriefing, setDailyBriefing] = useState<string>("Загрузка новостей университета...");
    const [weather, setWeather] = useState<WeatherData | undefined>();
    const [articles] = useState<Article[]>(initialArticles);
    const [ads] = useState<Ad[]>(initialAds);

    useEffect(() => {
        // Fetch daily briefing from our API route
        fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'briefing' }),
        })
            .then(res => res.json())
            .then(data => setDailyBriefing(data.text || "Сводка новостей временно недоступна."))
            .catch(() => setDailyBriefing("Сводка новостей временно недоступна из-за очереди в кофейню."));

        fetchMinskWeather().then(setWeather);
    }, []);

    useEffect(() => {
        // Deep linking for Live Preview or shared links
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('articleId');
        if (articleId) {
            const found = articles.find(a => a.id === articleId);
            if (found) {
                setSelectedArticle(found);
            }
        }
    }, [articles]);

    // Filter articles based on active category
    const filteredArticles = useMemo(() => {
        if (!articles.length) return [];
        if (!activeCategory) return articles;
        return articles.filter(a => a.category === activeCategory);
    }, [activeCategory, articles]);

    // Determine what to show as hero
    const heroArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;

    // Breaking news for the Hero Sidebar
    const breakingArticles = useMemo(() => {
        return articles.filter(a => a.isBreaking && a.id !== heroArticle?.id);
    }, [heroArticle, articles]);

    // Remaining articles for the grid/list
    const remainingArticles = useMemo(() => {
        return filteredArticles.slice(1);
    }, [filteredArticles]);

    // Paginated articles for the grid
    const paginatedArticles = useMemo(() => {
        const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
        return remainingArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
    }, [remainingArticles, currentPage]);

    const totalPages = Math.ceil(remainingArticles.length / ARTICLES_PER_PAGE);

    const handleCategorySelect = (category: ArticleCategory | null) => {
        setActiveCategory(category);
        setCurrentPage(1);
        setIsArchiveOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const gridElement = document.getElementById('news-content-start');
        if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Masthead
                dailyBriefing={dailyBriefing}
                weather={weather}
                onSearchClick={() => setIsSearchOpen(true)}
                onArchiveClick={() => setIsArchiveOpen(true)}
                activeCategory={activeCategory}
                onCategorySelect={handleCategorySelect}
            />

            <main className="grow relative">
                {heroArticle && (
                    <HeroSection
                        article={heroArticle}
                        breakingArticles={breakingArticles}
                        onClick={setSelectedArticle}
                    />
                )}

                <div id="news-content-start" className="container mx-auto px-4 my-12">
                    <div className="h-px bg-black w-full relative">
                        <div className="absolute left-1/2 -top-4 transform -translate-x-1/2 bg-paper px-8 py-1 border border-black font-serif italic text-xl text-ink whitespace-nowrap shadow-sm">
                            {activeCategory ? `Раздел: ${activeCategory}` : "Вестник Университета"}
                        </div>
                    </div>
                </div>

                {filteredArticles.length > 0 ? (
                    <NewsGrid
                        articles={paginatedArticles}
                        ads={ads}
                        onArticleClick={setSelectedArticle}
                        onArchiveClick={() => setIsArchiveOpen(true)}
                        categoryTitle={activeCategory || undefined}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                ) : (
                    <div className="container mx-auto px-4 py-24 text-center">
                        <div className="inline-block p-10 border-4 border-double border-gray-200">
                            <p className="font-serif text-3xl italic text-gray-400 mb-4">Типография пуста.</p>
                            <p className="font-sans text-xs uppercase tracking-widest text-gray-400">В этом разделе пока нет свежих выпусков.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Archive View Overlay */}
            {isArchiveOpen && (
                <div className="fixed inset-0 z-60 bg-paper overflow-y-auto animate-in slide-in-from-bottom duration-500">
                    <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-10"></div>

                    <div className="container mx-auto px-4 py-12 relative z-20">
                        <div className="flex justify-between items-center mb-16 border-b-4 border-double border-black pb-8">
                            <div className="text-left">
                                <h2 className="font-masthead text-4xl md:text-6xl tracking-tighter mb-2">ПОЛНЫЙ АРХИВ</h2>
                                <p className="font-serif italic text-gray-600">Все материалы издания с момента основания</p>
                            </div>
                            <button
                                onClick={() => setIsArchiveOpen(false)}
                                className="p-4 hover:bg-black/5 rounded-full transition-colors border border-black/10 shadow-sm"
                            >
                                <X size={32} />
                            </button>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <div className="space-y-12">
                                {articles.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => { setSelectedArticle(article); setIsArchiveOpen(false); }}
                                        className="group cursor-pointer flex flex-col md:flex-row gap-8 pb-12 border-b border-black/10 last:border-none"
                                    >
                                        <div className="w-full md:w-48 h-32 shrink-0 border border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <img src={article.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="grow">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-uni-red px-2 py-0.5 border border-uni-red">
                                                    {article.category}
                                                </span>
                                                <div className="flex items-center text-[10px] text-gray-400 font-sans uppercase tracking-widest">
                                                    <Calendar size={12} className="mr-1" />
                                                    {article.date}
                                                </div>
                                            </div>
                                            <h3 className="font-serif text-2xl md:text-3xl font-bold group-hover:text-uni-red transition-colors mb-4 leading-tight">
                                                {article.title}
                                            </h3>
                                            <p className="font-body text-gray-600 italic line-clamp-2 mb-4 leading-relaxed">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                                    <User size={12} className="mr-2" />
                                                    Автор: {article.author}
                                                </div>
                                                <div className="flex items-center text-xs font-black uppercase text-ink group-hover:translate-x-2 transition-transform">
                                                    Читать <ArrowRight size={14} className="ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-24 text-center border-t-2 border-black/10 pt-12 opacity-30">
                            <p className="font-masthead text-[10px] tracking-[0.5em]">Конец архивных записей</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer
                activeCategory={activeCategory}
                onCategorySelect={handleCategorySelect}
                onArchiveClick={() => setIsArchiveOpen(true)}
            />

            {selectedArticle && (
                <ArticleReader
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                articles={articles}
                onArticleSelect={setSelectedArticle}
            />
        </div>
    );
};

export default ObserverApp;
