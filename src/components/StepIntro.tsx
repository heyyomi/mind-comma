import React from 'react';
import { ArrowRight, Sparkles, HeartHandshake, Smile, ShieldCheck } from 'lucide-react';

interface StepIntroProps {
  onStart: () => void;
  schoolName: string;
  className: string;
}

export const StepIntro: React.FC<StepIntroProps> = ({ onStart, schoolName, className }) => {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto py-6 sm:py-10 px-4">
      {/* 쉼표 모티프 백그라운드 디자인 */}
      <div className="relative mb-4">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-indigo-50 to-slate-100 flex items-center justify-center shadow-xs mx-auto border border-slate-200 relative overflow-hidden">
          <span className="text-6xl sm:text-7xl font-serif text-indigo-600 font-bold select-none opacity-80">
            ,
          </span>
          <div className="absolute top-2 right-3 text-xl animate-bounce">🍃</div>
          <div className="absolute bottom-2 left-3 text-lg">☁️</div>
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{schoolName} · {className}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug mb-3 tracking-tight">
        온기, 마음 쉼표<br />
        <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">
          스트레스 Free Day
        </span>
      </h1>

      <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-6 font-normal">
        잠깐 멈춰도 괜찮아.<br />
        오늘 하루는 오롯이 내 마음을 따뜻하게 안아주고 돌보는 시간입니다.
      </p>

      {/* 핵심 미션 안내 카드 */}
      <div className="w-full bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm text-left mb-6 space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>오늘의 마음 돌봄 로드맵</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-slate-800">스트레스 이해 & SOS 신호</strong>
              <p className="text-xs text-slate-500 mt-0.5">스트레스는 적이 아니라 내 몸이 보내는 소중한 신호예요.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-slate-800">자가진단 & 나의 원인 찾기</strong>
              <p className="text-xs text-slate-500 mt-0.5">5가지 문항으로 지수를 체크하고 지치게 만든 일을 적어봐요.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-slate-800">4대 힐링 체험 & 다짐 비행기</strong>
              <p className="text-xs text-slate-500 mt-0.5">복식호흡·나비포옹을 체험하고 종이비행기로 다짐을 날려요.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
        >
          <span>마음 쉼표 시작하기</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-5">
        <span className="flex items-center gap-1"><Smile className="w-3.5 h-3.5" /> 비밀 보장 & 익명 참여</span>
        <span>•</span>
        <span className="flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5" /> 나를 위한 따뜻한 선물</span>
      </div>
    </div>
  );
};
