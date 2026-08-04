from reportlab.platypus import Paragraph, PageBreak

from generate_papers import (
    ANSWER_BODY, BODY, CORAL, MINT, QUESTION, YELLOW,
    answer_banner, build_pdf, q, section,
)


def english_prediction(set_no, accent, variant):
    grammar_a = [
        ("The plan will work well if every member _____ responsible for a clear task.", "A. is  B. was  C. will be  D. has been"),
        ("Hardly _____ the classroom when the bell rang.", "A. we entered  B. had we entered  C. we had entered  D. did we enter"),
        ("The report, together with its supporting files, _____ before Friday.", "A. submit  B. are submitted  C. must be submitted  D. have submitted"),
        ("Students are advised to focus _____ accuracy before speed.", "A. at  B. on  C. for  D. with"),
        ("The more carefully you review, the _____ mistakes you will repeat.", "A. few  B. fewer  C. fewest  D. less"),
        ("It is the first time that she _____ a full paper within the time limit.", "A. completes  B. completed  C. has completed  D. had completed"),
        ("_____ by the teacher's explanation, he rewrote the solution.", "A. Encouraging  B. Encouraged  C. Encourage  D. To encouraging"),
        ("No one knows _____ the 2027 notice will be published.", "A. what  B. which  C. when  D. whose"),
        ("The word 'allocate' is closest in meaning to _____.", "A. divide  B. refuse  C. forget  D. repeat"),
        ("You had better _____ your weak chapters before taking another paper.", "A. revising  B. revised  C. revise  D. to revise"),
    ]
    grammar_b = [
        ("By next March, we _____ three rounds of systematic review.", "A. finish  B. finished  C. will have finished  D. are finishing"),
        ("Not until the answer was checked _____ the hidden condition.", "A. she noticed  B. did she notice  C. she had noticed  D. does she notice"),
        ("The book _____ on the desk contains my error records.", "A. lies  B. lying  C. lay  D. lain"),
        ("Whether you improve depends largely _____ the quality of review.", "A. in  B. to  C. on  D. from"),
        ("This exercise is _____ difficult than the previous one.", "A. little  B. least  C. less  D. few"),
        ("If I _____ the formula earlier, I would not have lost those points.", "A. remember  B. remembered  C. had remembered  D. have remembered"),
        ("The teacher asked us _____ the evidence in the passage.", "A. underline  B. underlined  C. to underline  D. underlining"),
        ("There is no doubt _____ regular practice improves speed.", "A. that  B. what  C. whether  D. where"),
        ("The word 'consistent' is closest in meaning to _____.", "A. regular  B. accidental  C. careless  D. temporary"),
        ("Neither the notes nor the video _____ independent practice.", "A. replace  B. replaces  C. replacing  D. have replaced"),
    ]
    grammar = grammar_a if variant == "A" else grammar_b
    story = []
    story += section("第一部分  词汇与语法（60分）", "共60题，每题1分；前10题为核心题，后50题按相同规则做变式训练。")
    for i, (stem, opts) in enumerate(grammar, 1): story += q(i, stem, opts)
    for i in range(11, 61):
        source = ((i - 11) % 10) + 1
        story += q(i, f"参照第 {source} 题的考点，替换主语、时态或关键词后重新作答，并在题旁写出规则。", "A. 原结构  B. 变式结构  C. 两者均可  D. 信息不足")
    story += section("第二部分  阅读理解（50分）", "共4篇，每篇5题，每题2.5分；主旨、细节、推断和词义题都要回原文定位。")
    reading_sets = [
        ("Passage One", "A college study group tested two ways of learning formulas. Group One reread the notes three times. Group Two closed the notes after each reading and wrote down what they remembered. Both groups spent the same total time. One week later, Group Two remembered more and made fewer application errors. The researchers concluded that retrieval with timely correction produced stronger long-term memory.", [
            ("What did Group Two do after reading?", "A. Recalled without notes  B. Watched longer videos  C. Changed books  D. Stopped studying", "A"),
            ("Which group performed better one week later?", "A. Group One  B. Group Two  C. Both equally  D. Neither group", "B"),
            ("The study controlled which factor?", "A. Teachers  B. Total study time  C. Textbook price  D. Classroom size", "B"),
            ("What strengthens long-term memory according to the passage?", "A. Copying  B. Retrieval with correction  C. Faster playback  D. More materials", "B"),
            ("The word 'retrieval' is closest to _____.", "A. active recall  B. decoration  C. prediction  D. translation", "A"),
        ]),
        ("Passage Two", "Official exam notices define who may register, which subjects are tested and when each action must be completed. A screenshot shared in a group chat may be old or incomplete. Students should save the original link, check the publication date and confirm whether the notice applies to them. They should also follow messages from their own college when the college organizes a professional-course assessment.", [
            ("What do official notices define?", "A. Only scores  B. Eligibility, subjects and deadlines  C. Video courses  D. Dormitory rules", "B"),
            ("Why can a screenshot be risky?", "A. It may be old or incomplete  B. It is always false  C. It uses too much data  D. It has no pictures", "A"),
            ("What should students save?", "A. Only a picture  B. The original link  C. A teacher's nickname  D. An advertisement", "B"),
            ("When should college messages also be checked?", "A. When the college organizes an assessment  B. Only after admission  C. Never  D. After graduation", "A"),
            ("The passage mainly gives advice about _____.", "A. choosing a phone  B. verifying exam information  C. learning vocabulary  D. writing essays", "B"),
        ]),
        ("Passage Three", "A weekly plan is useful only when its tasks are specific. 'Study English' is too vague, while 'finish two reading passages and mark every evidence sentence' can be checked. A realistic plan also leaves time for correction. If the same mistake returns, students should revisit the relevant concept instead of immediately starting another paper.", [
            ("Which task is specific?", "A. Study harder  B. Learn English  C. Finish two readings and mark evidence  D. Improve soon", "C"),
            ("What should a realistic plan include?", "A. Correction time  B. More apps  C. No breaks  D. Daily mock exams", "A"),
            ("What should students do when a mistake returns?", "A. Ignore it  B. Revisit the concept  C. Buy a new book  D. Guess again", "B"),
            ("The word 'vague' is closest to _____.", "A. unclear  B. difficult  C. correct  D. complete", "A"),
            ("What is the main idea?", "A. Plans should be specific and include correction  B. Longer plans are better  C. Every day needs a full paper  D. Mistakes should be hidden", "A"),
        ]),
        ("Passage Four", "Many learners judge progress by the number of videos they finish. This can be misleading because watching creates familiarity but does not guarantee that knowledge can be used. A better check is to close the lesson, explain the key point in one's own words and solve a new question. If the explanation is incomplete, the learner knows exactly which part to review.", [
            ("Why can video count be misleading?", "A. Videos are short  B. Familiarity is not mastery  C. Questions are easy  D. Teachers speak slowly", "B"),
            ("What is a better check?", "A. Replay immediately  B. Explain and solve a new question  C. Count notes  D. Change courses", "B"),
            ("What does an incomplete explanation reveal?", "A. The exact weak part  B. The exam date  C. The final score  D. The teacher's plan", "A"),
            ("The word 'guarantee' is closest to _____.", "A. ensure  B. reduce  C. describe  D. avoid", "A"),
            ("Which title best fits the passage?", "A. Why Video Count Is Not Mastery  B. How to Buy Courses  C. The Longest Lesson  D. Watching at Double Speed", "A"),
        ]),
    ]
    reading_answers = []
    number = 61
    for title, passage, questions in reading_sets:
        story.append(Paragraph(f"<b>{title}</b><br/>{passage}", BODY))
        for stem, opts, answer in questions:
            story += q(number, stem, opts)
            reading_answers.append(f"{number} {answer}")
            number += 1
    story.append(PageBreak())
    story += section("第三部分  英译汉（20分）", "将下列英语短文译成汉语；译文应准确、通顺。")
    translation = "A steady study routine is more effective than staying up late occasionally. Students need to record why each mistake occurs and return to the relevant concept when the same error appears again. After a new official notice is published, the examination scope and important deadlines should also be checked carefully."
    story += q(81, translation, lines=8)
    story.append(PageBreak())
    story += section("第四部分  写作（20分）", "写120-180词；建议30分钟完成并留5分钟自查。")
    story += q(82, "Write an English composition on 'How I Will Improve My Weakest Subject'. Include the weakness, two concrete actions, and a weekly check.", lines=10)
    story += answer_banner()
    story += section("客观题参考与评分", "本卷结构按陕西现行考试说明整理；变式题用于训练方法。")
    key = "1 A  2 B  3 C  4 B  5 B  6 C  7 B  8 C  9 A  10 C" if variant == "A" else "1 C  2 B  3 B  4 C  5 C  6 C  7 C  8 A  9 A  10 B"
    story.append(Paragraph(f"<b>1-10：</b>{key}<br/><b>11-60：</b>先写依据再核对变式；能解释规则才计分。<br/><b>61-80：</b>{'  '.join(reading_answers)}", ANSWER_BODY))
    story += section("翻译参考与写作量表", "表达可不同，优先保证意思准确、结构完整。")
    story.append(Paragraph("<b>81 参考：</b>稳定的学习节奏比偶尔熬夜更有效。学生需要记录每次错误发生的原因；同类错误再次出现时，要回到相关概念。新官方公告发布后，还应认真核对考试范围和重要截止日期。<br/><br/><b>82 写作：</b>必须包含弱项、两个带频率的行动和每周检查方式；泛泛写“努力学习”不得高分。", ANSWER_BODY))
    return build_pdf(f"2027-english-prediction-{set_no}.pdf", "大学英语", f"陕西专升本 · 2027 英语原创预测卷 {set_no}", "理工类冲刺套卷", "词汇语法60｜阅读50｜英译汉20｜写作20", accent, story)


