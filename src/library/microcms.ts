// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from 'microcms-js-sdk';
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

// 型定義
export type BlogTag = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  content: string;
  category: ['post'] | ['impression'];
  heroImage?: {
    url: string;
    width: number;
    height: number;
    alt?: string;
    caption?: string; // 出典
  };
  tags?: BlogTag[];
} & MicroCMSListContent;

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: 'blogs', queries });
};

export const getBlogDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<Blog>({
    endpoint: 'blogs',
    contentId,
    queries,
  });
};

export type Diary = {
  title: string;
  content: string;
  date?: string; // 日記の日付。投稿日と別の日のことを書くときに指定する
} & MicroCMSListContent;

// 日付項目があればそれを、なければ投稿日を日記の日付とする
export const getDiaryDate = (entry: Diary) => entry.date ?? entry.publishedAt ?? entry.updatedAt;

export const getDiaries = async (queries?: MicroCMSQueries) => {
  return await client.getList<Diary>({ endpoint: 'diary', queries });
};

// getList は1回で最大100件しか返さないため、全件が必要な場面ではこちらを使う
export const getAllDiaries = async (queries?: Omit<MicroCMSQueries, 'limit' | 'offset'>) => {
  return await client.getAllContents<Diary>({ endpoint: 'diary', queries });
};

export const getDiaryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  return await client.getListDetail<Diary>({
    endpoint: 'diary',
    contentId,
    queries,
  });
};
