"use client";

import { useMemo, useRef, useState } from "react";

const IMA_URL = "https://ima.qq.com/wiki/?shareId=9bab7dd363f897697c1844590bf0a2999d3bd8a0dd8d2b9e04bc270441520eac";

type Article = {
  title: string;
  category: string;
  url: string;
};

const categories = [
  {
    name: "数字化工具与 AI 转型",
    shortName: "AI 转型",
    count: 5,
    code: "01",
    description: "把 AI 与数字工具真正用进业务现场",
  },
  {
    name: "经营数据分析与经营会",
    shortName: "经营分析",
    count: 23,
    code: "02",
    description: "从财务数据走向诊断、决策与行动",
  },
  {
    name: "经营管理的认知",
    shortName: "管理认知",
    count: 8,
    code: "03",
    description: "理解经营、机制、绩效与组织效率",
  },
];

const articles: Article[] = [
  { title: "Workbuddy108个通用指令合集，新手必看！", category: "数字化工具与 AI 转型", url: "https://mp.weixin.qq.com/s?__biz=MzY4NjMwMjU1Nw==&mid=2247484484&idx=1&sn=c2d48bb5e71c4236d26a919c3d242d58&chksm=f2c52c6bbc7b4ab0637c78ee8c77bfbf117e2dd05cda0c6fd428caa9906704b719b9a68b95e2#rd" },
  { title: "如何用 Workbuddy 生成各类数据图表", category: "数字化工具与 AI 转型", url: "https://mp.weixin.qq.com/s?__biz=Mzk1NzIyMjY1NA==&mid=2247484528&idx=1&sn=2eaa7650c4347da3ce80a8a56b776b75&chksm=c21beed3d2435b6ef973ba16e750a8706403f0c7354a3b867a8692a68d57275293522917d125#rd" },
  { title: "Workbuddy108个通用指令合集，新手必看！（更新版）", category: "数字化工具与 AI 转型", url: "https://mp.weixin.qq.com/s?__biz=MzY4NjMwMjU1Nw==&mid=2247484484&idx=1&sn=c2d48bb5e71c4236d26a919c3d242d58&chksm=f2e7f4c4871348a54ee0d5988e4444fc3f5a13fec57262f82f60267e66b45c78f966a00e3870#rd" },
  { title: "汪峰把公司1100人砍到400人：引入 AI 后，组织发生了什么？", category: "数字化工具与 AI 转型", url: "https://mp.weixin.qq.com/s?__biz=MzA5MTI3Nzk4OQ==&mid=2658439705&idx=1&sn=63499d0951cece2a2c4926a16c71b496&chksm=8a6c371ee0c37f8cd9481a946a879ab0f72e6791762c0c05367bb57ffe1e3338d1ca22b028a6#rd" },
  { title: "制造业数据：10分钟自动生成12张专业看板", category: "数字化工具与 AI 转型", url: "https://mp.weixin.qq.com/s?__biz=Mzk4ODU0MjUxNw==&mid=2247493160&idx=1&sn=ba3a147ce77eee650ed6f3f1c94864ce&chksm=c46a65553146858a17668cfb33b12d9916c2a8c564b8fedc3c6cde3ff38d4cb32216c0efe9d2#rd" },
  { title: "经营分析，不能脱离经营现场", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s/1Be3wMluyNcgs0EcSLTavg" },
  { title: "吃透这15个财务分析模型，你的分析能力直接碾压同行！", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=Mzg4OTUyMzY4OQ==&mid=2247581442&idx=1&sn=fa64964f7702a130ebabf9ae3f517084&chksm=ce7eb7bc60565e965a9e81616300dcf2783115fead162d2e763849c684e2040f76fd36f51fc6#rd" },
  { title: "财务 BP 必掌握的6大核心模块", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzYzODUzODEwMg==&mid=2247484935&idx=1&sn=74e80e87dea831a2fc52b1b519e022f9&chksm=f1646a710ad3eb6a20a61bc59b3aff1879243c38bdfc868ca36b2c6e08bd9b6fe1e6ad4d9c50#rd" },
  { title: "经营分析，常用的15个工具", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzAwMTA4OTY1MA==&mid=2247500061&idx=1&sn=9ce4e962641bbbd9523d7889ccbfec94&chksm=9beb0cfe1c9f21e35eac41f07aa40b2ea6eb8a8ef0b41e085f3b2bfb683cb37c4836ba4dea8a#rd" },
  { title: "如何从财务分析走向真正的经营分析", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzYzMzcyMzAzOQ==&mid=2247485398&idx=1&sn=79f3e920cc552d4546eb093997a9aeae&chksm=f15dd73e134d2979582048205c71e801f05f0b4577c9be09eaf7292a10482c76baa697c96e83#rd" },
  { title: "经营分析｜真正要盯的10大要点", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY5NzA5NDk5OA==&mid=2247485071&idx=1&sn=ca27b854adca037f403881590be0f59a&chksm=f5fcf382e70107da6636f28a6e9c76fbf4e6aaf995163ccb7a783df24b00912783da5133d4ab#rd" },
  { title: "经营分析6大要素", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzM0NTUwMw==&mid=2247486032&idx=1&sn=708ae258b317c10087589cc1e89b1181&chksm=f2c8c4dd654116957e8f4d3f9b9da3822264a76140f499e0501ddf15d4ef619ccdde509def4f#rd" },
  { title: "AI 重构财务：企业财务转型全景图", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzcwMTAyNzUwMw==&mid=2247485471&idx=1&sn=2fbf462c30f6a34edf9fc019acea568b&chksm=f5932ed9bb2e0f889b1d24651c53b4286b09a384f83b6902028a49cf88813ab665eded584c6a#rd" },
  { title: "经营分析全流程 SOP", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI4NjAwOQ==&mid=2247484021&idx=1&sn=a54b5cf79f96917704a0e2afbb80f47e&chksm=f25fb564ce80f5163ce6fc8cdeed75bc43becbd78d9a404304562ac84a1b760256b28ef16619#rd" },
  { title: "2026年7月总经理经营分析 PPT", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY5NTM2NTA5NA==&mid=2247484182&idx=1&sn=b1cf5f361f3dab1ec8626fd0efe8e96c&chksm=f586fa6e49aeb6f0f3801e261a9e7e2592da62de8f20cb0be442fd4bd10df8036bd3113b7125#rd" },
  { title: "财务分析到底该怎么做？真正厉害的财务，都在用这9个模型找问题", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI4NjAwOQ==&mid=2247484359&idx=1&sn=b5b4717f697ddaa8381f3d7e0f8274ac&chksm=f2034b43567c5a0aebdf00134a395e4bd186f57e1c8c30cc5acd7275f3ea324bcaae0e130669#rd" },
  { title: "经营分析，真正关注的就这10大要点（更新版）", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzcwMTAyNzUwMw==&mid=2247485459&idx=1&sn=4fe16d0ec9fb9283c1a9a37db40eed24&chksm=f54c6349939402aee7812e717ec5147697362b202b53b360e74b7adf6922ed038f7ccb7fcde7#rd" },
  { title: "一张图看懂！经营分析到底分析什么", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY5NzA5NDk5OA==&mid=2247484904&idx=1&sn=1b8ce7d37820ad9206527f3f0860a351&chksm=f52b80a93fa69a44f7dbe3d2dbd1d35ca3fe0b8ac1de0f5f2d635d879ec5fecd55247a765571#rd" },
  { title: "制造业数据分析的12个核心维度", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzYzOTc2NTcwNQ==&mid=2247484548&idx=1&sn=13fe389fed349d1c5d80cfadba6e1c09&chksm=f1278c99fdb76c921b7d058dda79e083db0ae9e7d38446849cc422eb20bb480758650402b742#rd" },
  { title: "这9个分析模型，可以搞定80%的数据分析工作", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzcwMDI5OTY1OA==&mid=2247484458&idx=1&sn=b67bc784a242573222dce5494dc73aaa&chksm=f5b997bb6cd0f9a1a6a707497882732f19a9f9473b982f0de725135fe9900e7f21146f909aaf#rd" },
  { title: "经营分析会必看8个指标：收入、毛利、费用、利润、现金流、库存、人效、回款", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI4NjAwOQ==&mid=2247484305&idx=1&sn=24871fcaaf8f25016879f2ac266c42f0&chksm=f2e713528479d2f153769056538289c96b9fbd9083a10a568a3a40dea97582a3400a09e6d07d#rd" },
  { title: "经营分析会别诉苦：下半年盯住6类指标", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzE5MTUzOTc3Mg==&mid=2247487545&idx=1&sn=6e5d9f55fc68a90b14a7854547079a6a&chksm=97ba09fae8e34c5e070750c2ff7a2eb424788358df6e2834a3c81841045e9aa39d52735b20ef#rd" },
  { title: "经营分析，真正关注的就这10大要点", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzcwMTAyNzUwMw==&mid=2247485459&idx=1&sn=4fe16d0ec9fb9283c1a9a37db40eed24&chksm=f586b93adc145e8d5a8672f8444fd7e9ff051b864d18515e8b6fb376bcf5524baeea84ae0c9a#rd" },
  { title: "经营分析6大模块：从数据到决策", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzAwMTA4OTY1MA==&mid=2247503329&idx=1&sn=d23e1b12f5e1c9d1eea4a455d783dd7a&chksm=9b3a80e3d925a07c8bd2032f62903f2f07698f502c47c6acc01bb2521382cb5356ac173d8526#rd" },
  { title: "经营分析 SOP 怎么做？从数据整理到经营改善全流程详解", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI4NjAwOQ==&mid=2247484350&idx=1&sn=faad7adef6800fea573bf01baad8e816&chksm=f2037dd87b148bf7c8fe066bbfbfbaec8f1c708646cbac5af479e09ab629f40b7234b1006791#rd" },
  { title: "终于有人讲清楚了——数据分析的十大方法论", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzYzNzk2Nzg4Mw==&mid=2247483852&idx=1&sn=39c4dc6ef9f58a24ac65402589a585f1&chksm=f1b406c41dbffd86cb836be7d4e3210aca576d51f0bb7460ad33400fc1aa3fc659d35641a005#rd" },
  { title: "经营分析会怎么开才有效？流程、指标与行动闭环一次讲清", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI4NjAwOQ==&mid=2247484360&idx=1&sn=257229e5ddedfecd7861ee34130e1598&chksm=f2ba33aa9402723876cee87036bc829d89d27f089639bccdd396e7129651f0a4dfd2f655c1c6#rd" },
  { title: "从财务到增长，拆解经营分析9个必懂模型", category: "经营数据分析与经营会", url: "https://mp.weixin.qq.com/s?__biz=MzY4NzI5OTczMg==&mid=2247484159&idx=1&sn=0e16ae7ec21865ffeed1fa49045ce3b3&chksm=f20db6929c0b77cd1327a9c347b987278e55480748c47052d9082f13827ef79700d201e960c7#rd" },
  { title: "靠谱的管理", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzczNjE0NDI2Nw==&mid=2247483658&idx=1&sn=1607d7eb67d29b8f4bf903aaea7a8d47&chksm=f7d64eccc7a6ad0060817710dfe5e9302e5936080275ccbeaff1482ddfb2516b56f3bd9cd3cf#rd" },
  { title: "从战略到结果，绩效管理体系落地全流程", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzkzNjYwNDY4Mw==&mid=2247484100&idx=1&sn=2703e427079af5d975d97953d827288f&chksm=c3e945568c86e185fb226808c4e52ecb192d4993d507b36f46041f194ddccf8954ddc1cff1fb#rd" },
  { title: "谁说搭建绩效管理体系很难？", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzcwNjM5MTEwNg==&mid=2247484032&idx=1&sn=08a497f07c8ce2bb4ba260b3dda9a9a8&chksm=f5792c40a09b725adc7c16c90f1b97abf0bf4f0f8027539c05b97fbe8e5d58a6c9106229528e#rd" },
  { title: "降本增效的核心逻辑是什么？", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzY5NTMxOTQyNQ==&mid=2247483961&idx=1&sn=11d1d4db8f45efb4728328c46fcf9778&chksm=f5873b5f3bb9a3030a887b4eadfb4c7aa4aa2102356d14f7798d52792ceef0b8e6fcf9a8f016#rd" },
  { title: "经营、运营、管理有什么不同", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzYzOTcxNjQ5OQ==&mid=2247486318&idx=1&sn=f56427c07dad854181424af60ac91f00&chksm=f194c8f1f5d82567f2125d1e03f0e6044e37c9f4cfa84891baac7f9cd2b5f67303b6676e27c6#rd" },
  { title: "经营管理的分水岭：从解决问题到设计机制", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzE5MTUzOTc3Mg==&mid=2247487410&idx=1&sn=620b10eb331af88247d537130d9c4731&chksm=9725394e6772f2ee821eb5ae8d709e85c684fbea832d7662f1ad8ea3a0b2c56c4db51c2ad1ab#rd" },
  { title: "一张图讲透经营与管理本质的区别", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzY4NDE0MzUzMw==&mid=2247484903&idx=1&sn=ce91cd6ec435b665155257cd59e24bff&chksm=f24c6617ceabe2fab51a7cf9e6c6dd64d07820dddd27a9470311750066f4e2d670ced89708fc#rd" },
  { title: "企业发展和盈利，真正靠什么？", category: "经营管理的认知", url: "https://mp.weixin.qq.com/s?__biz=MzE5MTUzOTc3Mg==&mid=2247487474&idx=1&sn=5f34fd514bb18dceea6896a714c3b543&chksm=973934ae11eaa895f8a61a0a24e3246329590518af1ed84ea02d05596b5aa1b54fd4cae21081#rd" },
];

const categoryIndex = (category: string) => categories.findIndex((item) => item.name === category);

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const articleSectionRef = useRef<HTMLElement>(null);

  const filteredArticles = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return articles.filter((article) => {
      const categoryMatch = activeCategory === "全部" || article.category === activeCategory;
      const keywordMatch = !keyword || article.title.toLowerCase().includes(keyword) || article.category.toLowerCase().includes(keyword);
      return categoryMatch && keywordMatch;
    });
  }, [activeCategory, query]);

  const selectCategory = (name: string) => {
    setActiveCategory(name);
    articleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    const shareData = {
      title: "Frank分享经管知识合集",
      text: "36 篇经营分析、管理认知与 AI 转型好文",
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setToast("链接已复制");
        window.setTimeout(() => setToast(""), 2200);
      }
    } catch {
      // Native share sheets can be dismissed intentionally.
    }
  };

  const startReading = () => {
    const firstArticle = filteredArticles[0] ?? articles[0];
    window.open(firstArticle.url, "_blank", "noopener,noreferrer");
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到页面顶部">
          <span className="brand-mark">F</span>
          <span>经管好文</span>
        </a>
        <div className="topbar-actions">
          <a className="text-link" href={IMA_URL} target="_blank" rel="noreferrer">查看原合集</a>
          <button className="icon-button" type="button" onClick={handleShare} aria-label="分享合集">↗</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>FRANK’S COLLECTION</span><span className="eyebrow-line" /></div>
          <h1>Frank分享<br /><em>经管知识合集</em></h1>
          <p className="hero-description">把值得反复阅读的经营管理文章，整理成一份清晰、好用、随时可以开始的阅读清单。</p>
          <div className="curator">
            <span className="avatar">陈</span>
            <span><strong>陈忠胜</strong><small>创建并持续整理</small></span>
          </div>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={startReading}>开始阅读 <span>→</span></button>
            <a className="secondary-button" href="#articles">浏览全部 36 篇</a>
          </div>
        </div>

        <div className="hero-art" aria-label="经营知识合集封面装饰">
          <div className="cover-card cover-back"><span>MANAGEMENT</span></div>
          <div className="cover-card cover-middle"><span>BUSINESS</span></div>
          <div className="cover-card cover-front">
            <div className="cover-number">36</div>
            <div className="cover-title">经营<br />知识<br />合集</div>
            <div className="cover-footer"><span>VOL. 01</span><span>2026</span></div>
          </div>
          <div className="art-stamp">3 个主题<br />36 篇内容</div>
        </div>
      </section>

      <section className="stats" aria-label="合集概览">
        <div><strong>36</strong><span>篇精选内容</span></div>
        <div><strong>03</strong><span>个知识主题</span></div>
        <div><strong>2026.08</strong><span>本次整理</span></div>
        <p>从数据走向决策<br />从问题走向机制</p>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <div><span className="section-kicker">COLLECTION INDEX</span><h2 id="category-title">按主题阅读</h2></div>
          <p>三条路径，构成一套从工具到分析、再到管理的认知地图。</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button className="category-card" type="button" key={category.name} onClick={() => selectCategory(category.name)}>
              <span className="category-code">{category.code}</span>
              <span className="category-count">{String(category.count).padStart(2, "0")} 篇</span>
              <strong>{category.name}</strong>
              <span className="category-description">{category.description}</span>
              <span className="category-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="article-section" id="articles" ref={articleSectionRef} aria-labelledby="article-title">
        <div className="article-toolbar">
          <div><span className="section-kicker">ALL ARTICLES</span><h2 id="article-title">合集文章</h2></div>
          <label className="search-box">
            <span>搜索</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入文章关键词" aria-label="搜索文章" />
          </label>
        </div>

        <div className="filter-row" role="tablist" aria-label="文章分类">
          {["全部", ...categories.map((category) => category.name)].map((name) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === name}
              className={activeCategory === name ? "filter active" : "filter"}
              onClick={() => setActiveCategory(name)}
              key={name}
            >
              {name === "全部" ? "全部 36" : categories.find((item) => item.name === name)?.shortName}
            </button>
          ))}
          <span className="result-count">当前显示 {filteredArticles.length} 篇</span>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="article-list">
            {filteredArticles.map((article, index) => {
              const themeIndex = categoryIndex(article.category);
              return (
                <a className="article-row" href={article.url} target="_blank" rel="noreferrer" key={`${article.url}-${index}`}>
                  <span className="article-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="article-main">
                    <span className="article-category">{article.category}</span>
                    <strong>{article.title}</strong>
                    <span className="article-meta">公众号文章　·　收录于 IMA 知识库</span>
                  </span>
                  <span className={`article-cover theme-${themeIndex + 1}`} aria-hidden="true">
                    <span>{categories[themeIndex]?.shortName}</span>
                    <i />
                  </span>
                  <span className="article-open">↗</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="empty-state"><strong>没有找到相关文章</strong><p>试试更短的关键词，或切换到“全部”。</p></div>
        )}
      </section>

      <section className="closing-section">
        <span className="closing-label">READ · THINK · PRACTICE</span>
        <h2>收藏只是开始，<br />真正的价值发生在实践里。</h2>
        <div className="closing-actions">
          <button className="primary-button light" type="button" onClick={startReading}>从第一篇开始 <span>→</span></button>
          <a href={IMA_URL} target="_blank" rel="noreferrer">在 IMA 中打开原合集 ↗</a>
        </div>
      </section>

      <footer>
        <span>Frank分享经管知识合集</span>
        <span>由陈忠胜整理 · 36 篇内容</span>
      </footer>

      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </main>
  );
}
