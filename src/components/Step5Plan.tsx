import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PlanData } from '../types';
import { Send, Sparkles, Heart, Clock, Target, HelpCircle, User, ArrowRight } from 'lucide-react';

interface Step5PlanProps {
  plan: PlanData;
  onChangePlan: (field: keyof PlanData, val: string) => void;
  onSubmitPlan: () => Promise<void>;
  onNext: () => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

export const Step5Plan: React.FC<Step5PlanProps> = ({
  plan,
  onChangePlan,
  onSubmitPlan,
  onNext,
  isSubmitting,
  hasSubmitted,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const handleFlyPlane = async () => {
    if (!plan.method.trim()) {
      setErrorMsg('내가 해보고 싶은 실천 방법을 먼저 적어주세요.');
      return;
    }
    setErrorMsg('');

    // 컨페티 팡파르 발사
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#355E43', '#F4C542', '#E97066', '#9C8AC4', '#66A2E9'],
    });

    await onSubmitPlan();
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 5 · 실천 계획 세우기</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          작은 실천이 단단한 마음을 만들어요 ✈️
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          부담 없는 작은 행동 하나를 정해 우리 반 하늘에 종이비행기로 띄워보내요.
        </p>
      </div>

      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        {/* 이름/닉네임 (선택) */}
        <div>
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>이름 또는 닉네임 (익명도 환영해요)</span>
          </label>
          <input
            type="text"
            maxLength={15}
            value={plan.studentName || ''}
            onChange={(e) => onChangePlan('studentName', e.target.value)}
            placeholder="예: 초록나무 (미입력 시 익명)"
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        {/* 해보고 싶은 방법 */}
        <div>
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>내가 해보고 싶은 실천 방법은? <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            maxLength={40}
            value={plan.method}
            onChange={(e) => onChangePlan('method', e.target.value)}
            placeholder="예: 자기 전 복식호흡 3번 하기 / 좋아하는 음악 1곡 듣기"
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        {/* 선택한 이유 */}
        <div>
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>이 방법을 선택한 이유는?</span>
          </label>
          <textarea
            rows={2}
            maxLength={120}
            value={plan.reason}
            onChange={(e) => onChangePlan('reason', e.target.value)}
            placeholder="예: 잠들기 전에 마음이 차분해질 것 같아서요."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 언제? */}
          <div>
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>언제 할까요?</span>
            </label>
            <input
              type="text"
              maxLength={30}
              value={plan.when}
              onChange={(e) => onChangePlan('when', e.target.value)}
              placeholder="예: 매일 저녁 자기 전 침대에서"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>

          {/* 어떻게? */}
          <div>
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>어떻게 실천할까요?</span>
            </label>
            <input
              type="text"
              maxLength={30}
              value={plan.how}
              onChange={(e) => onChangePlan('how', e.target.value)}
              placeholder="예: 스마트폰 내려놓고 3분간 심호흡"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
            />
          </div>
        </div>

        {/* 어떤 변화를 기대하나요? */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            어떤 긍정적인 변화를 기대하나요?
          </label>
          <textarea
            rows={2}
            maxLength={120}
            value={plan.expect}
            onChange={(e) => onChangePlan('expect', e.target.value)}
            placeholder="예: 긴장이 풀리고 다음 날 아침에 기분 좋게 일어날 것 같아요."
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 resize-none"
          />
        </div>

        {/* 나에게 보내는 응원 한마디 */}
        <div>
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>나에게 보내는 따뜻한 응원의 한마디</span>
          </label>
          <input
            type="text"
            maxLength={60}
            value={plan.cheer}
            onChange={(e) => onChangePlan('cheer', e.target.value)}
            placeholder="예: 힘들었지만 오늘도 너무 잘 버텼어, 넌 최고야!"
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
        )}

        {/* 종이비행기 띄우기 버튼 */}
        <button
          onClick={handleFlyPlane}
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting
              ? '하늘로 띄워보내는 중...'
              : hasSubmitted
              ? '✈️ 종이비행기 다시 띄워보내기'
              : '✈️ 종이비행기 날리듯, 마음 띄워보내기'}
          </span>
        </button>

        <p className="text-[11px] text-slate-400 text-center">
          우리가 날린 종이비행기는 우리 반 전자칠판 게시판에 모여 아름다운 하늘이 돼요.
        </p>
      </div>

      {hasSubmitted ? (
        <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-emerald-50 rounded-[24px] p-4 sm:p-5 border border-amber-200 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-xl shrink-0 shadow-xs">
              🎁
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <span>보거니 관리자에게 보여주세요!</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  상품 수령 단계
                </span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                작성한 실천 다짐 화면을 보거니(보건 선생님/담당자)에게 보여주고 확인 암호를 입력받으세요. 멋진 선물과 함께 완료 리포트로 이동합니다!
              </p>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <span>🎁 보거니 관리자 확인 & 선물 받기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            * 위의 실천 방법을 입력하고 [종이비행기 날리기]를 완료하면 보거니 관리자 확인 단계가 열립니다.
          </p>
        </div>
      )}
    </div>
  );
};
