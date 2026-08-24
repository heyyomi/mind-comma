import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

interface Step1LearnProps {
  onNext: () => void;
}

export const Step1Learn: React.FC<Step1LearnProps> = ({ onNext }) => {
  const [subIndex, setSubIndex] = useState(0);
  const total = 5;

  const nextSub = () => {
    if (subIndex < total - 1) {
      setSubIndex(subIndex + 1);
    } else {
      onNext();
    }
  };

  const prevSub = () => {
    if (subIndex > 0) {
      setSubIndex(subIndex - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4">
      {/* 서브 스텝 인디케이터 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 1 · 스트레스 바로 알기</span>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          ({subIndex + 1} / {total})
        </div>
      </div>

      {/* 인디케이터 점선 */}
      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setSubIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === subIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>

      {/* 카드뉴스 본체 */}
      <div className="min-h-[380px] relative">
        <AnimatePresence mode="wait">
          {subIndex === 0 && (
            <motion.div
              key="sub0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  핵심 개념
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  스트레스, 무조건 나쁜 걸까?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  스트레스는 내 마음과 몸이 보내는 소중한 신호등이에요. 얼마나 지속되고 어떻게 회복하느냐가 중요해요.
                </p>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-950 font-bold">초록 불 · 적당한 스트레스</strong>
                    <p className="text-emerald-800 mt-0.5 leading-relaxed">
                      "시험이 있으니 조금 긴장되네." → 집중력과 문제 해결력을 높여주는 긍정적인 힘이 돼요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <div className="w-4 h-4 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-950 font-bold">노란 불 · 스트레스가 쌓이는 중</strong>
                    <p className="text-amber-800 mt-0.5 leading-relaxed">
                      "요즘 계속 피곤하고 예민해!" → 잠시 멈추고 휴식과 충전이 필요하다는 알림이에요.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                  <div className="w-4 h-4 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-950 font-bold">빨간 불 · 감당하기 힘든 스트레스</strong>
                    <p className="text-rose-800 mt-0.5 leading-relaxed">
                      "아무것도 하기 싫고 버거워." → 혼자 끙끙 앓지 말고 선생님이나 어른에게 도움을 요청해요.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {subIndex === 1 && (
            <motion.div
              key="sub1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  원인 찾기
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  내 스트레스는 어디서 올까?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  학생들이 가장 많이 느끼는 5가지 스트레스 영역을 살펴보세요.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl">📚</span>
                  <div>
                    <strong className="text-slate-800">학업 스트레스</strong>
                    <p className="text-[11px] text-slate-500">시험·성적·수행평가·숙제 압박</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl">🧑‍🤝‍🧑</span>
                  <div>
                    <strong className="text-slate-800">관계 스트레스</strong>
                    <p className="text-[11px] text-slate-500">친구 관계·오해·단톡방·SNS 비교</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl">🪞</span>
                  <div>
                    <strong className="text-slate-800">나 자신에 대한 스트레스</strong>
                    <p className="text-[11px] text-slate-500">외모 고민·낮은 자존감·완벽주의</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl">📱</span>
                  <div>
                    <strong className="text-slate-800">환경 & 습관 스트레스</strong>
                    <p className="text-[11px] text-slate-500">수면 부족·스마트폰 과다 사용</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-2xl">🔮</span>
                  <div>
                    <strong className="text-slate-800">변화와 불확실성</strong>
                    <p className="text-[11px] text-slate-500">새 학기 적응·진로 선택·미래에 대한 두려움</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {subIndex === 2 && (
            <motion.div
              key="sub2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  몸과 마음의 신호
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  몸과 마음이 보내는 SOS
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  스트레스가 쌓이면 4가지 영역에서 다양한 증상이 나타납니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                  <strong className="text-indigo-900 block font-bold mb-1">💭 생각의 신호</strong>
                  <ul className="text-indigo-800 space-y-0.5 text-[11px]">
                    <li>• 집중이 잘 안 돼요</li>
                    <li>• 부정적인 걱정이 맴돌아요</li>
                    <li>• 자꾸 깜빡깜빡해요</li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
                  <strong className="text-amber-900 block font-bold mb-1">❤️ 감정의 신호</strong>
                  <ul className="text-amber-800 space-y-0.5 text-[11px]">
                    <li>• 이유 없이 짜증과 눈물</li>
                    <li>• 무기력하고 우울한 기분</li>
                    <li>• 예민해지고 불안해요</li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                  <strong className="text-rose-900 block font-bold mb-1">🩺 몸의 신호</strong>
                  <ul className="text-rose-800 space-y-0.5 text-[11px]">
                    <li>• 잦은 두통과 어지러움</li>
                    <li>• 소화불량, 복통, 속쓰림</li>
                    <li>• 어깨 뭉침, 불면증</li>
                  </ul>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <strong className="text-emerald-900 block font-bold mb-1">🏃 행동의 신호</strong>
                  <ul className="text-emerald-800 space-y-0.5 text-[11px]">
                    <li>• 할 일을 자꾸 미뤄요</li>
                    <li>• 스마트폰만 계속 봐요</li>
                    <li>• 친구를 피하거나 폭식</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 text-xs text-slate-700 font-medium text-center">
                💡 "왜 이러지?" 자책 대신 <strong className="text-slate-900">"아, 내가 지금 많이 지쳤구나"</strong> 알아채주세요.
              </div>
            </motion.div>
          )}

          {subIndex === 3 && (
            <motion.div
              key="sub3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3.5"
            >
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  구분해보기
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  스트레스 vs 소진 vs 우울
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold">
                      <th className="p-2 border-b border-r border-slate-200">구분</th>
                      <th className="p-2 border-b border-r border-slate-200">일반 스트레스</th>
                      <th className="p-2 border-b border-r border-slate-200">소진(번아웃)</th>
                      <th className="p-2 border-b border-slate-200">우울 신호</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">느낌</td>
                      <td className="p-2 border-r border-slate-200">긴장·걱정·초조</td>
                      <td className="p-2 border-r border-slate-200">지침·의욕상실</td>
                      <td className="p-2">슬픔·공허·절망감</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">휴식 시</td>
                      <td className="p-2 border-r border-slate-200">비교적 잘 회복됨</td>
                      <td className="p-2 border-r border-slate-200">회복에 긴 시간 필요</td>
                      <td className="p-2">쉬어도 지속될 수 있음</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold bg-slate-50 border-r border-slate-200">특징</td>
                      <td className="p-2 border-r border-slate-200">특정 원인 해결 시 완화</td>
                      <td className="p-2 border-r border-slate-200">정서적 에너지가 고갈</td>
                      <td className="p-2">2주 이상 일상 마비</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed">
                  우울감이나 무기력이 2주 이상 지속되고 학교생활이 어렵다면, 단순 사춘기로 넘기지 말고 <strong className="text-rose-950">위(Wee)클래스 상담선생님, 보호자, 담임선생님</strong>에게 꼭 도움을 요청하세요.
                </p>
              </div>
            </motion.div>
          )}

          {subIndex === 4 && (
            <motion.div
              key="sub4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                  골든타임 케어
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                  마음 응급처치 5단계 🖐️
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  갑자기 가슴이 답답하고 불안할 때 바로 써먹는 5가지 단계예요.
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong>STOP (잠깐 멈추기)</strong>
                    <p className="text-[11px] text-slate-500">하던 일을 1분간 멈추고 내 몸의 긴장을 느껴요.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong>BREATHE (깊게 호흡하기)</strong>
                    <p className="text-[11px] text-slate-500">코로 깊게 들이쉬고, 입으로 길게 내쉬기를 3번 반복해요.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong>NAME IT (감정에 이름 붙이기)</strong>
                    <p className="text-[11px] text-slate-500">"지금 나는 시험 때문에 긴장하고 두려운 상태야."</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div>
                    <strong>RESET (감각 리셋하기)</strong>
                    <p className="text-[11px] text-slate-500">시원한 물 마시기, 가볍게 스트레칭하기, 창문 열기.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">5</span>
                  <div>
                    <strong>CONNECT (연결하기)</strong>
                    <p className="text-[11px] text-slate-500">혼자 버겁다면 친구나 담임선생님, 위(Wee)클래스 상담선생님에게 털어놓기.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 하단 카드 네비게이션 버튼 */}
      <div className="flex items-center justify-between mt-4 gap-2">
        <button
          onClick={prevSub}
          disabled={subIndex === 0}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white shadow-xs transition-all ${
            subIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 카드</span>
        </button>

        <button
          onClick={nextSub}
          className="flex-1 max-w-[200px] flex items-center justify-center gap-1 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
        >
          <span>{subIndex === total - 1 ? '이해 완료 · 진단하기' : '다음 카드 보기'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
