"use client";

/* Browser storage and the live-notice request intentionally hydrate client-only state after mount. */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import {
  buildWeeklyRecord,
  carryFrom,
  formatDateRange,
  weekKey,
  type WeeklyHistory,
  type WeeklyRecord,
} from "./weekly-plan";

type Track = "science" | "arts";
type ResourceType = "全部" | "官方" | "英语" | "高数" | "真题" | "题库";

type Resource = {
  title: string;
  source: string;
  type: Exclude<ResourceType, "全部">;
  tag: string;
  description: string;
  action: string;
  url: string;
  tracks: Track[];
  featured?: boolean;
  paperUrl?: string;
};

type CourseUnit = {
  id: string;
  number: string;
  title: string;
  points: string;
  output: string;
  url: string;
};

type LatestUpdate = {
  status: "live" | "fallback";
  checkedAt: string;
  has2027Notice: boolean;
  notices: { title: string; url: string }[];
};

const predictionPapers = [
  { subject: "大学英语", set: "A", focus: "语法与阅读证据定位", url: "/papers/2027-english-prediction-A.pdf" },
  { subject: "大学英语", set: "B", focus: "时态从句与写作输出", url: "/papers/2027-english-prediction-B.pdf" },
  { subject: "高等数学", set: "A", focus: "极限、导数、积分主干", url: "/papers/2027-math-prediction-A.pdf" },
  { subject: "高等数学", set: "B", focus: "多元、级数、微分方程", url: "/papers/2027-math-prediction-B.pdf" },
];

const questionBanks = [
  { subject: "大学英语", mark: "EN", units: 8, questions: 48, focus: "词汇语法、句子结构、非谓语、从句、阅读、英译汉与写作", url: "/papers/english-course-question-bank.pdf" },
  { subject: "高等数学", mark: "∫", units: 8, questions: 48, focus: "函数极限、一元微积分、空间解析几何、多元微积分、级数、微分方程", url: "/papers/math-course-question-bank.pdf" },
];

