import React, { useState, useEffect, useMemo } from 'react';
import { ClassroomBoardNote, ConcernNote, GoogleSheetConfig, BoardType } from '../types';
import { NOTE_PALETTES, STRESS_CATEGORIES } from '../constants/assets';
import { fetchClassData, exportDataAsCSV, likeLocalConcern } from '../services/googleSheets';
import {
  X,
  RefreshCw,
  Download,
  Database,
  Heart,
  Sparkles,
  MessageSquareHeart,
  Send,
  Layers,
  BarChart3,
  Filter,
  Lock,
} from 'lucide-react';

interface ClassBoardViewProps {
  config: GoogleSheetConfig;
  onClose: () => void;
  onOpenSheetModal: () => void;
  onShowToast: (msg: string) => void;
  onOpenAdminAuth?: () => void;
}

export const ClassBoardView: React.FC<ClassBoardViewProps> = ({
  config,
  onClose,
  onOpenSheetModal,
  onShowToast,
  onOpenAdminAuth,
}) => {
  const [activeBoard, setActiveBoard] = useState<BoardType>('concerns');
  const [plans, setPlans] = useState<ClassroomBoardNote[]>([]);
  const [concerns, setConcerns] = useState<ConcernNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('전체');

  const loadData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const data = await fetchClassData();
      setPlans(data.plans);
      setConcerns(data.concerns);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to load board data:', e);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.webAppUrl]);

  // 고민 카테고리 통계 계산
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    STRESS_CATEGORIES.forEach((cat) => {
      counts[cat.id] = 0;
    });

    let totalTags = 0;
    concerns.forEach((c) => {
      (c.categories || []).forEach((catId) => {
        counts[catId] = (counts[catId] || 0) + 1;
        totalTags += 1;
      });
    });

    return { counts, totalTags };
  }, [concerns]);

  // 필터링된 고민 목록
  const filteredConcerns = useMemo(() => {
    if (selectedCategoryFilter === '전체') return concerns;
    return concerns.filter((c) => (c.categories || []).includes(selectedCategoryFilter));
  }, [concerns, selectedCategoryFilter]);

  const handleLikeConcern = (concernId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = likeLocalConcern(concernId);
    setConcerns(updated);
    onShowToast('따뜻한 공감 하트를 보냈어요! 💖');
  };

  const handleExportCSV = () => {
    const ok = exportDataAsCSV(activeBoard === 'concerns' ? 'concerns' : 'plans');
    if (ok) {
      onShowToast(`${activeBoard === 'concerns' ? '고민 나눔' : '실천 다짐'} 데이터를 CSV로 다운로드했어요!`);
    } else {
      onShowToast('저장된 학생 기록이 없습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto flex flex-col font-sans">
      {/* 상단 네비게이션 & 툴바 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-xs shrink-0">
            {activeBoard === 'concerns' ? '🌿' : '✈️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900">
                {activeBoard === 'concerns' ? '우리들의 마음 & 고민 나누기' : '실천 다짐 종이비행기 하늘'}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                {activeBoard === 'concerns' ? `${concerns.length}건 접수` : `${plans.length}대 도착`}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {config.schoolName} · {config.className} 온기, 마음 쉼표 실시간 전자칠판
            </p>
          </div>
        </div>

        {/* 2가지 종류 전자칠판 모드 스위처 (핵심 탭) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto justify-center">
          <button
            onClick={() => setActiveBoard('concerns')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeBoard === 'concerns'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareHeart className="w-4 h-4 text-indigo-600" />
            <span>1. 마음 & 고민 (STEP 3)</span>
          </button>

          <button
            onClick={() => setActiveBoard('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeBoard === 'plans'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>2. 실천 종이비행기 (STEP 5)</span>
          </button>
        </div>

        {/* 우측 관리 액션 버튼들 */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
          <button
            onClick={() => loadData(false)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            title="실시간 데이터 새로고침"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">새로고침</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            title="현재 게시판 데이터 CSV 다운로드"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">CSV 저장</span>
          </button>

          <button
            onClick={onOpenSheetModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            title="구글 시트 연동 설정 열기"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">시트 설정</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
            title="전자칠판 닫기 (학생 화면으로 복귀)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 전자칠판 본문 컨테이너 */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================================= */}
        {/* [종류 1: STEP 3 마음 & 고민 나누기 게시판] */}
        {/* ========================================================================= */}
        {activeBoard === 'concerns' && (
          <div className="space-y-6">
            {/* 상단 통계 요약 바 (우리 반 고민 현황) */}
            <div className="bg-white rounded-[24px] p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-sm sm:text-base text-slate-800">
                    우리 반 스트레스 요인 실시간 분석
                  </h3>
                  <span className="text-xs text-slate-500 font-normal">
                    (총 {categoryStats.totalTags}개 영역 응답)
                  </span>
                </div>

                {/* 카테고리 필터 버튼 그룹 */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                  <button
                    onClick={() => setSelectedCategoryFilter('전체')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedCategoryFilter === '전체'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    전체 보기 ({concerns.length})
                  </button>
                  {STRESS_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.id}</span>
                      <span className="text-[10px] opacity-80">({categoryStats.counts[cat.id] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 통계 막대 그래프 시각화 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                {STRESS_CATEGORIES.map((cat) => {
                  const count = categoryStats.counts[cat.id] || 0;
                  const percent =
                    categoryStats.totalTags > 0 ? Math.round((count / categoryStats.totalTags) * 100) : 0;
                  return (
                    <div
                      key={cat.id}
                      className={`p-3 rounded-2xl border ${cat.color} flex flex-col justify-between space-y-1.5`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1">
                          <span>{cat.icon}</span>
                          <span>{cat.id}</span>
                        </span>
                        <span className="font-bold">{count}명</span>
                      </div>
                      <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-current h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-right font-medium opacity-80">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 고민 카드 그리드 */}
            {filteredConcerns.length === 0 ? (
              <div className="bg-white rounded-[28px] p-12 border border-slate-200/80 text-center text-slate-400 space-y-3 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl mx-auto">
                  🌿
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                  {selectedCategoryFilter === '전체'
                    ? '아직 등록된 고민 나눔이 없어요'
                    : `'${selectedCategoryFilter}' 영역에 등록된 고민이 없습니다`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  학생들이 STEP 3에서 '요즘 나를 가장 지치게 하는 건 뭘까?'를 작성하고 저장하면 이곳에 실시간으로 나타납니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredConcerns.map((concern, idx) => {
                  const palette = NOTE_PALETTES[(concern.colorIndex ?? idx) % NOTE_PALETTES.length];
                  return (
                    <div
                      key={concern.id || idx}
                      className={`bg-white rounded-[24px] p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 transform hover:-translate-y-0.5 animate-in fade-in duration-300`}
                    >
                      <div className="space-y-2.5">
                        {/* 카드 상단: 작성자 및 카테고리 태그 */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            <span>{concern.studentName || '익명 친구'}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {concern.createdAt?.slice(0, 10) || ''}
                          </span>
                        </div>

                        {/* 카테고리 칩 목록 */}
                        {concern.categories && concern.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {concern.categories.map((cId) => (
                              <span
                                key={cId}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60"
                              >
                                #{cId}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 고민/상황 본문 */}
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50/80 p-3 rounded-xl border border-slate-100 min-h-[60px] whitespace-pre-wrap">
                          {concern.situation ? `"${concern.situation}"` : '선택한 영역의 스트레스를 겪고 있어요.'}
                        </p>
                      </div>

                      {/* 카드 하단: 공감 응원 버튼 */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">함께 공감해주세요</span>
                        <button
                          onClick={(e) => handleLikeConcern(concern.id, e)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-all active:scale-95 border border-rose-100 shadow-2xs"
                          title="공감 하트 보내기"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          <span>{concern.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* [종류 2: STEP 5 실천 다짐 종이비행기 게시판] */}
        {/* ========================================================================= */}
        {activeBoard === 'plans' && (
          <div className="space-y-6">
            {plans.length === 0 ? (
              <div className="bg-white rounded-[28px] p-12 border border-slate-200/80 text-center text-slate-400 space-y-3 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl mx-auto">
                  ✈️
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                  아직 도착한 실천 다짐 비행기가 없어요
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  학생들이 STEP 5에서 '종이비행기 띄워보내기'를 누르면 이곳에 실시간으로 실천 다짐 카드가 도착합니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {plans.map((note, index) => {
                  const palette = NOTE_PALETTES[(note.colorIndex ?? index) % NOTE_PALETTES.length];
                  return (
                    <div
                      key={note.id || index}
                      className={`bg-white rounded-[24px] p-5 border ${palette.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 transform hover:-translate-y-0.5 animate-in fade-in zoom-in-95 duration-300`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${palette.tag}`}>
                            ✈️ {note.studentName || '익명'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {note.createdAt?.slice(0, 10) || ''}
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {note.method}
                        </h4>

                        {note.reason && (
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <strong className="text-slate-800">이유:</strong> {note.reason}
                          </p>
                        )}

                        {note.when && (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <strong className="text-slate-800">언제:</strong> {note.when}
                            {note.how ? ` (${note.how})` : ''}
                          </p>
                        )}

                        {note.expect && (
                          <p className="text-xs text-indigo-700 font-medium leading-relaxed flex items-center gap-1">
                            <span>✨</span>
                            <span>{note.expect}</span>
                          </p>
                        )}
                      </div>

                      {note.cheer && (
                        <div className="pt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">"{note.cheer}"</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 상태 푸터 */}
      <div className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500 flex items-center justify-between max-w-7xl mx-auto w-full">
        <span>* 5초마다 자동 갱신 중 · 마지막 동기화: {lastRefreshed || '방금 전'}</span>
        <span className="flex items-center gap-1.5 font-medium text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{config.schoolName} 보건실 스트레스 Free Day</span>
        </span>
      </div>
    </div>
  );
};

