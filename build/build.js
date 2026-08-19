import { compileFile } from "pug";
import { readFileSync, writeFileSync, cpSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import markdown from "markdown-it";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const TEMPLATES = join(ROOT, "src/templates");
const STATICS = join(ROOT, "src/statics");
const DOC_MD = join(STATICS, "documents");
const PUBLIC = join(ROOT, "public");
const BASE = "./";

const md = markdown();

// Page definitions
const PAGES = [
  { tpl: "index", out: "index.html", title: "进度总览", active: "home" },
  { tpl: "download", out: "download.html", title: "全部文件", active: "download" },
  { tpl: "about", out: "about.html", title: "关于本站", active: "about" },
];

// Document pages (from markdown)
const DOCS = [
  { tpl: "doc", out: "guanliyue.html", title: "小区管理规约", icon: "📋", docx: "小区管理规约.docx", md: "小区管理规约.md", active: "guanliyue" },
  { tpl: "doc", out: "yishiguize.html", title: "业主大会议事规则", icon: "⚖️", docx: "业主大会议事规则.docx", md: "业主大会议事规则.md", active: "yishiguize" },
  { tpl: "doc", out: "biaojueGuize.html", title: "首次业主大会表决规则", icon: "📊", docx: "首次业主大会表决规则.docx", md: "首次业主大会表决规则.md", active: "biaojueGuize" },
  { tpl: "doc", out: "xuanjubanfa.html", title: "业主委员会选举办法", icon: "🗳️", docx: "业主委员会选举办法.docx", md: "业主委员会选举办法.md", active: "xuanjubanfa" },
  { tpl: "doc", out: "houxuanrenBanfa.html", title: "候选人产生办法", icon: "👥", docx: "候选人产生办法.docx", md: "候选人产生办法.md", active: "houxuanrenBanfa" },
  { tpl: "doc", out: "tuiXuanGonggao.html", title: "候选人产生办法及推选公告", icon: "📢", docx: "候选人产生办法及推选公告.docx", md: "候选人产生办法及推选公告.md", active: "tuiXuanGonggao" },
  { tpl: "doc", out: "tuiJianBiao.html", title: "候选人推荐表", icon: "📝", docx: "候选人推荐表.docx", md: "候选人推荐表.md", active: "tuiJianBiao" },
  { tpl: "doc", out: "ziJianBiao.html", title: "候选人自荐表", icon: "📝", docx: "候选人自荐表.docx", md: "候选人自荐表.md", active: "ziJianBiao" },
  { tpl: "doc", out: "xuanpiao.html", title: "选票模板", icon: "🗳️", docx: "选票模板.docx", md: "选票模板.md", active: "xuanpiao" },
  { tpl: "doc", out: "shenfenGongshi.html", title: "业主身份公示模板", icon: "👤", docx: "附件B-业主身份公示模板.docx", md: "附件B-业主身份公示模板.md", active: "shenfenGongshi" },
  { tpl: "doc", out: "zongheGongshi.html", title: "综合公示模板", icon: "📢", docx: "综合公示模板.docx", md: "综合公示模板.md", active: "zongheGongshi" },
  { tpl: "doc", out: "shouquanWeituo.html", title: "授权委托书（业主授权参选业委会）", icon: "📄", docx: "授权委托书（业主授权参选业委会）.docx", md: "授权委托书.md", active: "shouquanWeituo" },
];

// Clean & create public/
if (existsSync(PUBLIC)) rmSync(PUBLIC, { recursive: true });
mkdirSync(PUBLIC, { recursive: true });

// Common locals
const common = { base: BASE, description: "长春市双阳区碧桂园江山名筑业主委员会筹备组工作存档与进度跟踪" };

// Compile regular pages
for (const page of PAGES) {
  const tplPath = join(TEMPLATES, page.tpl + ".pug");
  const html = compileFile(tplPath)({ ...common, ...page });
  const outPath = join(PUBLIC, page.out);
  mkdirSync(join(PUBLIC), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`  ${page.out}`);
}

// Compile doc pages (pug + markdown)
for (const doc of DOCS) {
  const mdPath = join(DOC_MD, doc.md);
  const mdContent = readFileSync(mdPath, "utf-8");
  const docHtml = md.render(mdContent);
  const tplPath = join(TEMPLATES, doc.tpl + ".pug");
  const html = compileFile(tplPath)({ ...common, ...doc, docHtml });
  writeFileSync(join(PUBLIC, doc.out), html);
  console.log(`  ${doc.out}`);
}

// Compile count (voting stats) pages from data
import { readdirSync as _rd } from "fs";
const VOTING = join(ROOT, "src/data/voting.json");
const voting = JSON.parse(readFileSync(VOTING, "utf-8"));
const COUNT_DIR = join(PUBLIC, "count");
mkdirSync(COUNT_DIR, { recursive: true });
// remove stale hand-generated count html so copyDir below doesn't overwrite
if (existsSync(join(STATICS, "count"))) {
  for (const f of _rd(join(STATICS, "count"))) {
    if (f.endsWith(".html")) rmSync(join(STATICS, "count", f));
  }
}
const countIndexHtml = compileFile(join(TEMPLATES, "count.pug"))({ ...common, base: "../", title: "投票统计", active: "count", voting });
writeFileSync(join(COUNT_DIR, "index.html"), countIndexHtml);
console.log("  count/index.html");
for (const b of voting.buildings) {
  const html = compileFile(join(TEMPLATES, "countBuilding.pug"))({
    ...common, base: "../", title: b.name + " 投票明细", active: "count", building: b, statTime: voting.statTime,
  });
  writeFileSync(join(COUNT_DIR, b.slug + ".html"), html);
  console.log(`  count/${b.slug}.html`);
}

// Copy static assets (css, js, documents, favicon)
const SKIP_EXT = new Set([".md"]);
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      const ext = entry.slice(entry.lastIndexOf("."));
      if (SKIP_EXT.has(ext)) continue;
      cpSync(srcPath, destPath);
    }
  }
}
copyDir(STATICS, PUBLIC);

// List output
console.log("\npublic/:");
function list(dir, prefix = "") {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e), rel = prefix ? `${prefix}/${e}` : e;
    if (statSync(full).isDirectory()) list(full, rel);
    else console.log(`  ${rel}`);
  }
}
list(PUBLIC);
console.log("\nDone.");
