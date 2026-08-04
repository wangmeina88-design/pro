import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the portfolio with video inside the hero", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /王美娜/);
  assert.match(html, /intro\.mp4/);
  assert.match(html, /让复杂业务，[\s\S]*变成清晰而[\s\S]*有价值的产品体验/);
  assert.match(html, /精选项目/);
  assert.doesNotMatch(html, /进入作品集/);
});

test("keeps GSAP out of the server-rendering bundle", async () => {
  const assets = await readdir(
    new URL("../dist/server/ssr/assets/", import.meta.url),
  );
  assert.equal(
    assets.some((name) => name.startsWith("gsap-")),
    false,
    "GSAP starts a timer during Cloudflare Worker initialization",
  );
});

test("keeps the portfolio only at the root route", async () => {
  const rootResponse = await render("/");
  assert.equal(rootResponse.status, 200);
  const html = await rootResponse.text();
  assert.match(html, /让复杂业务，[\s\S]*变成清晰而[\s\S]*有价值的产品体验/);
  assert.match(html, /个人经历/);
  assert.match(html, /精选项目/);
  assert.match(html, /个人优势/);
  assert.match(html, /联系我/);

  const response = await render("/portfolio");
  assert.equal(response.status, 404);
});

test("ships without unused database tooling", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(packageJson.dependencies?.["drizzle-orm"], undefined);
  assert.equal(packageJson.devDependencies?.["drizzle-kit"], undefined);
  assert.equal(packageJson.scripts?.["db:generate"], undefined);
});

test("places strengths below hero and exposes contact copy controls", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.ok(html.indexOf('id="strengths"') < html.indexOf('id="about"'));
  assert.match(html, /复制电话/);
  assert.match(html, /复制微信/);
  assert.match(html, /data-copy-value="15718814725"/);
});

test("renders updated navigation, resume download, and expandable experience details", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /WMN/);
  assert.match(html, /href="#contact"[^>]*>联系我/);
  assert.match(html, /href="\/media\/王美娜-简历\.pdf"[^>]*download/);
  assert.match(html, /下载简历/);
  assert.match(html, /负责主导吴歌APP和星海情绪管理app的体验设计工作/);
  assert.match(html, /主导网校PC\/APP\/后台的产品体验设计/);
  assert.match(html, /吉林交通数据大屏/);
  assert.match(html, /aria-expanded="false"/);
  assert.equal((html.match(/data-copy-value=/g) ?? []).length, 3);
  assert.equal((html.match(/>复制<\/button>/g) ?? []).length, 3);
});

test("uses the correctly cropped personal portrait", async () => {
  const png = await readFile(new URL("../public/media/profile.png", import.meta.url));
  assert.equal(png.readUInt32BE(16), 456);
  assert.equal(png.readUInt32BE(20), 501);
});

test("renders the SplashCursor effect inside the hero", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /data-splash-cursor="hero"/);
  assert.match(html, /id="fluid"/);
});

test("applies MagicBento hover interactions to experience cards", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal((html.match(/data-magic-bento="experience"/g) ?? []).length, 3);
  assert.equal((html.match(/data-hover-details="true"/g) ?? []).length, 3);
});

test("renders projects as a horizontal ChromaGrid rail", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /data-chroma-grid="horizontal"/);
  assert.equal((html.match(/class="chroma-card"/g) ?? []).length, 10);
  assert.match(html, /aria-label="横向浏览精选项目"/);
});

test("uses the shared content width for home and project navigation", async () => {
  const home = await (await render("/")).text();
  const detail = await (await render("/projects/wuge-miracle")).text();
  assert.match(home, /class="site-nav"[\s\S]*class="site-nav-inner section-shell"/);
  assert.match(detail, /class="project-detail-nav"[\s\S]*class="project-detail-nav-inner section-shell"/);
});

test("orders the five primary projects without content duplication", async () => {
  const html = await (await render("/")).text();
  const primary = html.match(/data-project-group="primary"[^>]*>([\s\S]*?)data-project-group="duplicate"/)?.[1] ?? "";
  const titles = ["吴歌陪伴体验升级", "星海情绪助手", "APa 网校系统", "复华财富", "AI 赋能产品体验"];
  assert.equal((primary.match(/class="chroma-card"/g) ?? []).length, 5);
  titles.forEach((title, index) => {
    assert.match(primary, new RegExp(title));
    if (index) assert.ok(primary.indexOf(title) > primary.indexOf(titles[index - 1]));
  });
});

test("adds restrained decorative strength numbers and a constrained hero title", async () => {
  const html = await (await render("/")).text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.equal((html.match(/class="strength-number"/g) ?? []).length, 4);
  assert.match(html, /<h1 class="hero-title">让复杂业务，变成清晰而<br\/>有价值的产品体验。<\/h1>/);
  assert.match(css, /\.portfolio-hero \.hero-title\{[^}]*line-height:1\.12/);
  assert.match(css, /\.strength-card article \.strength-number\{[^}]*font-family:"Arial Narrow"[^}]*font-size:clamp\(48px,4\.8vw,68px\)[^}]*linear-gradient\(180deg,rgba\(255,255,255,\.5\),rgba\(255,255,255,\.08\)\)/);
});

