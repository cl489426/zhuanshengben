import type { PlanPhase } from "./weekly-plan";

type Unit = { id: string; title: string; url: string };

export type DailySlot = {
  id: string;
  time: string;
  subject: "英语" | "高数" | "复盘";
  title: string;
  detail: string;
  href: string;
};

export type DailyPlan = {
  dateKey: string;
  monthDay: string;
  weekday: string;
  weekNumber: number;
  phase: PlanPhase;
  phaseLabel: string;
  focus: string;
  slots: DailySlot[];
};

export type DailyHistory = Record<string, string[]>;

export const DAILY_PLAN_START = new Date(2026, 8, 7);
const DAY = 86400000;

export function isoLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function clampDailyDate(date: Date) {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return value < DAILY_PLAN_START ? new Date(DAILY_PLAN_START) : value;
}

export function shiftDailyDate(dateKey: string, amount: number) {
  const date = parseLocalDate(dateKey);
  date.setDate(date.getDate() + amount);
  return isoLocalDate(clampDailyDate(date));
}

function phaseFor(date: Date): { phase: PlanPhase; label: string } {
  const stamp = date.getTime();
  if (stamp < new Date(2026, 10, 2).getTime()) return { phase: "foundation", label: "基础搭建" };
  if (stamp < new Date(2027, 0, 4).getTime()) return { phase: "topic", label: "章节专题" };
  if (stamp < new Date(2027, 2, 1).getTime()) return { phase: "papers", label: "真题训练" };
  return { phase: "sprint", label: "套卷冲刺" };
}

function slot(dateKey: string, id: string, time: string, subject: DailySlot["subject"], title: string, detail: string, href: string): DailySlot {
  return { id: `${dateKey}:${id}`, time, subject, title, detail, href };
}

