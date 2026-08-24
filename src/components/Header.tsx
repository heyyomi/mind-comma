import React from 'react';
import { Database, Monitor, Leaf, CheckCircle2, ChevronRight, QrCode } from 'lucide-react';
import { StepId, GoogleSheetConfig } from '../types';

interface HeaderProps {
  currentStep: StepId;
  totalSteps: number;
  config: GoogleSheetConfig;
  onOpenSheetModal: () => void;
  onOpenBoardView: () => void;
  onOpenQrModal: () => void;
  onSelectStep: (step: StepId) => void;
}

const STEP_TITLES = [
  '시작',
  '이해하기',
  '자가진단',
  '원인살피기',
  '체험하기',
  '계획세우기',
  '완료',
];

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  config,
  onOpenSheetModal,
  onOpenBoardView,
  onOpenQrModal,
  onSelectStep,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* 상단 라인: 브랜드 & 버튼들 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm sm:text-base">
                <span>온기, 마음 쉼표</span>
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  스트레스 Free Day
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {config.schoolName || '온기 학교'} · {config.className || '우리 반 보건실'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 학생/모바일 QR 참여 버튼 */}
            <button
              onClick={onOpenQrModal}
              title="학생 휴대폰 참여 QR 코드 열기"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">학생 QR</span>
            </button>

            {/* 구글 시트 연동 상태 버튼 (교사용 관리자) */}
            <button
              onClick={onOpenSheetModal}
              title="구글 시트 연동 설정 (관리자 전용)"
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all shadow-xs ${
                config.isConnected || config.webAppUrl
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">
                {config.webAppUrl ? '시트 연동됨' : '구글 시트 연동'}
              </span>
              {config.webAppUrl ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            {/* 전자칠판 전체화면 모드 버튼 (교사용 관리자) */}
            <button
              onClick={onOpenBoardView}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
              title="전자칠판/대형 화면 모드로 열기 (관리자 전용)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">전자칠판</span>
            </button>
          </div>
        </div>

        {/* 하단 스텝 프로그레스 바 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 w-full">
            {STEP_TITLES.map((title, idx) => {
              const isCurrent = currentStep === idx;
              const isPassed = currentStep > idx;
              return (
                <React.Fragment key={title}>
                  <button
                    onClick={() => {
                      if (idx <= currentStep) {
                        onSelectStep(idx as StepId);
                      }
                    }}
                    disabled={idx > currentStep}
                    className={`flex items-center gap-1 text-[11px] whitespace-nowrap px-2 py-0.5 rounded-md transition-all ${
                      isCurrent
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : isPassed
                        ? 'text-indigo-600 font-medium hover:bg-indigo-50 cursor-pointer'
                        : 'text-slate-300 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] border border-current">
                      {idx}
                    </span>
                    <span className="hidden sm:inline">{title}</span>
                  </button>
                  {idx < STEP_TITLES.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
