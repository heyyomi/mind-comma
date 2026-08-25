import React, { useState } from 'react';
import { RecommendedSong, NURSE_PLAYLIST } from '../data/playlist';
import {
  Shuffle,
  ExternalLink,
  Heart,
  Radio,
  Sparkles,
  Music2,
  Tv,
  PlayCircle,
  Volume2,
} from 'lucide-react';

interface MusicPlayerCardProps {
  autoPlay?: boolean;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ autoPlay = true }) => {
  // 초기 랜덤 곡 선정
  const [currentSongIndex, setCurrentSongIndex] = useState(() =>
    Math.floor(Math.random() * NURSE_PLAYLIST.length)
  );
  const [showEmbed, setShowEmbed] = useState(true);

  const song: RecommendedSong = NURSE_PLAYLIST[currentSongIndex];

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % NURSE_PLAYLIST.length);
  };

  const handleOpenDirect = () => {
    window.open(song.youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-4 sm:p-6 border border-indigo-500/30 shadow-2xl space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* 배경 은은한 조명 효과 */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더: 보건샘 추천 타이틀 & 태그 */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 text-xs font-bold backdrop-blur-xs">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>보건샘의 힐링 플레이리스트 📻</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
          {song.tag}
        </span>
      </div>

      {/* 곡 정보 카드 */}
      <div className="flex items-center gap-3.5 relative z-10 bg-white/5 p-3.5 rounded-2xl border border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-3xl shadow-lg shrink-0">
          {song.albumEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base sm:text-lg text-white truncate tracking-tight">
              {song.title}
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/30 text-rose-300 border border-rose-400/30 shrink-0">
              가수 원곡
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium truncate mt-0.5">
            {song.artist}
          </p>
        </div>

        {/* 큰 원곡 즉시 재생 버튼 */}
        <button
          onClick={handleOpenDirect}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
          title="YouTube 공식 음원 새 창에서 고음질로 듣기"
        >
          <PlayCircle className="w-4 h-4" />
          <span className="hidden sm:inline">원곡 바로듣기</span>
          <span className="sm:hidden">듣기</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </button>
      </div>

      {/* 🎵 YouTube 플레이어 영역 */}
      {showEmbed && (
        <div className="relative z-10 rounded-2xl overflow-hidden bg-black/90 border border-indigo-400/30 shadow-inner space-y-2 p-2">
          <div className="relative w-full aspect-video sm:h-56 sm:aspect-auto rounded-xl overflow-hidden">
            <iframe
              key={`${song.id}-${currentSongIndex}`}
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${song.youtubeEmbedId}?autoplay=${autoPlay ? 1 : 0}&playsinline=1&rel=0`}
              title={`${song.artist} - ${song.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-2 py-1 text-[11px] text-slate-300 bg-slate-950/60 rounded-lg">
            <span className="text-amber-200">
              💡 일부 음원이 저작권 보호로 재생이 제한될 경우 우측의 <strong>[원곡 바로듣기]</strong>를 누르면 YouTube에서 완벽하게 감상하실 수 있습니다.
            </span>
            <button
              onClick={handleOpenDirect}
              className="text-rose-300 hover:text-rose-100 font-bold underline shrink-0 cursor-pointer self-end sm:self-auto"
            >
              YouTube 공식 음원 열기 ↗
            </button>
          </div>
        </div>
      )}

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
          title="다른 힘나는 추천곡 듣기"
        >
          <Shuffle className="w-4 h-4" />
          <span>다른 노래 추천받기 🎵</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            총 {NURSE_PLAYLIST.length}곡 중 랜덤 추천
          </span>
          <button
            onClick={handleOpenDirect}
            className="flex items-center gap-1 text-indigo-300 hover:text-white font-semibold underline"
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>YouTube 재생</span>
          </button>
        </div>
      </div>
    </div>
  );
};
