document.addEventListener('DOMContentLoaded', () => {
    // === UI Elements ===
    const screens = {
        start: document.getElementById('start-screen'),
        stage: document.getElementById('stage-screen'),
        quiz: document.getElementById('quiz-screen'),
        feedback: document.getElementById('feedback-screen'),
        analysis: document.getElementById('analysis-screen'),
        difficulty: document.getElementById('difficulty-screen'),
        chat: document.getElementById('chat-screen')
    };

    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizHeaderTitle = document.getElementById('quiz-header-title');
    const quizProgress = document.getElementById('quiz-progress');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const quizImageContainer = document.getElementById('quiz-image-container');

    // Stage Buttons
    const stageBtns = {
        1: document.getElementById('stage-1-btn'),
        2: document.getElementById('stage-2-btn'),
        3: document.getElementById('stage-3-btn'),
        4: document.getElementById('stage-4-btn')
    };

    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextStepBtn = document.getElementById('next-step-btn');

    const analysisReport = document.getElementById('analysis-report');
    const startRemedialBtn = document.getElementById('start-remedial-btn');
    const remedialSection = document.getElementById('remedial-section');

    const btnEasy = document.getElementById('btn-easy');
    const btnHard = document.getElementById('btn-hard');
    const switchBotBtn = document.getElementById('switch-bot-btn');
    const homeBtn = document.getElementById('home-btn');

    // === Helper: Josa ===
    function getJosa(word) {
        const lastChar = word.charCodeAt(word.length - 1);
        if (lastChar < 44032 || lastChar > 55203) return '은(는)';
        const hasBatchim = (lastChar - 44032) % 28 !== 0;
        return hasBatchim ? '은' : '는';
    }

    // === Quiz Database (Expanded to 55 Items) ===
    const quizDatabase = [
        // [Stage 1] 자석에 붙을까? 붙지 않을까? (14 items)
        { stage: 1, category: 'item_magnetic', type: 'item', text: "철 못", icon: "🔩", isMagnetic: true, reason: "자석에 붙는 물질: 철로 만들어진 물체는 자석에 붙습니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "클립", icon: "📎", isMagnetic: true, reason: "자석에 붙는 물질: 철로 된 클립은 자석에 찰싹 붙습니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "가위", icon: "✂️", isMagnetic: true, reason: "자석에 붙는 물질: 가위의 날 부분은 쇠(철)라서 붙습니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "옷핀", icon: "🧷", isMagnetic: true, reason: "자석에 붙는 물질: 철로 만들어진 옷핀은 자석을 좋아합니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "냉장고 문", icon: "🧊", isMagnetic: true, reason: "자석에 붙는 물질: 냉장고 문 안쪽에는 넓은 철판이 숨어있습니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "철 숟가락", icon: "🥄", isMagnetic: true, reason: "자석에 붙는 물질: 철로 만든 숟가락은 자석에 붙습니다." },
        { stage: 1, category: 'item_magnetic', type: 'item', text: "필통(철)", icon: "✏️", isMagnetic: true, reason: "자석에 붙는 물질: 철로 된 필통은 자석에 붙습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "지우개", icon: "🧼", isMagnetic: false, reason: "자석에 붙지 않는 물질: 고무는 자석에 붙지 않습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "플라스틱 자", icon: "📏", isMagnetic: false, reason: "자석에 붙지 않는 물질: 플라스틱은 자석에 붙지 않습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "나무 연필", icon: "✏️", isMagnetic: false, reason: "자석에 붙지 않는 물질: 나무는 자석에 반응하지 않습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "알루미늄 캔", icon: "🥫", isMagnetic: false, reason: "자석에 붙지 않는 물질: 알루미늄 캔은 자석에 붙지 않습니다. (철 캔과 달라요!)" },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "동전 (100원)", icon: "🪙", isMagnetic: false, reason: "자석에 붙지 않는 물질: 동전(구리, 니켈)은 자석에 붙지 않습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "유리컵", icon: "🥛", isMagnetic: false, reason: "자석에 붙지 않는 물질: 유리는 자석에 붙지 않습니다." },
        { stage: 1, category: 'item_non_magnetic', type: 'item', text: "종이", icon: "📄", isMagnetic: false, reason: "자석에 붙지 않는 물질: 종이는 자석에 붙지 않습니다." },

        // [Stage 2] 자석은 밀당의 고수 (14 items)
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석의 N극과 N극이 만나면?", icon: "🧲💥🧲", options: [{ text: "서로 밀어낸다 (척력)", correct: true }, { text: "서로 당긴다 (인력)", correct: false }], reason: "자석의 극: 같은 극끼리는 서로 밀어내는 척력이 작용합니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석의 N극과 S극이 만나면?", icon: "❤️", options: [{ text: "서로 붙는다 (인력)", correct: true }, { text: "서로 밀어낸다", correct: false }], reason: "자석의 극: 다른 극끼리는 서로 당기는 인력이 작용합니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석에서 힘이 가장 센 곳은?", icon: "💪", options: [{ text: "양쪽 끝 (극)", correct: true }, { text: "가운데", correct: false }], reason: "자석의 세기: 자석의 힘은 양쪽 끝인 '극'에서 가장 셉니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석을 반으로 자르면?", icon: "🔪", options: [{ text: "극이 사라진다", correct: false }, { text: "다시 N극, S극이 생긴다", correct: true }], reason: "자석의 성질: 자석은 잘라도 항상 두 극이 새로 생깁니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "철가루가 그리는 선의 이름은?", icon: "〰️", options: [{ text: "자기력선", correct: true }, { text: "전기줄", correct: false }], reason: "자기장: 자석의 힘이 미치는 선을 자기력선이라 합니다." },
        { stage: 2, category: 'concept_app', type: 'concept', question: "자석은 무엇을 통과할까요?", icon: "🥛", options: [{ text: "유리나 물", correct: true }, { text: "두꺼운 철판", correct: false }], reason: "자석의 힘: 자석의 힘은 유리, 종이, 물 등을 통과합니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "S극끼리 가까이 가져가면?", icon: "💥", options: [{ text: "밀어낸다", correct: true }, { text: "당긴다", correct: false }], reason: "자석의 극: S극과 S극도 같은 극이므로 서로 밀어냅니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "클립이 자석에 붙는 이유는?", icon: "📎", options: [{ text: "클립이 자석이 되어서", correct: true }, { text: "클립에 끈끈이가 있어서", correct: false }], reason: "자기 유도: 철이 자석 근처에 가면 일시적으로 자석 성질을 띠게 됩니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "막대자석 가운데 부분은 힘이 어떨까요?", icon: "😐", options: [{ text: "가장 약하다", correct: true }, { text: "가장 세다", correct: false }], reason: "자석의 세기: 자석의 가운데 부분은 자기력이 가장 약합니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석 힘이 미치는 공간을 무엇이라 할까요?", icon: "🌌", options: [{ text: "자기장", correct: true }, { text: "운동장", correct: false }], reason: "자기장: 자석의 힘이 작용하는 공간을 자기장이라고 합니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석의 힘은 눈에 보일까요?", icon: "👀", options: [{ text: "보이지 않는다", correct: true }, { text: "보인다", correct: false }], reason: "자기력: 자석의 힘(자기력)은 우리 눈에 보이지 않습니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "철가루가 가장 많이 붙는 곳은?", icon: "🧲", options: [{ text: "양쪽 극 부분", correct: true }, { text: "가운데 부분", correct: false }], reason: "자석의 세기: 자기력이 가장 센 양쪽 극에 철가루가 많이 붙습니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "말굽자석의 극은 어디에 있을까요?", icon: "🐴", options: [{ text: "양쪽 끝", correct: true }, { text: "구부러진 곳", correct: false }], reason: "자석의 형태: 모양이 달라도 극은 항상 양쪽 끝에 있습니다." },
        { stage: 2, category: 'concept_pole', type: 'concept', question: "자석 위에 종이를 놓고 클립을 움직이면?", icon: "📄", options: [{ text: "움직인다", correct: true }, { text: "움직이지 않는다", correct: false }], reason: "자석의 힘: 자석의 힘은 종이를 통과하여 작용합니다." },

        // [Stage 3] 자석과 나침반 (13 items)
        { stage: 3, category: 'concept_earth', type: 'compass', question: "나침반의 N극은 어디를 가리킬까요?", icon: "🧭", options: [{ text: "북쪽 (North)", correct: true }, { text: "남쪽 (South)", correct: false }], reason: "나침반의 원리: N극은 항상 북쪽을 향합니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "지구도 하나의 큰 OOO입니다.", icon: "🌏", options: [{ text: "자석", correct: true }, { text: "돌멩이", correct: false }], reason: "지구 자기장: 지구도 거대한 자석처럼 자기장을 가지고 있습니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "물에 띄운 자석은 어디를 볼까요?", icon: "🚣", options: [{ text: "북쪽", correct: true }, { text: "동쪽", correct: false }], reason: "자석의 성질: 물에 뜬 자석은 나침반처럼 북쪽을 가리킵니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "철새가 길을 찾는 방법은?", icon: "🦆", options: [{ text: "지구를 자석으로 느껴서", correct: true }, { text: "지도를 보고", correct: false }], reason: "동물의 감각: 철새는 몸속에 나침반 같은 기능이 있어 지구 자기장을 이용합니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "나침반 바늘의 정체는?", icon: "🧭", options: [{ text: "작은 자석", correct: true }, { text: "플라스틱", correct: false }], reason: "나침반의 구조: 나침반 바늘은 얇고 가벼운 자석입니다." },
        { stage: 3, category: 'concept_earth', type: 'compass', question: "나침반 주위에 자석을 가져가면?", icon: "😵", options: [{ text: "바늘이 움직인다", correct: true }, { text: "아무 변화 없다", correct: false }], reason: "나침반 반응: 나침반 바늘도 자석이므로 다른 자석에 반응하여 움직입니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "지구의 북극은 자석으로 치면 무슨 극일까요?", icon: "❄️", options: [{ text: "S극", correct: true }, { text: "N극", correct: false }], reason: "지구 자기장: 나침반의 N극을 당기기 위해 지구 북쪽은 S극 성질을 띱니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "나침반이 없을 때 북쪽을 찾는 방법은?", icon: "🌊", options: [{ text: "자석을 물에 띄운다", correct: true }, { text: "돌을 던진다", correct: false }], reason: "자석의 이용: 자석을 자유롭게 회전시키면 나침반 역할을 합니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "막대자석을 실에 매달면 어떻게 될까요?", icon: "🧵", options: [{ text: "남북을 가리키며 멈춘다", correct: true }, { text: "계속 뱅글뱅글 돈다", correct: false }], reason: "자석의 성질: 자유롭게 움직이는 자석은 항상 남북 방향을 가리킵니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "나침반 S극이 가리키는 방향은?", icon: "⬇️", options: [{ text: "남쪽", correct: true }, { text: "서쪽", correct: false }], reason: "나침반: S극은 South(남쪽)의 약자입니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "지구 주위에 생기는 자석의 힘 보호막을 뭐라 할까요?", icon: "🛡️", options: [{ text: "지구 자기장", correct: true }, { text: "오존층", correct: false }], reason: "지구 자기장: 지구 자기장은 우주 방사선으로부터 지구를 보호합니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "나침반을 이용해 찾을 수 있는 것은?", icon: "🗺️", options: [{ text: "방향", correct: true }, { text: "보물", correct: false }], reason: "나침반의 이용: 나침반은 동서남북 방향을 찾는 도구입니다." },
        { stage: 3, category: 'concept_earth', type: 'concept', question: "옛날 사람들은 나침반 대신 무엇을 썼을까요?", icon: "🥄", options: [{ text: "자석 돌(자철석)", correct: true }, { text: "나뭇가지", correct: false }], reason: "자석의 역사: 자석 성질을 가진 돌(자철석)을 물에 띄워 방향을 찾았습니다." },

        // [Stage 4] 우리 생활 속의 자석 (14 items)
        { stage: 4, category: 'concept_app', type: 'concept', question: "전기가 흐를 때만 자석이 되는 것은?", icon: "⚡", options: [{ text: "전자석", correct: true }, { text: "고무자석", correct: false }], reason: "전자석: 전류가 흐르면 자석이 되는 것을 전자석이라 합니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "자석을 이용해 붕 떠가는 기차는?", icon: "🚄", options: [{ text: "자기부상열차", correct: true }, { text: "증기기관차", correct: false }], reason: "자석의 이용: 자석의 척력과 인력을 이용해 기차를 띄웁니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "병원에 있는 자석 기계는?", icon: "🏥", options: [{ text: "MRI", correct: true }, { text: "X-ray", correct: false }], reason: "자석의 이용: MRI는 강한 자기장으로 몸속을 촬영합니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "통장을 자석 옆에 두면?", icon: "🏧", options: [{ text: "정보가 지워질 수 있다", correct: true }, { text: "더 잘 된다", correct: false }], reason: "자석의 주의점: 마그네틱 선의 정보가 자석 때문에 손상될 수 있습니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "자석의 힘을 잃게 하는 방법은?", icon: "🔥", options: [{ text: "뜨겁게 가열한다", correct: true }, { text: "차갑게 얼린다", correct: false }], reason: "자석의 성질: 자석에 고열을 가하면 자성을 잃어버립니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "냉장고 문이 '착' 닫히는 이유는?", icon: "🧊", options: [{ text: "고무 패킹 속 자석 때문에", correct: true }, { text: "바람 때문에", correct: false }], reason: "생활 속 자석: 고무 패킹 안에 자석이 들어있어 문이 잘 닫힙니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "드라이버 끝에 나사가 붙는 이유는?", icon: "🔧", options: [{ text: "자석으로 만들어서", correct: true }, { text: "끈끈해서", correct: false }], reason: "생활 속 자석: 작업 편의를 위해 드라이버 끝을 자석으로 만듭니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "스피커에서 소리가 나는 원리는?", icon: "🔊", options: [{ text: "자석과 전기의 힘", correct: true }, { text: "바람의 힘", correct: false }], reason: "자석의 이용: 스피커 안에는 자석이 들어있어 진동을 만듭니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "가방 뚜껑을 쉽게 닫는 단추는?", icon: "👜", options: [{ text: "자석 단추", correct: true }, { text: "그냥 단추", correct: false }], reason: "생활 속 자석: 자석 단추는 근처에만 가도 저절로 붙어 편리합니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "폐차장에서 무거운 차를 들어올릴 때 쓰는 것은?", icon: "🏗️", options: [{ text: "강력한 전자석", correct: true }, { text: "사람의 손", correct: false }], reason: "전자석의 이용: 전자석은 전기로 자석의 힘을 켰다 껐다- 하며 무거운 쇠를 옮깁니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "신용카드 뒷면 검은 띠의 정체는?", icon: "💳", options: [{ text: "자석 물질", correct: true }, { text: "그냥 검은 페인트", correct: false }], reason: "정보 저장: 자석의 성질을 이용해 정보를 기록합니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "스마트폰 거치대에 자석을 쓰는 이유는?", icon: "📱", options: [{ text: "쉽게 붙였다 떼려고", correct: true }, { text: "충전하려고", correct: false }], reason: "생활 속 자석: 자석의 인력을 이용해 편리하게 고정합니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "자석 두 개를 오랫동안 보관하려면?", icon: "📦", options: [{ text: "다른 극끼리 붙여서", correct: true }, { text: "따로 떨어트려서", correct: false }], reason: "자석 관리: 다른 극끼리 붙여두면 자석의 힘이 더 오래 유지됩니다." },
        { stage: 4, category: 'concept_app', type: 'concept', question: "망가진 전자석을 고치는 방법은?", icon: "🔋", options: [{ text: "전지를 새것으로 바꾼다", correct: true }, { text: "물에 씻는다", correct: false }], reason: "전자석: 전기가 흘러야 작동하므로 전원이 중요합니다." }
    ];

    // === Game State ===
    let stageStatus = {
        1: { cleared: false, wrong: [] },
        2: { cleared: false, wrong: [] },
        3: { cleared: false, wrong: [] },
        4: { cleared: false, wrong: [] },
        remedialWrong: []
    };
    let currentStage = 0;
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let currentQuizMode = 'stage';
    let remedialQueue = [];

    // === Stage Logic ===
    function checkAllStagesCleared() {
        return Object.values(stageStatus).filter(s => s.cleared !== undefined).every(s => s.cleared === true);
    }

    function updateStageScreen() {
        for (let i = 1; i <= 4; i++) {
            const btn = stageBtns[i];
            const status = stageStatus[i];
            const statusSpan = btn.querySelector('.stage-status');

            if (status.cleared) {
                btn.classList.add('cleared');
                btn.disabled = true;
                statusSpan.textContent = "CLEAR!";
            } else {
                btn.classList.remove('cleared');
                btn.disabled = false;
                statusSpan.textContent = "도전!";
            }
        }
    }

    window.selectStage = function (stageId) {
        currentStage = stageId;
        currentQuizMode = 'stage';

        let questions = quizDatabase.filter(q => q.stage === stageId);
        // Robust Shuffle
        questions.sort(() => Math.random() - 0.5);

        // Pick top 5
        quizQuestions = formatQuestions(questions.slice(0, 5));

        currentQuestionIndex = 0;
        stageStatus[stageId].wrong = [];
        switchScreen('quiz');
        loadQuestion();
    };

    function formatQuestions(rawQuestions) {
        return rawQuestions.map(item => {
            if (item.type === 'item') {
                const josa = getJosa(item.text);
                return {
                    question: `"${item.text}"${josa} 자석에 붙을까요?`,
                    icon: item.icon,
                    reason: item.reason,
                    options: [
                        { text: "⭕ 붙어요!", correct: item.isMagnetic },
                        { text: "❌ 안 붙어요!", correct: !item.isMagnetic }
                    ],
                    originalItem: item
                };
            } else {
                return {
                    question: item.question,
                    icon: item.icon,
                    reason: item.reason,
                    options: item.options,
                    originalItem: item
                };
            }
        });
    }

    // === Quiz Logic ===
    function loadQuestion() {
        const currentQ = quizQuestions[currentQuestionIndex];
        let title = "";

        if (currentQuizMode === 'stage') {
            title = `${currentStage}단계 (${currentQuestionIndex + 1}/5)`;
            let stTxt = stageBtns[currentStage].querySelector('.stage-title').innerHTML.replace(/<br>/g, ' ');
            // Simple check to keep title short or dynamic
            quizHeaderTitle.textContent = "문제 풀이 중...";
        } else {
            title = `종합 복습 (${currentQuestionIndex + 1}/${quizQuestions.length})`;
            quizHeaderTitle.textContent = "틀린 문제 완전 정복!";
        }

        quizProgress.textContent = title;
        questionText.textContent = currentQ.question;

        if (quizImageContainer) {
            quizImageContainer.innerHTML = `<div class="quiz-icon">${currentQ.icon}</div>`;
        }

        optionsContainer.innerHTML = '';
        currentQ.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
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
            if (currentQuizMode === 'stage') {
                stageStatus[currentStage].wrong.push(currentQ);
            } else {
                stageStatus.remedialWrong.push(currentQ);
            }
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
        if (currentQuizMode === 'stage') {
            stageStatus[currentStage].cleared = true;

            if (checkAllStagesCleared()) {
                switchScreen('feedback');
                feedbackTitle.textContent = `🚀 ${currentStage}단계 클리어!`;
                feedbackMessage.innerHTML = "와우! 모든 스테이지를 통과했어요!<br>이제 박사님의 정밀 분석 결과를 보러 갈까요?";
                nextStepBtn.textContent = "종합 분석 결과 보기";
                nextStepBtn.onclick = showAnalysisScreen;
            } else {
                switchScreen('feedback');
                feedbackTitle.textContent = `✅ ${currentStage}단계 완료!`;
                feedbackMessage.innerHTML = "수고했습니다! 정말 잘 했어요.<br>다음 스테이지도 도전해볼까요?";
                nextStepBtn.textContent = "스테이지 선택으로";
                nextStepBtn.onclick = () => {
                    updateStageScreen();
                    switchScreen('stage');
                };
            }
        } else {
            if (stageStatus.remedialWrong.length === 0) {
                switchScreen('feedback');
                feedbackTitle.textContent = "🏆 자석 마스터 등극! 🏆";
                feedbackMessage.innerHTML = "모든 약점을 완벽하게 극복했습니다!<br>이제 당신은 진정한 자석 박사입니다.";
                nextStepBtn.textContent = "박사님 만나기 👋";
                nextStepBtn.onclick = () => switchScreen('difficulty');
            } else {
                remedialQueue = [...stageStatus.remedialWrong];
                stageStatus.remedialWrong = [];
                alert("아직 틀린 문제가 남았어요! \n틀린 문제와 유사한 문제로 다시 복습합니다. 💪");
                startFinalRemedial(true);
            }
        }
    }

    // === Analysis Logic ===
    function showAnalysisScreen() {
        switchScreen('analysis');
        let reportHtml = "<div class='analysis-container'>";
        let totalWrong = 0;
        let allWrongItems = [];

        const stageTitles = {
            1: "자석에 붙을까? 붙지 않을까?",
            2: "자석은 밀당의 고수",
            3: "자석과 나침반",
            4: "우리 생활 속의 자석"
        };

        for (let i = 1; i <= 4; i++) {
            const wrongList = stageStatus[i].wrong;
            const count = wrongList.length;
            totalWrong += count;
            allWrongItems = allWrongItems.concat(wrongList);

            let statusBadge = count === 0
                ? "<span class='badge-success'>Perfect! 🎉</span>"
                : `<span class='badge-warning'>${count}문제 오답</span>`;

            reportHtml += `<div class="stage-report-item">
                <div class="stage-report-header">
                    <span class="stage-name">${i}단계: ${stageTitles[i]}</span>
                    ${statusBadge}
                </div>`;

            if (count > 0) {
                reportHtml += `<ul class="wrong-detail-list">`;
                wrongList.forEach(w => {
                    // Determine title: Use original text for items, or a categorized title for concepts
                    let qTitle = "";
                    if (w.originalItem.type === 'item') {
                        qTitle = `물체 퀴즈: ${w.originalItem.text}`;
                    } else {
                        // Extract key topic from reason if possible, or use question summary
                        qTitle = `개념 퀴즈`;
                    }
                    // Actually user wants: "N극과 S극과 관련된 문제를 틀렸어요 : 같은 극끼리는..."
                    // The 'reason' field now contains the concept prefix like "자석의 극: ..."

                    reportHtml += `<li><span class="wrong-mark">❌</span> 문제: <strong>${w.question}</strong><br><span class="reason-text">💡 ${w.reason}</span></li>`;
                });
                reportHtml += `</ul>`;
            }
            reportHtml += `</div>`;
        }
        reportHtml += "</div>";

        analysisReport.innerHTML = reportHtml;

        if (totalWrong === 0) {
            remedialSection.innerHTML = `<h3>와우! 틀린 문제가 하나도 없어요! 👏</h3><p>정말 대단한 실력입니다.</p><br><button id="pass-to-chat" class="primary-btn">박사님 만나러 가기</button>`;
            document.getElementById('pass-to-chat').onclick = () => switchScreen('difficulty');
        } else {
            const btn = document.getElementById('start-remedial-btn');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.style.display = 'inline-block';
            newBtn.onclick = () => {
                remedialQueue = allWrongItems;
                startFinalRemedial(true);
            };
        }
    }

    window.startFinalRemedial = function (fromQueue = false) {
        currentQuizMode = 'remedial';
        currentQuestionIndex = 0;
        stageStatus.remedialWrong = [];

        let targetList = [];
        if (fromQueue) {
            targetList = remedialQueue;
        } else {
            for (let i = 1; i <= 4; i++) targetList = targetList.concat(stageStatus[i].wrong);
        }

        if (targetList.length === 0) {
            alert("틀린 문제가 없어서 바로 박사님을 만납니다!");
            switchScreen('difficulty');
            return;
        }

        quizQuestions = targetList.map(w => getVariantQuestion(w));
        switchScreen('quiz');
        loadQuestion();
    }

    function getVariantQuestion(failedQuestion) {
        const failedItem = failedQuestion.originalItem;

        const potentialVariants = quizDatabase.filter(item =>
            item.stage === failedItem.stage &&
            (item.category === failedItem.category) &&
            item !== failedItem
        );

        if (potentialVariants.length === 0) {
            return { ...failedQuestion, question: `[복습] ${failedQuestion.question}` };
        }

        const variantItem = potentialVariants[Math.floor(Math.random() * potentialVariants.length)];

        if (variantItem.type === 'item') {
            const josa = getJosa(variantItem.text);
            return {
                question: `"${variantItem.text}"${josa} 자석에 붙을까요?`,
                icon: variantItem.icon,
                reason: variantItem.reason,
                options: [
                    { text: "⭕ 붙어요!", correct: variantItem.isMagnetic },
                    { text: "❌ 안 붙어요!", correct: !variantItem.isMagnetic }
                ],
                originalItem: variantItem
            };
        } else {
            return {
                question: variantItem.question,
                icon: variantItem.icon,
                reason: variantItem.reason,
                options: variantItem.options,
                originalItem: variantItem
            };
        }
    }

    function switchScreen(screenName) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        screens[screenName].classList.add('active');

        // Reset scroll position for the content area
        const contentArea = screens[screenName].querySelector('.content-area');
        if (contentArea) {
            contentArea.scrollTop = 0;
        }
    }

    if (startQuizBtn) startQuizBtn.addEventListener('click', () => {
        switchScreen('stage');
        updateStageScreen();
    });

    let currentDifficulty = 'easy';
    if (btnEasy) btnEasy.addEventListener('click', () => { currentDifficulty = 'easy'; startChat(); });
    if (btnHard) btnHard.addEventListener('click', () => { currentDifficulty = 'hard'; startChat(); });
    if (switchBotBtn) switchBotBtn.addEventListener('click', () => switchScreen('difficulty'));
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            if (confirm('처음 화면으로 돌아갈까요? (진행 상황은 초기화됩니다)')) {
                window.location.reload();
            }
        });
    }

    function startChat() {
        switchScreen('chat');
        const greeting = currentDifficulty === 'easy'
            ? "안녕? 난 친절한 자석 박사야! 🐣<br>자석이 왜 힘이 센지, 자석으로 뭘 할 수 있는지 궁금하지 않니?"
            : "반갑습니다. 저는 자석 연구소 소장입니다. 🎓<br>자성, 자기장, 또는 자석의 응용 기술에 대해 질문해 주십시오.";
        document.getElementById('chat-window').innerHTML = '';
        addBotMessage(greeting);
    }

    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const knowledgeBase = [
        { keywords: ['자석이 뭐야', '자석은 뭐야', '자석이란', '자석의 뜻'], answers: { easy: '자석은 보이지 않는 힘인 **자기력**으로 쇠붙이를 잡아당기는 신기한 물체야! 🧲', hard: '자석은 자기장을 형성하여 철, 니켈, 코발트 같은 강자성체 물질을 끌어당기는 성질(자성)을 가진 물체입니다.' } },
        { keywords: ['생겨', '만들어', '원리', '이유'], answers: { easy: '음~ 그건 자석 안에 아주 작은 꼬마 자석들이 한 방향으로 줄을 섰기 때문이야! 더 자세한 건 중학교 과학 시간에 배우게 될 거야! 😉', hard: '물질을 이루는 원자 속의 전자가 회전하면서 자기장을 만듭니다. 보통은 제각각이지만, 자석은 이 자기장들이 한 방향으로 정렬(자구 정렬)되어 있어 큰 힘을 냅니다.' } },
        { keywords: ['극', 'N극', 'S극', '빨간', '파란'], answers: { easy: '자석 양 끝에는 힘이 가장 센 **N극(북쪽)**과 **S극(남쪽)**이 있어. 자석을 아무리 잘게 잘라도 항상 두 극이 새로 생긴단다!', hard: '자석에는 항상 N극과 S극이 쌍으로 존재합니다(쌍극자). 원형 도선에 전류가 흐를 때 생기는 자기장과 같은 원리이기 때문에 단독 극(Monopole)은 존재할 수 없습니다.' } },
        { keywords: ['같은', '다른', '밀어', '당겨', '척력', '인력'], answers: { easy: '같은 극끼리(N-N)는 "저리가!" 하고 밀어내고, 다른 극끼리(N-S)는 "이리 와!" 하고 끌어당겨. 이걸 척력과 인력이라고 해!', hard: '같은 극 사이에는 서로 밀어내는 척력이, 다른 극 사이에는 서로 당기는 인력이 작용합니다. 이는 자기력선이 N극에서 나와 S극으로 들어가려는 성질 때문입니다.' } },
        { keywords: ['붙어', '안 붙어', '달라붙', '철', '금', '은', '동전', '유리', '나무'], answers: { easy: '자석은 철, 못, 가위 같은 **철 친구**들을 좋아해! 하지만 나무, 유리, 플라스틱, 그리고 100원짜리 동전은 좋아하지 않아.', hard: '자석은 강자성체(철, 니켈, 코발트)에는 붙지만, 상자성체(알루미늄)나 반자성체(구리, 금, 물)에는 붙지 않거나 아주 약하게 반응합니다.' } },
        { keywords: ['나침반', '지구', '북쪽', '남쪽', '방향'], answers: { easy: '지구가 아주 커다란 자석이기 때문이야! 나침반의 붉은 바늘(N극)은 북쪽을 좋아해서 항상 북쪽을 가리키는 거란다. 🌏', hard: '지구는 거대한 자기장을 가지고 있습니다. 지리상의 북극 근처에는 사실 자석의 S극 성질이 있어서, 나침반의 N극을 끌어당기는 것입니다.' } },
        { keywords: ['오로라', '북극광'], answers: { easy: '오로라도 자석 때문이야! 지구가 가진 자석 힘이 우주에서 날아오는 나쁜 먼지들을 막아줄 때 생기는 아름다운 빛 커튼이란다. ✨', hard: '태양에서 날아오는 대전 입자(태양풍)가 지구 자기장에 이끌려 대기 중의 기체 원자와 충돌하며 빛을 내는 현상이 바로 오로라입니다.' } },
        { keywords: ['전기', '전자석', '만드는 법', '만들기'], answers: { easy: '전기가 흐르는 동안만 자석이 되는 걸 **전자석**이라고 해. 못에 전선을 감고 건전지를 연결하면 만들 수 있어!', hard: '전류가 흐르면 그 주위에 자기장이 형성됩니다. 코일(솔레노이드) 속에 철심을 넣고 전류를 흘리면 강력한 일시적 자석, 즉 전자석이 됩니다.' } },
        { keywords: ['사용', '쓰임', '어디', '생활', '냉장고', '스피커', '카드'], answers: { easy: '자석은 냉장고 문, 필통, 가방 단추, 그리고 소리를 내는 스피커에도 들어있어! 신용카드 뒷면의 검은 띠도 자석을 이용한 거야.', hard: '자석은 모터, 발전기, 스피커, 하드디스크 등 다양한 전자기기에 필수적입니다. 신용카드의 마그네틱 선에는 자성 물질로 정보가 기록되어 있습니다.' } },
        { keywords: ['기차', '자기부상', '열차', '떠서'], answers: { easy: '자석이 서로 밀어내는 힘을 이용해서 공중에 붕~ 떠서 달리는 **자기부상열차**가 있어! 바퀴가 없어서 아주 빠르고 조용해. 🚄', hard: '자기부상열차는 자석의 척력(밀어내는 힘)이나 인력(당기는 힘)을 이용해 차체를 선로 위로 띄워 마찰 없이 고속으로 주행하는 열차입니다.' } },
        { keywords: ['병원', 'MRI', '엠알아이', '사진'], answers: { easy: '병원에 있는 MRI라는 큰 기계도 엄청 센 자석이야! 자석의 힘으로 우리 몸속을 찰칵찰칵 찍어서 아픈 곳을 찾아낸단다. 🏥', hard: 'MRI(자기공명영상)는 강력한 자기장과 고주파를 이용해 인체 내 수소 원자핵의 반응을 영상화하는 장치입니다. 방사선 피폭 없이 정밀한 진단이 가능합니다.' } },
        { keywords: ['발견', '옛날', '누가', '마그네시아'], answers: { easy: '아주 옛날, "마그네시아"라는 마을의 양치기가 신발 밑에 쇠못이 검은 돌에 붙는 걸 발견했대! 그게 최초의 자석 이야기야.', hard: '자석(Magnet)의 어원은 고대 그리스의 "마그네시아" 지방에서 유래했습니다. 그곳에서 자철석(천연 자석)이 많이 발견되었기 때문입니다.' } }
    ];

    function addBotMessage(text) {
        if (!chatWindow) return;
        const div = document.createElement('div');
        div.className = 'message bot-message';
        div.innerHTML = `<div class="avatar">${currentDifficulty === 'easy' ? '🐣' : '🎓'}</div><div class="bubble">${text}</div>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function addUserMessage(text) {
        if (!chatWindow) return;
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `<div class="bubble">${text}</div><div class="avatar">🧑‍🎓</div>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function handleChatInput() {
        const text = userInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        userInput.value = '';
        setTimeout(() => {
            const lowerInput = text.toLowerCase().replace(/\s+/g, '');
            let reply = "";
            for (let item of knowledgeBase) {
                for (let k of item.keywords) {
                    if (lowerInput.includes(k.replace(/\s+/g, ''))) {
                        reply = item.answers[currentDifficulty];
                        break;
                    }
                }
                if (reply) break;
            }
            if (!reply) {
                reply = currentDifficulty === 'easy'
                    ? "그건 중학교 가서 배우게 될거야~ 아직은 비밀이야! 🤫"
                    : "상당히 심도 있는 질문이군요. 제 데이터베이스에는 없지만, 혹시 '원자'나 '전자'와 관련된 내용이 아닐까요?";
            }
            addBotMessage(reply);
        }, 500);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleChatInput);
    if (userInput) userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleChatInput(); });

});
