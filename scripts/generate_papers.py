from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

GREEN = colors.HexColor("#173F35")
GREEN_2 = colors.HexColor("#225B49")
PAPER = colors.HexColor("#F6F4EA")
YELLOW = colors.HexColor("#F1DF70")
MINT = colors.HexColor("#B9E4D0")
CORAL = colors.HexColor("#F29D75")
INK = colors.HexColor("#17211B")
MUTED = colors.HexColor("#5D6861")
LINE = colors.HexColor("#D8D7CC")


def register_fonts():
    candidates = [
        ("C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"),
        ("C:/Windows/Fonts/simsun.ttc", "C:/Windows/Fonts/simhei.ttf"),
    ]
    for regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont("CN", regular))
            pdfmetrics.registerFont(TTFont("CN-Bold", bold))
            return
    raise FileNotFoundError("No compatible Chinese font found")


register_fonts()

styles = getSampleStyleSheet()
BODY = ParagraphStyle(
    "BodyCN", parent=styles["BodyText"], fontName="CN", fontSize=9.5,
    leading=16, textColor=INK, wordWrap="CJK", spaceAfter=5,
)
SMALL = ParagraphStyle(
    "SmallCN", parent=BODY, fontSize=8, leading=13, textColor=MUTED,
)
ANSWER_BODY = ParagraphStyle(
    "AnswerBodyCN", parent=BODY, fontSize=8.4, leading=13.5, spaceAfter=3,
)
QUESTION = ParagraphStyle(
    "QuestionCN", parent=BODY, fontSize=9.7, leading=17, leftIndent=0,
    firstLineIndent=0, spaceAfter=7,
)
OPTION = ParagraphStyle(
    "OptionCN", parent=BODY, fontSize=9, leading=15, leftIndent=7 * mm,
    spaceAfter=7,
)
SECTION = ParagraphStyle(
    "SectionCN", parent=styles["Heading2"], fontName="CN-Bold", fontSize=15,
    leading=21, textColor=GREEN, spaceBefore=7, spaceAfter=9, wordWrap="CJK",
)
ANSWER_HEAD = ParagraphStyle(
    "AnswerHeadCN", parent=SECTION, textColor=colors.white, alignment=TA_CENTER,
    spaceBefore=0, spaceAfter=0,
)
TITLE = ParagraphStyle(
    "TitleCN", parent=styles["Title"], fontName="CN-Bold", fontSize=27,
    leading=37, textColor=colors.white, alignment=TA_LEFT, wordWrap="CJK",
)
SUBTITLE = ParagraphStyle(
    "SubtitleCN", parent=BODY, fontSize=10, leading=16, textColor=colors.white,
)


def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    if doc.page > 1:
        canvas.setStrokeColor(LINE)
        canvas.line(18 * mm, height - 15 * mm, width - 18 * mm, height - 15 * mm)
        canvas.setFont("CN", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(18 * mm, height - 11.5 * mm, f"升本地图 · {doc.subject_name}")
        canvas.drawRightString(width - 18 * mm, 11 * mm, f"第 {doc.page} 页")
        canvas.drawString(18 * mm, 11 * mm, "原创阶段练习 · 非官方真题 · 2027 备考")
    canvas.restoreState()


def cover(subject, title, badge, focus, color):
    info = Table(
        [[Paragraph(badge, ParagraphStyle("Badge", parent=SMALL, fontName="CN-Bold", textColor=GREEN, alignment=TA_CENTER))]],
        colWidths=[34 * mm], rowHeights=[10 * mm],
    )
    info.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), YELLOW),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#C8B94D")),
    ]))
    title_box = Table(
        [[info], [Spacer(1, 13 * mm)], [Paragraph(title, TITLE)], [Spacer(1, 6 * mm)], [Paragraph(focus, SUBTITLE)]],
        colWidths=[170 * mm],
    )
    title_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN),
        ("LEFTPADDING", (0, 0), (-1, -1), 14 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 12 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12 * mm),
    ]))
    meta = Table([
        ["科目", subject, "总分", "150 分"],
        ["建议用时", "150 分钟", "适用阶段", "第一轮 / 第二轮衔接"],
        ["使用方法", Paragraph("先独立计时作答，再对答案；错题按知识点归类。", SMALL), "版本", "2026-08"],
    ], colWidths=[22 * mm, 56 * mm, 24 * mm, 68 * mm])
    meta.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "CN"),
        ("FONTNAME", (0, 0), (0, -1), "CN-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "CN-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("TEXTCOLOR", (0, 0), (-1, -1), INK),
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    notice = Table([[Paragraph("重要：本卷为升本地图原创练习，不是陕西省教育考试院发布的真题或样题。2027 考试说明发布后，请以官方范围为准。作答时关闭视频与答案页，到时立即停笔并记录未完成题。", SMALL)]], colWidths=[170 * mm])
    notice.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("BOX", (0, 0), (-1, -1), 0.5, GREEN_2),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return [title_box, Spacer(1, 13 * mm), meta, Spacer(1, 9 * mm), notice, PageBreak()]


def section(title, instruction):
    banner = Table([[Paragraph(title, SECTION), Paragraph(instruction, SMALL)]], colWidths=[74 * mm, 96 * mm])
    banner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#E6EFE9")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
    ]))
    return [banner, Spacer(1, 5 * mm)]


