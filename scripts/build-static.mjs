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
    <meta property="og:url" content="https://dateanalysi9527-bit.github.io/frank-management-collection/" />
    <meta property="og:image" content="https://dateanalysi9527-bit.github.io/frank-management-collection/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://dateanalysi9527-bit.github.io/frank-management-collection/" />
    <title>Frank分享经管知识合集</title>
    <link rel="icon" href="favicon.svg" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <header class="topbar">
        <a class="brand" href="#top" aria-label="返回顶部"><span class="brand-mark">F</span><span>经管好文</span></a>
        <div class="topbar-actions"><a class="text-link" href="${imaUrl}" target="_blank" rel="noreferrer">查看原合集</a><button class="icon-button" id="share-button" type="button" aria-label="分享合集">↗</button></div>
      </header>

      <section class="hero" id="top">
        <div class="hero-copy">
          <div class="eyebrow"><span>FRANK’S COLLECTION</span><span class="eyebrow-line"></span></div>
          <h1>Frank分享<br /><em>经管知识合集</em></h1>
          <p class="hero-description">把值得反复阅读的经营管理文章，整理成一份清晰、好用、随时可以开始的阅读清单。</p>
          <div class="curator"><span class="avatar">陈</span><span><strong>陈忠胜</strong><small>创建并持续整理</small></span></div>
          <div class="hero-actions"><button class="primary-button" id="start-reading" type="button">开始阅读 <span>→</span></button><a class="secondary-button" href="#articles">浏览全部 36 篇</a></div>
        </div>
        <div class="hero-art" aria-label="经营知识合集封面装饰">
          <div class="cover-card cover-back"><span>MANAGEMENT</span></div>
          <div class="cover-card cover-middle"><span>BUSINESS</span></div>
          <div class="cover-card cover-front"><div class="cover-number">36</div><div class="cover-title">经营<br />知识<br />合集</div><div class="cover-footer"><span>VOL. 01</span><span>2026</span></div></div>
          <div class="art-stamp">3 个主题<br />36 篇内容</div>
        </div>
      </section>

      <section class="stats" aria-label="合集概览"><div><strong>36</strong><span>篇精选内容</span></div><div><strong>03</strong><span>个知识主题</span></div><div><strong>2026.08</strong><span>本次整理</span></div><p>从数据走向决策<br />从问题走向机制</p></section>

      <section class="category-section" id="categories" aria-labelledby="category-title"><div class="section-heading"><div><span class="section-kicker">COLLECTION INDEX</span><h2 id="category-title">按主题阅读</h2></div><p>三条路径，构成一套从工具到分析、再到管理的认知地图。</p></div><div class="category-grid" id="category-grid"></div></section>

      <section class="article-section" id="articles" aria-labelledby="article-title"><div class="article-toolbar"><div><span class="section-kicker">ALL ARTICLES</span><h2 id="article-title">合集文章</h2></div><label class="search-box"><span>搜索</span><input id="search-input" type="search" placeholder="输入文章关键词" aria-label="搜索文章" /></label></div><div class="filter-row" id="filter-tabs" role="tablist" aria-label="文章分类"></div><div id="article-results"></div></section>

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
    <button class="category-card" type="button" data-category="\${category.name}">
      <span class="category-code">\${category.code}</span><span class="category-count">\${category.count} 篇</span>
      <strong>\${category.name}</strong><span class="category-description">\${category.description}</span><span class="category-arrow">→</span>
    </button>\`).join("");
}

function renderTabs() {
  const tabs = ["全部", ...categories.map((item) => item.name)];
  document.querySelector("#filter-tabs").innerHTML = tabs.map((name) => {
    const label = name === "全部" ? "全部 36" : categories.find((item) => item.name === name)?.shortName;
    return \`<button type="button" role="tab" aria-selected="\${selectedCategory === name}" class="filter \${selectedCategory === name ? "active" : ""}" data-tab="\${name}">\${label}</button>\`;
  }).join("") + \`<span class="result-count" id="result-count"></span>\`;
}

function renderArticles() {
  const filtered = currentArticles();
  document.querySelector("#result-count").textContent = \`当前显示 \${filtered.length} 篇\`;
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
