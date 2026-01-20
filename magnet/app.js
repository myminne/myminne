document.addEventListener('DOMContentLoaded', () => {
    // === UI Elements ===
    const screens = {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        feedback: document.getElementById('feedback-screen'),
        difficulty: document.getElementById('difficulty-screen'),
        chat: document.getElementById('chat-screen')
    };

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizProgress = document.getElementById('quiz-progress');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const quizImageContainer = document.getElementById('quiz-image-container');

    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const learningGuide = document.getElementById('learning-guide');
    const nextStepBtn = document.getElementById('next-step-btn');

    const btnEasy = document.getElementById('btn-easy');
    const btnHard = document.getElementById('btn-hard');
    const switchBotBtn = document.getElementById('switch-bot-btn');
    const homeBtn = document.getElementById('home-btn'); // [NEW]

    // === API Key Management ===
    // [중요] 여기에 선생님의 Google Gemini API 키를 붙여넣으세요.
    const API_KEY = "AIzaSyCUC5tEcakfCNMIi6EfmqgiCM6_jTFtvic";

    // === Helper Function for Korean Josa (은/는) ===
    function getJosa(word) {
        const lastChar = word.charCodeAt(word.length - 1);
        if (lastChar < 44032 || lastChar > 55203) return '은(는)';
        const hasBatchim = (lastChar - 44032) % 28 !== 0;
        return hasBatchim ? '은' : '는';
    }

    // === Quiz Database (50 Items) ===
    const quizDatabase = [
        // [Type 1] 자석에 붙는/안 붙는 물체 (35 Items)
        { type: 'item', text: "철 못", icon: "🔩", isMagnetic: true, reason: "철로 만들어져서 자석에 붙어요!" },
        { type: 'item', text: "클립", icon: "📎", isMagnetic: true, reason: "철로 된 클립은 자석에 찰싹 붙어요." },
        { type: 'item', text: "가위", icon: "✂️", isMagnetic: true, reason: "가위의 날 부분은 쇠(철)라서 붙어요." },
        { type: 'item', text: "옷핀", icon: "🧷", isMagnetic: true, reason: "철로 만들어진 옷핀은 자석을 좋아해요." },
        { type: 'item', text: "냉장고 문", icon: "🧊", isMagnetic: true, reason: "냉장고 문 안쪽에는 넓은 철판이 숨어있어요." },
        { type: 'item', text: "철 숟가락", icon: "🥄", isMagnetic: true, reason: "철로 만든 숟가락은 자석에 붙어요. (스테인리스는 종류에 따라 달라요!)" },
        { type: 'item', text: "나사못", icon: "🔩", isMagnetic: true, reason: "쇠로 만든 나사는 자석에 잘 붙어요." },
        { type: 'item', text: "필통(철)", icon: "✏️", isMagnetic: true, reason: "철로 된 필통은 자석에 붙어요." },
        { type: 'item', text: "스테이플러 심", icon: "🖇️", isMagnetic: true, reason: "철사로 된 심은 자석에 붙어요." },
        { type: 'item', text: "바늘", icon: "🪡", isMagnetic: true, reason: "바늘은 강한 철강이라서 자석에 잘 붙어요." },
        { type: 'item', text: "병뚜껑(쇠)", icon: "🍾", isMagnetic: true, reason: "쇠로 된 병뚜껑은 자석에 붙어요." },
        { type: 'item', text: "철사", icon: "➰", isMagnetic: true, reason: "철로 된 철사는 자석에 붙어요." },
        { type: 'item', text: "칠판 지우개 뒷면", icon: "🧽", isMagnetic: true, reason: "칠판에 붙도록 자석이나 철판이 들어있어요." },
        { type: 'item', text: "열쇠 고리(쇠)", icon: "🗝️", isMagnetic: true, reason: "쇠로 된 링 부분은 자석에 붙어요." },
        { type: 'item', text: "압정", icon: "📌", isMagnetic: true, reason: "압정의 뾰족한 핀과 머리는 철이라서 붙어요." },
        { type: 'item', text: "지우개", icon: "🧼", isMagnetic: false, reason: "고무는 자석에 붙지 않아요." },
        { type: 'item', text: "플라스틱 자", icon: "📏", isMagnetic: false, reason: "플라스틱은 자석에 붙지 않아요." },
        { type: 'item', text: "나무 연필", icon: "✏️", isMagnetic: false, reason: "나무는 자석에 반응하지 않아요." },
        { type: 'item', text: "알루미늄 캔", icon: "🥫", isMagnetic: false, reason: "알루미늄 음료수 캔은 자석에 안 붙어요. (철 캔만 붙어요!)" },
        { type: 'item', text: "동전 (100원)", icon: "🪙", isMagnetic: false, reason: "동전(구리, 니켈)은 자석에 붙지 않아요." },
        { type: 'item', text: "동전 (10원)", icon: "💰", isMagnetic: false, reason: "구리로 된 10원짜리는 안 붙어요." },
        { type: 'item', text: "유리컵", icon: "🥛", isMagnetic: false, reason: "유리는 자석에 붙지 않아요." },
        { type: 'item', text: "종이컵", icon: "🥤", isMagnetic: false, reason: "종이는 자석에 붙지 않아요." },
        { type: 'item', text: "금반지", icon: "💍", isMagnetic: false, reason: "순금은 자석에 붙지 않아요." },
        { type: 'item', text: "고무줄", icon: "🧶", isMagnetic: false, reason: "고무는 자석이랑 친하지 않아요." },
        { type: 'item', text: "플라스틱 병뚜껑", icon: "🧴", isMagnetic: false, reason: "플라스틱은 안 붙어요." },
        { type: 'item', text: "나무 젓가락", icon: "🥢", isMagnetic: false, reason: "나무는 자석에 안 붙어요." },
        { type: 'item', text: "레고 블록", icon: "🧱", isMagnetic: false, reason: "플라스틱 장난감은 안 붙어요." },
        { type: 'item', text: "공책", icon: "📓", isMagnetic: false, reason: "종이 책은 자석에 안 붙어요." },
        { type: 'item', text: "양말", icon: "🧦", isMagnetic: false, reason: "천(섬유)은 자석에 안 붙어요." },
        { type: 'item', text: "돌맹이", icon: "🪨", isMagnetic: false, reason: "일반적인 돌은 자석에 안 붙어요. (자철석은 예외!)" },
        { type: 'item', text: "나뭇잎", icon: "🍃", isMagnetic: false, reason: "식물은 자석에 안 붙어요." },
        { type: 'item', text: "축구공", icon: "⚽", isMagnetic: false, reason: "가죽과 고무는 안 붙어요." },
        { type: 'item', text: "모래", icon: "🏖️", isMagnetic: false, reason: "모래는 대부분 돌가루라 안 붙어요. (철가루만 붙어요!)" },
        { type: 'item', text: "크레파스", icon: "🖍️", isMagnetic: false, reason: "왁스로 만든 크레파스는 안 붙어요." },

        // [Type 2] 개념 문제 (15 Items)
        {
            type: 'concept',
            question: "자석의 N극과 N극이 만나면 어떻게 될까요?",
            icon: "🧲💥🧲",
            options: [{ text: "서로 밀어내요 (척력)", correct: true }, { text: "서로 당겨요 (인력)", correct: false }],
            reason: "같은 극끼리는 서로 밀어내는 힘(척력)이 작용해요."
        },
        {
            type: 'concept',
            question: "자석의 N극과 S극이 만나면 어떻게 될까요?",
            icon: "❤️",
            options: [{ text: "서로 밀어내요", correct: false }, { text: "서로 붙어요 (인력)", correct: true }],
            reason: "다른 극끼리는 서로 끌어당기는 힘(인력)이 작용해요."
        },
        {
            type: 'concept',
            question: "자석에서 철 클립이 가장 많이 붙는 곳은 어디일까요?",
            icon: "🧲",
            options: [{ text: "가운데", correct: false }, { text: "양쪽 끝 (극)", correct: true }],
            reason: "자석의 힘은 양쪽 끝인 '극'에서 가장 세요."
        },
        {
            type: 'concept',
            question: "자석을 반으로 뚝 자르면 극은 어떻게 될까요?",
            icon: "🔪",
            options: [{ text: "극이 사라진다", correct: false }, { text: "새로운 N극, S극이 생긴다", correct: true }],
            reason: "자석을 아무리 작게 잘라도 항상 N극과 S극이 새로 생겨요."
        },
        {
            type: 'compass',
            question: "나침반의 붉은 바늘(N극)은 항상 어디를 가리킬까요?",
            icon: "🧭",
            options: [{ text: "북쪽 (North)", correct: true }, { text: "남쪽 (South)", correct: false }],
            reason: "N극은 항상 북쪽(North)을 향해요."
        },
        {
            type: 'concept',
            question: "다음 중 자석의 성질을 잃어버리게 하는 행동은?",
            icon: "🔥",
            options: [{ text: "자석을 뜨겁게 가열한다", correct: true }, { text: "자석을 차갑게 한다", correct: false }],
            reason: "자석을 높은 온도로 가열하면 자석의 성질인 자성을 잃어버려요."
        },
        {
            type: 'concept',
            question: "막대자석을 물에 띄우면 N극은 어느 쪽을 볼까요?",
            icon: "🚣",
            options: [{ text: "북쪽", correct: true }, { text: "동쪽", correct: false }],
            reason: "물에 뜬 자석은 나침반처럼 북쪽을 가리켜요."
        },
        {
            type: 'concept',
            question: "전자석은 언제만 자석이 될까요?",
            icon: "⚡",
            options: [{ text: "항상", correct: false }, { text: "전기가 흐를 때만", correct: true }],
            reason: "전자석은 전기가 흐르는 동안에만 자석의 성질을 가져요."
        },
        {
            type: 'concept',
            question: "우리가 사는 지구는 커다란 OOO일까요?",
            icon: "🌏",
            options: [{ text: "자석", correct: true }, { text: "돌멩이", correct: false }],
            reason: "지구도 거대한 자석처럼 자기장을 가지고 있어요!"
        },
        {
            type: 'concept',
            question: "나침반의 바늘도 사실은 무엇일까요?",
            icon: "🧭",
            options: [{ text: "플라스틱", correct: false }, { text: "작은 자석", correct: true }],
            reason: "나침반의 바늘은 작고 가벼운 자석이에요."
        },
        {
            type: 'concept',
            question: "자석이 클립을 당기는 힘은 무엇을 통과할 수 있을까요?",
            icon: "🥛",
            options: [{ text: "유리컵과 물", correct: true }, { text: "두꺼운 철판", correct: false }],
            reason: "자석의 힘은 유리, 종이, 물, 플라스틱 등을 통과할 수 있어요. (철판은 막혀요!)"
        },
        {
            type: 'concept',
            question: "철가루를 자석 주위에 뿌리면 생기는 선 모양을 무엇이라 할까요?",
            icon: "〰️",
            options: [{ text: "자기력선", correct: true }, { text: "전기줄", correct: false }],
            reason: "자석의 힘이 미치는 모양을 자기력선이라고 해요."
        },
        {
            type: 'concept',
            question: "자석 보관 방법으로 올바른 것은?",
            icon: "📦",
            options: [{ text: "다른 극끼리 붙여 보관", correct: true }, { text: "같은 극끼리 억지로 붙임", correct: false }],
            reason: "자석은 다른 극끼리 붙여서 보관해야 힘이 오래 유지돼요."
        },
        {
            type: 'concept',
            question: "ATM 기계에 통장을 넣으면 안 되는 이유는?",
            icon: "🏧",
            options: [{ text: "자석 힘에 정보가 지워질까봐", correct: true }, { text: "너무 더러워서", correct: false }],
            reason: "통장의 검은 띠(마그네틱 선)는 강한 자석 옆에 가면 정보가 지워질 수 있어요."
        },
        {
            type: 'concept',
            question: "철새들이 먼 길을 잃지 않고 찾아가는 비결은?",
            icon: "🦆",
            options: [{ text: "지도를 봐서", correct: false }, { text: "지구의 자기장을 느껴서", correct: true }],
            reason: "철새들은 몸속에 나침반 같은 기능이 있어서 방향을 알 수 있대요."
        }
    ];

    // === Logic Functions ===
    let currentQuizState = 'initial';
    let currentQuestionIndex = 0;
    let wrongAnswers = [];
    let quizQuestions = [];
    let currentDifficulty = 'easy';

    function generateQuiz(count) {
        const itemQuestions = quizDatabase.filter(q => q.type === 'item');
        const conceptQuestions = quizDatabase.filter(q => q.type !== 'item');

        itemQuestions.sort(() => Math.random() - 0.5);
        conceptQuestions.sort(() => Math.random() - 0.5);

        const combined = [];

        itemQuestions.forEach(item => {
            const josa = getJosa(item.text);
            combined.push({
                question: `"${item.text}"${josa} 자석에 붙을까요?`,
                icon: item.icon,
                reason: item.reason,
                options: [
                    { text: "⭕ 붙어요!", correct: item.isMagnetic },
                    { text: "❌ 안 붙어요!", correct: !item.isMagnetic }
                ],
                originalItem: item
            });
        });

        conceptQuestions.forEach(q => {
            combined.push({
                question: q.question,
                icon: q.icon,
                reason: q.reason,
                options: q.options,
                originalItem: q
            });
        });

        combined.sort(() => Math.random() - 0.5);
        return combined.slice(0, count);
    }

    function switchScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    function startInitialQuiz() {
        currentQuizState = 'initial';
        currentQuestionIndex = 0;
        wrongAnswers = [];
        quizQuestions = generateQuiz(15);
        switchScreen('quiz');
        loadQuestion();
    }

    function startRemedialQuiz() {
        currentQuizState = 'remedial';
        currentQuestionIndex = 0;
        quizQuestions = wrongAnswers.map(wrong => ({
            ...wrong,
            question: `[복습] ${wrong.question}`
        }));
        wrongAnswers = [];
        switchScreen('quiz');
        loadQuestion();
    }

    function loadQuestion() {
        const currentQ = quizQuestions[currentQuestionIndex];
        const quizType = currentQuizState === 'initial' ? '자석 박사 도전!' : '핵심 콕콕 복습';
        quizProgress.textContent = `${quizType} : ${currentQuestionIndex + 1} / ${quizQuestions.length}`;
        questionText.textContent = currentQ.question;

        if (quizImageContainer) {
            quizImageContainer.innerHTML = `<div class="quiz-icon">${currentQ.icon}</div>`;
        }

        optionsContainer.innerHTML = '';
        currentQ.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            if (opt.text.includes('⭕') || opt.text.includes('❌')) {
                btn.innerHTML = opt.text.replace(' ', '<br>');
            }
            btn.onclick = (e) => handleAnswer(opt.correct, e.target.closest('button'));
            optionsContainer.appendChild(btn);
        });
    }

    function handleAnswer(isCorrect, btnElement) {
        if (btnElement.disabled) return;
        const currentQ = quizQuestions[currentQuestionIndex];
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            btnElement.classList.add('correct-anim');
        } else {
            btnElement.classList.add('wrong-anim');
            wrongAnswers.push(currentQ);
        }

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                loadQuestion();
            } else {
                finishQuiz();
            }
        }, 800);
    }

    function finishQuiz() {
        switchScreen('feedback');
        if (wrongAnswers.length === 0) {
            feedbackTitle.textContent = "🏆 완벽해요 자석 마스터! 🏆";
            feedbackMessage.textContent = "와! 15문제를 하나도 틀리지 않았어요!";
            learningGuide.innerHTML = "그럼 이제 자석 박사님들과 대화하면서 궁금증을 해결하고 이번 단원을 정리해 봅시다.";
            nextStepBtn.textContent = "박사님 만나러 가기 👋";
            nextStepBtn.onclick = () => { switchScreen('difficulty'); };
        } else {
            feedbackTitle.textContent = "조금만 더 힘내볼까요? 💪";
            feedbackMessage.textContent = `${quizQuestions.length}문제 중 ${wrongAnswers.length}개를 놓쳤어요.`;
            let guideHtml = "<ul style='text-align:left; padding-left:20px;'>";
            wrongAnswers.forEach(wrong => {
                const title = wrong.originalItem.text || "퀴즈";
                guideHtml += `<li><strong>${title}</strong>: ${wrong.reason}</li>`;
            });
            guideHtml += "</ul>";
            learningGuide.innerHTML = guideHtml;
            nextStepBtn.textContent = "복습 문제 풀기 📝";
            nextStepBtn.onclick = startRemedialQuiz;
        }
    }

    // === Event Listeners ===
    if (btnEasy) btnEasy.addEventListener('click', () => { currentDifficulty = 'easy'; startChat(); });
    if (btnHard) btnHard.addEventListener('click', () => { currentDifficulty = 'hard'; startChat(); });

    if (switchBotBtn) switchBotBtn.addEventListener('click', () => { switchScreen('difficulty'); });

    // [NEW] Home Button Listener
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            if (confirm('처음 화면으로 돌아갈까요? (퀴즈 진행 상황은 저장되지 않아요)')) {
                window.location.reload();
            }
        });
    }

    function startChat() {
        switchScreen('chat');
        const greeting = currentDifficulty === 'easy'
            ? "안녕? 난 친절한 자석 박사야! 🐣<br>자석이 왜 힘이 센지, 자석으로 뭘 할 수 있는지 궁금하지 않니?"
            : "반갑습니다. 저는 자석 연구소 소장입니다. 🎓<br>자성, 자기장, 또는 자석의 응용 기술에 대해 질문해 주십시오.";
        chatWindow.innerHTML = '';
        addMessage(greeting, 'bot');
    }

    // === Chatbot Logic ===
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatWindow = document.getElementById('chat-window');

    const knowledgeBase = [
        {
            keywords: ['자석이 뭐야', '자석은 뭐야', '자석이란', '자석의 뜻'],
            answers: {
                easy: '자석은 보이지 않는 힘인 **자기력**으로 쇠붙이를 잡아당기는 신기한 물체야! 🧲',
                hard: '자석은 자기장을 형성하여 철, 니켈, 코발트 같은 강자성체 물질을 끌어당기는 성질(자성)을 가진 물체입니다.'
            }
        },
        {
            keywords: ['생겨', '만들어', '원리', '이유'],
            answers: {
                easy: '음~ 그건 자석 안에 아주 작은 꼬마 자석들이 한 방향으로 줄을 섰기 때문이야! 더 자세한 건 중학교 과학 시간에 배우게 될 거야! 😉',
                hard: '물질을 이루는 원자 속의 전자가 회전하면서 자기장을 만듭니다. 보통은 제각각이지만, 자석은 이 자기장들이 한 방향으로 정렬(자구 정렬)되어 있어 큰 힘을 냅니다.'
            }
        },
        {
            keywords: ['극', 'N극', 'S극', '빨간', '파란'],
            answers: {
                easy: '자석 양 끝에는 힘이 가장 센 **N극(북쪽)**과 **S극(남쪽)**이 있어. 자석을 아무리 잘게 잘라도 항상 두 극이 새로 생긴단다!',
                hard: '자석에는 항상 N극과 S극이 쌍으로 존재합니다(쌍극자). 원형 도선에 전류가 흐를 때 생기는 자기장과 같은 원리이기 때문에 단독 극(Monopole)은 존재할 수 없습니다.'
            }
        },
        {
            keywords: ['같은', '다른', '밀어', '당겨', '척력', '인력'],
            answers: {
                easy: '같은 극끼리(N-N)는 "저리가!" 하고 밀어내고, 다른 극끼리(N-S)는 "이리 와!" 하고 끌어당겨. 이걸 척력과 인력이라고 해!',
                hard: '같은 극 사이에는 서로 밀어내는 척력이, 다른 극 사이에는 서로 당기는 인력이 작용합니다. 이는 자기력선이 N극에서 나와 S극으로 들어가려는 성질 때문입니다.'
            }
        },
        {
            keywords: ['붙어', '안 붙어', '달라붙', '철', '금', '은', '동전', '유리', '나무'],
            answers: {
                easy: '자석은 철, 못, 가위 같은 **철 친구**들을 좋아해! 하지만 나무, 유리, 플라스틱, 그리고 100원짜리 동전은 좋아하지 않아.',
                hard: '자석은 강자성체(철, 니켈, 코발트)에는 붙지만, 상자성체(알루미늄)나 반자성체(구리, 금, 물)에는 붙지 않거나 아주 약하게 반응합니다.'
            }
        },
        {
            keywords: ['나침반', '지구', '북쪽', '남쪽', '방향'],
            answers: {
                easy: '지구가 아주 커다란 자석이기 때문이야! 나침반의 붉은 바늘(N극)은 북쪽을 좋아해서 항상 북쪽을 가리키는 거란다. 🌏',
                hard: '지구는 거대한 자기장을 가지고 있습니다. 지리상의 북극 근처에는 사실 자석의 S극 성질이 있어서, 나침반의 N극을 끌어당기는 것입니다.'
            }
        },
        {
            keywords: ['오로라', '북극광'],
            answers: {
                easy: '오로라도 자석 때문이야! 지구가 가진 자석 힘이 우주에서 날아오는 나쁜 먼지들을 막아줄 때 생기는 아름다운 빛 커튼이란다. ✨',
                hard: '태양에서 날아오는 대전 입자(태양풍)가 지구 자기장에 이끌려 대기 중의 기체 원자와 충돌하며 빛을 내는 현상이 바로 오로라입니다.'
            }
        },
        {
            keywords: ['전기', '전자석', '만드는 법', '만들기'],
            answers: {
                easy: '전기가 흐르는 동안만 자석이 되는 걸 **전자석**이라고 해. 못에 전선을 감고 건전지를 연결하면 만들 수 있어!',
                hard: '전류가 흐르면 그 주위에 자기장이 형성됩니다. 코일(솔레노이드) 속에 철심을 넣고 전류를 흘리면 강력한 일시적 자석, 즉 전자석이 됩니다.'
            }
        },
        {
            keywords: ['사용', '쓰임', '어디', '생활', '냉장고', '스피커', '카드'],
            answers: {
                easy: '자석은 냉장고 문, 필통, 가방 단추, 그리고 소리를 내는 스피커에도 들어있어! 신용카드 뒷면의 검은 띠도 자석을 이용한 거야.',
                hard: '자석은 모터, 발전기, 스피커, 하드디스크 등 다양한 전자기기에 필수적입니다. 신용카드의 마그네틱 선에는 자성 물질로 정보가 기록되어 있습니다.'
            }
        },
        {
            keywords: ['기차', '자기부상', '열차', '떠서'],
            answers: {
                easy: '자석이 서로 밀어내는 힘을 이용해서 공중에 붕~ 떠서 달리는 **자기부상열차**가 있어! 바퀴가 없어서 아주 빠르고 조용해. 🚄',
                hard: '자기부상열차는 자석의 척력(밀어내는 힘)이나 인력(당기는 힘)을 이용해 차체를 선로 위로 띄워 마찰 없이 고속으로 주행하는 열차입니다.'
            }
        },
        {
            keywords: ['병원', 'MRI', '엠알아이', '사진'],
            answers: {
                easy: '병원에 있는 MRI라는 큰 기계도 엄청 센 자석이야! 자석의 힘으로 우리 몸속을 찰칵찰칵 찍어서 아픈 곳을 찾아낸단다. 🏥',
                hard: 'MRI(자기공명영상)는 강력한 자기장과 고주파를 이용해 인체 내 수소 원자핵의 반응을 영상화하는 장치입니다. 방사선 피폭 없이 정밀한 진단이 가능합니다.'
            }
        },
        {
            keywords: ['발견', '옛날', '누가', '마그네시아'],
            answers: {
                easy: '아주 옛날, "마그네시아"라는 마을의 양치기가 신발 밑에 쇠못이 검은 돌에 붙는 걸 발견했대! 그게 최초의 자석 이야기야.',
                hard: '자석(Magnet)의 어원은 고대 그리스의 "마그네시아" 지방에서 유래했습니다. 그곳에서 자철석(천연 자석)이 많이 발견되었기 때문입니다.'
            }
        }
    ];

    function addMessage(text, type) {
        if (!chatWindow) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = type === 'bot' ? (currentDifficulty === 'easy' ? '🐣' : '🎓') : '🧑‍🎓';
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = text;
        if (type === 'bot') { messageDiv.appendChild(avatar); messageDiv.appendChild(bubble); }
        else { messageDiv.appendChild(bubble); messageDiv.appendChild(avatar); }
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase().replace(/\s+/g, '');
        for (let item of knowledgeBase) {
            for (let keyword of item.keywords) {
                if (lowerInput.includes(keyword.replace(/\s+/g, ''))) {
                    return item.answers[currentDifficulty];
                }
            }
        }
        if (currentDifficulty === 'easy') {
            return "그건 중학교 가서 배우게 될거야~ 아직은 비밀이야! 🤫";
        } else {
            return "상당히 심도 있는 질문이군요. 제 데이터베이스에는 없지만, 혹시 '원자'나 '전자'와 관련된 내용이 아닐까요?";
        }
    }

    function handleInput() {
        const text = userInput.value.trim();
        if (text === "") return;
        addMessage(text, 'user');
        userInput.value = '';
        setTimeout(() => {
            const botReply = getBotResponse(text);
            addMessage(botReply, 'bot');
        }, 500);
    }
    if (sendBtn) sendBtn.addEventListener('click', handleInput);
    if (userInput) userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleInput();
    });
    if (startQuizBtn) startQuizBtn.addEventListener('click', startInitialQuiz);
});