const resources: Resource[] = [
  {
    title: "2026 陕西专升本考试招生工作实施办法",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "政策原文",
    description: "确认报考条件、统考科目、分值和流程。2027 新政策发布前，以它作为规则基线。",
    action: "打开官方原文",
    url: "https://www.sneea.cn/info/1031/17033.htm",
    tracks: ["science"],
    featured: true,
  },
  {
    title: "2026 专业对应目录",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "先查专业",
    description: "用你的专科专业，查能报哪些本科专业；多个方向只能选其中一个报考。",
    action: "查询专业对应",
    url: "https://www.sneea.cn/info/1031/17032.htm",
    tracks: ["science"],
    featured: true,
  },
  {
    title: "2026 招生专业与院校目录",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "选学校",
    description: "查看各专业有哪些招生院校。2026 年共列普通本科与职业本科院校，2027 以新目录为准。",
    action: "查看院校目录",
    url: "https://www.sneea.cn/info/1031/17031.htm",
    tracks: ["science"],
  },
  {
    title: "专业课考核科目表",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "校内考核",
    description: "查你要参加的两门专业课考核。该考核由生源学校组织，务必问本校教务处时间。",
    action: "查看考核科目",
    url: "https://www.sneea.cn/info/1031/17030.htm",
    tracks: ["science"],
  },
  {
    title: "2027 专升本英语零基础全套精讲",
    source: "哔哩哔哩 · 之了专升本",
    type: "英语",
    tag: "零基础",
    description: "覆盖词法、句法、核心词汇和写作，适合作为唯一主课。它是全国通用课，学完对应模块后必须用陕西真题校准。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1yR4y117yx/",
    tracks: ["science"],
    featured: true,
    paperUrl: "/papers/2027-english-prediction-A.pdf",
  },
  {
    title: "2025 陕西专升本英语真题逐题解析",
    source: "哔哩哔哩 · 麻花老师",
    type: "真题",
    tag: "陕西真题",
    description: "含单项选择与4篇阅读的分题讲解。先闭卷完成整套，再按错题跳到对应视频，不要边看边做。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV143ywBfExo/",
    tracks: ["science"],
    paperUrl: "/papers/2027-english-prediction-A.pdf",
  },
  {
    title: "2024 陕西专升本英语整卷精讲",
    source: "哔哩哔哩 · 职业猫网校",
    type: "真题",
    tag: "整卷讲解",
    description: "4段视频覆盖一套陕西英语真题，适合第一轮学完后做整卷复盘；旧真题用于认识稳定题型，不用于押题。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1EvmNY3Ef6/",
    tracks: ["science"],
    paperUrl: "/papers/2027-english-prediction-A.pdf",
  },
  {
    title: "2026 陕西专升本高数专项 800 题",
    source: "哔哩哔哩 · 川哥专升本",
    type: "高数",
    tag: "专项刷题",
    description: "94节陕西专项刷题课，按章节巩固。每学完主课一章再做对应题，不追播放量，只记录错因和正确步骤。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1w4ymBjE3C/",
    tracks: ["science"],
    featured: true,
    paperUrl: "/papers/math-foundation-paper.pdf",
  },
  {
    title: "2027 专升本高数零基础全章精讲",
    source: "哔哩哔哩 · 之了专升本",
    type: "高数",
    tag: "系统课",
    description: "全国通用系统主课；发布页明确标注陕西学习1—8章及曲线积分。按本站8个单元选章学习，跳过线性代数与概率论。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1HP411t7cS/",
    tracks: ["science"],
    paperUrl: "/papers/math-foundation-paper.pdf",
  },
  {
    title: "陕西理工类英语配套电子题库",
    source: "升本地图 · 原创",
    type: "题库",
    tag: "PDF 可下载",
    description: "对应本站英语8个学习单元，共48题并附答案。重点练词汇语法、阅读、英译汉和写作，不加入听力训练。",
    action: "下载英语题库",
    url: "/papers/english-course-question-bank.pdf",
    tracks: ["science"],
  },
  {
    title: "陕西理工类高数配套电子题库",
    source: "升本地图 · 原创",
    type: "题库",
    tag: "PDF 可下载",
    description: "对应高数8个知识点课程单元，共48题，保留答题空间并附关键步骤答案。",
    action: "下载高数题库",
    url: "/papers/math-course-question-bank.pdf",
    tracks: ["science"],
  },
  {
    title: "陕西专升本高数真题解析合集",
    source: "哔哩哔哩 · 杰哥专升本",
    type: "真题",
    tag: "陕西真题",
    description: "包含2024陕西高数选择、填空、计算和应用题分段解析，并附陕西考纲讲解。整卷计时后按错题观看。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1ctdaYgEW7/",
    tracks: ["science"],
    paperUrl: "/papers/math-foundation-paper.pdf",
  },
  {
    title: "2027 陕西专升本英数最新视频检索",
    source: "哔哩哔哩搜索",
    type: "真题",
    tag: "持续更新",
    description: "只用于追踪新公告解读与新真题解析。先核对发布日期和省份，不因“押题”“泄题”标题改变复习范围。",
    action: "查看最新结果",
    url: "https://search.bilibili.com/all?keyword=%E9%99%95%E8%A5%BF%E4%B8%93%E5%8D%87%E6%9C%AC%E8%80%83%E8%AF%95",
    tracks: ["science"],
  },
];

