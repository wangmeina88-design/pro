import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, projects } from "../../../lib/projects";
import "../project-detail.css";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex(item => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="project-detail-page">
      <nav className="project-detail-nav">
        <div className="project-detail-nav-inner section-shell">
          <Link className="brand" href="/#top">WMN<span>°</span></Link>
          <Link href="/#projects">返回精选项目</Link>
          <Link href="/">返回首页</Link>
        </div>
      </nav>

      <header className="project-detail-header">
        <p>{project.handle} / PROJECT DETAIL</p>
        <h1>{project.title}</h1>
        <span>{project.subtitle}</span>
      </header>

      <section className="project-pdf-shell" aria-label={`${project.title}完整项目详情`}>
        <iframe
          className="project-pdf-frame"
          src={`${project.pdf}#view=FitH&toolbar=0&navpanes=0`}
          title={`${project.title}项目详情 PDF`}
        />
        <p className="project-pdf-fallback">
          如果当前浏览器无法显示 PDF，<a href={project.pdf} target="_blank" rel="noreferrer">单独打开 PDF</a>。
        </p>
      </section>

      <nav className="project-detail-pagination" aria-label="项目切换">
        <Link href={previous.url}><span>上一个项目</span><strong>{previous.title}</strong></Link>
        <Link className="project-detail-back" href="/#projects">返回精选项目</Link>
        <Link href={next.url}><span>下一个项目</span><strong>{next.title}</strong></Link>
      </nav>
    </main>
  );
}
