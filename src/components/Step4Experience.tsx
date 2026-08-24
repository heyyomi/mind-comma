import React, { useState, useEffect } from 'react';
import { MiniSimType } from '../types';
import { HEALING_METHODS } from '../constants/assets';
import { Wind, Activity, Timer, Bell, Play, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Step4ExperienceProps {
  selectedMethods: string[];
  onToggleMethod: (method: string) => void;
  onNext: () => void;
}

export const Step4Experience: React.FC<Step4ExperienceProps> = ({
  selectedMethods,
  onToggleMethod,
  onNext,
}) => {
  const [activeSim, setActiveSim] = useState<MiniSimType>('breath');

  // 1. 복식호흡 상태
  const [breathPhase, setBreathPhase] = useState<'대기' | '들이쉬기 (4초)' | '내쉬기 (6초)' | '완료'>('대기');
  const [breathCount, setBreathCount] = useState(0);

  // 2. 나비포옹법 상태
  const [butterflyCount, setButterflyCount] = useState(0);
  const [butterflySide, setButterflySide] = useState<'left' | 'right' | null>(null);

  // 3. 근육이완법 상태
  const [musclePhase, setMusclePhase] = useState<'대기' | '5초간 꽉 쥐기!' | '툭 풀고 이완~' | '완료'>('대기');
  const [muscleTimer, setMuscleTimer] = useState(5);

  // 4. 소리명상 상태
  const [soundRunning, setSoundRunning] = useState(false);
  const [soundSeconds, setSoundSeconds] = useState(30);

  // 복식호흡 루프
  useEffect(() => {
    let timer: any;
    if (breathPhase === '들이쉬기 (4초)') {
      timer = setTimeout(() => {
        setBreathPhase('내쉬기 (6초)');
      }, 4000);
    } else if (breathPhase === '내쉬기 (6초)') {
      timer = setTimeout(() => {
        if (breathCount < 2) {
          setBreathCount((prev) => prev + 1);
          setBreathPhase('들이쉬기 (4초)');
        } else {
          setBreathPhase('완료');
        }
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [breathPhase, breathCount]);

  // 근육이완 타이머
  useEffect(() => {
    let interval: any;
    if (musclePhase === '5초간 꽉 쥐기!' && muscleTimer > 0) {
      interval = setInterval(() => {
        setMuscleTimer((t) => t - 1);
      }, 1000);
    } else if (musclePhase === '5초간 꽉 쥐기!' && muscleTimer === 0) {
      setMusclePhase('툭 풀고 이완~');
      setTimeout(() => {
        setMusclePhase('완료');
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [musclePhase, muscleTimer]);

  // 소리명상 타이머
  useEffect(() => {
    let interval: any;
    if (soundRunning && soundSeconds > 0) {
      interval = setInterval(() => {
        setSoundSeconds((s) => s - 1);
      }, 1000);
    } else if (soundRunning && soundSeconds === 0) {
      setSoundRunning(false);
    }
    return () => clearInterval(interval);
  }, [soundRunning, soundSeconds]);

  const startBreath = () => {
    setBreathCount(0);
    setBreathPhase('들이쉬기 (4초)');
  };

  const tapButterfly = (side: 'left' | 'right') => {
    setButterflySide(side);
    if (butterflyCount < 10) {
      setButterflyCount((c) => c + 1);
    }
  };

  const startMuscle = () => {
    setMuscleTimer(5);
    setMusclePhase('5초간 꽉 쥐기!');
  };

  const toggleSound = () => {
    if (!soundRunning) {
      setSoundSeconds(30);
      setSoundRunning(true);
    } else {
      setSoundRunning(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 space-y-5">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 4 · 힐링 관리법 체험</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          지금 바로 해보는 4대 미니 체험 🌿
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          마음에 드는 관리법 탭을 눌러 1분간 가볍게 몸과 마음을 이완해 보세요.
        </p>
      </div>

      {/* 4대 체험 탭 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => setActiveSim('breath')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
            activeSim === 'breath'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wind className="w-5 h-5 mb-1" />
          <span>복식호흡</span>
        </button>

        <button
          onClick={() => setActiveSim('butterfly')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
            activeSim === 'butterfly'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-lg mb-0.5">🦋</span>
          <span>나비포옹법</span>
        </button>

        <button
          onClick={() => setActiveSim('muscle')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
            activeSim === 'muscle'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-5 h-5 mb-1" />
          <span>근육이완</span>
        </button>

        <button
          onClick={() => setActiveSim('sound')}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
            activeSim === 'sound'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-5 h-5 mb-1" />
          <span>소리명상</span>
        </button>
      </div>

      {/* 시뮬레이터 인터랙션 박스 */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200 shadow-sm text-center">
        {activeSim === 'breath' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-800">🌬️ 4·6 복식호흡법</h3>
            <p className="text-xs text-slate-500">
              배에 손을 얹고 4초간 코로 천천히 들이쉬고, 6초간 입으로 길게 내쉬어요. (총 3회)
            </p>

            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-[3000ms] ${
                  breathPhase.startsWith('들이쉬기')
                    ? 'scale-125 bg-gradient-to-tr from-indigo-500 to-indigo-600 ring-8 ring-indigo-100'
                    : breathPhase.startsWith('내쉬기')
                    ? 'scale-90 bg-gradient-to-tr from-slate-700 to-slate-800'
                    : breathPhase === '완료'
                    ? 'scale-100 bg-emerald-600'
                    : 'scale-100 bg-slate-900'
                }`}
              >
                <div className="text-center px-2 leading-tight">
                  {breathPhase === '대기' && '시작 준비'}
                  {breathPhase === '들이쉬기 (4초)' && '코로 들이쉬기\n(4초)'}
                  {breathPhase === '내쉬기 (6초)' && '입으로 내쉬기\n(6초)'}
                  {breathPhase === '완료' && '호흡 완료! 🌿'}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-3">
                {breathPhase !== '대기' && breathPhase !== '완료' && `반복: ${breathCount + 1} / 3회`}
              </div>
            </div>

            <button
              onClick={startBreath}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all"
            >
              {breathPhase === '대기' || breathPhase === '완료' ? '호흡 시작하기' : '다시 시작하기'}
            </button>
          </div>
        )}

        {activeSim === 'butterfly' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-800">🦋 나비포옹법 (Butterfly Hug)</h3>
            <p className="text-xs text-slate-500">
              양손을 가슴 위에 교차해 얹고, 좌우를 번갈아 톡톡 두드려 10회를 채워보세요.
            </p>

            <div className="py-4 flex flex-col items-center">
              <div className="text-3xl font-extrabold text-slate-900 font-mono mb-3">
                {butterflyCount} / 10 회
              </div>

              <div className="flex items-center gap-4 justify-center">
                <button
                  onClick={() => tapButterfly('left')}
                  className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-95 ${
                    butterflySide === 'left'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">👈</span>
                  <span>왼쪽 톡</span>
                </button>

                <button
                  onClick={() => tapButterfly('right')}
                  className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-95 ${
                    butterflySide === 'right'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm scale-105'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">👉</span>
                  <span>오른쪽 톡</span>
                </button>
              </div>

              {butterflyCount >= 10 && (
                <p className="text-xs font-bold text-emerald-700 mt-3 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  스스로를 따뜻하게 다독여주었어요!
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setButterflyCount(0);
                setButterflySide(null);
              }}
              className="py-1.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all"
            >
              카운트 리셋
            </button>
          </div>
        )}

        {activeSim === 'muscle' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-800">💪 점진적 근육이완법</h3>
            <p className="text-xs text-slate-500">
              주먹을 5초간 온 힘을 다해 꽉 쥐었다가, 신호에 맞춰 한번에 '툭' 힘을 빼보세요.
            </p>

            <div className="py-4 flex flex-col items-center">
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center font-extrabold text-2xl shadow-inner transition-all ${
                  musclePhase === '5초간 꽉 쥐기!'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : musclePhase === '툭 풀고 이완~'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {musclePhase === '5초간 꽉 쥐기!' ? `${muscleTimer}초` : '✊'}
              </div>

              <div className="text-sm font-semibold text-slate-800 mt-3">
                상태: {musclePhase}
              </div>
            </div>

            <button
              onClick={startMuscle}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all"
            >
              이완 시작하기 (5초 쥐기)
            </button>
          </div>
        )}

        {activeSim === 'sound' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-800">🔔 30초 소리명상</h3>
            <p className="text-xs text-slate-500">
              눈을 편안히 감고, 지금 내 주변(교실, 창밖, 숨소리)에서 들리는 소리에 귀를 기울여보세요.
            </p>

            <div className="py-4 flex flex-col items-center">
              <div className="text-4xl font-extrabold text-slate-900 font-mono mb-2">
                {soundSeconds} 초
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {soundRunning ? '소리에 온전히 집중하는 중...' : '30초 타이머 준비 완료'}
              </div>
            </div>

            <button
              onClick={toggleSound}
              className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 mx-auto transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{soundRunning ? '일시정지' : '소리명상 시작'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 일상 속 추가 힐링 방법 선택 칩 */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-100 shadow-xs space-y-2.5">
        <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
          내가 일상에서 실천해보고 싶은 또 다른 힐링 방법은? (선택)
        </label>

        <div className="flex flex-wrap gap-2">
          {HEALING_METHODS.map((method) => {
            const isPicked = selectedMethods.includes(method);
            return (
              <button
                key={method}
                onClick={() => onToggleMethod(method)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-medium border transition-all ${
                  isPicked
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isPicked ? '✓ ' : '+ '}
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
      >
        <span>다음: 나만의 실천 계획 세우기</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
