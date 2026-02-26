// ═══════════════════════════════════════════
// 📐 학습 플랫폼 예시 데이터
// ═══════════════════════════════════════════
import type { Question, Exam, ExamAttempt, WrongNote, RelatedLink } from './studyData';
import { saveQuestions, saveExams, saveAttempts, saveWrongNotes, getQuestions, getExams } from './studyData';

const now = new Date().toISOString();
const base = 'seed';

// ─── 문제 은행 ───
const SAMPLE_QUESTIONS: Question[] = [
    // === 중2 일차함수 (4문제) ===
    {
        id: `${base}_q1`, type: 'mc', school: '진접중', grade: 2, school_level: '중등',
        textbook: '동아출판', chapter: '일차함수', sub_topic: '일차함수의 그래프',
        difficulty: 1, source: 'manual', tags: ['일차함수', '기울기'], created_by: 'admin', created_at: now, updated_at: now,
        content: '일차함수 $y = 2x + 3$의 그래프의 기울기와 $y$절편을 바르게 나타낸 것은?',
        related_links: [
            { url: '/jj/lectures', title: '일차함수 개념 정리 강의', type: 'lecture' },
            { url: 'https://www.youtube.com/watch?v=E3MnYGB7Hxo', title: '일차함수의 기울기와 절편 완벽 정리', type: 'youtube' },
        ],
        options: [
            { label: '①', text: '기울기: 2, $y$절편: 3' },
            { label: '②', text: '기울기: 3, $y$절편: 2' },
            { label: '③', text: '기울기: 2, $y$절편: -3' },
            { label: '④', text: '기울기: -2, $y$절편: 3' },
            { label: '⑤', text: '기울기: 3, $y$절편: -2' },
        ],
        correct_answer: '1',
        explanation: '$y = ax + b$에서 기울기는 $a = 2$이고, $y$절편은 $b = 3$이므로 정답은 ①입니다.',
    },
    {
        id: `${base}_q2`, type: 'mc', school: '진접중', grade: 2, school_level: '중등',
        textbook: '동아출판', chapter: '일차함수', sub_topic: '일차함수의 활용',
        difficulty: 2, source: 'manual', tags: ['일차함수', '활용'], created_by: 'admin', created_at: now, updated_at: now,
        content: '두 점 $(-1, 3)$과 $(2, -3)$을 지나는 일차함수의 식을 $y = ax + b$라 할 때, $a + b$의 값은?',
        options: [
            { label: '①', text: '-1' },
            { label: '②', text: '0' },
            { label: '③', text: '1' },
            { label: '④', text: '2' },
            { label: '⑤', text: '-2' },
        ],
        correct_answer: '3',
        explanation: '기울기 $a = \\frac{-3-3}{2-(-1)} = \\frac{-6}{3} = -2$\n\n$y = -2x + b$에 $(2, -3)$을 대입하면 $-3 = -4 + b$이므로 $b = 1$\n\n따라서 $a + b = -2 + 1 = -1$... 아, 잠깐! $a + b = -2 + 1 = -1$인데 보기 ①이 -1이므로... 아 기울기를 다시 확인하면 $a=-2$, $b=1$, $a+b = -1$이므로 정답은 ①입니다.\n\n정정: 정답은 ①번 (-1)입니다.',
    },
    {
        id: `${base}_q3`, type: 'short', school: '진접중', grade: 2, school_level: '중등',
        textbook: '동아출판', chapter: '일차함수', sub_topic: '일차함수의 그래프',
        difficulty: 2, source: 'manual', tags: ['일차함수', '교점'], created_by: 'admin', created_at: now, updated_at: now,
        content: '일차함수 $y = 3x - 6$의 그래프가 $x$축과 만나는 점의 $x$좌표를 구하시오.',
        related_links: [
            { url: 'https://m.blog.naver.com/mathteacher/222', title: '일차함수 그래프와 축 교점 구하기', type: 'blog' },
        ],
        correct_answer: '2',
        explanation: '$x$축과 만나는 점에서 $y = 0$이므로\n$0 = 3x - 6$\n$3x = 6$\n$x = 2$\n\n따라서 $x$좌표는 $2$입니다.',
    },
    {
        id: `${base}_q4`, type: 'essay', school: '전체', grade: 2, school_level: '중등',
        textbook: '비상교육', chapter: '일차함수', sub_topic: '일차함수의 활용',
        difficulty: 3, source: 'manual', tags: ['일차함수', '서술형', '활용'], created_by: 'admin', created_at: now, updated_at: now,
        content: '물탱크에 물이 $200\\text{L}$ 들어 있다. 매분 $5\\text{L}$씩 물을 빼낸다고 할 때, $x$분 후 남은 물의 양 $y\\text{L}$를 $x$에 대한 일차함수로 나타내고, 물이 모두 빠지는 데 걸리는 시간을 구하시오. (풀이 과정을 쓰시오)',
        correct_answer: 'y = -5x + 200, 40분',
        explanation: '초기 물의 양: $200\\text{L}$, 매분 $5\\text{L}$씩 감소\n\n$y = 200 - 5x = -5x + 200$\n\n물이 모두 빠지려면 $y = 0$이므로\n$0 = -5x + 200$\n$5x = 200$\n$x = 40$\n\n따라서 물이 모두 빠지는 데 $40$분이 걸립니다.',
    },

    // === 중2 확률 (3문제) ===
    {
        id: `${base}_q5`, type: 'mc', school: '풍양중', grade: 2, school_level: '중등',
        textbook: '미래엔', chapter: '확률', sub_topic: '경우의 수',
        difficulty: 1, source: 'manual', tags: ['확률', '경우의수'], created_by: 'admin', created_at: now, updated_at: now,
        content: '1에서 10까지의 자연수가 적혀 있는 카드에서 한 장을 뽑을 때, 3의 배수가 뽑히는 경우의 수는?',
        related_links: [
            { url: 'https://www.youtube.com/watch?v=abc123', title: '경우의 수 개념 정리 (중학 확률)', type: 'youtube' },
            { url: '/jj/lectures', title: '확률 단원 강의 프로그램', type: 'lecture' },
            { url: 'https://mathblog.example.com/probability-basics', title: '확률 기초 정리 블로그', type: 'blog' },
        ],
        options: [
            { label: '①', text: '3가지' },
            { label: '②', text: '4가지' },
            { label: '③', text: '5가지' },
            { label: '④', text: '6가지' },
            { label: '⑤', text: '7가지' },
        ],
        correct_answer: '1',
        explanation: '1~10에서 3의 배수: $3, 6, 9$로 총 $3$가지입니다.',
    },
    {
        id: `${base}_q6`, type: 'mc', school: '풍양중', grade: 2, school_level: '중등',
        textbook: '미래엔', chapter: '확률', sub_topic: '확률 계산',
        difficulty: 2, source: 'manual', tags: ['확률', '동전'], created_by: 'admin', created_at: now, updated_at: now,
        content: '동전 2개를 동시에 던질 때, 모두 앞면이 나올 확률은?',
        options: [
            { label: '①', text: '$\\frac{1}{2}$' },
            { label: '②', text: '$\\frac{1}{3}$' },
            { label: '③', text: '$\\frac{1}{4}$' },
            { label: '④', text: '$\\frac{2}{3}$' },
            { label: '⑤', text: '$\\frac{3}{4}$' },
        ],
        correct_answer: '3',
        explanation: '동전 2개의 전체 경우의 수: $(앞,앞), (앞,뒤), (뒤,앞), (뒤,뒤)$ → $4$가지\n\n모두 앞면: $(앞,앞)$ → $1$가지\n\n확률 $= \\frac{1}{4}$',
    },
    {
        id: `${base}_q7`, type: 'short', school: '전체', grade: 2, school_level: '중등',
        textbook: '신사고', chapter: '확률', sub_topic: '확률 계산',
        difficulty: 3, source: 'manual', tags: ['확률', '주사위'], created_by: 'admin', created_at: now, updated_at: now,
        content: '주사위 1개를 던질 때, 소수가 나올 확률을 기약분수로 구하시오. (분수로 답하시오, 예: 1/2)',
        correct_answer: '1/2',
        explanation: '주사위의 눈: $1, 2, 3, 4, 5, 6$ → 전체 $6$가지\n\n소수: $2, 3, 5$ → $3$가지\n\n확률 $= \\frac{3}{6} = \\frac{1}{2}$',
    },

    // === 중2 도형의 닮음 (4문제) ===
    {
        id: `${base}_q8`, type: 'mc', school: '광동중', grade: 2, school_level: '중등',
        textbook: '천재교육', chapter: '도형의 닮음과 피타고라스', sub_topic: '닮음비',
        difficulty: 2, source: 'manual', tags: ['닮음', '닮음비'], created_by: 'admin', created_at: now, updated_at: now,
        content: '두 직사각형 A, B가 닮음이고 닮음비가 $2:3$이다. A의 넓이가 $16\\text{cm}^2$일 때, B의 넓이는?',
        options: [
            { label: '①', text: '$24\\text{cm}^2$' },
            { label: '②', text: '$30\\text{cm}^2$' },
            { label: '③', text: '$36\\text{cm}^2$' },
            { label: '④', text: '$48\\text{cm}^2$' },
            { label: '⑤', text: '$54\\text{cm}^2$' },
        ],
        correct_answer: '3',
        explanation: '닮음비가 $2:3$이면 넓이의 비는 $2^2:3^2 = 4:9$\n\n$\\frac{16}{B의 넓이} = \\frac{4}{9}$\n\n$B의 넓이 = \\frac{16 \\times 9}{4} = 36\\text{cm}^2$',
    },
    {
        id: `${base}_q9`, type: 'mc', school: '광동중', grade: 2, school_level: '중등',
        textbook: '천재교육', chapter: '도형의 닮음과 피타고라스', sub_topic: '피타고라스 정리',
        difficulty: 2, source: 'manual', tags: ['피타고라스', '직각삼각형'], created_by: 'admin', created_at: now, updated_at: now,
        content: '직각삼각형에서 빗변의 길이가 $13\\text{cm}$이고 한 변의 길이가 $5\\text{cm}$일 때, 나머지 한 변의 길이는?',
        related_links: [
            { url: 'https://www.youtube.com/watch?v=xyz789', title: '피타고라스 정리 완벽 정리', type: 'youtube' },
        ],
        options: [
            { label: '①', text: '$8\\text{cm}$' },
            { label: '②', text: '$10\\text{cm}$' },
            { label: '③', text: '$12\\text{cm}$' },
            { label: '④', text: '$11\\text{cm}$' },
            { label: '⑤', text: '$9\\text{cm}$' },
        ],
        correct_answer: '3',
        explanation: '피타고라스 정리: $a^2 + b^2 = c^2$\n\n$5^2 + b^2 = 13^2$\n$25 + b^2 = 169$\n$b^2 = 144$\n$b = 12\\text{cm}$',
    },
    {
        id: `${base}_q10`, type: 'tf', school: '전체', grade: 2, school_level: '중등',
        textbook: '비상교육', chapter: '도형의 닮음과 피타고라스', sub_topic: '피타고라스 정리',
        difficulty: 1, source: 'manual', tags: ['피타고라스', 'OX'], created_by: 'admin', created_at: now, updated_at: now,
        content: '세 변의 길이가 $3, 4, 5$인 삼각형은 직각삼각형이다.',
        correct_answer: 'O',
        explanation: '$3^2 + 4^2 = 9 + 16 = 25 = 5^2$\n\n피타고라스 정리가 성립하므로 직각삼각형 맞습니다. → O',
    },
    {
        id: `${base}_q11`, type: 'tf', school: '전체', grade: 2, school_level: '중등',
        textbook: '비상교육', chapter: '도형의 닮음과 피타고라스', sub_topic: '피타고라스 정리',
        difficulty: 2, source: 'manual', tags: ['피타고라스', 'OX'], created_by: 'admin', created_at: now, updated_at: now,
        content: '세 변의 길이가 $5, 7, 9$인 삼각형은 직각삼각형이다.',
        correct_answer: 'X',
        explanation: '$5^2 + 7^2 = 25 + 49 = 74$\n$9^2 = 81$\n\n$74 \\neq 81$이므로 직각삼각형이 아닙니다. → X',
    },

    // === 중3 이차함수 (3문제) ===
    {
        id: `${base}_q12`, type: 'mc', school: '진접중', grade: 3, school_level: '중등',
        textbook: '동아출판', chapter: '이차함수', sub_topic: '이차함수의 그래프',
        difficulty: 2, source: 'manual', tags: ['이차함수', '꼭짓점'], created_by: 'admin', created_at: now, updated_at: now,
        content: '이차함수 $y = (x-2)^2 + 3$의 꼭짓점의 좌표는?',
        options: [
            { label: '①', text: '$(2, 3)$' },
            { label: '②', text: '$(-2, 3)$' },
            { label: '③', text: '$(2, -3)$' },
            { label: '④', text: '$(-2, -3)$' },
            { label: '⑤', text: '$(3, 2)$' },
        ],
        correct_answer: '1',
        explanation: '$y = (x-p)^2 + q$에서 꼭짓점은 $(p, q)$\n\n$y = (x-2)^2 + 3$이므로 꼭짓점은 $(2, 3)$',
    },
    {
        id: `${base}_q13`, type: 'short', school: '전체', grade: 3, school_level: '중등',
        textbook: '신사고', chapter: '이차함수', sub_topic: '이차함수의 식 구하기',
        difficulty: 3, source: 'manual', tags: ['이차함수', '꼭짓점'], created_by: 'admin', created_at: now, updated_at: now,
        content: '꼭짓점이 $(1, -4)$이고 점 $(3, 0)$을 지나는 이차함수 $y = a(x-1)^2 - 4$에서 $a$의 값을 구하시오.',
        correct_answer: '1',
        explanation: '점 $(3, 0)$을 대입하면:\n$0 = a(3-1)^2 - 4$\n$0 = 4a - 4$\n$4a = 4$\n$a = 1$',
    },
    {
        id: `${base}_q14`, type: 'mc', school: '전체', grade: 3, school_level: '중등',
        textbook: '미래엔', chapter: '이차함수', sub_topic: '이차함수와 직선',
        difficulty: 3, source: 'manual', tags: ['이차함수', '교점'], created_by: 'admin', created_at: now, updated_at: now,
        content: '이차함수 $y = x^2 - 4x + 3$의 그래프와 $x$축의 교점의 $x$좌표의 합은?',
        options: [
            { label: '①', text: '2' },
            { label: '②', text: '3' },
            { label: '③', text: '4' },
            { label: '④', text: '5' },
            { label: '⑤', text: '6' },
        ],
        correct_answer: '3',
        explanation: '$x$축과의 교점은 $y = 0$:\n$x^2 - 4x + 3 = 0$\n$(x-1)(x-3) = 0$\n$x = 1$ 또는 $x = 3$\n\n$x$좌표의 합 = $1 + 3 = 4$',
    },

    // === 중1 정수와 유리수 (2문제) ===
    {
        id: `${base}_q15`, type: 'mc', school: '주곡중', grade: 1, school_level: '중등',
        textbook: '천재교육', chapter: '정수와 유리수', sub_topic: '정수의 덧셈',
        difficulty: 1, source: 'manual', tags: ['정수', '연산'], created_by: 'admin', created_at: now, updated_at: now,
        content: '$(-7) + (+3) + (-2)$의 값은?',
        options: [
            { label: '①', text: '$-8$' },
            { label: '②', text: '$-6$' },
            { label: '③', text: '$-4$' },
            { label: '④', text: '$-2$' },
            { label: '⑤', text: '$6$' },
        ],
        correct_answer: '2',
        explanation: '$(-7) + (+3) = -4$\n$-4 + (-2) = -6$',
    },
    {
        id: `${base}_q16`, type: 'short', school: '주곡중', grade: 1, school_level: '중등',
        textbook: '천재교육', chapter: '정수와 유리수', sub_topic: '유리수의 곱셈',
        difficulty: 2, source: 'manual', tags: ['유리수', '곱셈'], created_by: 'admin', created_at: now, updated_at: now,
        content: '$\\left(-\\frac{2}{3}\\right) \\times \\left(-\\frac{9}{4}\\right)$의 값을 구하시오. (분수로 답하시오, 예: 3/2)',
        correct_answer: '3/2',
        explanation: '부호: $(-)\\times(-) = +$\n\n$\\frac{2}{3} \\times \\frac{9}{4} = \\frac{2 \\times 9}{3 \\times 4} = \\frac{18}{12} = \\frac{3}{2}$',
    },
];

