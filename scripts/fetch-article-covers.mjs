import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { cpus } from "node:os";

const source = await readFile("app/CollectionPage.tsx", "utf8");
const articleMatches = [...source.matchAll(/\{ title: "([^"]+)", category: "([^"]+)", url: "(https:\/\/mp\.weixin\.qq\.com\/[^"]+)" \}/g)];
if (articleMatches.length !== 36) throw new Error(`预期 36 篇文章，实际找到 ${articleMatches.length} 篇`);

const articles = articleMatches.map((match, index) => ({ index, title: match[1], url: match[3] }));
const outputDirectory = "public/article-covers";
await mkdir(outputDirectory, { recursive: true });

const curl = "C:\\Users\\31345\\.workbuddy\\vendor\\PortableGit\\mingw64\\bin\\curl.exe";
const python = "C:\\Users\\31345\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(Buffer.concat(stdout)) : reject(new Error(Buffer.concat(stderr).toString() || `${command} 退出码 ${code}`)));
  });
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

async function fetchCover(article) {
  const html = (await run(curl, ["-L", "--silent", "--show-error", "--max-time", "35", "--retry", "2", "-A", userAgent, article.url])).toString("utf8");
  const imageUrl = decodeEntities(html.match(/property=["']og:image["']\s+content=["']([^"']+)/i)?.[1] ?? "");
  if (!/^https?:\/\/mmbiz\.qpic\.cn\//.test(imageUrl)) throw new Error("未找到公众号封面地址");
  const secureImageUrl = imageUrl.replace(/^http:\/\//, "https://");

  const originalPath = `${outputDirectory}/${String(article.index + 1).padStart(2, "0")}.source`;
  const outputPath = `${outputDirectory}/${String(article.index + 1).padStart(2, "0")}.webp`;
  const image = await run(curl, ["-L", "--silent", "--show-error", "--max-time", "35", "--retry", "2", "-A", userAgent, "-e", article.url, secureImageUrl]);
  await writeFile(originalPath, image);
  await run(python, ["-c", "from PIL import Image,ImageOps; import sys; im=Image.open(sys.argv[1]).convert('RGB'); im=ImageOps.fit(im,(480,320),method=Image.Resampling.LANCZOS,centering=(0.5,0.5)); im.save(sys.argv[2],'WEBP',quality=82,method=6)", originalPath, outputPath]);
  await rm(originalPath, { force: true });
  return { index: article.index, title: article.title, image: `article-covers/${String(article.index + 1).padStart(2, "0")}.webp`, source: secureImageUrl };
}

const results = new Array(articles.length);
const failures = [];
let cursor = 0;
const workerCount = Math.min(4, Math.max(2, Math.floor(cpus().length / 2)));

await Promise.all(Array.from({ length: workerCount }, async () => {
  while (cursor < articles.length) {
    const article = articles[cursor++];
    try {
      results[article.index] = await fetchCover(article);
      console.log(`[${article.index + 1}/36] ${article.title}`);
    } catch (error) {
      failures.push({ index: article.index, title: article.title, error: error.message });
      console.warn(`[失败 ${article.index + 1}/36] ${article.title}: ${error.message}`);
    }
  }
}));

await writeFile(`${outputDirectory}/manifest.json`, JSON.stringify({ generatedAt: new Date().toISOString(), covers: results.filter(Boolean), failures }, null, 2));
console.log(`完成：${results.filter(Boolean).length}/36，失败 ${failures.length}`);
if (failures.length) process.exitCode = 2;
