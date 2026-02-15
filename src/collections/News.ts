import { CollectionConfig } from 'payload';
import {
    lexicalEditor,
    FixedToolbarFeature,
    HeadingFeature,
    BoldFeature,
    ItalicFeature,
    UnderlineFeature,
    StrikethroughFeature,
    SubscriptFeature,
    SuperscriptFeature,
    AlignFeature,
    IndentFeature,
    UnorderedListFeature,
    OrderedListFeature,
    LinkFeature,
    BlockquoteFeature,
    UploadFeature,
} from '@payloadcms/richtext-lexical';

export const News: CollectionConfig = {
    slug: 'news',
    hooks: {
        beforeChange: [
            ({ data }) => {
                if (data.content) {
                    const countWords = (node: any): number => {
                        let count = 0;
                        if (node.text) {
                            count += node.text.split(/\s+/).length;
                        }
                        if (node.children) {
                            node.children.forEach((child: any) => {
                                count += countWords(child);
                            });
                        }
                        return count;
                    };

                    const wordCount = data.content.root ? countWords(data.content.root) : 0;
                    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
                    data.readTime = `${readingTime} мин читать`;
                }
                return data;
            }
        ]
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'date', 'coverImage', 'displayPreview'],
        livePreview: {
            url: ({ data }) => `http://localhost:3000/?articleId=${data.id}`,
        },
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Контент',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                            label: 'Заголовок',
                        },
                        {
                            name: 'coverImage',
                            type: 'upload',
                            relationTo: 'media',
                            required: false,
                            label: 'Обложка (Загрузка файла)',
                        },
                        {
                            name: 'content',
                            type: 'richText',
                            required: true,
                            label: 'Полный текст',
                            editor: lexicalEditor({
                                features: ({ defaultFeatures }) => [
                                    ...defaultFeatures,
                                    FixedToolbarFeature(),
                                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                                    BoldFeature(),
                                    ItalicFeature(),
                                    UnderlineFeature(),
                                    StrikethroughFeature(),
                                    SubscriptFeature(),
                                    SuperscriptFeature(),
                                    AlignFeature(),
                                    IndentFeature(),
                                    UnorderedListFeature(),
                                    OrderedListFeature(),
                                    LinkFeature({}),
                                    BlockquoteFeature(),
                                ],
                            }),
                        },
                    ],
                },
                {
                    label: 'Публикация',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'category',
                                    type: 'select',
                                    required: true,
                                    label: 'Категория',
                                    options: [
                                        { label: 'Жизнь Университета', value: 'Жизнь Университета' },
                                        { label: 'Спорт', value: 'Спорт' },
                                        { label: 'Культура', value: 'Культура' },
                                        { label: 'Мнения', value: 'Мнения' },
                                    ],
                                    admin: { width: '50%' },
                                },
                                {
                                    name: 'author',
                                    type: 'text',
                                    required: true,
                                    label: 'Автор',
                                    admin: { width: '50%' },
                                },
                            ],
                        },
                        {
                            type: 'row',
                            fields: [
                                {
                                    name: 'date',
                                    type: 'date',
                                    required: true,
                                    label: 'Дата публикации',
                                    admin: {
                                        date: {
                                            pickerAppearance: 'dayOnly',
                                            displayFormat: 'd MMM yyyy',
                                        },
                                        width: '50%',
                                    }
                                },
                                {
                                    name: 'readTime',
                                    type: 'text',
                                    label: 'Время чтения',
                                    admin: { width: '50%' },
                                }
                            ]
                        },
                        {
                            name: 'excerpt',
                            type: 'textarea',
                            required: true,
                            label: 'Краткое описание',
                        },
                        {
                            name: 'isBreaking',
                            type: 'checkbox',
                            label: 'Молния / Срочно',
                            defaultValue: false,
                        },
                    ],
                },
                {
                    label: 'Архив / Техническое',
                    fields: [
                        {
                            name: 'imageUrl',
                            type: 'text',
                            required: false,
                            label: 'Ссылка на изображение (URL) - Фоллбек',
                            admin: {
                                description: 'Используется, если не загружена обложка на вкладке Контент.',
                            }
                        },
                        {
                            name: 'imageCaption',
                            type: 'text',
                            label: 'Подпись к изображению',
                        },
                    ],
                },
            ],
        },
    ],
}
