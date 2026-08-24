import React, { useState } from 'react';
import { STRESS_CATEGORIES } from '../constants/assets';
import { Sparkles, MessageSquareHeart, ArrowRight, Send, CheckCircle2, User, HelpCircle } from 'lucide-react';

interface Step3ExamineProps {
  selectedCategories: string[];
  situationText: string;
  studentName?: string;
  onToggleCategory: (catId: string) => void;
  onChangeSituation: (text: string) => void;
  onChangeStudentName?: (name: string) => void;
  onSaveConcernToBoard?: () => Promise<boolean>;
  onNext: () => void;
}

export const Step3Examine: React.FC<Step3ExamineProps> = ({
  selectedCategories,
  situationText,
  studentName = '',
  onToggleCategory,
  onChangeSituation,
  onChangeStudentName,
  onSaveConcernToBoard,
  onNext,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToBoard = async () => {
    if (selectedCategories.length === 0 && !situationText.trim()) {
      alert('스트레스 영역을 하나 이상 선택하거나 상황을 적어주세요.');
      return;
    }

    if (onSaveConcernToBoard) {
      setIsSubmitting(true);
      const success = await onSaveConcernToBoard();
      setIsSubmitting(false);
      if (success) {
        setIsSaved(true);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 px-3 sm:px-4 space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-indigo-50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 3 · 나를 들여다보기</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
          요즘 나를 가장 지치게 하는 건 뭘까?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          마음이 무거웠던 이유를 골라보고, 전자칠판에 익명으로 마음을 털어놓아 보세요.
        </p>
      </div>

      {/* 캐릭터 말풍선 가이드 */}
      <div className="flex items-start gap-3 p-4 rounded-[24px] bg-white border border-slate-100 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shrink-0 border border-indigo-100">
          🌱
        </div>
        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="font-semibold text-indigo-600 mb-0.5">온기 쉼표의 조언</p>
          "스트레스의 원인을 밖으로 꺼내놓는 것만으로도 마음의 답답함이 절반으로 줄어들어요. 저장하면 전자칠판 <strong>[1. 우리들의 마음 & 고민 나누기]</strong>에 띄워져 친구들과 함께 공감할 수 있어요."
        </div>
      </div>

      {/* 닉네임 / 이름 입력 (익명 보장) */}
      <div className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>닉네임 또는 별명 (선택)</span>
          </label>
          <span className="text-[11px] text-slate-400">비워두면 '익명 친구'로 등록돼요</span>
        </div>
        <input
          type="text"
          maxLength={15}
          value={studentName}
          onChange={(e) => {
            onChangeStudentName?.(e.target.value);
            setIsSaved(false);
          }}
          placeholder="예: 푸른하늘, 1모둠 지우, 익명 (최대 15자)"
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-slate-900 text-slate-800"
        />
      </div>

      {/* 카테고리 선택 칩 */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
        <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
          해당되는 스트레스 영역을 선택해주세요 (중복 선택 가능)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STRESS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onToggleCategory(cat.id);
                  setIsSaved(false);
                }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="truncate">{cat.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 구체적 상황 주관식 텍스트 */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-100 shadow-xs space-y-2">
        <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
          <span>구체적으로 어떤 상황에서 답답하거나 힘들었나요?</span>
        </label>
        <p className="text-[11px] text-slate-400">
          예: "시험 기간이 다가와서 마음이 불안하고 밤늦게까지 공부하느라 잠이 부족해요."
        </p>

        <textarea
          rows={3}
          maxLength={250}
          value={situationText}
          onChange={(e) => {
            onChangeSituation(e.target.value);
            setIsSaved(false);
          }}
          placeholder="솔직한 마음을 편안하게 적어보세요..."
          className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs sm:text-sm bg-slate-50 resize-none text-slate-800"
        />
        <div className="text-right text-[10px] text-slate-400">
          {situationText.length} / 250자
        </div>
      </div>

      {/* 전자칠판에 바로 띄우기 저장 액션 카드 */}
      <div className={`rounded-2xl p-4 sm:p-4.5 border transition-all ${
        isSaved 
          ? 'bg-emerald-50/80 border-emerald-200' 
          : 'bg-indigo-50/80 border-indigo-200 ring-2 ring-indigo-500/20'
      } flex flex-col sm:flex-row items-center justify-between gap-3`}>
        <div className="text-xs space-y-1 text-center sm:text-left">
          <div className="font-bold flex items-center justify-center sm:justify-start gap-1.5 text-slate-900 text-sm">
            <HelpCircle className={`w-4 h-4 ${isSaved ? 'text-emerald-600' : 'text-indigo-600'}`} />
            <span>우리 반 전자칠판에 고민 띄우기 {isSaved ? '✨ 완료' : '(필수)'}</span>
          </div>
          <p className={`text-[11px] ${isSaved ? 'text-emerald-800' : 'text-indigo-800'}`}>
            {isSaved
              ? '우리 반 전자칠판 [고민 나누기 게시판]에 등록되었어요! 이제 다음 단계로 갈 수 있습니다.'
              : '스트레스 영역과 고민을 적고 아래 버튼을 눌러야 다음 단계(4대 힐링법)로 이동할 수 있어요.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveToBoard}
          disabled={isSubmitting || (selectedCategories.length === 0 && !situationText.trim())}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 active:scale-95 ${
            isSaved
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed animate-pulse'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>전자칠판 등록 완료!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? '전자칠판 등록 중...' : '전자칠판에 고민 띄우기'}</span>
            </>
          )}
        </button>
      </div>

      {/* 다음 단계 버튼 (전자칠판 등록 완료 시에만 활성화) */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (!isSaved) {
              alert('먼저 위의 [전자칠판에 고민 띄우기] 버튼을 눌러 등록을 완료해주세요! 🌿');
              return;
            }
            onNext();
          }}
          disabled={!isSaved}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isSaved
              ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-80'
          }`}
        >
          <span>{isSaved ? '다음: 4대 힐링 관리법 체험하기' : '위의 [전자칠판에 고민 띄우기] 완료 후 이동 가능'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        {!isSaved && (
          <p className="text-[11px] text-center text-slate-400 mt-1.5">
            * 친구들과 마음을 나누기 위해 전자칠판 등록을 먼저 완료해주세요.
          </p>
        )}
      </div>
    </div>
  );
};

