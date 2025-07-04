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

  text += `<div class="grid-container" style="display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;">`;

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

    text += `<div class="grid-item" style="display: block;">
               <a href='${link}' target='_blank'
                style="margin-top: 8px;
                display: block;
                width: 100%;
                ">
                 ${
                   imageUrl
                     ? `<div class="image-container" style="position: relative;
                        width: 100%;
                        padding-bottom: 56.25%;
                        overflow: hidden;
                        border-radius:10px;">
                            <img src="${imageUrl}" alt="${title}" style="position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                object-fit: cover;"/>
                        </div>`
                     : `<div class="no-image-container" style="position: relative;
                        width: 100%;
                        padding-bottom: 56.25%; 
                        background-color: #f0f0f0; 
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        overflow: hidden;
                        border-radius: 10px;">
                            <p style="display: -webkit-box;
                                -webkit-line-clamp: 1;     
                                -webkit-box-orient: vertical;
                                overflow: hidden;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                width: 90%;
                                color: #333;">${title}</p>
                        </div>`
                 }
                 <p class="post-title" style="display: -webkit-box;
                    -webkit-line-clamp: 1;     
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin-top: 6px;
                    padding: 0 10px;
                    ">${title}</p>
               </a>
             </div>`;
  }

  text += `</div>`;

  // README.md 파일 생성
  // 터미널에서 node index.js 실행 후 vscode로 README.md 파일 미리보기 하면 됨
  writeFileSync("README.md", text, "utf8", (e) => {
    console.log(e);
  });

  console.log("업데이트 완료");
})();
