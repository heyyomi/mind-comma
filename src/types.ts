export type StepId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface QuizQuestion {
  id: number;
  question: string;
}

export interface QuizOption {
  label: string;
  score: number;
}

export type StressTier = '낮음' | '보통' | '높음' | '매우 높음';

export interface CheckinResult {
  score: number;
  tier: StressTier;
  answers: (number | null)[];
  testedAt: string;
}

export interface StressFactorState {
  selectedCategories: string[];
  situationText: string;
  studentName?: string;
}

export type MiniSimType = 'breath' | 'butterfly' | 'muscle' | 'sound';

export interface PlanData {
  method: string;
  reason: string;
  when: string;
  how: string;
  expect: string;
  cheer: string;
  studentName?: string;
  gradeClass?: string;
  createdAt: string;
  id: string;
}

export interface ConcernNote {
  id: string;
  studentName: string;
  gradeClass?: string;
  categories: string[];
  situation: string;
  createdAt: string;
  colorIndex?: number;
  likes?: number;
}

export interface GoogleSheetConfig {
  webAppUrl: string;
  sheetName: string;
  lastConnectedAt?: string;
  isConnected: boolean;
  schoolName: string;
  className: string;
}

export interface ClassroomBoardNote {
  id: string;
  method: string;
  reason?: string;
  when?: string;
  how?: string;
  expect?: string;
  cheer?: string;
  studentName?: string;
  gradeClass?: string;
  createdAt: string;
  colorIndex?: number;
}

export type BoardType = 'concerns' | 'plans';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

