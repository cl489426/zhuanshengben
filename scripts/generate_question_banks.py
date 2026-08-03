from reportlab.platypus import PageBreak, Paragraph

from generate_papers import (
    ANSWER_BODY, BODY, CORAL, MINT, YELLOW,
    answer_banner, build_pdf, q, section,
)


def unit_story(title, instruction, questions, start_number):
    story = section(title, instruction)
    answers = []
    for offset, item in enumerate(questions):
        number = start_number + offset
        stem, options, answer = item
        story += q(number, stem, options, lines=0 if options else 2)
        answers.append((number, answer))
    return story, answers, start_number + len(questions)


def english_bank():
    units = [
        ("单元一  词汇与词性", "先判断空格需要的词性，再比较词义与固定搭配。", [
            ("The new schedule is more _____ than the old one.", "A. efficiency  B. efficient  C. efficiently  D. efficiencies", "B。be动词后作表语，需要形容词 efficient。"),
            ("Students should take _____ for their own learning.", "A. responsible  B. responsibly  C. responsibility  D. responsibilities", "C。take responsibility for 是固定搭配。"),
            ("The teacher gave us two useful _____ for reviewing vocabulary.", "A. suggest  B. suggestion  C. suggestions  D. suggestive", "C。two 后用可数名词复数。"),
            ("Please read the question _____ before choosing an answer.", "A. care  B. careful  C. carefully  D. carefulness", "C。修饰动词 read，用副词 carefully。"),
            ("There is _____ university near the railway station.", "A. a  B. an  C. the  D. /", "A。university 以辅音音素开头。"),
            ("The word closest in meaning to 'essential' is _____.", "A. optional  B. necessary  C. ordinary  D. temporary", "B。essential 表示“必要的”。"),
        ]),
        ("单元二  句子骨架", "先圈谓语，再找主语、宾语、表语和补语。", [
            ("Neither the teacher nor the students _____ ready for the test.", "A. is  B. are  C. was  D. be", "B。就近一致，students 为复数。"),
            ("The news _____ surprising to everyone in the class.", "A. are  B. were  C. is  D. have", "C。news 作不可数名词，谓语用单数。"),
            ("In the sentence 'The plan made me confident', confident is _____.", "A. subject  B. object  C. object complement  D. adverbial", "C。confident 补充说明宾语 me。"),
            ("There _____ a notebook and two pens on the desk.", "A. is  B. are  C. have  D. be", "A。there be 结构遵循就近一致，最近主语为 a notebook。"),
            ("The manager asked us _____ the report before Friday.", "A. finish  B. finished  C. to finish  D. finishing", "C。ask sb. to do sth.。"),
            ("Choose the complete sentence.", "A. Because the task was difficult.  B. When we arrived.  C. The team finished the task on time.  D. After the class.", "C。C含完整主谓结构，能独立成句。"),
        ]),
        ("单元三  时态与语态", "画时间线，先定时间，再定主动或被动。", [
            ("By the end of last month, she _____ three practice papers.", "A. finishes  B. finished  C. had finished  D. has finished", "C。过去某时之前完成，用过去完成时。"),
            ("Look! The students _____ a mock examination.", "A. take  B. took  C. are taking  D. have taken", "C。Look 提示现在进行时。"),
            ("The official notice _____ on the website when it is ready.", "A. publishes  B. will publish  C. will be published  D. published", "C。notice 与 publish 为被动关系。"),
            ("I _____ this course for two weeks.", "A. study  B. studied  C. have studied  D. am studying yesterday", "C。for two weeks 常与现在完成时连用。"),
            ("If it _____ tomorrow, we will study in the library.", "A. rains  B. will rain  C. rained  D. raining", "A。条件状语从句用一般现在时表将来。"),
            ("When I entered the room, the teacher _____ the key points.", "A. explains  B. was explaining  C. has explained  D. will explain", "B。进入时动作正在进行。"),
        ]),
        ("单元四  非谓语动词", "先找句中谓语，再判断非谓语与逻辑主语的关系。", [
            ("_____ enough time, we can finish the review plan.", "A. Give  B. Given  C. Giving  D. To giving", "B。given 表示“如果给予”，与主语为被动关系。"),
            ("The student _____ by the teacher improved quickly.", "A. encouraging  B. encouraged  C. encourage  D. to encourage", "B。student 与 encourage 为被动关系。"),
            ("I look forward to _____ from you soon.", "A. hear  B. heard  C. hearing  D. be heard", "C。to 为介词，后接动名词。"),
            ("The best way _____ speed is to practise under a time limit.", "A. improve  B. improving  C. improved  D. to improve", "D。不定式作后置定语说明 way。"),
            ("_____ the notes, she started the practice paper.", "A. Reviewing  B. Reviewed  C. Having reviewed  D. Review", "C。复习先于开始，且为主动关系。"),
            ("It is no use _____ answers without understanding them.", "A. copy  B. copying  C. copied  D. to copied", "B。It is no use doing sth.。"),
        ]),
        ("单元五  从句与特殊句", "判断从句成分，再选连接词；倒装题先还原正常语序。", [
            ("The reason _____ he improved was that he reviewed every error.", "A. which  B. why  C. what  D. whose", "B。why 引导定语从句修饰 reason。"),
            ("There is no doubt _____ regular practice is useful.", "A. that  B. what  C. whether  D. where", "A。that 引导同位语从句。"),
            ("Only after checking the answer _____ his mistake.", "A. he found  B. did he find  C. he had found  D. found he", "B。only+状语置于句首，主句部分倒装。"),
            ("It was yesterday _____ the new plan was announced.", "A. when  B. where  C. that  D. which", "C。强调句结构 It was...that...。"),
            ("_____ difficult the question is, do not give up immediately.", "A. Whatever  B. However  C. Whenever  D. Wherever", "B。however + 形容词 + 主谓。"),
            ("The book _____ you recommended is very useful.", "A. who  B. whom  C. that  D. whose", "C。先行词为物，关系词在从句中作宾语。"),
        ]),
        ("单元六  完形填空", "结合语法、搭配与上下文逻辑选择。", [
            ("A good plan should be simple enough to _____.", "A. repeat  B. refuse  C. disappear  D. waste", "A。计划应便于重复执行。"),
            ("First, choose one weak point. _____, prepare ten questions about it.", "A. However  B. Next  C. Unless  D. Although", "B。表示步骤顺序。"),
            ("Do not check the answer _____ you have finished the question.", "A. because  B. until  C. while  D. since", "B。not...until...表示“直到……才”。"),
            ("If the same error appears again, you should return _____ the concept.", "A. at  B. by  C. to  D. with", "C。return to 表示“回到”。"),
            ("Review is useful _____ it changes your next action.", "A. when  B. but  C. or  D. so", "A。当复盘能改变下一步行动时才有用。"),
            ("Small actions repeated every day can lead to a _____ improvement.", "A. steadily  B. steadiness  C. steady  D. steadied", "C。修饰名词 improvement 需要形容词。"),
        ]),
        ("单元七  阅读理解", "每题在原文中画出证据句。", [
            ("阅读短文：A study compared rereading with retrieval practice. One group read the same notes three times. The other group closed the notes and wrote down what they remembered after each reading. Both groups spent the same amount of time. A week later, the retrieval group remembered more. The researchers added that students should check their answers after retrieval, because practising a wrong answer can strengthen the mistake. 文章主要比较什么？", "A. Two study methods  B. Two schools  C. Two examinations  D. Two teachers", "A。全文比较重复阅读和检索练习。"),
            ("Which group remembered more after one week?", "A. The rereading group  B. The retrieval group  C. Both equally  D. The article does not say", "B。原文明确说 retrieval group remembered more。"),
            ("What did the retrieval group do after reading?", "A. Watched a video  B. Took a break  C. Wrote what they remembered  D. Changed textbooks", "C。对应原文 wrote down what they remembered。"),
            ("Why should students check answers after retrieval?", "A. To save paper  B. To avoid strengthening mistakes  C. To read faster  D. To reduce study time", "B。原文最后说明练错会强化错误。"),
            ("The word 'strengthen' is closest in meaning to _____.", "A. make stronger  B. remove  C. hide  D. question", "A。strengthen 表示“加强”。"),
            ("Which statement is supported by the passage?", "A. More time always means better results.  B. Rereading is the only effective method.  C. Active recall with correction supports memory.  D. Students should never read notes.", "C。文章支持主动回忆并及时纠错。"),
        ]),
        ("单元八  翻译与写作", "先找主干，再处理修饰语；写作必须包含具体行动。", [
            ("翻译：稳定的学习节奏比偶尔熬夜更有效。", None, "A steady study routine is more effective than staying up late occasionally."),
            ("翻译：只有独立做题，你才能发现真正的薄弱点。", None, "Only by answering questions independently can you find your real weaknesses."),
            ("翻译：新公告发布后，我们应该再次核对考试范围。", None, "After the new notice is published, we should check the examination scope again."),
            ("翻译：他不仅记录错题，而且分析了出错的原因。", None, "He not only recorded the wrong answers but also analysed why the mistakes occurred."),
            ("写出一句包含定语从句的英语学习建议。", None, "示例：Choose a method that you can repeat every day."),
            ("写作：以 My Weekly Study Plan 为题写120-180词，包含英语、高数安排和周末检查方式。", None, "评分要点：两科安排具体；至少写出频率或时长；说明周末如何测验与复盘；结构清晰、语法基本正确。"),
        ]),
    ]

    story, answer_groups, number = [], [], 1
    for index, (title, instruction, questions) in enumerate(units):
        if index: story.append(PageBreak())
        part, answers, number = unit_story(title, instruction, questions, number)
        story += part
        answer_groups.append((title, answers))
    story += answer_banner()
    for index, (title, answers) in enumerate(answer_groups):
        if index and index % 3 == 0: story.append(PageBreak())
        story += section(title + "答案", "先订正，再用自己的话复述规则。")
        story.append(Paragraph("<br/>".join(f"<b>{number}.</b> {answer}" for number, answer in answers), ANSWER_BODY))
    return build_pdf("english-course-question-bank.pdf", "大学英语", "陕西专升本 · 英语课程配套电子题库", "8单元 · 48题", "词汇｜句法｜时态｜非谓语｜从句｜题型", MINT, story)


