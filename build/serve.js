import express from "express";
import { compileFile } from "pug";
import { readFileSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import markdown from "markdown-it";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TEMPLATES = join(ROOT, "src/templates");
const STATICS = join(ROOT, "src/statics");
const DOC_MD = join(STATICS, "documents");
const PORT = process.env.PORT || 3000;
const BASE = "./";
const md = markdown();

// Page registry
const PAGES = {
  "index":        { title: "进度总览", active: "home" },
  "download":     { title: "全部文件", active: "download" },
  "about":        { title: "关于本站", active: "about" },
  "guanliyue":    { title: "小区管理规约", active: "guanliyue", icon: "📋", docx: "小区管理规约.docx", md: "小区管理规约.md" },
  "yishiguize":   { title: "业主大会议事规则", active: "yishiguize", icon: "⚖️", docx: "业主大会议事规则.docx", md: "业主大会议事规则.md" },
  "xuanjubanfa":  { title: "业主委员会选举办法", active: "xuanjubanfa", icon: "🗳️", docx: "业主委员会选举办法.docx", md: "业主委员会选举办法.md" },
  "xuanpiao":     { title: "选票模板", active: "xuanpiao", icon: "🗳️", docx: "选票模板.docx", md: "选票模板.md" },
};

const common = { base: BASE, description: "长春市双阳区碧桂园江山名筑业主委员会筹备组工作存档与进度跟踪" };

// Voting stats data (count pages) — read live so edits to voting.json show on refresh
const VOTING = join(ROOT, "src/data/voting.json");
const COUNT_BASE = "../"; // count pages live under /count/, assets resolve to root
function loadVoting() {
  return JSON.parse(readFileSync(VOTING, "utf-8"));
}
function renderCount() {
  const voting = loadVoting();
  return compileFile(join(TEMPLATES, "count.pug"))({ ...common, base: COUNT_BASE, title: "投票统计", active: "count", voting });
}

function renderPage(name) {
  const page = PAGES[name];
  if (!page) return null;

  const locals = { ...common, ...page, title: page.title };

  // Doc pages: convert markdown to HTML
  if (page.md) {
    const mdContent = readFileSync(join(DOC_MD, page.md), "utf-8");
    locals.docHtml = md.render(mdContent);
    return compileFile(join(TEMPLATES, "doc.pug"))(locals);
  }

  // Regular pages
  return compileFile(join(TEMPLATES, name + ".pug"))(locals);
}

const app = express();

// Serve static assets (css, js, documents, favicon)
app.use(express.static(STATICS));

// Render pug pages on the fly
app.get("/:page.html", (req, res) => {
  const html = renderPage(req.params.page);
  if (!html) return res.status(404).send("Not Found");
  res.type("html").send(html);
});

// Root
app.get("/", (req, res) => {
  res.type("html").send(renderPage("index"));
});

// Count (voting stats) pages — rendered live from src/data/voting.json
app.get(["/count", "/count/", "/count/index.html"], (req, res) => {
  res.type("html").send(renderCount());
});
app.get("/count/:building.html", (req, res) => {
  const html = renderCountBuilding(req.params.building);
  if (!html) return res.status(404).send("Not Found");
  res.type("html").send(html);
});

// Helper: match building by ASCII slug (URL) — name keeps the 栋 suffix for display
function renderCountBuilding(slug) {
  const voting = loadVoting();
  const b = voting.buildings.find((x) => x.slug === slug);
  if (!b) return null;
  return compileFile(join(TEMPLATES, "countBuilding.pug"))({
    ...common, base: COUNT_BASE, title: b.name + " 投票明细", active: "count", building: b, statTime: voting.statTime,
  });
}

app.listen(PORT, () => {
  console.log(`\n  🏠 本地预览服务器已启动 (Pug 热编译)\n`);
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://localhost:${PORT}/count/          投票统计总览`);
  console.log(`  http://localhost:${PORT}/count/001栋.html  楼栋投票明细`);
  console.log(`  http://localhost:${PORT}/guanliyue.html`);
  console.log(`  http://localhost:${PORT}/yishiguize.html`);
  console.log(`  http://localhost:${PORT}/xuanjubanfa.html`);
  console.log(`  http://localhost:${PORT}/download.html`);
  console.log(`  http://localhost:${PORT}/about.html`);
  console.log(`\n  按 Ctrl+C 停止\n`);
});
