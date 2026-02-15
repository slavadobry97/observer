import { Article } from './types';

/**
 * Helper to get the best available image URL for an article.
 * Prioritizes the uploaded `coverImage` over the legacy `imageUrl`.
 * Since frontend and backend are on the same origin now, relative URLs work directly.
 */
export const getArticleImageUrl = (article: Article): string => {
    if (!article) return 'https://via.placeholder.com/800x400?text=No+Data';

    if (article.coverImage) {
        if (typeof article.coverImage === 'string') {
            return article.coverImage;
        }
        if (article.coverImage.url) {
            // Same origin — relative URLs work directly
            return article.coverImage.url;
        }
    }

    return article.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image';
};