def q(number, text, options=None, lines=0):
    out = [Paragraph(f"<b>{number}.</b> {text}", QUESTION)]
    if options:
        out.append(Paragraph(options, OPTION))
    for _ in range(lines):
        out.append(Paragraph("________________________________________________________________________________", SMALL))
    return out


def answer_banner():
    box = Table([[Paragraph("答案 · 评分 · 复盘", ANSWER_HEAD)]], colWidths=[170 * mm], rowHeights=[16 * mm])
    box.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), GREEN), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    return [PageBreak(), box, Spacer(1, 7 * mm)]


def build_pdf(filename, subject, title, badge, focus, accent, story):
    path = OUT / filename
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, rightMargin=20 * mm, leftMargin=20 * mm,
        topMargin=21 * mm, bottomMargin=18 * mm, title=title,
        author="升本地图", subject=subject,
    )
    doc.subject_name = subject
    content = cover(subject, title, badge, focus, accent) + story
    doc.build(content, onFirstPage=footer, onLaterPages=footer)
    return path


def english_paper():
    story = []
    story += section("第一部分　词汇与语法（40分）", "共20题，每题2分。选择最恰当的一项。")
    questions = [
        ("The library _____ at 9 p.m. on weekdays.", "A. close　B. closes　C. closed　D. closing"),
        ("If I _____ more time, I would join the volunteer team.", "A. have　B. had　C. will have　D. am having"),
        ("Neither the teacher nor the students _____ satisfied with the result.", "A. is　B. was　C. are　D. be"),
        ("The book _____ by my roommate yesterday is very useful.", "A. recommend　B. recommending　C. recommended　D. recommends"),
        ("It was not until midnight _____ he finished the report.", "A. that　B. when　C. which　D. where"),
        ("We should make full use _____ the resources available online.", "A. in　B. of　C. with　D. for"),
        ("The new method is much _____ than the old one.", "A. efficient　B. more efficient　C. most efficient　D. efficiently"),
        ("By the end of last month, she _____ three practice papers.", "A. completes　B. completed　C. had completed　D. has completed"),
        ("The manager asked whether the task _____ on time.", "A. could be finished　B. could finish　C. has finished　D. finishing"),
        ("_____ tired he was, he kept reviewing his mistakes.", "A. Because　B. However　C. Whatever　D. Unless"),
        ("Please _____ the important dates in your calendar.", "A. take down　B. take off　C. take after　D. take over"),
        ("The word closest in meaning to “essential” is _____.", "A. optional　B. necessary　C. ordinary　D. possible"),
        ("There is no point _____ the same video without doing exercises.", "A. watch　B. to watch　C. watching　D. watched"),
        ("She speaks English clearly enough for everyone _____ her.", "A. understand　B. understood　C. understanding　D. to understand"),
        ("Only after checking the answer _____ his mistake.", "A. he found　B. did he find　C. he had found　D. found he"),
        ("The course provides students _____ practical learning strategies.", "A. to　B. at　C. with　D. by"),
        ("I prefer studying in the morning _____ staying up late.", "A. than　B. to　C. for　D. from"),
        ("The reason _____ he missed the deadline was that he read the wrong notice.", "A. why　B. which　C. what　D. whom"),
        ("You had better _____ a fixed time for daily review.", "A. setting　B. set　C. to set　D. sets"),
        ("Hard work matters, but the right method is equally _____.", "A. importance　B. importantly　C. important　D. import"),
    ]
    for i, (text, opts) in enumerate(questions, 1): story += q(i, text, opts)

    story += section("第二部分　完形填空（20分）", "共10题，每题2分。阅读短文并选择最佳答案。")
    story.append(Paragraph("Many students begin exam preparation by collecting a large number of courses. However, having more materials does not always lead to better results. A useful plan should be simple enough to <b>(21)</b> every day. First, choose one main course for each subject and follow it in order. Second, do a short exercise after each lesson so that you can <b>(22)</b> whether you truly understand the content. Third, keep a mistake notebook. Do not simply copy the correct answer; write down <b>(23)</b> your first thought was wrong. Review the notebook once a week. This turns mistakes into useful information <b>(24)</b> repeated failures. Finally, use timed papers only after you have built a basic knowledge system. At that stage, timing helps you improve both speed <b>(25)</b> accuracy. A good plan is not the one that looks busiest. It is the one you can continue, examine, and <b>(26)</b>. If a weekly target is too difficult, divide it into smaller steps. When a task is completed, mark it clearly. This gives you a sense of progress and makes it <b>(27)</b> to continue. Remember that preparation is a long process. Missing one day is not a reason to give <b>(28)</b>. Return to the plan the next day and focus on the next action. Over several months, small actions can <b>(29)</b> into a large improvement. Consistency is often more valuable <b>(30)</b> a sudden burst of effort.", BODY))
    cloze = [
        (21, "A. follow　B. hide　C. refuse　D. borrow"), (22, "A. guess　B. check　C. promise　D. forget"),
        (23, "A. where　B. when　C. why　D. whose"), (24, "A. instead of　B. because of　C. apart from　D. as for"),
        (25, "A. or　B. but　C. and　D. so"), (26, "A. adjust　B. damage　C. cancel　D. avoid"),
        (27, "A. easy　B. easier　C. easiest　D. easily"), (28, "A. away　B. out　C. up　D. off"),
        (29, "A. grow　B. break　C. fall　D. enter"), (30, "A. as　B. from　C. than　D. with"),
    ]
    for n, opts in cloze: story += q(n, "", opts)

    story += section("第三部分　阅读理解（30分）", "共10题，每题3分。根据短文选择最佳答案。")
    story.append(Paragraph("<b>Passage One</b><br/>A college study group tried a simple experiment. For four weeks, half of the students watched recorded lessons at any speed they liked. The other half watched the same lessons but paused every twenty minutes to write a three-sentence summary and answer two questions without notes. Both groups spent nearly the same amount of time. At the end, the second group remembered more key ideas and made fewer mistakes on new problems. The researchers explained that learning feels smooth when information is familiar, but familiarity is not the same as mastery. Trying to recall information forces the brain to rebuild it. This effort may feel slow, yet it produces stronger memory. The study group therefore changed its rule: every lesson must end with a closed-book check. Students could still replay difficult parts, but only after attempting to explain them first.", BODY))
    read1 = [
        (31, "What was different about the second group?", "A. They watched different lessons.　B. They studied for more hours.　C. They regularly recalled and tested themselves.　D. They used faster playback."),
        (32, "What did the second group achieve?", "A. Better memory and transfer.　B. Shorter lessons.　C. More familiar materials.　D. Fewer study days."),
        (33, "According to the passage, familiarity _____.", "A. always means mastery　B. may create a false feeling of learning　C. makes recall unnecessary　D. is stronger than practice"),
        (34, "Why can recall feel slow?", "A. It requires active mental effort.　B. It uses outdated materials.　C. It reduces memory.　D. It depends on group size."),
        (35, "Which title best fits the passage?", "A. The Fastest Video Player　B. Why More Notes Are Always Better　C. The Value of Closed-Book Recall　D. How to Form a Large Study Group"),
    ]
    for n, text, opts in read1: story += q(n, text, opts)
    story.append(Paragraph("<b>Passage Two</b><br/>Official exam notices are more than administrative documents. They define who may register, which subjects are tested, and when important steps must be completed. Yet many students depend on screenshots forwarded in group chats. A screenshot may be incomplete, old, or separated from its original context. A safer habit is to locate the notice on the examination authority's website and record three items: the publication date, the applicable group of candidates, and the action deadline. Students should also save the link rather than only the picture. If a school organizes part of the qualification process, such as a professional-course assessment, students need to check both the provincial notice and their college's academic-office message. Reliable information will not replace studying, but it protects the opportunity to sit the exam.", BODY))
    read2 = [
        (36, "Why can forwarded screenshots be risky?", "A. They are always fake.　B. They may lack date or context.　C. They cannot show Chinese text.　D. They are too large to save."),
        (37, "Which item should students record from an official notice?", "A. The writer's hobby.　B. The website color.　C. The action deadline.　D. The number of pictures."),
        (38, "Why should students save the original link?", "A. To verify and revisit the full notice.　B. To make the phone faster.　C. To avoid all school messages.　D. To replace registration."),
        (39, "If the college organizes an assessment, students should _____.", "A. check only group chats　B. wait until the exam day　C. follow both provincial and college notices　D. ignore the provincial notice"),
        (40, "The final sentence mainly means that reliable information _____.", "A. guarantees a high score　B. is unnecessary after studying　C. protects eligibility but cannot replace preparation　D. makes professional courses optional"),
    ]
    for n, text, opts in read2: story += q(n, text, opts)

    story += section("第四部分　英译汉（20分）", "共5题，每题4分。译文应准确、通顺。")
    translations = [
        "A clear weekly plan reduces the number of decisions you need to make each day.",
        "Students who review their mistakes regularly are less likely to repeat them.",
        "No matter how useful a video is, it cannot replace independent practice.",
        "The official schedule should be checked again when the new notice is published.",
        "It is not the amount of material but the quality of review that matters most.",
    ]
    for i, text in enumerate(translations, 41): story += q(i, text, lines=2)

    story += section("第五部分　短文写作（40分）", "建议120-180词。内容20分，语言15分，书写与结构5分。")
    story += q(46, "Write an English composition on the topic <b>My Seven-Month Study Plan</b>. Your composition should include: (1) your current weakness; (2) two actions you will take; (3) how you will check progress.", lines=13)

    story += answer_banner()
    story += section("客观题答案（90分）", "先圈出错题，再给每题标注：词汇 / 语法 / 阅读 / 粗心。")
    keys = "1 B　2 B　3 C　4 C　5 A　6 B　7 B　8 C　9 A　10 B<br/>11 A　12 B　13 C　14 D　15 B　16 C　17 B　18 A　19 B　20 C<br/>21 A　22 B　23 C　24 A　25 C　26 A　27 B　28 C　29 A　30 C<br/>31 C　32 A　33 B　34 A　35 C　36 B　37 C　38 A　39 C　40 C"
    story.append(Paragraph(keys, ANSWER_BODY))
    story += section("重点解析", "只看自己不确定或做错的题。")
    explanations = [
        "2. 与现在事实相反的虚拟条件句：If 从句用一般过去时，主句用 would + 动词原形。",
        "3. neither...nor... 的谓语遵循就近原则，靠近 students，故用 are。",
        "5. 强调句型 It was not until... that...。",
        "8. by + 过去时间点通常与过去完成时连用。",
        "10. However + 形容词/副词 + 主语 + 谓语，表示“无论多么……”。",
        "15. only + 状语置于句首，主句部分倒装。",
        "24. instead of 表示“而不是”，符合把错误转化为信息而非重复失败的逻辑。",
        "33. 文中明确指出 familiar 不等于 mastery；熟悉感可能让人误以为已掌握。",
        "40. 信息能保护考试机会，但不能代替学习，正是末句的对比关系。",
    ]
    for item in explanations: story.append(Paragraph(item, ANSWER_BODY))
    story += section("翻译参考", "意思准确优先；下列答案不是唯一表达。")
    refs = [
        "41. 清晰的周计划能减少你每天需要做出的决定。",
        "42. 经常复习错题的学生不太容易重复犯同样的错误。",
        "43. 无论一个视频多么有用，它都不能替代独立练习。",
        "44. 新公告发布后，应再次核对官方时间安排。",
        "45. 最重要的不是资料数量，而是复习质量。",
    ]
    for item in refs: story.append(Paragraph(item, ANSWER_BODY))
    story += section("写作评分与参考框架", "不要背整篇范文，按自己的实际情况替换细节。")
    story.append(Paragraph("<b>第一段：</b>说明当前最弱项及原因。<br/><b>第二段：</b>写两个可执行动作，例如每天30个词、每周一次限时卷，并说明具体频率。<br/><b>第三段：</b>说明用错题统计、周清单或阶段分数检查进步。<br/><br/><b>评分：</b>内容完整且有具体行动 16-20分；结构基本完整 11-15分；只泛泛谈努力 6-10分；明显偏题或内容过少 0-5分。语言部分按语法、词汇、连贯性综合评分。", ANSWER_BODY))
    story.append(Paragraph("<b>分数诊断：</b>110分以上进入真题与速度训练；80-109分重点补语法和阅读证据定位；50-79分先完成词法、句法第一轮；50分以下减少题量，从高频词和基本句子结构开始。", ANSWER_BODY))
    return build_pdf("english-foundation-paper.pdf", "大学英语", "陕西专升本 · 英语基础配套卷", "英语系统课配套", "词汇语法｜完形｜阅读｜翻译｜写作", MINT, story)


