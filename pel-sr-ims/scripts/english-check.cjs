#!/usr/bin/env node
// English check for math labs: pulls every student-facing string out of a
// lab's .tsx files and flags candidates against the grade's guidelines in
// .claude/reference/english-for-math/. It finds CANDIDATES; a person (or the
// math-lab-english-checker agent) reads them and decides.
//
// Usage (from pel-sr-ims/):
//   node scripts/english-check.cjs --grade K <file-or-folder> [more...] [--json out.json] [--all]
// Example:
//   node scripts/english-check.cjs --grade K \
//     src/pages/math-levels/MK1/MK1_CountingAndCardinalityLab.tsx \
//     src/pages/math-levels/MK1/CountingAndCardinalityLab
//
// ${...} values in template strings become "N", so word counts are close,
// not exact. Text built at run time from pools (names, verbs) still needs
// a real-values check; see checklist.md step 2.

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

// ---------- args
const args = process.argv.slice(2);
let gradeArg = null, jsonOut = null, showAll = false;
const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--grade") gradeArg = args[++i];
  else if (args[i] === "--json") jsonOut = args[++i];
  else if (args[i] === "--all") showAll = true;
  else inputs.push(args[i]);
}
if (gradeArg == null || !inputs.length) {
  console.error("Usage: node scripts/english-check.cjs --grade K|1..8 <file-or-folder> [...] [--json out.json] [--all]");
  process.exit(1);
}
const G = gradeArg.toUpperCase() === "K" ? 0 : Number(gradeArg);
if (!(G >= 0 && G <= 8)) { console.error("--grade must be K or 1-8"); process.exit(1); }

// ---------- guideline data (keep in sync with the grade files)
const LIMIT = { 0: 8, 1: 10, 2: 12, 3: 15, 4: 18, 5: 20, 6: 25, 7: 25, 8: 25 };
const LATER_WORDS = {
  0: /\b(numerals?|digits?|symbols?|sum|difference|equations?|decompos\w*|attributes?|cardinality|partners?|place value|addends?|greater than|categor\w+)\b/i,
  1: /\b(difference|place value|expanded form|even|odd|commutative|multipl\w+|divid\w+|product|quotient|arrays?|estimate)\b/i,
  2: /\b(multipl\w+|product|factors?|divi\w+|quotient|remainders?|round(ing|ed)? to|area|perimeter|commutative|associative|distributive|numerators?|denominators?)\b/i,
  3: /\b(remainders?|multiples?|prime|composite|times as (many|much|long|tall|heavy)|decimals?|mixed numbers?|expressions?|parenthes\w+|per|percent|commutative|associative|distributive|variables?)\b/i,
  4: /\b(expressions?|parenthes\w+|brackets|braces|exponents?|volume|ratios?|per|percent|negative|integers?|variables?|evaluate)\b/i,
  5: /\b(variables?|ratios?|rates?|per|percent|negative|integers?|coefficients?)\b/i,
  6: /\b(slope|functions?|irrational|proportional|constant of proportionality)\b/i,
  7: /\b(slope|functions?|irrational)\b/i,
  8: null,
};
const TRAPS = /\b(left over|in all|altogether|times a (day|week)|even though|difference between|mean|range|figure out|you nailed it|piece of cake|ballpark)\b/i;
const HOMOPHONES = /\b(sum|whole|cents|weigh|plane|pair)\b/i; // checked for K-3 (read-aloud)
const CONTEXT = /\b(dozen|allowance|tip|tax|inning|touchdown|quarterback|mileage|mortgage)\b/i;

// ---------- extraction
const SKIP_PROPS = new Set(["className", "style", "id", "key", "type", "kind", "bucket", "tone", "tones", "href", "src", "fill", "stroke", "d", "viewBox", "arrangement", "difficulty", "skillId", "componentFile", "componentExport", "variant", "mode", "role", "as", "fontFamily", "fontWeight", "textAnchor", "dominantBaseline", "transform", "points", "width", "height", "color", "background", "border"]);
const TEXT_ATTRS = new Set(["aria-label", "data-tts-say", "title", "label", "placeholder", "prompt", "hint", "explain", "showMe", "story", "wrapUp"]);
const TEXT_TAGS = new Set(["p", "aside", "li", "h1", "h2", "h3", "h4", "button", "span", "label", "div", "ReadAloud", "strong", "b", "em", "td", "th", "Says", "summary", "option", "text", "tspan"]);