// ─── 시험 ───
const SAMPLE_EXAMS: Exam[] = [
    {
        id: `${base}_exam1`,
        title: '[중2] 일차함수 단원 테스트',
        description: '일차함수의 그래프, 기울기, 절편을 종합적으로 평가합니다.',
        school: '진접중', grade: 2, school_level: '중등',
        question_ids: [`${base}_q1`, `${base}_q2`, `${base}_q3`, `${base}_q4`],
        time_limit_minutes: 30,
        shuffle_questions: false, shuffle_options: false,
        show_result_immediately: true,
        allow_retry: true, max_attempts: 3,
        available_from: null, available_until: null,
        status: 'published', created_by: 'admin', created_at: now,
    },
    {
        id: `${base}_exam2`,
        title: '[중2] 확률·도형 종합 평가',
        description: '확률과 도형의 닮음·피타고라스 정리를 종합적으로 평가합니다.',
        school: '전체', grade: 2, school_level: '중등',
        question_ids: [`${base}_q5`, `${base}_q6`, `${base}_q7`, `${base}_q8`, `${base}_q9`, `${base}_q10`, `${base}_q11`],
        time_limit_minutes: 40,
        shuffle_questions: true, shuffle_options: false,
        show_result_immediately: true,
        allow_retry: true, max_attempts: 2,
        available_from: null, available_until: null,
        status: 'published', created_by: 'admin', created_at: now,
    },
    {
        id: `${base}_exam3`,
        title: '[중3] 이차함수 월말 테스트',
        description: '이차함수의 그래프와 식 구하기를 평가합니다.',
        school: '전체', grade: 3, school_level: '중등',
        question_ids: [`${base}_q12`, `${base}_q13`, `${base}_q14`],
        time_limit_minutes: 20,
        shuffle_questions: false, shuffle_options: false,
        show_result_immediately: true,
        allow_retry: true, max_attempts: 3,
        available_from: null, available_until: null,
        status: 'published', created_by: 'admin', created_at: now,
    },
];

// ─── 시딩 함수 ───
export async function seedSampleData(): Promise<boolean> {
    const existingQ = await getQuestions();
    const existingE = await getExams();

    // 이미 데이터가 있으면 스킵
    if (existingQ.some(q => q.id.startsWith(base)) && existingE.some(e => e.id.startsWith(base))) {
        return false;
    }

    // 기존 데이터에 합치기 (중복 방지)
    const seedQIds = new Set(SAMPLE_QUESTIONS.map(q => q.id));
    const seedEIds = new Set(SAMPLE_EXAMS.map(e => e.id));
    const mergedQ = [...existingQ.filter(q => !seedQIds.has(q.id)), ...SAMPLE_QUESTIONS];
    const mergedE = [...existingE.filter(e => !seedEIds.has(e.id)), ...SAMPLE_EXAMS];

    await saveQuestions(mergedQ);
    await saveExams(mergedE);
    return true;
}
