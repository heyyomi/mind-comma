import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { CheckinResult, PlanData } from '../types';
import { Download, Mail, Check, RotateCcw, Monitor, FileText, HeartHandshake, Image as ImageIcon, Sparkles } from 'lucide-react';
import { MusicPlayerCard } from './MusicPlayerCard';

interface Step6CompleteProps {
  checkin: CheckinResult | null;
  selectedCategories: string[];
  situationText: string;
  selectedMethods: string[];
  plan: PlanData;
  schoolName: string;
  className: string;
  onRestart: () => void;
  onOpenBoardView: () => void;
  onShowToast: (msg: string) => void;
}

export const Step6Complete: React.FC<Step6CompleteProps> = ({
  checkin,
  selectedCategories,
  situationText,
  selectedMethods,
  plan,
  schoolName,
  className,
  onRestart,
  onOpenBoardView,
  onShowToast,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSavingImage, setIsSavingImage] = useState(false);
  const reportCardRef = useRef<HTMLDivElement>(null);

  const generateSummaryText = () => {
    return [
      `🍃 [마음 쉼표, 스트레스 Free Day] 활동 기록`,
      `학교/학급: ${schoolName} · ${className}`,
      `작성 일시: ${new Date().toLocaleString()}`,
      ``,
      `1. 나의 스트레스 진단`,
      `- 총점: ${checkin ? checkin.score : 0}점 / 15점 (${checkin ? checkin.tier : '진단전'} 단계)`,
      ``,
      `2. 요즘 나를 지치게 하는 것`,
      `- 주요 영역: ${selectedCategories.length > 0 ? selectedCategories.join(', ') : '미선택'}`,
      `- 구체적 상황: ${situationText || '기록 없음'}`,
      ``,
      `3. 내가 관심 있는 힐링 방법`,
      `- 선택 항목: ${selectedMethods.length > 0 ? selectedMethods.join(', ') : '미선택'}`,
      ``,
      `4. 나의 작은 실천 계획 (종이비행기)`,
      `- 작성자: ${plan.studentName || '익명'}`,
      `- 실천 방법: ${plan.method || '미작성'}`,
      `- 선택한 이유: ${plan.reason || '미작성'}`,
      `- 실천 시기/장소·시간: ${plan.when || '-'} / ${plan.how || '-'}`,
      `- 기대하는 변화: ${plan.expect || '미작성'}`,
      `- 나에게 보내는 응원: ${plan.cheer || '미작성'}`,
      ``,
      `"스트레스 관리의 목표는 0으로 만드는 것이 아니라, 다시 회복하는 힘을 기르는 것입니다." 🌿`,
    ].join('\n');
  };

  const handleSaveImage = async () => {
    if (!reportCardRef.current) return;
    try {
      setIsSavingImage(true);
      const dataUrl = await toPng(reportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });

      const fileName = `마음쉼표_활동기록_${schoolName || '보건실'}_${className || '우리반'}_${new Date().toISOString().slice(0, 10)}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onShowToast('📸 활동 리포트가 이미지(사진)로 저장되었어요!');
    } catch (err) {
      console.error('Image save error:', err);
      onShowToast('이미지 저장에 실패했습니다. 화면을 캡처해주세요.');
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleSendEmail = () => {
    const email = emailInput.trim();
    if (!email || !email.includes('@')) {
      onShowToast('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    const subject = encodeURIComponent(`[마음 쉼표] 스트레스 Free Day 활동 기록 (${schoolName})`);
    const body = encodeURIComponent(generateSummaryText());
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    onShowToast('이메일 앱이 열렸습니다. 메일 전송을 완료해주세요!');
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide px-3 py-1 rounded-full bg-indigo-50">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>오늘 하루도 정말 애썼어요</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
          마음 쉼표 완료! 🌿
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          오늘 정리한 나만의 실천 다짐을 사진첩에 이미지로 저장해 간직하세요.
        </p>
      </div>

      {/* 영수증/인증서 형태의 요약 리포트 카드 (이미지로 저장 대상) */}
      <div
        ref={reportCardRef}
        className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-3.5 relative overflow-hidden font-sans"
      >
        <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>오늘의 마음 쉼표 리포트</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-700 block">
              {schoolName} · {className}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex justify-between py-1 border-b border-slate-100 items-center">
            <span className="text-slate-500">참여자 (닉네임)</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
              {plan.studentName || '익명 친구'}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100 items-center">
            <span className="text-slate-500">나의 스트레스 지수</span>
            <span className="font-bold text-slate-900">
              {checkin ? checkin.score : 0}점 / 15점 ({checkin ? checkin.tier : '-'})
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100 items-center">
            <span className="text-slate-500">주요 스트레스 영역</span>
            <span className="font-semibold text-right max-w-[200px] truncate text-indigo-700">
              {selectedCategories.length > 0 ? selectedCategories.join(', ') : '선택없음'}
            </span>
          </div>

          {situationText && (
            <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
              <strong className="text-slate-800">요즘 상황:</strong> {situationText}
            </div>
          )}

          <div className="pt-1">
            <span className="text-slate-500 block mb-1 text-[11px] font-semibold">
              나의 작은 실천 다짐 (종이비행기)
            </span>
            <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
              <p className="font-bold text-indigo-950 text-xs sm:text-sm flex items-center gap-1.5">
                <span>✈️</span>
                <span>{plan.method || '실천 다짐'}</span>
              </p>
              {plan.reason && (
                <p className="text-[11px] text-indigo-800">
                  <strong>이유:</strong> {plan.reason}
                </p>
              )}
              {plan.when && (
                <p className="text-[11px] text-indigo-800">
                  <strong>시기/장소·시간:</strong> {plan.when} {plan.how ? `· ${plan.how}` : ''}
                </p>
              )}
              {plan.expect && (
                <p className="text-[11px] text-indigo-900 font-medium flex items-center gap-1">
                  <span>✨</span>
                  <span>{plan.expect}</span>
                </p>
              )}
              {plan.cheer && (
                <p className="text-[11px] font-bold text-indigo-900 mt-1 pt-1.5 border-t border-indigo-200/80 flex items-center gap-1">
                  <span>💌</span>
                  <span>나에게: "{plan.cheer}"</span>
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
            "스트레스 관리의 목표는 0으로 만드는 것이 아니라, 다시 회복하는 힘을 기르는 것입니다." 🌿
          </div>
        </div>
      </div>

      {/* 이미지 저장하기 버튼 (기존 텍스트 복사하기 대체) */}
      <div className="space-y-2">
        <button
          onClick={handleSaveImage}
          disabled={isSavingImage}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
        >
          {isSavingImage ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>이미지 생성 중...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>📸 리포트 이미지 사진첩에 저장하기</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-center text-slate-400">
          * 스마트폰 사진첩 또는 다운로드 폴더에 이미지(PNG)로 영구 보관됩니다.
        </p>
      </div>

      {/* 이메일 전송 카드 */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-slate-100 shadow-xs space-y-2.5">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Mail className="w-4 h-4 text-indigo-600" />
          <span>내 이메일로 텍스트 전송하기</span>
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="이메일 주소 (예: student@school.kr)"
            className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
          <button
            onClick={handleSendEmail}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shrink-0 shadow-xs transition-all"
          >
            보내기
          </button>
        </div>
        <p className="text-[10px] text-slate-400">
          * 버튼을 누르면 기본 메일 앱이 열리며 내용이 자동 입력됩니다.
        </p>
      </div>

      {/* 보건샘 추천 플레이리스트 & 힐링 음악 카드 */}
      <MusicPlayerCard autoPlay={false} />

      {/* 하단 보조 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          onClick={onOpenBoardView}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Monitor className="w-4 h-4" />
          <span>우리 반 종이비행기 하늘 보기</span>
        </button>

        <button
          onClick={onRestart}
          className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>다시 시작하기</span>
        </button>
      </div>
    </div>
  );
};
