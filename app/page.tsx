"use client";

import { useEffect, useMemo, useState } from "react";

type Track = "science" | "arts";
type ResourceType = "全部" | "官方" | "英语" | "高数" | "语文" | "真题";

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

const resources: Resource[] = [
  {
    title: "2026 陕西专升本考试招生工作实施办法",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "政策原文",
    description: "确认报考条件、统考科目、分值和流程。2027 新政策发布前，以它作为规则基线。",
    action: "打开官方原文",
    url: "https://www.sneea.cn/info/1031/17033.htm",
    tracks: ["science", "arts"],
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
    tracks: ["science", "arts"],
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
    tracks: ["science", "arts"],
  },
  {
    title: "专业课考核科目表",
    source: "陕西省教育考试院",
    type: "官方",
    tag: "校内考核",
    description: "查你要参加的两门专业课考核。该考核由生源学校组织，务必问本校教务处时间。",
    action: "查看考核科目",
    url: "https://www.sneea.cn/info/1031/17030.htm",
    tracks: ["science", "arts"],
  },
  {
    title: "专升本英语零基础系统课",
    source: "哔哩哔哩 · 秦天英语",
    type: "英语",
    tag: "零基础",
    description: "从词法、句法进入，适合现在开始建立语法框架。先学语法，再用陕西真题校准题型。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1SPJazBEuK/",
    tracks: ["science", "arts"],
    featured: true,
    paperUrl: "/papers/english-foundation-paper.pdf",
  },
  {
    title: "2025 陕西专升本英语真题解析",
    source: "哔哩哔哩",
    type: "真题",
    tag: "陕西真题",
    description: "从单项选择开始看老师如何定位考点。先自己计时做，再看讲解，别边看边抄答案。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV143ywBfExo/",
    tracks: ["science", "arts"],
    paperUrl: "/papers/english-foundation-paper.pdf",
  },
  {
    title: "陕西英语 2020—2021 真题逐题解析",
    source: "哔哩哔哩",
    type: "真题",
    tag: "整卷讲解",
    description: "包含考点梳理、作文模板与单词建议。旧题用于研究稳定考法，不用于预测新题。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1bu411z7UF/",
    tracks: ["science", "arts"],
    paperUrl: "/papers/english-foundation-paper.pdf",
  },
  {
    title: "陕西专升本数学必刷 800 题",
    source: "哔哩哔哩 · 川哥专升本",
    type: "高数",
    tag: "专项刷题",
    description: "按章节练习，适合学完一章立即巩固。现在不要直接追求题量，先保证每题会复盘。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1w4ymBjE3C/",
    tracks: ["science"],
    featured: true,
    paperUrl: "/papers/math-foundation-paper.pdf",
  },
  {
    title: "2027 专升本高数零基础全套课",
    source: "哔哩哔哩 · 正鑫学长",
    type: "高数",
    tag: "系统课",
    description: "全国通用系统课；页面注明陕西可学 1—8 章与曲线积分。学习时仍要对照陕西考试说明删减。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1HP411t7cS/",
    tracks: ["science"],
    paperUrl: "/papers/math-foundation-paper.pdf",
  },
  {
    title: "2026 陕西专升本大学语文",
    source: "哔哩哔哩",
    type: "语文",
    tag: "陕西课程",
    description: "陕西地区课程入口，适合搭建篇目与题型框架。听完一课后必须配套默写或做题。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1U341zdEj1/",
    tracks: ["arts"],
    featured: true,
    paperUrl: "/papers/chinese-foundation-paper.pdf",
  },
  {
    title: "陕西专升本大学语文零基础全程课",
    source: "哔哩哔哩",
    type: "语文",
    tag: "入门先导",
    description: "较早的陕西课程，适合补基础概念。年份较旧，篇目范围与题型请用最新考试说明核对。",
    action: "直接观看",
    url: "https://www.bilibili.com/video/BV1nG4y187GU/",
    tracks: ["arts"],
    paperUrl: "/papers/chinese-foundation-paper.pdf",
  },
  {
    title: "陕西专升本最新视频检索页",
    source: "哔哩哔哩搜索",
    type: "真题",
    tag: "持续更新",
    description: "用于补充查找 2027 新大纲解读、最新真题与考情。优先看标题明确写“陕西”的内容。",
    action: "查看最新结果",
    url: "https://search.bilibili.com/all?keyword=%E9%99%95%E8%A5%BF%E4%B8%93%E5%8D%87%E6%9C%AC%E8%80%83%E8%AF%95",
    tracks: ["science", "arts"],
  },
];