def math_prediction(set_no, accent, variant):
    questions_a = [
        ("函数 f(x)=ln(3-x)+1/(x-1) 的定义域是（ ）。", "A. (-∞,1)∪(1,3)  B. (-∞,3)  C. (1,3)  D. (-∞,1)"),
        ("lim(x→0) [sin(5x)/x] 等于（ ）。", "A. 0  B. 1  C. 5  D. 不存在"),
        ("若 f'(x)>0 在区间 I 上恒成立，则 f 在 I 上（ ）。", "A. 单调增加  B. 单调减少  C. 为常数  D. 不连续"),
        ("∫2x e^(x²) dx 等于（ ）。", "A. e^(x²)+C  B. 2e^x+C  C. x²e^x+C  D. ln x+C"),
        ("向量 a 与 b 垂直的充要条件是（ ）。", "A. a×b=0  B. a·b=0  C. |a|=|b|  D. a=b"),
        ("二元函数 z=x²+y² 在 (1,-1) 处的全微分是（ ）。", "A. dx-dy  B. 2dx-2dy  C. 2dx+2dy  D. dx+dy"),
        ("级数 Σ(1/2)^n（n从1开始）的和为（ ）。", "A. 1/2  B. 1  C. 2  D. 发散"),
        ("微分方程 y'+y=0 的通解是（ ）。", "A. Ce^x  B. Ce^(-x)  C. x+C  D. C/x"),
    ]
    questions_b = [
        ("函数 f(x)=sqrt(x+2)/(x-2) 的定义域是（ ）。", "A. [-2,2)∪(2,+∞)  B. (-2,2)  C. [-2,+∞)  D. (2,+∞)"),
        ("lim(x→∞) (2x²+1)/(x²-3) 等于（ ）。", "A. 0  B. 1  C. 2  D. ∞"),
        ("若 f''(x)<0，则函数图形在该区间（ ）。", "A. 凹  B. 凸  C. 递增  D. 递减"),
        ("∫cos x dx 等于（ ）。", "A. -sin x+C  B. sin x+C  C. cos x+C  D. tan x+C"),
        ("平面 2x-y+2z=3 的法向量可取（ ）。", "A. (2,-1,2)  B. (1,1,1)  C. (2,1,2)  D. (3,0,0)"),
        ("z=xy 在 (1,2) 处的偏导 z_x 等于（ ）。", "A. 1  B. 2  C. x  D. y²"),
        ("幂级数 Σx^n 的收敛半径为（ ）。", "A. 0  B. 1  C. 2  D. ∞"),
        ("y'=2x 的通解是（ ）。", "A. y=x²+C  B. y=2x+C  C. y=e^(2x)  D. y=x+C"),
    ]
    qs = questions_a if variant == "A" else questions_b
    story = []
    story += section("第一部分  单项选择题（40分）", "共8题，每题5分。")
    for i, (stem, opts) in enumerate(qs, 1): story += q(i, stem, opts)
    story += section("第二部分  填空题（40分）", "共8题，每题5分；保留必要步骤。")
    fills = ["求 d/dx[x²ln x]。", "求 lim(x→0)(e^x-1)/x。", "求 ∫_0^1 3x² dx。", "求曲线 y=x³ 在 x=1 处的切线斜率。", "写出过点(1,0,0)且法向量为(1,2,1)的平面方程。", "求 z=x²y 在(1,2)处的 z_y。", "判断级数 Σ1/n² 的敛散性。", "解初值问题 y'=y, y(0)=2。"]
    for i, stem in enumerate(fills, 9): story += q(i, stem, lines=2)
    story += section("第三部分  计算题（50分）", "共5题，每题10分；写出关键变形。")
    calcs = ["用洛必达法则计算 lim(x→0)(ln(1+x)-x)/x²。", "求函数 f(x)=x³-3x²+2 的单调区间与极值。", "计算 ∫x ln x dx。", "计算二重积分 ∬_D (x+y)dA，其中 D=[0,1]×[0,2]。", "求微分方程 y'-2y=e^x 的通解。"]
    for i, stem in enumerate(calcs, 17): story += q(i, stem, lines=5)
    story += section("第四部分  综合应用题（20分）", "共2题，每题10分；建模、公式、结果均计分。")
    story += q(22, "用导数讨论矩形周长固定为20时，面积的最大值及对应边长。", lines=6)
    story += q(23, "求由 y=x 与 y=x² 围成的平面图形面积。", lines=6)
    story += answer_banner()
    story += section("答案与关键步骤", "先圈知识点，再订正步骤。")
    key = "1 A  2 C  3 A  4 A  5 B  6 B  7 B  8 B" if variant == "A" else "1 A  2 C  3 A  4 B  5 A  6 B  7 B  8 A"
    story.append(Paragraph(f"<b>选择：</b>{key}<br/><b>填空：</b>9. 2xlnx+x；10. 1；11. 1；12. 3；13. x+2y+z-1=0；14. 1；15. 收敛；16. y=2e^x。<br/><b>计算：</b>17. -1/2；18. 递增(-∞,0)、(2,+∞)，递减(0,2)，极大值2，极小值-2；19. (x²/2)lnx-x²/4+C；20. 3；21. y=Ce^(2x)-e^x。<br/><b>应用：</b>22. 正方形边长5，最大面积25；23. ∫_0^1(x-x²)dx=1/6。", ANSWER_BODY))
    story += section("预测卷使用说明", "本卷只用于查漏补缺，不代表官方命题。")
    story.append(Paragraph("建议按150分钟完整计时。低于90分：回到函数极限、导数、积分三章；90-119分：补空间解析、多元、级数和方程；120分以上：继续练综合题表达与速度。2027考试说明发布后，若范围变化，应停止使用不在范围内的题。", ANSWER_BODY))
    return build_pdf(f"2027-math-prediction-{set_no}.pdf", "高等数学", f"陕西专升本 · 2027 高数原创预测卷 {set_no}", "理工类冲刺套卷", "极限｜微积分｜空间｜多元｜级数｜方程", accent, story)


if __name__ == "__main__":
    paths = [
        english_prediction("A", MINT, "A"),
        english_prediction("B", CORAL, "B"),
        math_prediction("A", YELLOW, "A"),
        math_prediction("B", MINT, "B"),
    ]
    for path in paths: print(path)
