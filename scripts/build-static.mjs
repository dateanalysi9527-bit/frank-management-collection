import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const source = await readFile("app/CollectionPage.tsx", "utf8");
const styles = await readFile("app/globals.css", "utf8");
const imaUrl = source.match(/const IMA_URL = "([^"]+)"/)?.[1];
if (!imaUrl) throw new Error("无法从页面组件中提取 IMA 链接");

const dataMatch = source.match(/(const IMA_URL[\s\S]*?const articles: Article\[\] = \[[\s\S]*?\n\];)/);
if (!dataMatch) throw new Error("无法从页面组件中提取文章数据");

const dataScript = dataMatch[1]
  .replace(/type Article = \{[\s\S]*?\};\s*/, "")
  .replace("const articles: Article[]", "const articles");

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="36 篇关于经营分析、管理认知与 AI 转型的精选公众号文章。" />
    <meta property="og:title" content="Frank分享经管知识合集" />
    <meta property="og:description" content="36 篇精选 · 经营分析 · 数字化与 AI · 管理认知" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="og.png" />
    <title>Frank分享经管知识合集</title>
    <link rel="icon" href="favicon.svg" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <header class="topbar">
        <a class="brand" href="#top" aria-label="返回顶部"><span class="brand-mark">F</span><span>FRANK'S LIBRARY</span></a>
        <div class="topbar-actions"><a class="text-link" href="${imaUrl}" target="_blank" rel="noreferrer">查看原合集</a><button class="icon-button" id="share-button" type="button" aria-label="分享合集">↗</button></div>
      </header>

      <section class="hero" id="top">
        <div class="hero-copy"><p class="eyebrow"><span></span> MANAGEMENT READING LIST</p><h1>值得反复阅读的<br /><em>经管知识合集</em></h1><p class="hero-description">把经营分析、管理认知与 AI 转型中的好文章，整理成一套清晰、可检索、随时可读的知识地图。</p><div class="hero-actions"><button class="primary-button" id="start-reading" type="button">开始阅读 <span>→</span></button><span class="updated-note">36 篇精选文章 · 3 个专题</span></div></div>
        <div class="hero-cover" aria-label="Frank分享经管知识合集封面"><div class="cover-top"><span>FRANK'S</span><span>COLLECTION · 01</span></div><div class="cover-title"><small>经营 · 管理 · 数字化</small><strong>知行之间</strong><p>在数据里看见经营<br />在实践里验证认知</p></div><div class="cover-lines" aria-hidden="true"><i></i><i></i><i></i></div><div class="cover-bottom"><span>36 ARTICLES</span><span>陈忠胜 整理</span></div></div>
      </section>

      <section class="stats-strip" aria-label="合集概览"><div><strong>36</strong><span>篇精选文章</span></div><div><strong>03</strong><span>个知识专题</span></div><div><strong>∞</strong><span>持续思考与实践</span></div><p>从数据出发<br />回到经营现场</p></section>

      <section class="category-section" id="categories"><div class="section-heading"><div><span class="section-number">01</span><p class="eyebrow">KNOWLEDGE MAP</p><h2>三个专题，一张经营地图</h2></div><p>从数字工具、经营分析到管理认知，<br />循序建立完整的经营思维。</p></div><div class="category-grid" id="category-grid"></div></section>

      <section class="articles-section" id="articles"><div class="section-heading article-heading"><div><span class="section-number">02</span><p class="eyebrow">ALL ARTICLES</p><h2>精选文章</h2></div><p>每一篇都通往公众号原文。<br />筛选、搜索，然后开始阅读。</p></div><div class="article-toolbar"><div class="filter-tabs" id="filter-tabs" role="tablist" aria-label="按专题筛选"></div><label class="search-box"><span aria-hidden="true"></span><input id="search-input" type="search" placeholder="搜索文章标题" aria-label="搜索文章标题" /></label></div><p class="result-count" id="result-count"></p><div id="article-results"></div></section>

      <section class="closing-section"><span class="closing-label">READ · THINK · PRACTICE</span><h2>收藏只是开始，<br />真正的价值发生在实践里。</h2><div class="closing-actions"><button class="primary-button light" id="closing-start" type="button">从第一篇开始 <span>→</span></button><a href="${imaUrl}" target="_blank" rel="noreferrer">在 IMA 中打开原合集 ↗</a></div></section>
      <footer><span>Frank分享经管知识合集</span><span>由陈忠胜整理 · 36 篇内容</span></footer>
      <div class="toast" id="toast" role="status" hidden></div>
    </main>
    <script>${dataScript}</script>
    <script src="app.js"></script>
  </body>
