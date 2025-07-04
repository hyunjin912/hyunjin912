import { writeFileSync } from "node:fs";
import Parser from "rss-parser";

/**
 * README.MD에 작성될 페이지 텍스트
 * @type {string}
 *
 * 아래 사이트에서 로고 검색 한 후,
 * https://simpleicons.org/?q=flutter
 *
 * 아래 사이트처럼 뱃지 만들기
 * https://shields.io/
 *
 * 예시)
 * https://img.shields.io/badge/Flutter-black?logo=Flutter&logoColor=02569B"/>
 *
 * 설명)
 * /Flutter-black?logo=Flutter&logoColor=02569B
 * /메세지(내용)-색상?logo=로고이름&logoColor=로고색상
 */
let text = `
# 반갑습니다 신입 플러터 개발자 이현진입니다👋

## 💻 Languages
<p>
  <img alt="" src= "https://img.shields.io/badge/Flutter-02569B?logo=Flutter&logoColor=white"/>
  <img alt="" src= "https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white"/> 
</p>

## 📕 Latest Blog Posts
`;

// rss-parser 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

(async () => {
  // 피드 목록
  const feed = await parser.parseURL("https://skyhyunjinlee.tistory.com/rss"); // 본인의 블로그 주소

  const style = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
      /* http://meyerweb.com/eric/tools/css/reset/ 
         v2.0 | 20110126
         License: none (public domain)
      */

      html, body, div, span, applet, object, iframe,
      h1, h2, h3, h4, h5, h6, p, blockquote, pre,
      a, abbr, acronym, address, big, cite, code,
      del, dfn, em, img, ins, kbd, q, s, samp,
      small, strike, strong, sub, sup, tt, var,
      b, u, i, center,
      dl, dt, dd, ol, ul, li,
      fieldset, form, label, legend,
      table, caption, tbody, tfoot, thead, tr, th, td,
      article, aside, canvas, details, embed, 
      figure, figcaption, footer, header, hgroup, 
      menu, nav, output, ruby, section, summary,
      time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        font: inherit;
        vertical-align: baseline;
      }
      /* HTML5 display-role reset for older browsers */
      article, aside, details, figcaption, figure, 
      footer, header, hgroup, menu, nav, section {
        display: block;
      }
      body {
        line-height: 1;
      }
      ol, ul {
        list-style: none;
      }
      blockquote, q {
        quotes: none;
      }
      blockquote:before, blockquote:after,
      q:before, q:after {
        content: '';
        content: none;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      a {
        color: inherit;
        text-decoration: none;
      }

      body {
        font-family: 'Roboto', sans-serif;
      }

      .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .grid-item {
        display: block;
      }
      .image-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%; /* 16:9 Aspect Ratio (9 / 16 * 100%) */
        overflow: hidden;
        border-radius:10px;
      }
      .image-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .no-image-container {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%; /* Same aspect ratio as image container */
        background-color: #f0f0f0; /* Light gray background */
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        overflow: hidden;
        border-radius: 10px;
      }
      .no-image-container p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%; /* Adjust width to prevent overflow */
        color: #333; /* Darker text color for contrast */
      }
      .grid-item a {
        margin-top: 8px;
        display: block; /* Make the anchor tag a block element */
        width: 100%; /* Ensure it takes full width of its parent */
      }
      .post-title {
        margin-top: 10px;
        padding: 0 10px;
        text-align: center;
        word-wrap: break-word;
      }
      @media (max-width: 640px) {
        .grid-container {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;

  text += style;
  text += `<div class="grid-container">`;

  // 최신 6개의 글의 제목, 링크, 이미지(포스터)를 가져온 후 text에 추가
  for (let i = 0; i < 6; i++) {
    const { title, link, content } = feed.items[i];
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const match = content.match(imageRegex);
    const imageUrl = match ? match[0].match(/src="([^">]+)"/)[1] : null;

    console.log(`${i + 1}번째 게시물`);
    console.log(`추가될 제목: ${title}`);
    console.log(`추가될 링크: ${link}`);
    console.log(`추가될 이미지: ${imageUrl}`);

    text += `<div class="grid-item">
               <a href='${link}' target='_blank'>
                 ${
                   imageUrl
                     ? `<div class="image-container">
                     <img src="${imageUrl}" alt="${title}"/>
                   </div>`
                     : `<div class="no-image-container">
                     <p>${title}</p>
                   </div>`
                 }
                 <p class="post-title">${title}</a>
               </a>
             </div>`;
  }

  text += `</div>`;

  // README.md 파일 생성
  writeFileSync("README.md", text, "utf8", (e) => {
    console.log(e);
  });

  // preview.html 파일 생성
  // 터미널에서 node index.js 실행 후
  // 브라우저로 preview.html 열면 됨
  const previewText = `<html><head><meta charset="UTF-8"></head><body>${text}</body></html>`;
  writeFileSync("preview.html", previewText, "utf8", (e) => {
    console.log(e);
  });

  console.log("업데이트 완료");
})();