const scienceCourseGroups: { subject: string; subtitle: string; units: CourseUnit[] }[] = [
  {
    subject: "大学英语",
    subtitle: "所有理工考生必考 · 先语法，再题型，最后陕西真题",
    units: [
      { id: "en-words", number: "01", title: "词汇与词性", points: "名词、冠词、代词、形容词、副词、介词与常见搭配", output: "做一张词性判断表；每天30词", url: "https://www.bilibili.com/video/BV1X4411J7yd/?p=2" },
      { id: "en-sentence", number: "02", title: "句子骨架", points: "句子成分、五大基本句型、主谓一致与英文造句", output: "能独立拆出主谓宾 / 主系表", url: "https://www.bilibili.com/video/BV1ai3yzoEwE/?p=3" },
      { id: "en-tense", number: "03", title: "时态与语态", points: "一般时、进行时、完成时、被动语态与时间线", output: "整理时态结构和标志词", url: "https://www.bilibili.com/video/BV1ai3yzoEwE/?p=6" },
      { id: "en-nonfinite", number: "04", title: "非谓语动词", points: "不定式、动名词、分词作定语 / 状语 / 宾补", output: "完成20道非谓语单选", url: "https://www.bilibili.com/video/BV1X4411J7yd/?p=29" },
      { id: "en-clause", number: "05", title: "三大从句与特殊句", points: "名词性从句、定语从句、状语从句、强调与倒装", output: "画出连接词选择流程", url: "https://www.bilibili.com/video/BV1X4411J7yd/?p=41" },
      { id: "en-cloze", number: "06", title: "完形填空", points: "上下文逻辑、词义辨析、固定搭配与语法线索", output: "做完一篇并标出每空依据", url: "https://www.bilibili.com/video/BV1DT411U7Pj/?p=5" },
      { id: "en-reading", number: "07", title: "阅读理解", points: "主旨、细节、推断、词义题与证据定位", output: "每篇圈出题干关键词与原文证据", url: "https://www.bilibili.com/video/BV1D44y1M7fV/" },
      { id: "en-writing", number: "08", title: "翻译与写作", points: "句子主干、英译汉顺序、120-180词短文结构", output: "完成5句翻译和1篇限时作文", url: "https://www.bilibili.com/video/BV1cm4y1P7yW/?p=3" },
    ],
  },
  {
    subject: "高等数学",
    subtitle: "陕西理工类主科 · 按依赖关系顺序学习，不要跳章",
    units: [
      { id: "math-limit", number: "01", title: "函数、极限与连续", points: "定义域、函数性质、重要极限、无穷小、连续与间断", output: "建立极限计算方法清单", url: "https://www.bilibili.com/video/BV1114y1G7oB/" },
      { id: "math-derivative", number: "02", title: "一元函数微分学", points: "导数定义、求导法则、高阶导数、隐函数与参数方程", output: "默写求导公式并做30题", url: "https://www.bilibili.com/video/BV1Mh4y1f7Yp/?p=34" },
      { id: "math-application", number: "03", title: "导数的应用", points: "中值定理、洛必达、单调性、极值、凹凸与渐近线", output: "会画符号表并写完整判定", url: "https://www.bilibili.com/video/BV145411t75K/" },
      { id: "math-integral", number: "04", title: "一元积分与应用", points: "不定积分、换元、分部、定积分、面积与旋转体体积", output: "按方法分类整理积分题", url: "https://www.bilibili.com/video/BV1VE411i73B/" },
      { id: "math-vector", number: "05", title: "向量与空间解析几何", points: "向量运算、平面与直线方程、位置关系与距离", output: "整理点积、叉积和方程公式", url: "https://www.bilibili.com/video/BV1Gz41187e2/" },
      { id: "math-multivariable", number: "06", title: "多元函数与曲线积分", points: "偏导、全微分、极值、二重积分、曲线积分与格林公式", output: "会画积分区域并选择积分次序", url: "https://www.bilibili.com/video/BV1Up4y1Y76a/?p=113" },
      { id: "math-series", number: "07", title: "无穷级数", points: "数项级数、审敛法、幂级数、收敛半径与展开", output: "做一张审敛法决策表", url: "https://www.bilibili.com/video/BV1Ux4y1B7Ub/" },
      { id: "math-ode", number: "08", title: "常微分方程", points: "可分离变量、一阶线性、可降阶与二阶常系数方程", output: "先判类型，再套对应解法", url: "https://www.bilibili.com/video/BV1GS4y1Y7bP/" },
    ],
  },
];

