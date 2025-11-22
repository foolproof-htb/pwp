import hljs from 'highlight.js';
import { useEffect, useRef } from 'preact/hooks';
import useSWR from 'swr';
import { getBlogDetail } from '../library/microcms';

const PreviewContent = () => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const params = new URLSearchParams(window.location.search);
  const contentId = params.get('contentId');
  const draftKey = params.get('draftKey');

  const swrKey = contentId && draftKey ? ['/preview', contentId, draftKey] : null;
  const { data, error, isLoading, isValidating } = useSWR(swrKey, ([, contentId, draftKey]) =>
    getBlogDetail(contentId, { draftKey })
  );
  const htmlContent = data?.content ?? '';

  useEffect(() => {
    if (!contentRef.current || !htmlContent) {
      return;
    }

    const codeBlocks = contentRef.current.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const element = block as HTMLElement;

      if (element.dataset.highlighted === 'true') {
        return;
      }

      hljs.highlightElement(element);
      element.dataset.highlighted = 'true';
      const parentPre = element.closest('pre');
      parentPre?.classList.add('hljs');

      const languageAttr = Array.from(element.classList)
        .find((className) => className.startsWith('language-'))
        ?.replace('language-', '');
      const detectedLanguage = element.dataset.language || languageAttr;

      if (detectedLanguage) {
        element.dataset.language = detectedLanguage;
        parentPre?.setAttribute('data-language', detectedLanguage);
      }
    });
  }, [htmlContent]);

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
        <div
          ref={contentRef}
          class="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
        {isValidating && <div>プレビューを更新中...</div>}
      </div>
    )
  );
};

export default PreviewContent;
