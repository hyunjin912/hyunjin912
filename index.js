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

<br>

## 💻 Languages
<p>
<img alt="" src= "https://img.shields.io/badge/Dart-0175C2?logo=Dart&logoColor=white"/>
  <img alt="" src= "https://img.shields.io/badge/Flutter-02569B?logo=Flutter&logoColor=white"/>
  <img alt="" src= "https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white"/> 
</p>

<br>

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

  text += `<table width="100%" border="0" cellspacing="0" cellpadding="10">
`;

  // 최신 6개의 글을 2행 3열 테이블로 표시
  for (let i = 0; i < 6; i++) {
    const { title, link, content } = feed.items[i];
    const imageRegex = /<img[^>]+src="([^">]+)"/g;
    const match = content.match(imageRegex);
    const imageUrl = match ? match[0].match(/src="([^">]+)"/)[1] : null;

    console.log(`${i + 1}번째 게시물`);
    console.log(`추가될 제목: ${title}`);
    console.log(`추가될 링크: ${link}`);
    console.log(`추가될 이미지: ${imageUrl}`);

    // 3열마다 새로운 행 시작
    if (i % 3 === 0) {
      text += `  <tr>
`;
    }

    // URL-safe-encoding for the title text in placeholder
    const placeholderText = encodeURIComponent(title);

    const imageTag = imageUrl
      ? `<img src="${imageUrl}" alt="${title}" style="object-fit: cover;"/>`
      : `<img src="https://placehold.co/600x400?text=No+Image" alt="${title}" style="object-fit: cover;"/>`;

    text += `    <td align="center" valign="top" width="33.3%">
`;
    text += `      <a href='${link}' target='_blank' style="display: block; overflow: hidden;">
`;
    text += `        ${imageTag}
`;
    text += `      </a>
`;
    text += `      <p align="center"><a href='${link}' target='_blank'>${title}</a></p>
`;
    text += `    </td>
`;

    // 3열마다 행 종료
    if (i % 3 === 2) {
      text += `  </tr>
`;
    }
  }

  // 만약 게시물 수가 3의 배수가 아닐 경우 테이블을 닫아줌 (현재는 6개 고정이라 불필요)
  if (6 % 3 !== 0) {
    text += `</tr>
`;
  }

  text += `</table>`;

  // README.md 파일 생성
  // 터미널에서 node index.js 실행 후 vscode로 README.md 파일 미리보기 하면 됨
  writeFileSync("README.md", text, "utf8", (e) => {
    console.log(e);
  });

  console.log("업데이트 완료");
})();