test("keeps the transition from hero to strengths compact", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.strengths\{padding-top:88px\}/);
  assert.match(css, /\.strengths \.strength-grid\{margin-top:48px\}/);
});

test("removes section indices and the sticky navigation black filter block", async () => {
  const html = await (await render("/")).text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const navCss = await readFile(new URL("../components/GooeyNav.css", import.meta.url), "utf8");
  assert.equal((html.match(/class="section-index"/g) ?? []).length, 0);
  assert.match(css, /\.section-heading\{grid-template-columns:1fr auto\}/);
  assert.match(css, /\.portfolio-hero \.hero-title\{[^}]*font-size:clamp\(40px,4\.2vw,60px\)/);
  assert.match(css, /\.contact h2\{[^}]*font-size:clamp\(42px,5\.5vw,82px\)/);
  assert.match(navCss, /\.site-nav \.gooey-nav-container \.effect\.filter::before\s*\{[^}]*display:\s*none/);
});

test("renders colorful auto-scrolling projects without a visible scrollbar", async () => {
  const response = await render("/");
  const html = await response.text();
  const css = await readFile(new URL("../components/ChromaGrid.css", import.meta.url), "utf8");
  assert.match(html, /data-auto-scroll="true"/);
  assert.equal((html.match(/data-project-group=/g) ?? []).length, 2);
  assert.match(html, /data-project-group="duplicate" aria-hidden="true"/);
  assert.doesNotMatch(css, /grayscale\(/);
  assert.match(css, /scrollbar-width:\s*none/);
  assert.match(css, /::-webkit-scrollbar/);
});

test("renders the approved closing message", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /感谢您的观看/);
  assert.match(html, /期待您的回复/);
  assert.doesNotMatch(html, /有合适的项目或机会/);
});

test("animates the footer message and removes contact dividers and arrows", async () => {
  const response = await render("/");
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(html, /<h2[^>]*data-split-text="footer"/);
  assert.doesNotMatch(html, /1135551233@qq\.com[^<]*↗/);
  assert.doesNotMatch(html, /157 1881 4725[^<]*↗/);
  assert.match(css, /\.contact-links\{border:0\}/);
  assert.equal((html.match(/>复制<\/button>/g) ?? []).length, 3);
});

test("renders the five-item GooeyNav navigation", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /data-gooey-nav="portfolio"/);
  const labels = ["首页", "个人优势", "个人经历", "精选项目", "联系我们"];
  labels.forEach((label) => assert.match(html, new RegExp(`>${label}<`)));
  assert.ok(labels.every((label, index) => index === 0 || html.indexOf(label) > html.indexOf(labels[index - 1])));
});

test("renders unchanged strengths inside four BorderGlow cards", async () => {
  const response = await render("/");
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.equal((html.match(/data-border-glow="strength"/g) ?? []).length, 4);
  assert.equal((html.match(/data-border-glow-animated="false"/g) ?? []).length, 4);
  ["业务拆解", "体验策略", "视觉落地", "AI 协同"].forEach((copy, index, all) => {
    assert.match(html, new RegExp(`>${copy}<`));
    if (index) assert.ok(html.indexOf(copy) > html.indexOf(all[index - 1]));
  });
  assert.match(css, /\.strength-grid\{[^}]*gap:16px/);
});

test("uses the complete BorderGlow mesh, fill, and outer glow effects", async () => {
  const css = await readFile(new URL("../components/BorderGlow.css", import.meta.url), "utf8");
  assert.match(css, /mask-composite:\s*subtract,\s*add,\s*add,\s*add,\s*add,\s*add/);
  assert.match(css, /--gradient-seven/);
  assert.match(css, /inset 0 0 50px 2px var\(--glow-color-10/);
  assert.match(css, /0 0 50px 2px var\(--glow-color-10/);
});

const projectDetails = [
  ["ai-experience", "AI 赋能产品体验", "ai-experience.pdf"],
  ["starry-miracle", "星海情绪助手", "starry-miracle.pdf"],
  ["wuge-miracle", "吴歌陪伴体验升级", "wuge-miracle.pdf"],
  ["apa-school", "APa 网校系统", "apa-school.pdf"],
  ["forise-wealth", "复华财富", "forise-wealth.pdf"],
];

test("links every selected project to its detail route", async () => {
  const html = await (await render("/")).text();
  projectDetails.forEach(([slug]) => assert.match(html, new RegExp(`href="/projects/${slug}"`)));
});

for (const [slug, title, pdf] of projectDetails) {
  test(`renders ${slug} project detail`, async () => {
    const response = await render(`/projects/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(title));
    assert.match(html, new RegExp(`class="project-pdf-frame"[^>]*src="/media/project-details/${pdf}`));
    assert.match(html, /单独打开 PDF/);
    assert.match(html, /返回精选项目/);
    assert.match(html, /上一个项目/);
    assert.match(html, /下一个项目/);
  });
}
