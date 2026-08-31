export type PlanPhase = "foundation" | "topic" | "papers" | "sprint";

export type WeeklyTask = {
  id: string;
  label: string;
  subject: "英语" | "高数" | "复盘";
  kind: "planned" | "carry";
  href?: string;
};

export type WeeklyRecord = {
  weekKey: string;
  weekNumber: number;
  start: string;
  end: string;
  phase: PlanPhase;
  phaseLabel: string;
  tasks: WeeklyTask[];
  completed: string[];
  createdAt: string;
};

export type WeeklyHistory = Record<string, WeeklyRecord>;

type Unit = { id: string; title: string; output: string; url: string };

const PLAN_START = new Date(2026, 8, 1);
const ANCHOR = mondayOf(PLAN_START);

export function mondayOf(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  return result;
}

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekKey(date = new Date()) {
  return isoDate(date < PLAN_START ? ANCHOR : mondayOf(date));
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  return `${s.getMonth() + 1}月${s.getDate()}日—${e.getMonth() + 1}月${e.getDate()}日`;
}

function phaseFor(start: Date): { phase: PlanPhase; label: string } {
  const stamp = start.getTime();
  if (stamp < new Date(2026, 10, 2).getTime()) return { phase: "foundation", label: "基础搭建" };
  if (stamp < new Date(2027, 0, 4).getTime()) return { phase: "topic", label: "章节专题" };
  if (stamp < new Date(2027, 2, 1).getTime()) return { phase: "papers", label: "真题训练" };
  return { phase: "sprint", label: "套卷冲刺" };
}

function task(week: string, id: string, label: string, subject: WeeklyTask["subject"], href?: string): WeeklyTask {
  return { id: `${week}:${id}`, label, subject, href, kind: "planned" };
}

function nextUnit(units: Unit[], completed: string[], offset = 0) {
  const pending = units.filter((unit) => !completed.includes(unit.id));
  return pending[offset] ?? units[(completed.length + offset) % units.length];
}

export function buildWeeklyRecord(
  date: Date,
  completedCourses: string[],
  englishUnits: Unit[],
  mathUnits: Unit[],
  carry: WeeklyTask[] = [],
): WeeklyRecord {
  const startDate = date < PLAN_START ? new Date(ANCHOR) : mondayOf(date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  const displayStartDate = startDate < PLAN_START && endDate >= PLAN_START ? PLAN_START : startDate;
  const key = isoDate(startDate);
  const weekNumber = Math.max(1, Math.floor((startDate.getTime() - ANCHOR.getTime()) / 604800000) + 1);
  const { phase, label } = phaseFor(displayStartDate);
  const english = nextUnit(englishUnits, completedCourses);
  const math = nextUnit(mathUnits, completedCourses);
  const secondEnglish = nextUnit(englishUnits, completedCourses, 1);
  const secondMath = nextUnit(mathUnits, completedCourses, 1);
  let planned: WeeklyTask[];

  if (phase === "foundation") {
    planned = [
      task(key, `en-${english.id}`, `完成英语「${english.title}」课程，并做到：${english.output}`, "英语", english.url),
      task(key, "en-words", "周一至周五每天30个新词，周日只复习不加新词", "英语", "#syllabus"),
      task(key, `math-${math.id}`, `完成高数「${math.title}」课程，并做到：${math.output}`, "高数", math.url),
      task(key, "math-drill", `围绕「${math.title}」完成30道基础题，至少订正5道`, "高数", "#syllabus"),
      task(key, "mini-test", "周六完成英语40分钟 + 高数60分钟章节测验", "复盘", "#resources"),
      task(key, "review", "周日按“知识点—错因—正确步骤”整理本周错题", "复盘", "#resources"),
    ];
  } else if (phase === "topic") {
    planned = [
      task(key, `en-${english.id}`, `精学英语「${english.title}」，完成对应练习并复述解题规则`, "英语", english.url),
      task(key, `en-${secondEnglish.id}`, `复习英语「${secondEnglish.title}」，完成2篇阅读或1篇写作`, "英语", secondEnglish.url),
      task(key, `math-${math.id}`, `主攻高数「${math.title}」，完成40道分层题`, "高数", math.url),
      task(key, `math-${secondMath.id}`, `回测高数「${secondMath.title}」，重做本章错题`, "高数", secondMath.url),
      task(key, "timed", "周六完成一次120分钟英数混合训练，严格记录用时", "复盘", "#resources"),
      task(key, "weakness", "周日只补本周错误率最高的1个英语点和1个高数点", "复盘", "#syllabus"),
    ];
  } else if (phase === "papers") {
    const set = weekNumber % 2 === 0 ? "A" : "B";
    planned = [
      task(key, "english-paper", "计时完成1套陕西英语真题或整卷练习，先做后看解析", "英语", "#resources"),
      task(key, "english-review", "把英语整卷错题归为词汇、语法、阅读、翻译、写作5类", "英语", "#resources"),
      task(key, "math-paper", `计时完成高数预测卷 ${set}，到150分钟立即停笔`, "高数", `/papers/2027-math-prediction-${set}.pdf`),
      task(key, "math-review", "重做高数整卷错题，并给每题标注所属章节和丢分原因", "高数", "#predictions"),
      task(key, "weak-course", `回到英语「${english.title}」和高数「${math.title}」各补1节弱项课`, "复盘", "#syllabus"),
      task(key, "second-attempt", "周日闭卷重做本周所有错题，正确率达到85%才过关", "复盘", "#checklist"),
    ];
  } else {
    const set = weekNumber % 2 === 0 ? "A" : "B";
    planned = [
      task(key, "english-sprint", `150分钟完成英语预测卷 ${set}，作文至少留30分钟`, "英语", `/papers/2027-english-prediction-${set}.pdf`),
      task(key, "math-sprint", `150分钟完成高数预测卷 ${set}，逐题写出关键步骤`, "高数", `/papers/2027-math-prediction-${set}.pdf`),
      task(key, "full-simulation", "按正式考试时段完成一次英数双科模拟，中间不查资料", "复盘", "#predictions"),
      task(key, "error-pack", "只练最近3套卷重复出现的错题，不再大量开新题", "复盘", "#resources"),
      task(key, "memory", "每天复习高频词、公式和易错结论，控制在45分钟内", "复盘", "#syllabus"),
      task(key, "official", "核对官方公告、准考证、考试用品与到场时间", "复盘", "#updates"),
    ];
  }

  return {
    weekKey: key,
    weekNumber,
    start: isoDate(displayStartDate),
    end: isoDate(endDate),
    phase,
    phaseLabel: label,
    tasks: [...carry.slice(0, 3), ...planned],
    completed: [],
    createdAt: new Date().toISOString(),
  };
}

export function carryFrom(history: WeeklyHistory, currentKey: string) {
  const previous = Object.values(history)
    .filter((record) => record.weekKey < currentKey)
    .sort((a, b) => b.weekKey.localeCompare(a.weekKey))[0];
  if (!previous) return [];
  return previous.tasks
    .filter((item) => !previous.completed.includes(item.id))
    .slice(0, 3)
    .map((item, index) => ({
      ...item,
      id: `${currentKey}:carry-${index}-${item.id}`,
      label: `顺延：${item.label.replace(/^顺延：/, "")}`,
      kind: "carry" as const,
    }));
}
