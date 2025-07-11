import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import fetch from "node-fetch";
import sharp from "sharp";

// assets 폴더 경로
const assetsDir = path.join(process.cwd(), "assets");
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir);

// guid에서 맨 뒤 숫자 추출 함수
function extractGuidNumber(guid) {
  const match = guid.match(/(\d+)(\/)?$/);
  return match ? match[1] : guid;
}

// 타이틀 36글자 고정: 33자 이상이면 ... 붙이고, 33자 미만이면 공백 추가
function formatTitle(title) {
  const maxLen = 33;
  const totalLen = 36;
  if (title.length > maxLen) {
    return title.slice(0, maxLen) + "...";
  } else {
    return title.padEnd(totalLen, " ");
  }
}

// assets 폴더 내 파일 목록
function getAssetFiles() {
  return fs.readdirSync(assetsDir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
}

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

(async () => {
  // README 텍스트 시작
  let text = `
# 반갑습니다 신입 플러터 개발자 이현진입니다👋

### ***자신의 노력과 경험이 사용자에게 더 나은 서비스를 제공한다고 믿는 모바일(플러터) 개발자입니다.*** 
깃허브와 블로그는 저의 개발 과정과 배움을 기록하는 공간입니다.     
이렇게 축적된 경험과 생각들은 단순한 기록을 넘어,       
저만의 문제 해결 방식과 개발에 대한 고민이 서비스 곳곳에 자연스럽게 스며들게 하여, 사용자에게 더욱 신뢰받는 경험과 가치를 전할 수 있다고 믿습니다.

<br>

### ***협업은 단순히 서비스 구현의 수단이 아니라, 서로의 역량과 경험이 함께 성장하는 소중한 기회라고 생각합니다.***
프로젝트를 진행하며 코드 리뷰와 지식 공유, 페어 프로그래밍 등 다양한 협업 방식을 경험했습니다.      
이 과정에서 서로의 다양한 시각과 경험을 나누고, 함께 고민했기에 한 단계 더 발전할 수 있었다고 생각합니다.

<br>

## 💻 Things used for development
<p>
  <img alt="" src="https://img.shields.io/badge/Dart-0175C2?logo=Dart&logoColor=white"/>
  <img alt="" src="https://img.shields.io/badge/Flutter-02569B?logo=Flutter&logoColor=white"/>
  <img alt="" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white"/> 
  <img alt="" src="https://img.shields.io/badge/Git-F05032?logo=Git&logoColor=white"/> 
  <img alt="" src="https://img.shields.io/badge/Figma-F24E1E?logo=Figma&logoColor=white"/> 
</p>

<br>

## 📕 Latest Blog Posts
`;

  const feed = await parser.parseURL("https://skyhyunjinlee.tistory.com/rss");
  const usedFiles = [];
  let htmlTable = `<table>\n`;

  // 4열 3행(최대 12개) HTML 테이블 생성
  let count = 0;
  for (let row = 0; row < 3; row++) {
    htmlTable += "  <tr>\n";
    for (let col = 0; col < 4; col++) {
      htmlTable += '    <td width="25%" align="center" valign="top">';
      if (count < feed.items.length) {
        const item = feed.items[count];
        const title = item.title;
        const formattedTitle = formatTitle(title);
        const link = item.link;
        const content = item.content || "";
        const guidNum = extractGuidNumber(item.guid);
        const filename = `${guidNum}.jpg`;
        const filePath = path.join(assetsDir, filename);

        let imgSrc = "";
        // assets 폴더에 파일이 이미 있으면 재사용
        if (fs.existsSync(filePath)) {
          imgSrc = `assets/${filename}`;
        } else {
          // 썸네일 추출
          const match = content.match(/<img.*?src="(.*?)"/);
          if (match) {
            const imageUrl = match[1];
            try {
              const response = await fetch(imageUrl);
              if (!response.ok) throw new Error("이미지 다운로드 실패");
              const buffer = Buffer.from(await response.arrayBuffer());
              // gif면 jpg로 변환
              const processedBuffer = await sharp(buffer)
                .resize(300, 168, { fit: "cover" })
                .toFormat("jpeg")
                .toBuffer();

              // 파일 생성
              fs.writeFileSync(filePath, processedBuffer);
              imgSrc = `assets/${filename}`;
            } catch (e) {
              imgSrc = "assets/no-image.jpg";
            }
          } else {
            imgSrc = "assets/no-image.jpg";
          }
        }
        usedFiles.push(path.basename(imgSrc));
        htmlTable += `<img src="${imgSrc}" style="display:block;margin:0 auto;vertical-align:top;" /><br/>`;
        htmlTable += `<a href="${link}" target="_blank">${title}</a>`;
      }
      htmlTable += "</td>\n";
      count++;
    }
    htmlTable += "  </tr>\n";
  }
  htmlTable += "</table>\n";

  // assets 폴더 내 미사용 이미지 삭제 (no-image.jpg는 항상 남김)
  // no-image.jpg가 없으면 생성하지 않지만, 있으면 절대 삭제하지 않음
  const assetFiles = getAssetFiles();
  for (const file of assetFiles) {
    if (!usedFiles.includes(file) && file !== "no-image.jpg") {
      fs.unlinkSync(path.join(assetsDir, file));
    }
  }

  // 테이블 삽입
  text += htmlTable;

  // README.md 파일 생성
  fs.writeFileSync("README.md", text, "utf8");
  console.log("README.md 생성 완료");
})();
