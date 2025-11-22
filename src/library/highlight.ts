import { load } from 'cheerio';
import hljs from 'highlight.js';

export const applySyntaxHighlight = (html: string) => {
  if (!html) {
    return html;
  }

  const $ = load(html);

  $('pre code').each((_, element) => {
    const $code = $(element);

    if ($code.hasClass('hljs')) {
      return;
    }

    const code = $(element).text();
    const { value, language } = hljs.highlightAuto(code);

    $code.html(value);
    $code.addClass('hljs');
    $code.parent('pre').addClass('hljs');

    if (language) {
      $code.attr('data-language', language);
      $code.parent('pre').attr('data-language', language);
    }
  });

  return $.html();
};