</html>`;

const script = `
let selectedCategory = "全部";
let query = "";

const categoryIndex = (name) => categories.findIndex((item) => item.name === name);
const currentArticles = () => articles.filter((article) => {
  const matchesCategory = selectedCategory === "全部" || article.category === selectedCategory;
  const matchesQuery = article.title.toLowerCase().includes(query.trim().toLowerCase());
  return matchesCategory && matchesQuery;
});

function renderCategories() {
  document.querySelector("#category-grid").innerHTML = categories.map((category, index) => \`
    <button class="category-card theme-\${index + 1}" type="button" data-category="\${category.name}">
      <span class="category-code">\${category.code}</span><span class="category-count">\${category.count} 篇</span>
      <span class="category-visual" aria-hidden="true"><i></i><i></i><i></i></span>
      <strong>\${category.name}</strong><p>\${category.description}</p><span class="category-link">查看专题 →</span>
    </button>\`).join("");
}

function renderTabs() {
  const tabs = ["全部", ...categories.map((item) => item.name)];
  document.querySelector("#filter-tabs").innerHTML = tabs.map((name) => \`<button type="button" role="tab" aria-selected="\${selectedCategory === name}" class="\${selectedCategory === name ? "active" : ""}" data-tab="\${name}">\${name}</button>\`).join("");
}

function renderArticles() {
  const filtered = currentArticles();
  document.querySelector("#result-count").textContent = \`显示 \${filtered.length} 篇\`;
  const target = document.querySelector("#article-results");
  if (!filtered.length) { target.innerHTML = '<div class="empty-state"><strong>没有找到相关文章</strong><p>试试更短的关键词，或切换到“全部”。</p></div>'; return; }
  target.innerHTML = \`<div class="article-list">\${filtered.map((article, index) => {
    const themeIndex = categoryIndex(article.category);
    return \`<a class="article-row" href="\${article.url}" target="_blank" rel="noreferrer"><span class="article-index">\${String(index + 1).padStart(2, "0")}</span><span class="article-main"><span class="article-category">\${article.category}</span><strong>\${article.title}</strong><span class="article-meta">公众号文章　·　收录于 IMA 知识库</span></span><span class="article-cover theme-\${themeIndex + 1}" aria-hidden="true"><span>\${categories[themeIndex]?.shortName ?? "专题"}</span><i></i></span><span class="article-open">↗</span></a>\`; }).join("")}</div>\`;
}

function selectCategory(name) {
  selectedCategory = name; renderTabs(); renderArticles();
  document.querySelector("#articles").scrollIntoView({ behavior: "smooth", block: "start" });
}

function startReading() { const first = currentArticles()[0] ?? articles[0]; window.open(first.url, "_blank", "noopener,noreferrer"); }
function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.hidden = false; window.setTimeout(() => { toast.hidden = true; }, 2200); }

document.querySelector("#category-grid").addEventListener("click", (event) => { const card = event.target.closest("[data-category]"); if (card) selectCategory(card.dataset.category); });
document.querySelector("#filter-tabs").addEventListener("click", (event) => { const tab = event.target.closest("[data-tab]"); if (tab) selectCategory(tab.dataset.tab); });
document.querySelector("#search-input").addEventListener("input", (event) => { query = event.target.value; renderArticles(); });
document.querySelector("#start-reading").addEventListener("click", startReading);
document.querySelector("#closing-start").addEventListener("click", startReading);
document.querySelector("#share-button").addEventListener("click", async () => { const data = { title: "Frank分享经管知识合集", text: "36 篇经营分析、管理认知与 AI 转型好文", url: location.href }; try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); showToast("链接已复制"); } } catch {} });

renderCategories(); renderTabs(); renderArticles();
`;

await rm("docs", { recursive: true, force: true });
await mkdir("docs", { recursive: true });
await writeFile("docs/index.html", html);
await writeFile("docs/styles.css", styles);
await writeFile("docs/app.js", script);
await cp("public/favicon.svg", "docs/favicon.svg");
await cp("public/og.png", "docs/og.png");
await writeFile("docs/.nojekyll", "");
console.log("Static GitHub Pages site built in docs/");