const phases = [
  { date: "8—9月", title: "筑地基", detail: "英语语法 + 高频词；高数/语文完成第一轮框架。", tone: "mint" },
  { date: "10—12月", title: "做专题", detail: "按章节刷题，建立错题本；每两周做一次计时测验。", tone: "yellow" },
  { date: "1—2月", title: "啃真题", detail: "整卷限时，统计失分原因；弱项回到对应章节补洞。", tone: "blue" },
  { date: "3月起", title: "等公告 · 冲刺", detail: "核对 2027 政策、报名与专业目录；套卷训练并稳住作息。", tone: "coral" },
];

const commonTasks = [
  "做一次英语摸底：限时 40 分钟，记录词汇 / 语法 / 阅读失分",
  "连续 7 天背词，每天 30 个新词 + 复习旧词",
  "完成 3 节英语语法课，每节课后做 10 道对应题",
  "向本校教务处确认专业课考核科目与大致时间",
];

const trackTasks: Record<Track, string[]> = {
  science: ["完成函数与极限的第一轮课程", "做 30 道函数 / 极限基础题，并整理 5 个错因"],
  arts: ["完成语文考试范围与题型导学", "精读 3 篇篇目，整理作者、主旨、手法与名句"],
};

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [track, setTrack] = useState<Track>("science");
  const [filter, setFilter] = useState<ResourceType>("全部");
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [courseDone, setCourseDone] = useState<string[]>([]);
  const [latest, setLatest] = useState<LatestUpdate | null>(null);
  const [checkingUpdates, setCheckingUpdates] = useState(false);

  const tasks = useMemo(() => [...commonTasks, ...trackTasks[track]], [track]);

  useEffect(() => {
    const savedTrack = window.localStorage.getItem("sb-track") as Track | null;
    const savedDone = window.localStorage.getItem("sb-done");
    const savedCourses = window.localStorage.getItem("sb-science-courses");
    if (savedTrack === "science" || savedTrack === "arts") setTrack(savedTrack);
    if (savedDone) {
      try {
        setDone(JSON.parse(savedDone));
      } catch {
        setDone([]);
      }
    }
    if (savedCourses) {
      try {
        setCourseDone(JSON.parse(savedCourses));
      } catch {
        setCourseDone([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sb-track", track);
  }, [track]);

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

  const visibleResources = resources.filter((resource) => {
    const inTrack = resource.tracks.includes(track);
    const inFilter = filter === "全部" || resource.type === filter;
    const haystack = `${resource.title}${resource.source}${resource.tag}${resource.description}`.toLowerCase();
    return inTrack && inFilter && haystack.includes(query.trim().toLowerCase());
  });

  const completedCount = tasks.filter((task) => done.includes(task)).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  function toggleTask(task: string) {
    const next = done.includes(task) ? done.filter((item) => item !== task) : [...done, task];
    setDone(next);
    window.localStorage.setItem("sb-done", JSON.stringify(next));
  }

  function chooseTrack(next: Track) {
    setTrack(next);
    setFilter("全部");
  }

  function toggleCourse(courseId: string) {
    const next = courseDone.includes(courseId)
      ? courseDone.filter((item) => item !== courseId)
      : [...courseDone, courseId];
    setCourseDone(next);
    window.localStorage.setItem("sb-science-courses", JSON.stringify(next));
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
          <a href="#updates">实时更新</a>
          <a href="#roadmap">学习路线</a>
          <a href="#syllabus">知识点课</a>
          <a href="#resources">资源库</a>
          <a href="#checklist">本周计划</a>
        </nav>
        <a className="header-cta" href="#checklist">开始第一周</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> 2027 陕西统招专升本备考导航</div>
          <h1>别再到处找课。<br /><em>从今天，照着学。</em></h1>
          <p className="hero-lead">把官方政策、可直接观看的免费课程和 7 个月复习节奏放在一个页面里。先选你的类别，下面的内容会自动切换。</p>

          <div className="track-picker" role="group" aria-label="选择考试类别">
            <button className={track === "science" ? "active" : ""} onClick={() => chooseTrack("science")}>
              <span className="track-icon">∫</span>
              <span><b>理工类</b><small>英语 + 高等数学</small></span>
            </button>
            <button className={track === "arts" ? "active" : ""} onClick={() => chooseTrack("arts")}>
              <span className="track-icon">文</span>
              <span><b>文史 / 医学 / 艺术</b><small>英语 + 大学语文</small></span>
            </button>
          </div>

          <div className="hero-actions">
            <a className="primary-button" href={track === "science" ? "#syllabus" : "#resources"}>看适合我的课程 <Arrow /></a>
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
          <div><span className="section-number">01</span><span className="eyebrow dark">现在到考试</span></div>
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
            <div><b>周一—周五</b><span>英语 60 分钟</span><span>{track === "science" ? "高数" : "语文"} 90 分钟</span><span>错题 20 分钟</span></div>
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
            <p>按陕西理工类公共课范围整理。每学完一项就打勾，进度会保存在当前设备；2027 考试说明发布后再做最终核对。</p>
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
                    <a href={group.subject === "大学英语" ? "/papers/english-foundation-paper.pdf" : "/papers/math-foundation-paper.pdf"} target="_blank" rel="noreferrer">下载配套试卷 PDF <Arrow /></a>
                  </div>
                </article>
              );
            })}
          </div>
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
                <span className="poster-word">{resource.type === "英语" ? "EN" : resource.type === "高数" ? "∫dx" : "语"}</span>
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
            {(["全部", "官方", "英语", "高数", "语文", "真题"] as ResourceType[]).map((item) => (
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
        <p className="source-note">基础资源核对日期：2026-08-01 · 页面顶部可实时检查官方栏目 · 视频均跳转至原发布页，不提供或转载付费资料。</p>
      </section>

      <section className="section checklist-section" id="checklist">
        <div className="checklist-panel">
          <div className="checklist-copy">
            <div><span className="section-number light">05</span><span className="eyebrow">别等“准备好”</span></div>
            <h2>你的第一周，<br />只做这 6 件事</h2>
            <p>勾选状态会保存在这台设备上。完成 4 项就算本周合格，不追求一次做到满分。</p>
            <div className="progress-wrap">
              <div className="progress-label"><span>本周进度</span><b>{completedCount} / {tasks.length}</b></div>
              <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
              <small>{progress === 100 ? "第一周完成。下周把题量提高 20%，不要换老师。" : progress >= 67 ? "已经合格，先把剩余任务收尾。" : "从第一项开始，今天完成一个闭环。"}</small>
            </div>
          </div>
          <div className="task-list">
            {tasks.map((task, index) => {
              const checked = done.includes(task);
              return (
                <label className={checked ? "task checked" : "task"} key={task}>
                  <input type="checkbox" checked={checked} onChange={() => toggleTask(task)} />
                  <span className="custom-check" aria-hidden="true">{checked ? "✓" : ""}</span>
                  <span className="task-number">0{index + 1}</span>
                  <span>{task}</span>
                </label>
              );
            })}
          </div>
        </div>
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

      <a className="mobile-start" href="#checklist">开始第一周 · {progress}%</a>
    </main>
  );
}
