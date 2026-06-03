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
  { tpl: "doc", out: "xuanjubanfa.html", title: "业主委员会选举办法", icon: "🗳️", docx: "业主委员会选举办法.docx", md: "业主委员会选举办法.md", active: "xuanjubanfa" },
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
