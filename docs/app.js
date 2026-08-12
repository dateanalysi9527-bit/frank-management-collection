
let selectedCategory = "全部";
let query = "";

const categoryIndex = (name) => categories.findIndex((item) => item.name === name);
const currentArticles = () => articles.filter((article) => {
  const matchesCategory = selectedCategory === "全部" || article.category === selectedCategory;
  const matchesQuery = article.title.toLowerCase().includes(query.trim().toLowerCase());
  return matchesCategory && matchesQuery;
});

function renderCategories() {
  document.querySelector("#category-grid").innerHTML = categories.map((category, index) => `
    <button class="category-card" type="button" data-category="${category.name}">
      <span class="category-code">${category.code}</span><span class="category-count">${category.count} 篇</span>
      <strong>${category.name}</strong><span class="category-description">${category.description}</span><span class="category-arrow">→</span>
    </button>`).join("");
}

function renderTabs() {
  const tabs = ["全部", ...categories.map((item) => item.name)];
  document.querySelector("#filter-tabs").innerHTML = tabs.map((name) => {
    const label = name === "全部" ? "全部 36" : categories.find((item) => item.name === name)?.shortName;
    return `<button type="button" role="tab" aria-selected="${selectedCategory === name}" class="filter ${selectedCategory === name ? "active" : ""}" data-tab="${name}">${label}</button>`;
  }).join("") + `<span class="result-count" id="result-count"></span>`;
}

function renderArticles() {
  const filtered = currentArticles();
  document.querySelector("#result-count").textContent = `当前显示 ${filtered.length} 篇`;
  const target = document.querySelector("#article-results");
  if (!filtered.length) { target.innerHTML = '<div class="empty-state"><strong>没有找到相关文章</strong><p>试试更短的关键词，或切换到“全部”。</p></div>'; return; }
  target.innerHTML = `<div class="article-list">${filtered.map((article, index) => {
    const themeIndex = categoryIndex(article.category);
    return `<a class="article-row" href="${article.url}" target="_blank" rel="noreferrer"><span class="article-index">${String(index + 1).padStart(2, "0")}</span><span class="article-main"><span class="article-category">${article.category}</span><strong>${article.title}</strong><span class="article-meta">公众号文章　·　收录于 IMA 知识库</span></span><span class="article-cover theme-${themeIndex + 1}" aria-hidden="true"><span>${categories[themeIndex]?.shortName ?? "专题"}</span><i></i></span><span class="article-open">↗</span></a>`; }).join("")}</div>`;
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