def math_paper():
    story = []
    story += section("第一部分　单项选择题（50分）", "共10题，每题5分。每题只有一个正确选项。")
    questions = [
        ("函数 f(x)=ln(2-x) 的定义域是（　）。", "A. (-∞,2)　B. (-∞,2]　C. (2,+∞)　D. [2,+∞)"),
        ("极限 lim<sub>x→0</sub> sin(3x)/x 等于（　）。", "A. 0　B. 1　C. 3　D. 不存在"),
        ("当 x→0 时，与 1-cos x 等价的无穷小是（　）。", "A. x　B. x/2　C. x²　D. x²/2"),
        ("函数 f(x)=|x| 在 x=0 处（　）。", "A. 连续且可导　B. 连续但不可导　C. 不连续　D. 可导但不连续"),
        ("若 y=e<super>2x</super>，则 y' 等于（　）。", "A. e<super>2x</super>　B. 2e<super>2x</super>　C. xe<super>2x</super>　D. 2xe<super>2x</super>"),
        ("函数 f(x)=x³-3x 在 x=1 处的导数是（　）。", "A. -3　B. 0　C. 1　D. 3"),
        ("不定积分 ∫2x dx 等于（　）。", "A. x²+C　B. 2x²+C　C. x+C　D. 2+C"),
        ("定积分 ∫<sub>0</sub><super>1</super> x dx 等于（　）。", "A. 0　B. 1/2　C. 1　D. 2"),
        ("若 z=x²y+y³，则 ∂z/∂x 等于（　）。", "A. 2xy　B. x²+3y²　C. 2x+y　D. x²"),
        ("微分方程 y'=2x 的通解是（　）。", "A. y=2x+C　B. y=x²+C　C. y=x+C　D. y=2x²+C"),
    ]
    for i, (text, opts) in enumerate(questions, 1): story += q(i, text, opts)

    story += section("第二部分　填空题（25分）", "共5题，每题5分。写出最简结果。")
    fills = [
        "lim<sub>x→∞</sub> (3x²+1)/(x²-2) = ______。",
        "若 f(x)=x·ln x，则 f'(x)= ______。",
        "函数 f(x)=x²-4x+1 的极小值为 ______。",
        "∫(1/x) dx = ______。",
        "设 z=e<super>xy</super>，则 ∂z/∂y = ______。",
    ]
    for i, text in enumerate(fills, 11): story += q(i, text, lines=1)

    story += section("第三部分　计算题（50分）", "共5题，每题10分。必须写主要步骤。")
    calcs = [
        "计算极限：lim<sub>x→0</sub> (e<super>x</super>-1-x)/x²。",
        "求函数 y=(x²+1)e<super>x</super> 的导数。",
        "求函数 f(x)=x³-6x²+9x 的单调区间与极值。",
        "计算不定积分：∫x cos x dx。",
        "计算二重积分：∫∫<sub>D</sub>(x+y)dσ，其中 D={(x,y)|0≤x≤1, 0≤y≤2}。",
    ]
    for i, text in enumerate(calcs, 16): story += q(i, text, lines=6)

    story += section("第四部分　综合应用题（25分）", "写清建模、求导、判定和结论。")
    story += q(21, "某学习资料的每日复习收益可近似表示为 R(t)=40t-2t²（0≤t≤10），其中 t 为当天复习时长（小时），R 为相对收益。问：每天复习多少小时收益最大？最大收益是多少？结合结果说明为什么复习时间并非越长越好。", lines=12)

    story += answer_banner()
    story += section("客观题答案（75分）", "先看结果，再检查对应概念。")
    story.append(Paragraph("1 A　2 C　3 D　4 B　5 B　6 B　7 A　8 B　9 A　10 B<br/>11. 3　12. ln x+1　13. -3　14. ln|x|+C　15. xe<super>xy</super>", BODY))
    story += section("计算题参考步骤", "步骤分通常比最终答案更重要。")
    solutions = [
        "16. 利用 e<super>x</super>=1+x+x²/2+o(x²)，原式=(x²/2+o(x²))/x²，极限为 <b>1/2</b>。",
        "17. 乘积求导：y'=2xe<super>x</super>+(x²+1)e<super>x</super>=<b>(x²+2x+1)e<super>x</super></b>。",
        "18. f'(x)=3x²-12x+9=3(x-1)(x-3)。递增区间为 (-∞,1)、(3,+∞)，递减区间为 (1,3)。x=1 处极大值 f(1)=4；x=3 处极小值 f(3)=0。",
        "19. 分部积分，取 u=x，dv=cos x dx，则 du=dx，v=sin x。原积分=<b>x sin x+cos x+C</b>。",
        "20. ∫<sub>0</sub><super>1</super>∫<sub>0</sub><super>2</super>(x+y)dydx = ∫<sub>0</sub><super>1</super>(2x+2)dx = <b>3</b>。",
        "21. R'(t)=40-4t。令 R'(t)=0 得 t=10；区间内 R'(t)≥0，且 R(10)=400-200=<b>200</b>。在给定模型区间内10小时达到最大；现实中超长学习会带来疲劳与边际收益下降，模型的二次项正体现这一点。评分：列函数与定义域5分，求导5分，驻点与单调判定7分，最大值4分，解释4分。",
    ]
    for item in solutions: story.append(Paragraph(item, BODY))
    story += section("分数诊断", "错题不是按题号复习，而是按知识点复习。")
    story.append(Paragraph("<b>110分以上：</b>开始整卷限时与综合题。　<b>80-109分：</b>重点补极限、导数和积分步骤。　<b>50-79分：</b>回到函数、极限、基本求导公式。　<b>50分以下：</b>先完成一轮基础课，只做例题与同型基础题。", BODY))
    story += section("错因记录表", "每道错题只选一个主要原因。")
    table = Table([
        ["题号", "知识点", "主要错因", "下次重做日期", "是否做对"],
        ["", "", "概念 / 公式 / 计算 / 审题", "", "□"],
        ["", "", "概念 / 公式 / 计算 / 审题", "", "□"],
        ["", "", "概念 / 公式 / 计算 / 审题", "", "□"],
        ["", "", "概念 / 公式 / 计算 / 审题", "", "□"],
        ["", "", "概念 / 公式 / 计算 / 审题", "", "□"],
    ], colWidths=[18*mm, 42*mm, 58*mm, 34*mm, 18*mm], rowHeights=[9*mm]*6)
    table.setStyle(TableStyle([
        ("FONTNAME", (0,0), (-1,-1), "CN"), ("FONTNAME", (0,0), (-1,0), "CN-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 8), ("GRID", (0,0), (-1,-1), .5, LINE),
        ("BACKGROUND", (0,0), (-1,0), MINT), ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
    ]))
    story.append(table)
    return build_pdf("math-foundation-paper.pdf", "高等数学", "陕西专升本 · 高数基础配套卷", "高数系统课配套", "函数｜极限｜导数｜积分｜多元函数", YELLOW, story)


def chinese_paper():
    story = []
    story += section("第一部分　单项选择题（30分）", "共15题，每题2分。每题只有一个正确选项。")
    questions = [
        ("《诗经》在内容上通常分为（　）。", "A. 风、雅、颂　B. 赋、比、兴　C. 纪、表、书　D. 诗、词、曲"),
        ("我国第一部纪传体通史是（　）。", "A.《左传》　B.《战国策》　C.《史记》　D.《汉书》"),
        ("“路漫漫其修远兮，吾将上下而求索”的作者是（　）。", "A. 李白　B. 屈原　C. 杜甫　D. 陶渊明"),
        ("下列作家属于“唐宋八大家”的是（　）。", "A. 白居易　B. 柳宗元　C. 李商隐　D. 杜牧"),
        ("《故都的秋》的作者是（　）。", "A. 郁达夫　B. 朱自清　C. 鲁迅　D. 老舍"),
        ("《再别康桥》在体裁上属于（　）。", "A. 现代诗　B. 古体诗　C. 词　D. 散曲"),
        ("下列句子中没有语病的是（　）。", "A. 通过错题整理，使我提高了正确率。　B. 是否坚持复盘，是成绩提高的关键。　C. 学校公布了最新报名安排。　D. 我们要防止不再错过通知。"),
        ("“不刊之论”的正确含义是（　）。", "A. 不能刊登的言论　B. 不值得一看的言论　C. 正确得不能改动的言论　D. 没有发表的言论"),
        ("“月明星稀，乌鹊南飞”运用的主要表达方式是（　）。", "A. 议论　B. 说明　C. 描写　D. 应用"),
        ("以人物对话和行动推动情节的文学体裁主要是（　）。", "A. 戏剧　B. 散文　C. 说明文　D. 书信"),
        ("下列词语书写完全正确的是（　）。", "A. 再接再励　B. 一愁莫展　C. 按部就班　D. 穿流不息"),
        ("“桃李不言，下自成蹊”使用的修辞手法主要是（　）。", "A. 借代与比喻　B. 排比　C. 顶真　D. 反问"),
        ("《呐喊》是鲁迅的（　）。", "A. 散文集　B. 小说集　C. 诗集　D. 杂文集"),
        ("议论文的核心要素通常不包括（　）。", "A. 论点　B. 论据　C. 论证　D. 韵律"),
        ("“山重水复疑无路，柳暗花明又一村”所含哲理最接近（　）。", "A. 困境中可能孕育转机　B. 只应欣赏自然风景　C. 任何道路都很相似　D. 成功无需坚持"),
    ]
    for i, (text, opts) in enumerate(questions, 1): story += q(i, text, opts)

    story += section("第二部分　填空题（20分）", "共10题，每题2分。请写出准确内容。")
    fills = [
        "《诗经》的基本表现手法常概括为赋、比、______。",
        "司马迁称《史记》的写作追求为“究天人之际，通古今之变，______”。",
        "“采菊东篱下，______”出自陶渊明《饮酒》。",
        "“安能摧眉折腰事权贵，______”出自李白《梦游天姥吟留别》。",
        "杜甫被后人尊称为“______”。",
        "苏轼《水调歌头》中“但愿人长久”的下句是“______”。",
        "《红楼梦》的作者通常署为______。",
        "《雷雨》的作者是______。",
        "用简明文字说明事物特征、原理或方法的文体称为______。",
        "文章中用来证明论点的材料和依据称为______。",
    ]
    for i, text in enumerate(fills, 16): story += q(i, text, lines=1)

    story += section("第三部分　词语解释（20分）", "共5题，每题4分。解释加点词在句中的意思。")
    terms = [
        "学而时习之，不亦<b>说</b>乎。",
        "河内<b>凶</b>，则移其民于河东。",
        "此所谓战胜于朝廷。<b>所谓</b>：______。",
        "先帝不以臣<b>卑鄙</b>。",
        "愿伯具言臣之不敢<b>倍</b>德也。",
    ]
    for i, text in enumerate(terms, 26): story += q(i, text, lines=2)

    story += section("第四部分　判断题（10分）", "共10题，每题1分。正确写“√”，错误写“×”。")
    judgments = [
        "《左传》是一部编年体历史著作。",
        "王维是宋代山水田园诗人。",
        "“赋”可以指铺陈直叙的表现手法。",
        "《骆驼祥子》的作者是老舍。",
        "说明文只能使用下定义一种说明方法。",
        "排比能够增强语言节奏与表达气势。",
        "“我好像看见了远方的灯光”一定是比喻句。",
        "议论文中的事实材料可以充当论据。",
        "应用文写作可以忽略对象和格式。",
        "阅读题作答应尽量回到原文寻找依据。",
    ]
    for i, text in enumerate(judgments, 31): story += q(i, text, "　□ √　　□ ×")

    story += section("第五部分　阅读简析（30分）", "共2题，每题15分。按“观点 + 证据 + 作用”作答。")
    story.append(Paragraph("<b>材料一</b><br/>晏子为齐相，出，其御之妻从门间而窥其夫。其夫为相御，拥大盖，策驷马，意气扬扬，甚自得也。既而归，其妻请去。夫问其故。妻曰：“晏子长不满六尺，身相齐国，名显诸侯。今者妾观其出，志念深矣，常有以自下者。今子长八尺，乃为人仆御，然子之意自以为足，妾是以求去也。”其后夫自抑损。晏子怪而问之，御以实对。晏子荐以为大夫。", BODY))
    story += q(41, "概括车夫妻子“请去”的原因，并分析她与车夫形象的对比作用。", lines=7)
    story.append(Paragraph("<b>材料二</b><br/>真正有效的复习，往往没有想象中热闹。它可能只是合上书，拿出一张白纸，写出刚学过的三个概念；也可能是把一道错题隔两天重新做一遍。刷到新的课程会带来短暂的兴奋，而回到旧错误常常令人不舒服。但正是这种不舒服，让人看见“我以为会”和“我真的会”之间的距离。学习计划因此不应只记录看了多少小时，更要记录能否独立完成、错误是否减少、同类题是否再次做对。", BODY))
    story += q(42, "概括材料的中心观点，并说明作者使用对比手法产生了怎样的表达效果。", lines=7)

    story += section("第六部分　作文（40分）", "不少于600字。立意明确，结构完整，语言通顺。")
    story += q(43, "阅读下面材料，自选角度，自拟题目，写一篇文章。<br/><br/>有人把备考比作一场长跑：重要的不只是某一天跑得多快，而是能否看清方向、保持节奏，并在偏离时及时调整。也有人说，真正的坚持不是从不间断，而是每次中断后都能重新开始。", lines=14)

    story += answer_banner()
    story += section("客观题答案（60分）", "文学常识错题要回到作者、作品、体裁三列卡片。")
    story.append(Paragraph("1 A　2 C　3 B　4 B　5 A　6 A　7 C　8 C　9 C　10 A<br/>11 C　12 A　13 B　14 D　15 A<br/>16 兴　17 成一家之言　18 悠然见南山　19 使我不得开心颜　20 诗圣<br/>21 千里共婵娟　22 曹雪芹　23 曹禺　24 说明文　25 论据<br/>31 √　32 ×　33 √　34 √　35 ×　36 √　37 ×　38 √　39 ×　40 √", ANSWER_BODY))
    story += section("词语解释参考", "结合语境作答，古今异义词要写古义。")
    for item in [
        "26. 说：同“悦”，愉快。", "27. 凶：谷物收成不好，荒年。", "28. 所谓：所说的。",
        "29. 卑鄙：社会地位低微、见识浅陋。", "30. 倍：同“背”，背弃。",
    ]: story.append(Paragraph(item, ANSWER_BODY))
    story += section("阅读简析参考", "参考答案按得分点拆开，表述不必逐字一致。")
    story.append(Paragraph("<b>41.</b> 妻子认为晏子身居高位却谦逊深沉，而丈夫只是车夫却扬扬自得，因此感到丈夫缺乏自知并请求离开。对比突出了晏子的谦逊与车夫最初的浅薄自满，也表现妻子的见识；后文车夫改过并获荐举，使人物变化更有说服力。评分：原因6分，对比双方4分，作用5分。", ANSWER_BODY))
    story.append(Paragraph("<b>42.</b> 中心观点：有效复习要通过主动回忆和重做错题检验真实掌握，计划应记录学习效果而不只记录时长。材料把“刷新课的短暂兴奋”与“回看旧错的不舒服”对比，把“以为会”与“真的会”对比，具体揭示表面学习感与真实掌握的差异，使观点鲜明、有说服力。评分：观点7分，对比内容4分，表达作用4分。", ANSWER_BODY))
    story += section("作文评分建议", "先看是否完成任务，再看思想、结构和语言。")
    story.append(Paragraph("<b>一类（34-40分）：</b>紧扣方向、节奏、调整或重新开始展开，有具体材料，结构清楚，语言有表现力。<br/><b>二类（27-33分）：</b>立意正确，内容较充实，结构完整，语言通顺。<br/><b>三类（20-26分）：</b>基本切题，但内容单薄或结构松散。<br/><b>四类（0-19分）：</b>偏题、篇幅严重不足或语句大量不通。<br/><br/>可用结构：开头解释“坚持不是机械重复” - 中间用个人备考或生活事例说明调整的重要 - 再讨论中断后重启 - 结尾回扣长期目标。", ANSWER_BODY))
    story += section("分数诊断", "语文提分依赖“可重复的得分点”，不是只靠语感。")
    story.append(Paragraph("<b>110分以上：</b>保持篇目复习，强化阅读与作文限时。　<b>80-109分：</b>文学常识与古文词义要做成卡片反复记。　<b>50-79分：</b>先完成重点篇目第一轮，学习简析题答题结构。　<b>50分以下：</b>从作者作品对应、名句默写和基础语病开始。", ANSWER_BODY))
    return build_pdf("chinese-foundation-paper.pdf", "大学语文", "陕西专升本 · 语文基础配套卷", "大学语文系统课配套", "文学常识｜古文词义｜阅读简析｜作文", CORAL, story)


if __name__ == "__main__":
    paths = [english_paper(), math_paper(), chinese_paper()]
    for path in paths:
        print(path)
