import 'dotenv/config'
import config from './payload.config'
import { getPayload } from 'payload'
import seedData from './seed-data.json'

// Helper to parse Russian date string "17 нояб. 2023" to ISO
function parseRussianDate(dateStr: string) {
  if (!dateStr) return new Date().toISOString();
  // If already ISO, return it
  if (dateStr.includes('T') && dateStr.includes('Z')) return dateStr;

  const months: { [key: string]: number } = {
    'янв.': 0, 'февр.': 1, 'марта': 2, 'апр.': 3, 'мая': 4, 'июня': 5,
    'июля': 6, 'авг.': 7, 'сент.': 8, 'окт.': 9, 'нояб.': 10, 'дек.': 11,
    // Variants just in case
    'фев.': 1, 'мар.': 2, 'сен.': 8, 'ноя.': 10
  };

  try {
    const parts = dateStr.split(' ');
    if (parts.length < 3) return new Date().toISOString();

    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase().replace(/[.,]/g, '') + '.'; // ensure dot
    // Try exact match or with/without dot
    let month = months[monthStr] ?? months[parts[1].toLowerCase()];

    if (month === undefined) {
      // Fallback: try looking up keys checking startsWith
      const cleanMonth = parts[1].toLowerCase().replace('.', '');
      for (const k in months) {
        if (k.startsWith(cleanMonth)) {
          month = months[k];
          break;
        }
      }
    }

    if (month === undefined) month = 0; // Default Jan if fail

    const year = parseInt(parts[2], 10);
    const date = new Date(Date.UTC(year, month, day));
    return date.toISOString();
  } catch (e) {
    console.error(`Failed to parse date: ${dateStr}`, e);
    return new Date().toISOString();
  }
}

// Helper to convert simple HTML paragraphs to Lexical JSON
function convertHtmlToLexical(html: string) {
  // Simple regex to split by <p> tags
  const paragraphs = html.match(/<p>(.*?)<\/p>/gs) || [];

  const children = paragraphs.map(p => {
    // Strip tags for simplicity for now, preserving strict text
    const textContent = p.replace(/<[^>]*>/g, '').trim();

    return {
      type: 'paragraph' as const,
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children: [
        {
          type: 'text' as const,
          detail: 0,
          format: 0,
          mode: 'normal' as const,
          style: '',
          text: textContent,
          version: 1
        }
      ]
    };
  });

  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: children
    }
  };
}

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('--- Seeding Announcements ---');
  await payload.delete({ collection: 'announcements', where: {} }); // Clear existing
  for (const ad of seedData.ads) {
    await payload.create({
      collection: 'announcements',
      data: ad,
    })
    console.log(`Created ad: ${ad.title}`);
  }

  console.log('--- Seeding News ---');
  await payload.delete({ collection: 'news', where: {} }); // Clear existing
  for (const article of seedData.articles) {
    try {
      // Strip ID if present (Payload handles IDs), parse date
      const { id, date, ...rest } = article;

      await payload.create({
        collection: 'news',
        data: {
          ...rest,
          category: rest.category as any, // Type assertion for Payload enum
          date: parseRussianDate(date),
          content: convertHtmlToLexical(article.content),
        },
      })
      console.log(`Created article: ${article.title}`);
    } catch (e) {
      console.error(`Error creating article ${article.title}:`, e);
    }
  }

  console.log('--- Seed Complete ---');
  process.exit(0);
}

seed()