function textOf(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) {
    let s = node.head.text;
    for (const sp of node.templateSpans) s += "N" + sp.literal.text;
    return s;
  }
  return null;
}
function jsxLine(el, sf) {
  let s = "", hasText = false;
  for (const c of el.children) {
    if (ts.isJsxText(c)) { const t = c.text.replace(/\s+/g, " "); if (t.trim()) hasText = true; s += t; }
    else if (ts.isJsxExpression(c) && c.expression) {
      const t = textOf(c.expression);
      if (t != null) { s += t; hasText = true; } else s += "N";
    } else if (ts.isJsxElement(c)) { const inner = jsxLine(c, sf); s += inner.s; if (inner.hasText) hasText = true; }
  }
  return { s, hasText };
}

const rows = [];
function walkFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const consumed = new Set();
  const record = (s, node, field) => {
    s = s.replace(/\s+/g, " ").trim();
    if (s.length < 12 || !/[a-z]{2,} [a-z]{2,}/i.test(s)) return;
    if (/(\bN\b\s*){3,}/.test(s)) return; // text stitched from many expressions
    if (/^[\w-]+( [\w-]+)*$/.test(s) && /-/.test(s) && !/[A-Z]/.test(s)) return; // class lists
    if (/^(var\(|#|rgb|url\(|M\d|translate|rotate|scale|calc\()/.test(s)) return;
    const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
    rows.push({ file: path.relative(process.cwd(), file).replace(/\\/g, "/"), line, field, text: s });
  };
  const visit = (node, prop) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return;
    if (ts.isPropertyAssignment(node)) {
      const nm = node.name.getText(sf);
      if (SKIP_PROPS.has(nm)) return;
      return ts.forEachChild(node, (c) => visit(c, nm));
    }
    if (ts.isJsxAttribute(node) && !TEXT_ATTRS.has(node.name.getText(sf))) return;
    if (ts.isJsxAttribute(node)) return ts.forEachChild(node, (c) => visit(c, node.name.getText(sf)));
    if (ts.isCallExpression(node) && /classList|querySelector|addEventListener|getElementById|localStorage|console\.|setAttribute|matchMedia/.test(node.expression.getText(sf))) return;
    if (ts.isJsxElement(node) && !consumed.has(node) && TEXT_TAGS.has(node.openingElement.tagName.getText(sf))) {
      const { s, hasText } = jsxLine(node, sf);
      if (hasText && s.trim().split(/\s+/).length >= 3) {
        const mark = (n) => { if (ts.isJsxElement(n)) { consumed.add(n); n.children.forEach(mark); } else if (ts.isJsxExpression(n) && n.expression) consumed.add(n.expression); };
        node.children.forEach(mark);
        record(s, node, "screen");
      }
    }
    const t = textOf(node);
    if (t != null && !consumed.has(node)) record(t, node, prop || "text");
    ts.forEachChild(node, (c) => visit(c, prop));
  };
  visit(sf);
}
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const e of fs.readdirSync(p)) walk(path.join(p, e));
  else if (/\.tsx$/.test(p)) walkFile(p);
}
inputs.forEach(walk);