def math_bank():
    units = [
        ("单元一  函数、极限与连续", "写出使用的极限公式或等价无穷小。", [
            ("求函数 f(x)=ln(2-x)+1/(x+1) 的定义域。", None, "(-∞,-1)∪(-1,2)。"),
            ("计算 lim(x→0) sin(4x)/x。", None, "4。利用 sin u/u→1。"),
            ("计算 lim(x→∞) (3x²-x+1)/(x²+2)。", None, "3。分子分母同除以 x²。"),
            ("判断 f(x)=1/(x-2) 在 x=2 处的间断点类型。", None, "无穷间断点。"),
            ("若 f(x)=x²+ax 在 x=1 处取得极值，求 a。", None, "a=-2，因为 f'(1)=2+a=0。"),
            ("计算 lim(x→0) (e^(2x)-1)/x。", None, "2。利用 (e^u-1)/u→1。"),
        ]),
        ("单元二  一元函数微分学", "求导时写清复合函数层次。", [
            ("求 y=x³-2x+1 的导数。", None, "y'=3x²-2。"),
            ("求 y=ln(x²+1) 的导数。", None, "y'=2x/(x²+1)。"),
            ("求 y=x²e^x 的导数。", None, "y'=e^x(x²+2x)。"),
            ("已知 x²+y²=4，求 dy/dx。", None, "y'=-x/y。"),
            ("求 y=sin(3x) 的二阶导数。", None, "y''=-9sin(3x)。"),
            ("曲线 y=x³ 在点(1,1)处的切线方程。", None, "y-1=3(x-1)，即 y=3x-2。"),
        ]),
        ("单元三  导数的应用", "先求临界点，再列表判断符号。", [
            ("求 f(x)=x²-4x+1 的单调区间。", None, "(-∞,2)递减，(2,+∞)递增。"),
            ("求 f(x)=x³-3x 的极值。", None, "x=-1处极大值2；x=1处极小值-2。"),
            ("判断 f(x)=ln x-x 在(0,+∞)上的最大值。", None, "x=1处最大值-1。"),
            ("用洛必达法则计算 lim(x→0)(1-cos x)/x²。", None, "1/2。"),
            ("求曲线 y=x³-3x² 的凹凸分界点。", None, "f''=6x-6，拐点为(1,-2)。"),
            ("周长为20的矩形，何时面积最大？", None, "正方形边长5时最大，面积25。"),
        ]),
        ("单元四  一元积分与应用", "先判断直接积分、换元还是分部积分。", [
            ("计算 ∫(3x²-2x+1)dx。", None, "x³-x²+x+C。"),
            ("计算 ∫2x cos(x²)dx。", None, "sin(x²)+C。"),
            ("计算 ∫x e^x dx。", None, "e^x(x-1)+C。"),
            ("计算 ∫_0^1 (2x+1)dx。", None, "2。"),
            ("求由 y=x 与 y=x² 围成图形的面积。", None, "∫_0^1(x-x²)dx=1/6。"),
            ("求 y=x²、x=0、x=1及x轴围成图形绕x轴旋转所得体积。", None, "V=π∫_0^1 x^4 dx=π/5。"),
        ]),
        ("单元五  向量与空间解析几何", "位置关系优先使用方向向量与法向量。", [
            ("已知 a=(1,2,-1)，b=(2,0,3)，求 a·b。", None, "-1。"),
            ("求向量 a=(3,4,0) 的模。", None, "5。"),
            ("写出过点(1,0,2)、法向量为(2,-1,1)的平面方程。", None, "2x-y+z-4=0。"),
            ("判断平面 x+y+z=1 与 2x+2y+2z=3 的位置关系。", None, "平行且不重合。"),
            ("求点(1,2,3)到平面 x+2y+2z-4=0 的距离。", None, "7/3。"),
            ("直线方向向量(1,0,1)与平面法向量(1,2,-1)有何关系？", None, "点积为0，直线与平面平行或位于平面内。"),
        ]),
        ("单元六  多元函数与曲线积分", "画出积分区域，再决定积分次序。", [
            ("设 z=x²y+e^y，求 z_x。", None, "z_x=2xy。"),
            ("设 z=x²y+e^y，求 z_y。", None, "z_y=x²+e^y。"),
            ("求 z=x²+y² 在点(1,-1)处的全微分。", None, "dz=2dx-2dy。"),
            ("计算 ∬_D 1dA，其中 D=[0,2]×[0,3]。", None, "6，即区域面积。"),
            ("计算 ∬_D (x+y)dA，其中 D=[0,1]×[0,1]。", None, "1。"),
            ("计算沿直线段从(0,0)到(1,1)的 ∫(x+y)dx。", None, "令x=t,y=t，积分∫_0^1 2t dt=1。"),
        ]),
        ("单元七  无穷级数", "先看通项是否趋于0，再选审敛法。", [
            ("判断级数 Σ(1/2)^n（n从1开始）的敛散性并求和。", None, "收敛，和为1。"),
            ("判断调和级数 Σ1/n 的敛散性。", None, "发散。"),
            ("判断 p 级数 Σ1/n² 的敛散性。", None, "收敛，因为 p=2>1。"),
            ("求幂级数 Σx^n 的收敛半径。", None, "R=1。"),
            ("求幂级数 Σ(x-2)^n/3^n 的收敛区间。", None, "(-1,5)，两端均发散。"),
            ("写出 e^x 的麦克劳林展开式前四项。", None, "1+x+x²/2!+x³/3!+...。"),
        ]),
        ("单元八  常微分方程", "先判类型，再使用对应通解公式。", [
            ("求微分方程 y'=2x 的通解。", None, "y=x²+C。"),
            ("求微分方程 y'=y 的通解。", None, "y=Ce^x。"),
            ("求初值问题 y'=y，y(0)=3。", None, "y=3e^x。"),
            ("求一阶线性方程 y'+y=e^x 的通解。", None, "y=(1/2)e^x+Ce^(-x)。"),
            ("求方程 y''-3y'+2y=0 的通解。", None, "特征根1、2，y=C1e^x+C2e^(2x)。"),
            ("求方程 y''+y=0 的通解。", None, "y=C1cos x+C2sin x。"),
        ]),
    ]

    story, answer_groups, number = [], [], 1
    for index, (title, instruction, questions) in enumerate(units):
        if index: story.append(PageBreak())
        part, answers, number = unit_story(title, instruction, questions, number)
        story += part
        answer_groups.append((title, answers))
    story += answer_banner()
    for index, (title, answers) in enumerate(answer_groups):
        if index and index % 3 == 0: story.append(PageBreak())
        story += section(title + "答案", "核对结果，更要核对方法和步骤。")
        story.append(Paragraph("<br/>".join(f"<b>{number}.</b> {answer}" for number, answer in answers), ANSWER_BODY))
    return build_pdf("math-course-question-bank.pdf", "高等数学", "陕西专升本 · 高数课程配套电子题库", "8单元 · 48题", "极限｜微分｜积分｜空间｜多元｜级数｜方程", YELLOW, story)


if __name__ == "__main__":
    for path in [english_bank(), math_bank()]:
        print(path)
