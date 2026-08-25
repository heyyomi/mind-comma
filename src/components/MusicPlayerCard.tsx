import React, { useState } from 'react';
import { RecommendedSong, NURSE_PLAYLIST } from '../data/playlist';
import {
  Shuffle,
  ExternalLink,
  Heart,
  Radio,
  Sparkles,
  Music2,
  Play,
  ListMusic,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

interface MusicPlayerCardProps {
  autoPlay?: boolean;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ autoPlay = true }) => {
  // 초기 추천 곡 (랜덤)
  const [currentSongIndex, setCurrentSongIndex] = useState(() =>
    Math.floor(Math.random() * NURSE_PLAYLIST.length)
  );
  const [showList, setShowList] = useState(false);

  const song: RecommendedSong = NURSE_PLAYLIST[currentSongIndex];

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % NURSE_PLAYLIST.length);
  };

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
    setShowList(false);
  };

  const handleOpenYouTube = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-6 border border-indigo-500/30 shadow-2xl space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* 배경 은은한 조명 효과 */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더: 보건샘 추천 타이틀 & 태그 */}
      <div className="flex items-center justify-between gap-2 relative z-10 flex-wrap">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-bold backdrop-blur-xs">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>보건샘의 공식 원곡 플레이어 🎧</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            {song.tag}
          </span>
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/40 px-2.5 py-1 rounded-lg border border-indigo-400/30 transition-colors"
            title="전체 선곡 목록 보기"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>선곡표 {showList ? '닫기' : '열기'}</span>
          </button>
        </div>
      </div>

      {/* 선곡표 드롭다운/리스트 */}
      {showList && (
        <div className="relative z-20 bg-slate-950/90 border border-indigo-500/40 rounded-2xl p-3 max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar animate-in fade-in duration-200">
          <p className="text-[11px] font-bold text-indigo-300 px-1 mb-1">
            원하는 노래를 클릭하여 바로 감상해보세요:
          </p>
          {NURSE_PLAYLIST.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleSelectSong(idx)}
              className={`w-full text-left flex items-center justify-between gap-2 p-2 rounded-xl text-xs transition-all ${
                idx === currentSongIndex
                  ? 'bg-indigo-600/60 border border-indigo-400 font-bold text-white shadow-xs'
                  : 'hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-base shrink-0">{item.albumEmoji}</span>
                <span className="truncate">{item.title}</span>
                <span className="text-[11px] text-slate-400 shrink-0">· {item.artist}</span>
              </div>
              {idx === currentSongIndex && (
                <span className="text-[10px] text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded-md shrink-0">
                  재생 중
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 곡 정보 카드 */}
      <div className="flex items-center gap-3.5 relative z-10 bg-white/5 p-3.5 rounded-2xl border border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-3xl shadow-lg shrink-0">
          {song.albumEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-base sm:text-lg text-white truncate tracking-tight">
              {song.title}
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/30 text-rose-300 border border-rose-400/30 shrink-0">
              가수 공식 원곡
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium truncate mt-0.5">
            {song.artist}
          </p>
        </div>

        {/* YouTube 공식 음원 즉시 재생 버튼 */}
        <button
          onClick={() => handleOpenYouTube(song.youtubeUrl)}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          title="YouTube 공식 음원 고화질/고음질로 즉시 듣기"
        >
          <Headphones className="w-4 h-4" />
          <span className="hidden sm:inline">원곡 바로듣기</span>
          <span className="sm:hidden">원곡 듣기</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-90" />
        </button>
      </div>

      {/* 🎵 YouTube 스트리밍 플레이어 영역 */}
      <div className="relative z-10 rounded-2xl overflow-hidden bg-black/90 border border-indigo-400/30 shadow-inner space-y-2 p-2">
        <div className="relative w-full aspect-video sm:h-60 sm:aspect-auto rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
          <iframe
            key={`${song.id}-${currentSongIndex}`}
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${song.youtubeEmbedId}?autoplay=${autoPlay ? 1 : 0}&playsinline=1&rel=0`}
            title={`${song.artist} - ${song.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* 하단 친절한 원곡 스트리밍 안내바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 text-[11px] text-slate-300 bg-slate-950/80 rounded-xl border border-white/5">
          <div className="flex items-center gap-1.5 text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              선택된 곡: <strong>{song.artist} - {song.title}</strong>
            </span>
          </div>
          <button
            onClick={() => handleOpenYouTube(song.youtubeUrl)}
            className="flex items-center gap-1 text-rose-300 hover:text-rose-100 font-bold underline shrink-0 cursor-pointer self-end sm:self-auto text-xs"
          >
            <Play className="w-3 h-3 fill-rose-300" />
            <span>YouTube 공식 영상/음원으로 완곡 감상하기 ↗</span>
          </button>
        </div>
      </div>

      {/* 보건샘의 따뜻한 응원 한마디 말풍선 */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 relative z-10 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>보건샘의 다정한 응원 한마디</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
          "{song.cheerMessage}"
        </p>
      </div>

      {/* 하단 컨트롤러: 다른 추천곡 셔플 버튼 */}
      <div className="flex items-center justify-between gap-2 pt-1 relative z-10 flex-wrap">
        <button
          onClick={handleNextSong}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          title="다음 힐링 노래 추천받기"
        >
          <Shuffle className="w-4 h-4" />
          <span>다른 노래 추천받기 🎵</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            총 {NURSE_PLAYLIST.length}곡 플레이리스트
          </span>
          <button
            onClick={() => handleOpenYouTube(song.youtubeUrl)}
            className="flex items-center gap-1 text-indigo-300 hover:text-white font-semibold underline cursor-pointer"
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>YouTube 바로열기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