const scienceCourseGroups: { subject: string; subtitle: string; units: CourseUnit[] }[] = [
  {
    subject: "大学英语",
    subtitle: "陕西理工类必考 · 词汇语法打底，阅读与输出提分，最后用陕西真题校准",
    units: [
      { id: "en-words", number: "01", title: "核心词汇与词法", points: "名词、冠词、代词、数词、形容词、副词、介词、连词与常见搭配", output: "每天30词；完成一张词性与搭配表", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-sentence", number: "02", title: "句子骨架与谓语", points: "句子成分、五大基本句型、主谓一致、动词分类与情态动词", output: "能独立标出主谓宾 / 主系表", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-tense", number: "03", title: "时态、语态与虚拟语气", points: "常用时态、被动语态、时间线、条件句与虚拟语气", output: "默写结构并完成30道单选", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-nonfinite", number: "04", title: "非谓语动词", points: "不定式、动名词、现在分词与过去分词的句法功能", output: "先判成分，再完成20道专项题", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-clause", number: "05", title: "三大从句与特殊结构", points: "名词性、定语、状语从句，以及倒装、强调、省略和反意疑问", output: "画出连接词与先行词判断流程", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-reading", number: "06", title: "阅读理解与长难句", points: "细节、主旨、推断、词义题；题干关键词、同义替换与证据定位", output: "完成4篇阅读并标出每题原文依据", url: "https://www.bilibili.com/video/BV1EvmNY3Ef6/" },
      { id: "en-translation", number: "07", title: "英译汉", points: "拆句、确定主干、从句和非谓语处理、中文语序与通顺表达", output: "限时翻译5句并对照修改", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
      { id: "en-writing", number: "08", title: "短文与应用文写作", points: "审题、三段结构、常用衔接、书信格式与120—180词限时输出", output: "30分钟完成1篇并自查语法", url: "https://www.bilibili.com/video/BV1yR4y117yx/" },
    ],
  },
  {
    subject: "高等数学",
    subtitle: "陕西理工类主科 · 严格按考试范围8章排序，系统课只学对应章节",
    units: [
      { id: "math-limit", number: "01", title: "函数、极限与连续", points: "函数性质、复合与反函数、数列/函数极限、无穷小、连续与间断", output: "建立极限计算方法清单并做30题", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-derivative", number: "02", title: "一元函数微分学及应用", points: "导数与微分、复合/隐/参数求导、中值定理、洛必达、单调极值、凹凸渐近线", output: "默写求导公式；会画完整符号表", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-integral", number: "03", title: "一元函数积分学及应用", points: "不定积分、换元与分部、定积分、反常积分、平面面积与旋转体体积", output: "按题型选择积分方法并做40题", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-vector", number: "04", title: "向量代数与空间解析几何", points: "向量运算、平面与直线方程、位置关系、距离、常见空间曲面", output: "整理点积、叉积及直线平面公式", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-multidiff", number: "05", title: "多元函数微分学", points: "二元极限与连续、偏导、全微分、复合与隐函数求导、方向导数、极值", output: "完成偏导链式法则与极值专项", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-multiintegral", number: "06", title: "多元函数积分学", points: "二重积分、极坐标换元、两类曲线积分与格林公式", output: "会画积分区域并正确选择积分次序", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-series", number: "07", title: "无穷级数", points: "常数项级数、正项与交错级数审敛、幂级数、收敛域与函数展开", output: "做一张审敛法与幂级数决策表", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
      { id: "math-ode", number: "08", title: "常微分方程", points: "可分离变量、齐次、一阶线性、伯努利、可降阶与二阶常系数方程", output: "先判类型，再写通解并验算", url: "https://www.bilibili.com/video/BV1HP411t7cS/" },
    ],
  },
];

const phases = [
  { date: "9—10月", title: "筑地基", detail: "英语词汇语法 + 高数函数极限、一元微积分，完成第一轮框架。", tone: "mint" },
  { date: "11—12月", title: "做专题", detail: "按章节刷题，建立错题本；每两周做一次计时测验。", tone: "yellow" },
  { date: "1—2月", title: "啃真题", detail: "整卷限时，统计失分原因；弱项回到对应章节补洞。", tone: "blue" },
  { date: "3月起", title: "等公告 · 冲刺", detail: "核对 2027 政策、报名与专业目录；套卷训练并稳住作息。", tone: "coral" },
];

const englishPlanUnits = scienceCourseGroups[0].units;
const mathPlanUnits = scienceCourseGroups[1].units;
const validCourseIds = new Set(scienceCourseGroups.flatMap((group) => group.units.map((unit) => unit.id)));

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Some embedded browsers disable storage. The page should still remain usable.
  }
}

export default function Home() {
  const [track] = useState<Track>("science");
  const [filter, setFilter] = useState<ResourceType>("全部");
  const [query, setQuery] = useState("");
  const [courseDone, setCourseDone] = useState<string[]>([]);
  const [latest, setLatest] = useState<LatestUpdate | null>(null);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [weeklyHistory, setWeeklyHistory] = useState<WeeklyHistory>({});
  const [weekRecord, setWeekRecord] = useState<WeeklyRecord | null>(null);
  const [plannerLoaded, setPlannerLoaded] = useState(false);

  useEffect(() => {
    const savedCourses = readStorage("sb-science-courses");
    if (savedCourses) {
      try {
        setCourseDone((JSON.parse(savedCourses) as string[]).filter((id) => validCourseIds.has(id)));
      } catch {
        setCourseDone([]);
      }
    }
    setPlannerLoaded(true);
  }, []);

  async function checkUpdates() {
    setCheckingUpdates(true);
    try {
      const response = await fetch("/api/latest", { cache: "no-store" });
      if (!response.ok) throw new Error("update check failed");
      setLatest(await response.json());
    } catch {
      setLatest(null);
    } finally {
      setCheckingUpdates(false);
    }
  }

  useEffect(() => {
    void checkUpdates();
  }, []);

  function ensureWeeklyPlan(completedCourses: string[]) {
    let history: WeeklyHistory = {};
    try {
      history = JSON.parse(readStorage("sb-weekly-history-v3") ?? "{}") as WeeklyHistory;
    } catch {
      history = {};
    }
    const currentKey = weekKey();
    let current = history[currentKey];
    if (!current) {
      current = buildWeeklyRecord(new Date(), completedCourses, englishPlanUnits, mathPlanUnits, carryFrom(history, currentKey));
      history = { ...history, [currentKey]: current };
      writeStorage("sb-weekly-history-v3", JSON.stringify(history));
    }
    setWeeklyHistory(history);
    setWeekRecord(current);
  }

  useEffect(() => {
    if (!plannerLoaded) return;
    ensureWeeklyPlan(courseDone);
  }, [plannerLoaded, courseDone]);

  useEffect(() => {
    if (!plannerLoaded) return;
    const timer = window.setInterval(() => {
      if (weekRecord && weekKey() !== weekRecord.weekKey) ensureWeeklyPlan(courseDone);
    }, 60000);
    return () => window.clearInterval(timer);
  }, [plannerLoaded, weekRecord, courseDone]);

  const visibleResources = resources.filter((resource) => {
    const inTrack = resource.tracks.includes(track);
    const inFilter = filter === "全部" || resource.type === filter;
    const haystack = `${resource.title}${resource.source}${resource.tag}${resource.description}`.toLowerCase();
    return inTrack && inFilter && haystack.includes(query.trim().toLowerCase());
  });

  const completedCount = weekRecord?.completed.length ?? 0;
  const taskCount = weekRecord?.tasks.length ?? 0;
  const progress = taskCount ? Math.round((completedCount / taskCount) * 100) : 0;
  const carryCount = weekRecord?.tasks.filter((item) => item.kind === "carry").length ?? 0;
  const historyRecords = Object.values(weeklyHistory).sort((a, b) => b.weekKey.localeCompare(a.weekKey));

  function toggleWeeklyTask(taskId: string) {
    if (!weekRecord) return;
    const completed = weekRecord.completed.includes(taskId)
      ? weekRecord.completed.filter((item) => item !== taskId)
      : [...weekRecord.completed, taskId];
    const nextRecord = { ...weekRecord, completed };
    const nextHistory = { ...weeklyHistory, [nextRecord.weekKey]: nextRecord };
    setWeekRecord(nextRecord);
    setWeeklyHistory(nextHistory);
    writeStorage("sb-weekly-history-v3", JSON.stringify(nextHistory));
  }

  function toggleCourse(courseId: string) {
    const next = courseDone.includes(courseId)
      ? courseDone.filter((item) => item !== courseId)
      : [...courseDone, courseId];
    setCourseDone(next);
    writeStorage("sb-science-courses", JSON.stringify(next));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页">
          <span className="brand-mark">升</span>
          <span>升本地图</span>
          <span className="brand-province">陕西</span>
        </a>
        <nav aria-label="主导航">
          <a href="#top">首页</a>
          <a href="#updates">实时更新</a>
          <a href="#roadmap">学习路线</a>
          <a href="#syllabus">知识点课</a>
          <a href="#resources">资源库</a>
          <a href="#checklist">本周计划</a>
        </nav>
        <a className="header-cta" href="#checklist">查看本周任务</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> 2027 陕西统招专升本备考导航</div>
          <h1>别再到处找课。<br /><em>从今天，照着学。</em></h1>
          <p className="hero-lead">只服务陕西理工类：从 2026 年 9 月 1 日开始，把最新官方基线、可直接观看的英语高数课程和 7 个月复习节奏放在一个页面里。</p>

          <div className="track-picker" aria-label="当前考试类别">
            <button className="active" type="button" aria-pressed="true">
              <span className="track-icon">∫</span>
              <span><b>陕西理工类专属</b><small>大学英语 + 高等数学</small></span>
            </button>
          </div>

          <div className="hero-actions">
            <a className="primary-button" href="#syllabus">开始第一单元 <Arrow /></a>
            <a className="text-button" href="#roadmap">先看怎么安排时间 ↓</a>
          </div>
        </div>

        <aside className="start-card" aria-label="考试关键信息">
          <div className="tape" aria-hidden="true" />
          <div className="card-kicker">先记住这四件事</div>
          <div className="fact-grid">
            <div><strong>2</strong><span>门省统考</span></div>
            <div><strong>150</strong><span>每科满分</span></div>
            <div><strong>150′</strong><span>每科时长</span></div>
            <div><strong>1次</strong><span>应届报考机会</span></div>
          </div>
          <div className="scribble-note">
            <span className="pin" aria-hidden="true">!</span>
            <p><b>2027 公告还没发布</b><br />当前以 2026 官方规则做基线。往年政策与报名信息多在 3 月集中发布，考试日期不要靠传言猜。</p>
          </div>
          <a className="official-link" href="https://www.sneea.cn/zc/zsbks.htm" target="_blank" rel="noreferrer">盯住官方专升本栏目 <Arrow /></a>
        </aside>
      </section>

      <section className="truth-strip" aria-label="重要说明">
        <span className="truth-label">你现在最该做的</span>
        <p><b>先查专业对应，再定公共课路线。</b> 在校生还要通过本校组织的专业课考核；它不是省统考，但不合格就不能报。</p>
        <a href="https://www.sneea.cn/info/1031/17032.htm" target="_blank" rel="noreferrer">查我的专业 <Arrow /></a>
      </section>

      <section className="section update-section" id="updates">
        <div className="update-head">
          <div><span className="live-dot" aria-hidden="true" /><span className="eyebrow dark">官方信息监测</span></div>
          <h2>每次打开，检查一次最新公告</h2>
          <button onClick={checkUpdates} disabled={checkingUpdates}>{checkingUpdates ? "正在检查…" : "立即刷新 ↻"}</button>
        </div>
        <div className="update-grid">
          <article className="update-status">
            <span>{latest?.has2027Notice ? "发现更新" : "当前基线"}</span>
            <strong>{latest?.has2027Notice ? "检测到 2027 专升本公告" : "2027 正式公告暂未检测到"}</strong>
            <p>在正式通知发布前，课程和套卷依据 2026 陕西统考规则及稳定考点整理；检测结果只作提醒，最终以官方原文为准。</p>
            <small>{latest ? `检查时间：${new Date(latest.checkedAt).toLocaleString("zh-CN", { hour12: false })}${latest.status === "fallback" ? " · 官方站暂不可达，显示已核对信息" : " · 已连接陕西省教育考试院"}` : checkingUpdates ? "正在连接陕西省教育考试院…" : "暂时无法检查，请稍后重试或打开官方栏目。"}</small>
          </article>
          <div className="notice-list">
            <div className="notice-list-title"><b>官方栏目最新条目</b><a href="https://www.sneea.cn/zc/zsbks.htm" target="_blank" rel="noreferrer">打开完整栏目 <Arrow /></a></div>
            {(latest?.notices ?? []).map((notice, index) => (
              <a href={notice.url} target="_blank" rel="noreferrer" key={notice.url}><span>{String(index + 1).padStart(2, "0")}</span><b>{notice.title}</b><Arrow /></a>
            ))}
            {!latest && <div className="notice-loading">等待最新公告列表…</div>}
          </div>
        </div>
      </section>

      <section className="section roadmap-section" id="roadmap">
        <div className="section-heading">
          <div><span className="section-number">01</span><span className="eyebrow dark">9月1日到考试</span></div>
          <h2>7 个月，分成四段走</h2>
          <p>不要一上来就刷整套真题。先学会，再做对，最后才是做快。</p>
        </div>

        <div className="timeline">
          {phases.map((phase, index) => (
            <article className={`phase-card ${phase.tone}`} key={phase.date}>
              <div className="phase-top"><span>0{index + 1}</span><b>{phase.date}</b></div>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
              <div className="phase-line" aria-hidden="true" />
            </article>
          ))}
        </div>

        <div className="weekly-rhythm">
          <div className="rhythm-title"><span>一周模板</span><h3>不用每天“学很久”，要每天有产出</h3></div>
          <div className="rhythm-days">
            <div><b>周一—周五</b><span>英语 60 分钟</span><span>高数 90 分钟</span><span>错题 20 分钟</span></div>
            <div><b>周六</b><span>章节测验 1 套</span><span>完整复盘</span></div>
            <div><b>周日</b><span>补欠账</span><span>整理下周清单</span></div>
          </div>
        </div>
      </section>

      {track === "science" && (
        <section className="section syllabus-section" id="syllabus">
          <div className="section-heading syllabus-heading">
            <div><span className="section-number">02</span><span className="eyebrow dark">仅理工科</span></div>
            <h2>知识点课程表</h2>
            <p>按陕西现行考试说明的稳定范围整理：英语只练词汇语法、阅读、英译汉和写作；高数按8章顺序学习。2027正式说明发布后会再次校准。</p>
          </div>

          <div className="syllabus-overview">
            <div><strong>16</strong><span>个学习单元</span></div>
            <div><strong>{courseDone.length}</strong><span>已完成</span></div>
            <div><strong>{Math.round((courseDone.length / 16) * 100)}%</strong><span>课程进度</span></div>
            <a href="/papers/math-foundation-paper.pdf" target="_blank" rel="noreferrer">先做高数摸底卷 <Arrow /></a>
          </div>

          <div className="course-groups">
            {scienceCourseGroups.map((group) => {
              const groupDone = group.units.filter((unit) => courseDone.includes(unit.id)).length;
              return (
                <article className="course-group" key={group.subject}>
                  <div className="course-group-head">
                    <div><span>{group.subject === "大学英语" ? "EN" : "∫"}</span><div><h3>{group.subject}</h3><p>{group.subtitle}</p></div></div>
                    <b>{groupDone} / {group.units.length}</b>
                  </div>
                  <div className="course-units">
                    {group.units.map((unit) => {
                      const checked = courseDone.includes(unit.id);
                      return (
                        <div className={checked ? "course-unit completed" : "course-unit"} key={unit.id}>
                          <button className="course-check" onClick={() => toggleCourse(unit.id)} aria-label={`${checked ? "取消完成" : "标记完成"}：${unit.title}`} aria-pressed={checked}>
                            {checked ? "✓" : unit.number}
                          </button>
                          <div className="course-unit-copy">
                            <h4>{unit.title}</h4>
                            <p>{unit.points}</p>
                            <small>学完产出：{unit.output}</small>
                          </div>
                          <a href={unit.url} target="_blank" rel="noreferrer" aria-label={`观看${unit.title}课程`}>看课 <Arrow /></a>
                        </div>
                      );
                    })}
                  </div>
                  <div className="course-paper-row">
                    <span>学完本组，用整卷检查是否真的掌握</span>
                    <div>
                      <a href={group.subject === "大学英语" ? "/papers/english-course-question-bank.pdf" : "/papers/math-course-question-bank.pdf"} download>下载电子题库 <Arrow /></a>
                      <a href={group.subject === "大学英语" ? "/papers/2027-english-prediction-A.pdf" : "/papers/math-foundation-paper.pdf"} target="_blank" rel="noreferrer">配套试卷 PDF <Arrow /></a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {track === "science" && (
        <section className="section bank-section" id="banks">
          <div className="section-heading compact">
            <div><span className="section-number">Q</span><span className="eyebrow dark">课程学完就练</span></div>
            <h2>配套电子题库</h2>
            <p>英语、高数各按8个课程单元编排。可以在线打开，也可以下载到手机、平板或电脑，离线练习后再看答案。</p>
          </div>
          <div className="bank-grid">
            {questionBanks.map((bank) => (
              <article key={bank.subject}>
                <div className="bank-mark">{bank.mark}</div>
                <div className="bank-copy"><span>{bank.subject}</span><h3>{bank.subject}课程题库</h3><p>{bank.focus}</p></div>
                <div className="bank-stats"><div><strong>{bank.units}</strong><small>知识单元</small></div><div><strong>{bank.questions}</strong><small>配套练习</small></div><div><strong>答案</strong><small>集中解析</small></div></div>
                <div className="bank-actions"><a href={bank.url} target="_blank" rel="noreferrer">在线打开</a><a className="download" href={bank.url} download>下载 PDF ↓</a></div>
              </article>
            ))}
          </div>
          <p className="bank-note">建议：每学完一个知识点单元，先关闭答案完成对应6题；错题回到课程表复习，再隔3天重做。</p>
        </section>
      )}

      {track === "science" && (
        <section className="section prediction-section" id="predictions">
          <div className="section-heading compact">
            <div><span className="section-number">P</span><span className="eyebrow dark">2027 理工类</span></div>
            <h2>原创预测套卷</h2>
            <p>按当前陕西理工类公共课结构制作，用来练速度、查薄弱点。它们不是官方押题，不承诺命中；2027 考试说明发布后会以新范围为准调整。</p>
          </div>
          <div className="prediction-grid">
            {predictionPapers.map((paper, index) => (
              <article key={paper.url}>
                <span className="prediction-index">0{index + 1}</span>
                <div><small>{paper.subject}</small><h3>预测卷 {paper.set}</h3><p>{paper.focus}</p></div>
                <a href={paper.url} target="_blank" rel="noreferrer">打开 PDF ↓</a>
              </article>
            ))}
          </div>
          <div className="prediction-note"><b>使用顺序：</b>先做 A 卷定位问题，补课 7 天后做 B 卷验证。两卷都必须按 150 分钟计时，答案页结束前不要打开。</div>
        </section>
      )}

      <section className="section featured-section">
        <div className="section-heading compact">
          <div><span className="section-number">03</span><span className="eyebrow dark">先看这组</span></div>
          <h2>为你选好的起步课</h2>
          <p>按照“基础课 → 章节题 → 陕西真题”的顺序，不要同时跟三位老师。</p>
        </div>
        <div className="featured-grid">
          {resources.filter((item) => item.featured && item.tracks.includes(track) && item.type !== "官方").map((resource, index) => (
            <article className="video-card" key={resource.title}>
              <div className={`video-poster poster-${index + 1}`}>
                <span className="video-index">0{index + 1}</span>
                <span className="play-button" aria-hidden="true">▶</span>
                <span className="poster-word">{resource.type === "英语" ? "EN" : "∫dx"}</span>
              </div>
              <div className="video-body">
                <div className="resource-meta"><span>{resource.tag}</span><span>{resource.source}</span></div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="video-actions">
                  <a href={resource.url} target="_blank" rel="noreferrer">观看视频 <Arrow /></a>
                  {resource.paperUrl && <a className="paper-action" href={resource.paperUrl} target="_blank" rel="noreferrer">配套试卷 PDF ↓</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section resource-section" id="resources">
        <div className="section-heading resource-heading">
          <div><span className="section-number">04</span><span className="eyebrow dark">可直接打开</span></div>
          <h2>学习资源库</h2>
          <p>共收录 {resources.filter((item) => item.tracks.includes(track)).length} 个与你当前类别相关的入口。外部课程可能更新或下架，官方规则始终排第一。</p>
        </div>

        <div className="resource-tools">
          <div className="filter-row" role="group" aria-label="资源类型筛选">
            {(["全部", "官方", "英语", "高数", "真题", "题库"] as ResourceType[]).map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜课程、真题、政策…" aria-label="搜索资源" />
          </label>
        </div>

        <div className="resource-list">
          {visibleResources.map((resource, index) => (
            <article className="resource-row" key={resource.title}>
              <span className="row-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="row-main">
                <div className="resource-meta"><span>{resource.type}</span><span>{resource.tag}</span><span>{resource.source}</span></div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </div>
              <div className="row-actions">
                <a className="row-action" href={resource.url} target="_blank" rel="noreferrer">{resource.action} <Arrow /></a>
                {resource.paperUrl && <a className="row-paper-action" href={resource.paperUrl} target="_blank" rel="noreferrer">配套卷 PDF ↓</a>}
              </div>
            </article>
          ))}
          {visibleResources.length === 0 && <div className="empty-state">没有找到匹配的资源，换个关键词或选择“全部”试试。</div>}
        </div>
        <p className="source-note">资源核对日期：2026-08-04 · 页面顶部可实时检查官方栏目 · 视频均跳转至原发布页，不提供或转载付费资料。</p>
      </section>

      <section className="section checklist-section" id="checklist">
        {track === "science" ? (
          <>
            <div className="phase-switcher" aria-label="自动学习阶段">
              {(["基础搭建", "章节专题", "真题训练", "套卷冲刺"] as const).map((label, index) => {
                const order = ["foundation", "topic", "papers", "sprint"];
                const activeIndex = order.indexOf(weekRecord?.phase ?? "foundation");
                return <span className={index === activeIndex ? "active" : index < activeIndex ? "passed" : ""} key={label}><i>{index < activeIndex ? "✓" : index + 1}</i>{label}</span>;
              })}
            </div>
            <div className="checklist-panel">
              <div className="checklist-copy">
                <div><span className="section-number light">05</span><span className="eyebrow">9月1日起 · 每周一自动换新</span></div>
                <h2>{weekRecord ? `第 ${weekRecord.weekNumber} 周` : "本周计划"}，<br />{weekRecord?.phaseLabel ?? "正在生成"}</h2>
                <p>{weekRecord ? `${formatDateRange(weekRecord.start, weekRecord.end)}。任务根据尚未完成的英语、高数知识点生成；每周一自动切换。` : "正在读取你的课程进度并生成任务。"}</p>
                {carryCount > 0 && <div className="carry-alert">本周已顺延 {carryCount} 项未完成任务，先清欠账再开新内容。</div>}
                <div className="progress-wrap">
                  <div className="progress-label"><span>本周进度</span><b>{completedCount} / {taskCount}</b></div>
                  <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                  <small>{progress === 100 ? "本周任务全部完成。保持节奏，下周一会自动生成新计划。" : progress >= 67 ? "已经完成大半，先把顺延项和错题复盘收尾。" : "优先做列表最上方任务，每天完成一个闭环。"}</small>
                </div>
              </div>
              <div className="task-list">
                {(weekRecord?.tasks ?? []).map((task, index) => {
                  const checked = weekRecord?.completed.includes(task.id) ?? false;
                  return (
                    <div className={`${checked ? "task checked" : "task"}${task.kind === "carry" ? " carried" : ""}`} key={task.id}>
                      <button className="custom-check" onClick={() => toggleWeeklyTask(task.id)} aria-label={`${checked ? "取消完成" : "标记完成"}：${task.label}`} aria-pressed={checked}>{checked ? "✓" : ""}</button>
                      <span className="task-number">{String(index + 1).padStart(2, "0")}</span>
                      <div className="task-copy"><span>{task.label}</span><small>{task.kind === "carry" ? "上周顺延" : task.subject}</small></div>
                      {task.href && <a href={task.href} target="_blank" rel="noreferrer">去完成 <Arrow /></a>}
                    </div>
                  );
                })}
                {!weekRecord && <div className="planner-loading">正在生成本周任务…</div>}
              </div>
            </div>

            <div className="history-panel">
              <div className="history-head"><div><span>学习档案</span><h3>每周完成记录</h3></div><p>记录保存在当前设备和浏览器中；换设备或清理浏览器数据不会自动同步。</p></div>
              <div className="history-list">
                {historyRecords.slice(0, 10).map((record, index) => (
                    <details key={record.weekKey} open={index === 0}>
                    <summary><span>第 {record.weekNumber} 周</span><b>{formatDateRange(record.start, record.end)} · {record.phaseLabel}</b><strong>{record.completed.length}/{record.tasks.length}</strong></summary>
                    <ul>{record.tasks.map((item) => <li className={record.completed.includes(item.id) ? "done" : ""} key={item.id}><span>{record.completed.includes(item.id) ? "✓" : "○"}</span>{item.label}</li>)}</ul>
                  </details>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="planner-track-note"><span>∫</span><div><h2>理工类自动周计划</h2><p>它会根据英语和高数进度安排任务，并在真题、套卷、冲刺阶段自动换挡。</p></div></div>
        )}
      </section>

      <section className="section method-section">
        <div className="section-heading compact">
          <div><span className="section-number">06</span><span className="eyebrow dark">少走弯路</span></div>
          <h2>三个“不要”</h2>
        </div>
        <div className="dont-grid">
          <article><span>×</span><h3>不要只看视频</h3><p>每看 30—45 分钟，必须关掉视频做题。能复述、能做对，才算学过。</p></article>
          <article><span>×</span><h3>不要囤十套资料</h3><p>一套主讲义 + 一本题库 + 一本错题本足够。反复做，比不断换资料更有效。</p></article>
          <article><span>×</span><h3>不要忽略校内通知</h3><p>报名资格、专业课考核和材料提交都由生源学校参与组织，错过节点没法靠刷题补救。</p></article>
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <div><div className="brand footer-brand"><span className="brand-mark">升</span><span>升本地图</span></div><p>给陕西专科生的一页式备考起点。</p></div>
          <div className="footer-links">
            <a href="https://www.sneea.cn/zc/zsbks.htm" target="_blank" rel="noreferrer">陕西省教育考试院 · 专升本</a>
            <a href="https://www.sneac.com/" target="_blank" rel="noreferrer">陕西招生考试信息网</a>
            <a href="https://www.chsi.com.cn/" target="_blank" rel="noreferrer">学信网</a>
          </div>
        </div>
        <div className="footer-bottom"><span>政策有时效，请以 2027 年陕西省教育考试院正式公告为准。</span><span>实时检查入口已启用</span></div>
      </footer>

      <nav className="mobile-nav" aria-label="移动端快速导航">
        <a href="#top"><span aria-hidden="true">⌂</span><b>首页</b></a>
        <a href="#updates"><span aria-hidden="true">↻</span><b>更新</b></a>
        <a href="#roadmap"><span aria-hidden="true">◇</span><b>路线</b></a>
        <a href="#syllabus"><span aria-hidden="true">▤</span><b>课程</b></a>
        <a href="#resources"><span aria-hidden="true">⌕</span><b>资源</b></a>
        <a href="#checklist"><span aria-hidden="true">✓</span><b>计划 {progress}%</b></a>
      </nav>
    </main>
  );
}