// ---------- flags
const words = (x) => x.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
function flagsFor(s) {
  const f = [];
  const sentences = s.replace(/\bN\b/g, "7").split(/(?<=[.!?])\s+(?=[A-Z0-9"“'])/);
  const maxW = Math.max(...sentences.map(words));
  if (maxW > LIMIT[G]) f.push(`long:${maxW}`);
  if (/\b(was|were|is|are|be|been|being)\s+(\w+ly\s+)?(\w+ed|given|taken|eaten|shared|split|cut|made|shown|written|drawn|sold|put|built|known|held|broken|bought|found|kept)\b/i.test(s) && !/\b(is|are) (left|needed|called|shaded)\b/i.test(s)) f.push("passive");
  if (/^If\b|[.!?] If\b/.test(s)) f.push("if-first");
  if (/\b(which|whom|whose)\b/i.test(s) && !/(^|[.?!] )Which\b|\bwhich (one|group|row|number|shape|is|has|box|side|clock|picture|way|tool|ten|part)\b/i.test(s)) f.push("relative-clause");
  if (/\bNOT\b/.test(s) || /\bwhich (is|does) not\b/i.test(s)) f.push("negative-question");
  if (/\bthe (total )?number of \w+ (of|in|that|who)\b/i.test(s)) f.push("long-noun-phrase");
  if (/\btrue or false\b/i.test(s)) f.push(G <= 1 ? "true-false(K-1 ban)" : "true-false");
  if (/\s(vs\.?|→|⇒)\s/.test(s)) f.push("voice:symbol");
  if (/\b\d+\s?[-–]\s?\d+\b/.test(s.replace(/\bN\b/g, "7")) && !/[−=+×÷]/.test(s)) f.push("voice:range");
  if (/\?\s+[a-z]/.test(s)) f.push("voice:mid-?");
  if (/\b(e\.g\.|i\.e\.|etc\.)/.test(s)) f.push("abbreviation");
  if (G <= 2 && /—/.test(s)) f.push("dash-aside");
  if (G <= 3 && /\(([^)]{12,})\)/.test(s)) f.push("paren-aside");
  const lw = LATER_WORDS[G] && s.match(LATER_WORDS[G]);
  if (lw) f.push(`later-word:${lw[0].toLowerCase()}`);
  const tr = s.match(TRAPS);
  if (tr) f.push(`trap:${tr[0].toLowerCase()}`);
  if (G <= 3) { const h = s.match(HOMOPHONES); if (h) f.push(`homophone:${h[0].toLowerCase()}`); }
  if (G <= 5 && CONTEXT.test(s)) f.push("context");
  if (G <= 1 && /\b(at first|at the start|to start with|in the beginning)\b/i.test(s)) f.push("start-unknown");
  if (G <= 3 && /\btimes as (many|much|long|tall)\b/i.test(s)) f.push("times-as-many(4th)");
  return { f, maxW };
}
const KIND = (field) =>
  ["prompt", "story", "hint", "showMe", "question", "q", "say", "nudge", "show"].includes(field) ? "task"
  : ["explain", "wrapUp", "praise", "good", "bad", "feedback", "note", "correctExplain"].includes(field) ? "after-answer"
  : field === "screen" ? "screen (Explore/CFU/shell)" : "other";

const out = rows.map((r) => ({ ...r, kind: KIND(r.field), ...flagsFor(r.text) })).map((r) => ({ ...r, flags: r.f, f: undefined }));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1));

// ---------- report
const gName = G === 0 ? "K" : String(G);
console.log(`# English check — grade ${gName} (sentence limit ${LIMIT[G]} words)`);
console.log(`Inputs: ${inputs.join(", ")}`);
console.log(`Strings found: ${out.length}. Flagged: ${out.filter((r) => r.flags.length).length}.\n`);
console.log("## Over the length limit, by kind");
for (const k of ["task", "after-answer", "screen (Explore/CFU/shell)", "other"]) {
  const rs = out.filter((r) => r.kind === k);
  if (!rs.length) continue;
  const over = rs.filter((r) => r.maxW > LIMIT[G]).length;
  const med = [...rs.map((r) => r.maxW)].sort((a, b) => a - b)[Math.floor(rs.length / 2)];
  console.log(`- ${k}: ${over}/${rs.length} over (${Math.round((100 * over) / rs.length)}%), median longest sentence ${med} words`);
}
const counts = {};
out.forEach((r) => r.flags.forEach((f) => { const k = f.startsWith("long:") ? "long" : f; counts[k] = (counts[k] || 0) + 1; }));
console.log("\n## Flag counts");
Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`- ${k}: ${v}`));

const order = ["true-false(K-1 ban)", "times-as-many(4th)", "later-word", "start-unknown", "homophone", "voice", "negative-question", "long", "passive", "relative-clause", "if-first", "long-noun-phrase", "dash-aside", "paren-aside", "trap", "context", "true-false", "abbreviation"];
const rank = (r) => Math.min(...r.flags.map((f) => { const i = order.findIndex((o) => f.startsWith(o)); return i < 0 ? 99 : i; }));
const flagged = out.filter((r) => r.flags.length).sort((a, b) => rank(a) - rank(b) || b.maxW - a.maxW);
const cap = showAll ? flagged.length : Math.min(flagged.length, 150);
console.log(`\n## Flagged strings (${cap} of ${flagged.length}${showAll ? "" : "; use --all for every one"})`);
for (const r of flagged.slice(0, cap)) console.log(`- ${r.file}:${r.line} [${r.kind}/${r.field}, ${r.maxW}w] {${r.flags.join(", ")}} ${r.text.slice(0, 240)}`);
