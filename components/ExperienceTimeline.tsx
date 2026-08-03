"use client";

import { useState } from "react";
import MagicBentoCard from "./MagicBentoCard";

const experiences = [
  { date: "2018—2026", company: "北京光耀立铭有限公司", role: "UI/UX 体验设计师", details: [
    "负责主导吴歌APP和星海情绪管理app的体验设计工作，包括体验规划，完整梳理并落地从0到1的产品全链路交互及视觉设计方案。",
    "深入分析目标用户需求，结合行业趋势和商业目标进行设计决策，确保设计方案兼具可用性和商业价值。",
    "协同产研团队推进项目落地实施。",
    "收集分析数据反馈，迭代优化现有功能模块的用户体验质量和使用效率。",
  ]},
  { date: "2018—2019", company: "APa 在线网校", role: "UI/UX 设计", details: [
    "主导网校PC/APP/后台的产品体验设计，具备跨端设计能力，整理输出设计资产，确保设计产出的可落地性和体验质量。",
    "B端教务复杂业务分析：针对核心业务，梳理用户任务路径、信息层级和操作流程，定位问题并提出系统优化策略。",
    "形成完整B端改版方法论：用户旅程分析 → 问题归因 → 设计目标 → 页面落地 → 组件沉淀 → 数据验证，保证设计方案可落地。",
  ]},
  { date: "2017—2018", company: "北京东方波尔科技", role: "UI 设计师", details: [
    "承担UI设计工作，与产品沟通需求并完成部分交互工作，包括信息架构、界面流程与原型输出；协助产品完成竞品分析。",
    "负责复华资产APP和雪松金融APP端产品设计。",
    "负责公司线下物料宣传，根据营销计划输出并调整设计方案。",
    "参与雪松金融和复华资产项目视觉界面设计，输出交付标注与切图，并跟进开发页面还原。",
    "进行产品专题设计、广告推广优化设计和活动广告图设计。",
    "完成吉林交通数据大屏设计。",
  ]},
];

export default function ExperienceTimeline() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  function toggleOnTouch(index: number, isOpen: boolean) {
    if (window.matchMedia("(hover: hover)").matches) return;
    setOpenIndex(isOpen ? null : index);
  }
  return <div className="timeline">{experiences.map((experience, index) => {
    const isOpen = openIndex === index;
    const panelId = `experience-panel-${index}`;
    return <MagicBentoCard active={isOpen} key={experience.company} onActivate={() => setOpenIndex(index)} onDeactivate={() => setOpenIndex(null)}>
      <button className="experience-summary" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggleOnTouch(index, isOpen)}>
        <time>{experience.date}</time><h3>{experience.company}</h3><span>{experience.role}</span><i aria-hidden="true">{isOpen ? "−" : "+"}</i>
      </button>
      <div className="experience-panel" id={panelId} hidden={!isOpen}><ol>{experience.details.map((detail) => <li key={detail}>{detail}</li>)}</ol></div>
    </MagicBentoCard>;
  })}</div>;
}
