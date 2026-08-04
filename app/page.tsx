import CopyContact from "../components/CopyContact";
import ExperienceTimeline from "../components/ExperienceTimeline";
import SplashCursor from "../components/SplashCursor";
import ChromaGrid from "../components/ChromaGrid";
import GooeyNav from "../components/GooeyNav";
import SplitText from "../components/SplitText";
import BorderGlow from "../components/BorderGlow";
import { projects } from "../lib/projects";

const strengths = [
  ["01", "业务拆解", "从目标、角色与流程中定位真正的问题，把复杂业务变成清晰的设计命题。"],
  ["02", "体验策略", "将用户洞察转化为信息架构、产品路径与可以被验证的体验策略。"],
  ["03", "视觉落地", "从高保真方案、组件规范到研发交付，持续维护产品体验的一致性。"],
  ["04", "AI 协同", "用 AI 辅助洞察、方案探索、视觉生产与复盘，提升设计效率和质量。"],
];

const navItems = [
  { label: "首页", href: "#top" },
  { label: "个人优势", href: "#strengths" },
  { label: "个人经历", href: "#about" },
  { label: "精选项目", href: "#projects" },
  { label: "联系我们", href: "#contact" },
];

export default function PortfolioPage() {
  return (
    <main className="portfolio-page">
      <SplashCursor
        DYE_RESOLUTION={512}
        DENSITY_DISSIPATION={4.2}
        VELOCITY_DISSIPATION={2.4}
        SPLAT_RADIUS={0.12}
        SPLAT_FORCE={4200}
        RAINBOW_MODE={false}
        COLOR="#6B8CFF"
      />
      <nav className="site-nav">
        <div className="site-nav-inner section-shell">
          <a className="brand" href="#top">WMN<span>°</span></a>
          <div className="nav-links">
            <GooeyNav
              items={navItems}
              particleCount={10}
              particleDistances={[42, 7]}
              particleR={62}
              animationTime={480}
              timeVariance={180}
              colors={[1, 2, 1, 3, 2]}
            />
          </div>
          <a className="nav-contact" href="/media/王美娜-简历.pdf" download>下载简历 <span aria-hidden="true">↓</span></a>
        </div>
      </nav>

      <section className="portfolio-hero" id="top">
        <video className="hero-video" autoPlay muted loop playsInline poster="/media/intro-poster.jpg" aria-label="电脑前的女孩与猫咪光影动画">
          <source src="/media/intro.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content section-shell">
          <p className="eyebrow">SENIOR UI / UX DESIGNER · BEIJING</p>
          <h1 className="hero-title">让复杂业务，变成清晰而<br />有价值的产品体验。</h1>
          <div className="hero-bottom">
            <p>我是王美娜，一名拥有 8 年经验的 UI/UX 设计师。专注 B 端与 C 端产品体验，通过用户洞察、业务分析与快速验证，将复杂需求转化为可落地的设计方案。</p>
            <a className="round-link" href="#about" aria-label="继续浏览个人经历">↓</a>
          </div>
        </div>
      </section>

      <section className="strengths section-shell" id="strengths">
        <div className="section-heading"><h2>个人优势</h2><p>HOW I WORK</p></div>
        <div className="strength-grid">
          {strengths.map(([number, title, description]) => (
            <BorderGlow
              key={title}
              className="strength-card"
              edgeSensitivity={34}
              glowColor="225 85 72"
              backgroundColor="#111417"
              borderRadius={20}
              glowRadius={28}
              glowIntensity={0.72}
              coneSpread={22}
              animated={false}
              colors={["#6B8CFF", "#8B7CFF", "#58C4DC"]}
              fillOpacity={0.22}
            >
              <article><span className="strength-number">{number}</span><h3>{title}</h3><p>{description}</p></article>
            </BorderGlow>
          ))}
        </div>
        <div className="process"><span>理解业务</span><i>→</i><span>发现问题</span><i>→</i><span>形成策略</span><i>→</i><span>快速验证</span><i>→</i><span>设计交付</span><i>→</i><span>数据复盘</span></div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-heading"><h2>个人经历</h2><p>ABOUT & EXPERIENCE</p></div>
        <div className="about-grid">
          <figure className="profile-frame"><img src="/media/profile.png" alt="王美娜个人照片" /></figure>
          <div className="about-copy">
            <p className="lead">我关注的不只是界面是否好看，更在意设计如何同时回应用户需要、业务目标与研发约束。</p>
            <p>具备 B 端和 C 端产品从问题定位、体验策略、交互设计、高保真视觉到上线验证的完整经验，并持续探索 AI 时代更高效的设计工作方式。</p>
            <div className="stats">
              <div><strong>8</strong><span>年设计经验</span></div>
              <div><strong>B/C</strong><span>跨端产品经验</span></div>
              <div><strong>3</strong><span>段核心经历</span></div>
              <div><strong>AI</strong><span>全链路协同</span></div>
            </div>
          </div>
        </div>
        <ExperienceTimeline />
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading"><h2>精选项目</h2><p>SELECTED WORKS</p></div>
        <ChromaGrid items={projects} className="chroma-project-rail" radius={340} damping={0.35} fadeOut={0.5} />
      </section>

      <footer className="contact" id="contact">
        <div className="section-shell">
          <p className="eyebrow">LET&apos;S WORK TOGETHER</p>
          <SplitText
            tag="h2"
            text={"感谢您的观看，\n期待您的回复。"}
            className="contact-title"
            delay={34}
            duration={0.7}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 28 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.15}
            rootMargin="-60px"
            textAlign="left"
            dataAttribute="footer"
          />
          <div className="contact-links">
            <CopyContact label="邮箱" value="1135551233@qq.com" displayValue="1135551233@qq.com" href="mailto:1135551233@qq.com" />
            <CopyContact label="电话" value="15718814725" displayValue="157 1881 4725" href="tel:15718814725" />
            <CopyContact label="微信" value="15718814725" displayValue="WECHAT · 15718814725" />
          </div>
          <div className="footer-bottom"><span>© 2026 WANG MEINA</span><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
