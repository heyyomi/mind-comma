import React from 'react';
import { QUIZ_QUESTIONS, QUIZ_OPTIONS } from '../constants/assets';
import { CheckinResult, StressTier } from '../types';
import { AlertTriangle, CheckCircle2, HeartPulse, ArrowRight } from 'lucide-react';

interface Step2DiagnosisProps {
  answers: (number | null)[];
  onSelectOption: (qIndex: number, score: number) => void;
  result: CheckinResult | null;
  onNext: () => void;
}

export const Step2Diagnosis: React.FC<Step2DiagnosisProps> = ({
  answers,
  onSelectOption,
  result,
  onNext,
}) => {
  const allAnswered = answers.every((a) => a !== null);

  const getTierBadge = (tier: StressTier) => {
    switch (tier) {
      case '낮음':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          desc: '스트레스가 매우 잘 관리되고 있어요! 지금처럼 건강한 마음 루틴을 이어가세요.',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
      case '보통':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          desc: '일상적인 수준의 스트레스가 있어요. 오늘의 힐링 체험으로 에너지를 충전해 보세요.',
          icon: <HeartPulse className="w-5 h-5 text-indigo-600" />,
        };
      case '높음':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          desc: '피로와 스트레스가 꽤 쌓인 상태예요. 적극적으로 휴식하고 좋아하는 활동을 실천해 보세요.',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        };
      case '매우 높음':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          desc: '마음의 신호등이 빨간 불이에요. 혼자 끙끙 앓지 말고 보건실이나 위(Wee)클래스 선생님과 이야기해봐요.',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
        };
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-50">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>STEP 2 · 자가진단</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          나의 스트레스 지수는 몇 점일까?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          지난 2주 동안 내 모습과 가장 가까운 것을 솔직하게 골라보세요. (정답은 없어요!)
        </p>
      </div>

      {/* 5문항 퀴즈 카드 목록 */}
      <div className="space-y-3">
        {QUIZ_QUESTIONS.map((q, qIndex) => {
          const selected = answers[qIndex];
          return (
            <div
              key={q.id}
              className="bg-white rounded-[24px] p-4 sm:p-5 border border-slate-100 shadow-xs transition-all"
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {q.id}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {q.question}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUIZ_OPTIONS.map((opt) => {
                  const isPicked = selected === opt.score;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => onSelectOption(qIndex, opt.score)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                        isPicked
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 결과 리포트 박스 */}
      {allAnswered && result && (
        <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTierBadge(result.tier).icon}
              <h3 className="font-bold text-base sm:text-lg text-slate-800">
                진단 결과: {result.score}점 / 15점 만점
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                getTierBadge(result.tier).bg
              }`}
            >
              {result.tier} 단계
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {getTierBadge(result.tier).desc}
          </p>

          <button
            onClick={onNext}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>다음: 스트레스 원인 찾아보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
