import { QuizOption, QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: '이유 없이 쉽게 짜증이나 화가 난다.' },
  { id: 2, question: '공부나 일상생활에 집중하기가 어렵다.' },
  { id: 3, question: '잠을 잘 못 자거나 아침에 일어나도 피곤하다.' },
  { id: 4, question: '미래나 결과에 대해 걱정이 많고 불안하다.' },
  { id: 5, question: '두통, 복통, 소화불량 등 몸이 자주 아프다.' },
];

export const QUIZ_OPTIONS: QuizOption[] = [
  { label: '전혀 아니다', score: 0 },
  { label: '가끔 그렇다', score: 1 },
  { label: '자주 그렇다', score: 2 },
  { label: '매우 그렇다', score: 3 },
];

export const STRESS_CATEGORIES = [
  { id: '학업', label: '학업·성적·수행평가', icon: '📚', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { id: '교우관계', label: '친구·교우관계·SNS', icon: '🧑‍🤝‍🧑', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { id: '가족', label: '가족·부모님 기대', icon: '🏡', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { id: '자신', label: '외모·자존감·완벽주의', icon: '🪞', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  { id: '환경', label: '수면부족·스마트폰·시간', icon: '📱', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  { id: '진로', label: '진로·미래 불확실성', icon: '🔮', color: 'bg-blue-50 text-blue-700 border-blue-100' },
];

export const HEALING_METHODS = [
  '가벼운 유산소 걷기 & 산책하기',
  '좋아하는 차분한 음악 감상하기',
  '몰입할 수 있는 나만의 취미 활동',
  '솔직한 감정을 적는 마음 일기 쓰기',
  '믿을 수 있는 친구/선생님/가족과 대화',
  '7~8시간 충분하고 규칙적인 수면',
  '스마트폰 잠시 방 밖에 두고 디지털 디톡스',
  '따뜻한 물로 샤워하고 스트레칭하기',
  '위(Wee)클래스 상담선생님 또는 담임선생님과 대화하기',
];

export const NOTE_PALETTES = [
  { bg: 'bg-white', border: 'border-indigo-100', tag: 'bg-indigo-50 text-indigo-700' },
  { bg: 'bg-white', border: 'border-emerald-100', tag: 'bg-emerald-50 text-emerald-700' },
  { bg: 'bg-white', border: 'border-amber-100', tag: 'bg-amber-50 text-amber-700' },
  { bg: 'bg-white', border: 'border-rose-100', tag: 'bg-rose-50 text-rose-700' },
  { bg: 'bg-white', border: 'border-slate-200', tag: 'bg-slate-100 text-slate-700' },
];