export function buildDailyPlan(date: Date, englishUnits: Unit[], mathUnits: Unit[]): DailyPlan {
  const current = clampDailyDate(date);
  const dateKey = isoLocalDate(current);
  const daysSinceStart = Math.floor((current.getTime() - DAILY_PLAN_START.getTime()) / DAY);
  const weekIndex = Math.floor(daysSinceStart / 7);
  const weekNumber = weekIndex + 1;
  const weekdayIndex = current.getDay();
  const english = englishUnits[weekIndex % englishUnits.length];
  const math = mathUnits[weekIndex % mathUnits.length];
  const { phase, label: phaseLabel } = phaseFor(current);
  const paperSet = weekNumber % 2 === 0 ? "B" : "A";
  let focus = `英语「${english.title}」＋高数「${math.title}」`;
  let slots: DailySlot[];

  if (weekdayIndex === 6) {
    if (phase === "papers" || phase === "sprint") {
      focus = `${phaseLabel} · 双科计时训练`;
      slots = [
        slot(dateKey, "recall", "07:30—08:10", "复盘", "单词与公式热身", "只复习本周内容，让大脑进入考试状态。", "#syllabus"),
        slot(dateKey, "math-paper", "08:30—11:00", "高数", `高数${phase === "sprint" ? "预测" : "整卷"} ${paperSet} 卷`, "150分钟独立作答，到点立即停笔并标出没把握的题。", `/papers/2027-math-prediction-${paperSet}.pdf`),
        slot(dateKey, "math-review", "11:10—11:50", "复盘", "高数整卷初步复盘", "只统计章节、错因和用时，暂时不抄完整答案。", "#resources"),
        slot(dateKey, "english-paper", "14:00—16:30", "英语", `英语${phase === "sprint" ? "预测" : "整卷"} ${paperSet} 卷`, "150分钟完整作答，作文至少预留30分钟。", `/papers/2027-english-prediction-${paperSet}.pdf`),
        slot(dateKey, "english-review", "16:40—17:20", "复盘", "英语整卷初步复盘", "按词汇、语法、阅读、翻译和写作归类失分。", "#resources"),
        slot(dateKey, "error-fix", "19:00—20:30", "复盘", "订正今天最关键的错题", "英数各选3道代表题，写出正确思路和下次识别信号。", "#checklist"),
        slot(dateKey, "summary", "20:40—21:10", "复盘", "整理整卷数据", "记录两科得分、用时和下周最先补的三个问题。", "#checklist"),
      ];
    } else {
      slots = [
        slot(dateKey, "words", "07:30—08:10", "英语", "本周单词总复习", "遮住释义快速回忆，不认识的词单独加入下周清单。", english.url),
        slot(dateKey, "math-test", "08:30—10:30", "高数", `${math.title} · 章节训练`, "先闭卷做题，再用剩余时间核对步骤；目标正确率不低于80%。", math.url),
        slot(dateKey, "math-review", "10:45—11:45", "复盘", "高数错题订正", "每道错题标注：知识点、错误原因、正确步骤。", "/papers/math-course-question-bank.pdf"),
        slot(dateKey, "english-test", "14:00—15:30", "英语", `${english.title} · 限时训练`, "完成本单元配套题；阅读题必须在原文标出依据。", "/papers/english-course-question-bank.pdf"),
        slot(dateKey, "english-review", "15:45—17:15", "复盘", "英语错题与生词复盘", "整理10个生词和3条易错规则，晚上再口头回忆一次。", english.url),
        slot(dateKey, "weakness", "19:00—20:30", "复盘", "本周薄弱点补课", "只补错误率最高的一个知识点，不额外开启新章节。", "#syllabus"),
        slot(dateKey, "summary", "20:40—21:10", "复盘", "生成本周学习报告", "记录两科正确率、完成度和下周需要顺延的任务。", "#checklist"),
      ];
    }
  } else if (weekdayIndex === 0) {
    slots = [
      slot(dateKey, "words", "08:00—08:40", "英语", "本周单词回忆", "只复习、不加新词，把仍然陌生的词加入下周复习表。", english.url),
      slot(dateKey, "carry", "09:00—10:30", "复盘", "补齐本周未完成任务", "优先处理周计划中的顺延项和未订正错题。", "#checklist"),
      slot(dateKey, "recall", "10:45—11:45", "复盘", "单词＋公式闭卷回忆", "默写本周高频词、求导积分公式或本章关键结论。", "#syllabus"),
      slot(dateKey, "weekly-test", "14:00—15:30", phase === "foundation" ? "复盘" : "高数", phase === "foundation" ? "英数周测" : `${phaseLabel}周测`, "全程计时，手机调静音；结束后记录正确率和用时。", phase === "foundation" ? "/papers/math-foundation-paper.pdf" : `/papers/2027-math-prediction-${paperSet}.pdf`),
      slot(dateKey, "weekly-review", "15:45—17:15", "复盘", "周测深度复盘", "把错题归入对应英语或高数单元，并安排隔3天重做。", "#resources"),
      slot(dateKey, "next-week", "19:00—20:00", "复盘", "准备下周学习", "整理桌面、下载资料，只写3个最重要的下周目标。", "#checklist"),
      slot(dateKey, "rest", "20:00—21:00", "复盘", "轻复习与提前休息", "口头回忆本周框架，21点后不再做高强度新题。", "#syllabus"),
    ];
  } else if (phase === "papers" || phase === "sprint") {
    const isMathDay = weekdayIndex % 2 === 1;
    focus = `${phaseLabel} · ${isMathDay ? "高数" : "英语"}整卷拆练`;
    slots = [
      slot(dateKey, "memory", "07:30—08:10", "英语", "高频词与易错公式", "复习旧内容，不再大量加入新词或新公式。", "#syllabus"),
      slot(dateKey, "paper-main", "08:30—10:10", isMathDay ? "高数" : "英语", `${isMathDay ? "高数" : "英语"}整卷分段训练`, "连续100分钟完成对应题段，不查答案、不暂停计时。", isMathDay ? `/papers/2027-math-prediction-${paperSet}.pdf` : `/papers/2027-english-prediction-${paperSet}.pdf`),
      slot(dateKey, "review-main", "10:25—11:45", "复盘", "上午题段订正", "统计正确率、失分章节和用时，选出3道题隔天重做。", "#resources"),
      slot(dateKey, "paper-second", "14:00—15:30", isMathDay ? "英语" : "高数", `${isMathDay ? "英语" : "高数"}整卷分段训练`, "完成另一科重点题段，保持双科每天都接触。", isMathDay ? `/papers/2027-english-prediction-${paperSet}.pdf` : `/papers/2027-math-prediction-${paperSet}.pdf`),
      slot(dateKey, "review-second", "15:45—17:15", isMathDay ? "英语" : "高数", "下午题段订正与重做", "关掉答案复做错题，能独立写完整步骤才算订正。", "#resources"),
      slot(dateKey, "weak-course", "19:00—20:30", isMathDay ? "英语" : "高数", `补强「${isMathDay ? english.title : math.title}」`, "回看薄弱知识点，并马上做5道对应题验证。", isMathDay ? english.url : math.url),
      slot(dateKey, "review", "20:40—21:10", "复盘", "更新错题清单", "只记录可执行的改进：错因、正确方法、重做日期。", "#checklist"),
    ];
  } else {
    const weekdayTasks = [
      { english: "主课精学与笔记", math: "主课精学与例题" },
      { english: "语法规则专项练习", math: "基础计算专项练习" },
      { english: "长难句拆解训练", math: "主课续学与例题" },
      { english: "阅读或翻译限时练", math: "章节题与错题重做" },
      { english: "本周知识点回测", math: "本周知识点回测" },
    ][weekdayIndex - 1];
    slots = [
      slot(dateKey, "words", "07:30—08:10", "英语", "30个新词＋昨日复习", "25分钟学新词，15分钟遮住中文或英文做回忆。", english.url),
      slot(dateKey, "math-main", "08:30—10:10", "高数", `${math.title} · ${weekdayTasks.math}`, "看课并整理方法，暂停视频独立复做例题。", math.url),
      slot(dateKey, "math-drill", "10:25—11:45", "高数", `${math.title} · 章节训练`, "完成15—20道对应题，错题立刻标注原因但集中到晚上整理。", "/papers/math-course-question-bank.pdf"),
      slot(dateKey, "english-main", "14:00—15:30", "英语", `${english.title} · ${weekdayTasks.english}`, "完整学习一个小节，写出规则、例句和识别方法。", english.url),
      slot(dateKey, "english-drill", "15:45—17:15", "英语", `${english.title} · 当日训练`, "完成配套练习，阅读题标依据，语法题说出规则。", "/papers/english-course-question-bank.pdf"),
      slot(dateKey, "mixed", "19:00—20:30", weekdayIndex % 2 === 1 ? "高数" : "英语", weekdayIndex % 2 === 1 ? "高数错题重做＋提高题" : "英语阅读、翻译或写作输出", "前60分钟限时完成，后30分钟核对并重做。", weekdayIndex % 2 === 1 ? "/papers/math-course-question-bank.pdf" : "/papers/english-course-question-bank.pdf"),
      slot(dateKey, "review", "20:40—21:10", "复盘", "错题记录与明日准备", "英数各写1条收获，整理明天需要的课程和试卷。", "#checklist"),
    ];
  }

  return {
    dateKey,
    monthDay: `${current.getMonth() + 1}月${current.getDate()}日`,
    weekday: `星期${"日一二三四五六"[weekdayIndex]}`,
    weekNumber,
    phase,
    phaseLabel,
    focus,
    slots,
  };
}
