import useSWR from 'swr';
import { getBlogDetail } from '../library/microcms';

const Preview = () => {
  const params = new URLSearchParams(window.location.search);
  const contentId = params.get('contentId');
  const draftKey = params.get('draftKey');

  const swrKey = contentId && draftKey ? ['/preview', contentId, draftKey] : null;
  const { data, error, isLoading, isValidating } = useSWR(swrKey, ([, contentId, draftKey]) =>
    getBlogDetail(contentId, { draftKey })
  );

  if (error) return <div>プレビューの読み込み中にエラーが発生しました。</div>;
  if (isLoading) return <div>プレビューを読み込み中...</div>;

  return (
    data && (
      <div>
        <div class="title">
          <div class="date">
            投稿日：{new Date(data.publishedAt ?? data.createdAt).toLocaleDateString()}
          </div>
          <h1 class="post-title">{data.title}</h1>
          <hr />
        </div>
        <div class="blog-content" dangerouslySetInnerHTML={{ __html: data.content ?? '' }}></div>
        {isValidating && <div>プレビューを更新中...</div>}
      </div>
    )
  );
};

export default Preview;
