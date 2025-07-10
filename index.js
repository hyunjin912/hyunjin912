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

### 자신의 노력과 경험이 사용자에게 더 나은 서비스를 제공한다고 믿는 모바일(플러터) 개발자입니다. 
깃허브와 블로그는 저만의 개발 과정과 배움을 기록하는 공간입니다.     
이렇게 축적된 경험과 생각들은 단순한 기록을 넘어,       
저만의 문제 해결 방식과 개발에 대한 고민이 서비스 곳곳에 자연스럽게 스며들게 하여, 사용자에게 더욱 신뢰받는 경험과 가치를 전할 수 있다고 믿습니다.

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

  text += `<ul>`;

  // 최신 10개의 글의 제목과 링크를 가져온 후 text에 추가
  for (let i = 0; i < 10; i++) {
    const { title, link } = feed.items[i];
    console.log(`${i + 1}번째 게시물`);
    console.log(`추가될 제목: ${title}`);
    console.log(`추가될 링크: ${link}`);
    text += `<li><a href='${link}' target='_blank'>${title}</a></li>`;
  }

  text += `</ul>`;

  text += `
  <br>

  ## 💻 Things used for development
  <p>
    <img alt="" src= "https://img.shields.io/badge/Dart-0175C2?logo=Dart&logoColor=white"/>
    <img alt="" src= "https://img.shields.io/badge/Flutter-02569B?logo=Flutter&logoColor=white"/>
    <img alt="" src= "https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white"/> 
    <img alt="" src= "https://img.shields.io/badge/Git-F05032?logo=Git&logoColor=white"/> 
    <img alt="" src= "https://img.shields.io/badge/Figma-F24E1E?logo=Figma&logoColor=white"/> 
  </p>
  `;

  // README.md 파일 생성
  writeFileSync("README.md", text, "utf8", (e) => {
    console.log(e);
  });
  console.log("업데이트 완료");
})();
