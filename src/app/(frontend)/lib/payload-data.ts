import 'server-only'

import type { BasePayload } from 'payload'
import { Article, ArticleCategory, Ad } from './types'

/**
 * Serializer for Lexical JSON to HTML.
 */
const serializeLexicalToHtml = (node: any): string => {
    if (!node) return '';

    if (Array.isArray(node)) {
        return node.map(serializeLexicalToHtml).join('');
    }

    if (node.type === 'root') {
        return serializeLexicalToHtml(node.children);
    }

    if (node.type === 'paragraph') {
        return `<p>${serializeLexicalToHtml(node.children)}</p>`;
    }

    if (node.text) {
        let text = node.text;
        if (node.format & 1) text = `<strong>${text}</strong>`;
        if (node.format & 2) text = `<em>${text}</em>`;
        if (node.format & 8) text = `<u>${text}</u>`;
        return text;
    }

    if (node.children) {
        return serializeLexicalToHtml(node.children);
    }

    return '';
};

/**
 * Get all articles from Payload CMS via Local API.
 * Receives the payload instance from page.tsx to avoid importing config here.
 */
export const getArticles = async (payload: BasePayload): Promise<Article[]> => {
    try {
        const data = await payload.find({
            collection: 'news',
            limit: 100,
            sort: '-date',
        })

        return data.docs.map((doc: any) => ({
            id: String(doc.id),
            title: doc.title,
            category: doc.category as ArticleCategory,
            author: doc.author,
            date: new Date(doc.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).replace('.', ''),
            excerpt: doc.excerpt,
            imageUrl: doc.imageUrl,
            coverImage: doc.coverImage,
            imageCaption: doc.imageCaption,
            isBreaking: doc.isBreaking,
            content: doc.content ? serializeLexicalToHtml(doc.content.root) : '',
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
};

/**
 * Get all announcements from Payload CMS via Local API.
 */
export const getAnnouncements = async (payload: BasePayload): Promise<Ad[]> => {
    try {
        const data = await payload.find({
            collection: 'announcements',
            limit: 100,
        })

        return data.docs.map((doc: any) => ({
            id: String(doc.id),
            title: doc.title,
            text: doc.text,
            contact: doc.contact,
        }));
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return [];
    }
};
