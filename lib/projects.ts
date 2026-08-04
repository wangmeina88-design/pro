export type PortfolioProject = {
  slug: string;
  title: string;
  subtitle: string;
  handle: string;
  image: string;
  borderColor: string;
  gradient: string;
  pdf: string;
  url: string;
};

export const projects: PortfolioProject[] = [
  { slug: "wuge-miracle", title: "吴歌陪伴体验升级", subtitle: "EXPERIENCE UPGRADE · APP", handle: "01", image: "/media/projects/wuge-miracle.jpg", borderColor: "#D06BFF", gradient: "linear-gradient(145deg,#532859,#080A0C)", pdf: "/media/project-details/wuge-miracle.pdf", url: "/projects/wuge-miracle" },
  { slug: "starry-miracle", title: "星海情绪助手", subtitle: "EMOTIONAL EXPERIENCE · APP", handle: "02", image: "/media/projects/starry-miracle.jpg", borderColor: "#8B7CFF", gradient: "linear-gradient(145deg,#382B62,#080A0C)", pdf: "/media/project-details/starry-miracle.pdf", url: "/projects/starry-miracle" },
  { slug: "apa-school", title: "APa 网校系统", subtitle: "B-SIDE SYSTEM · WEB", handle: "03", image: "/media/projects/apa-school.jpg", borderColor: "#68B9FF", gradient: "linear-gradient(145deg,#21435B,#080A0C)", pdf: "/media/project-details/apa-school.pdf", url: "/projects/apa-school" },
  { slug: "forise-wealth", title: "复华财富", subtitle: "FINTECH · MOBILE", handle: "04", image: "/media/projects/forise-wealth.jpg", borderColor: "#FF7C68", gradient: "linear-gradient(145deg,#61342E,#080A0C)", pdf: "/media/project-details/forise-wealth.pdf", url: "/projects/forise-wealth" },
  { slug: "ai-experience", title: "AI 赋能产品体验", subtitle: "UX STRATEGY · AI WORKFLOW", handle: "05", image: "/media/projects/ai-experience.jpg", borderColor: "#6B8CFF", gradient: "linear-gradient(145deg,#263967,#080A0C)", pdf: "/media/project-details/ai-experience.pdf", url: "/projects/ai-experience" },
];

export function getProjectBySlug(slug: string) {
  return projects.find(project => project.slug === slug);
}
