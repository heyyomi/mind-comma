import React, { useState } from 'react';
import { RecommendedSong, NURSE_PLAYLIST } from '../data/playlist';
import {
  Shuffle,
  ExternalLink,
  Heart,
  Radio,
  Sparkles,
  Music,
  CheckCircle2,
} from 'lucide-react';

interface MusicPlayerCardProps {
  autoPlay?: boolean;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ autoPlay = true }) => {
  // 초기 랜덤 곡 선정
  const [currentSongIndex, setCurrentSongIndex] = useState(() =>
    Math.floor(Math.random() * NURSE_PLAYLIST.length)
  );

  const song: RecommendedSong = NURSE_PLAYLIST[currentSongIndex];

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % NURSE_PLAYLIST.length);
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
          <span>보건샘의 힐링 뮤직 플레이어 📻</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
          {song.tag}
        </span>
      </div>

      {/* 곡 정보 요약 */}
      <div className="flex items-center gap-3.5 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-2xl shadow-lg shrink-0">
          {song.albumEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base sm:text-lg text-white truncate tracking-tight">
              {song.title}
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/30 text-rose-300 border border-rose-400/30 shrink-0">
              실제 원곡
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium truncate">
            {song.artist}
          </p>
        </div>
      </div>

      {/* 🎵 실제 원곡 YouTube 공식 영상 & 오디오 플레이어 */}
      <div className="relative z-10 rounded-2xl overflow-hidden bg-black/90 border border-indigo-400/30 shadow-inner">
        <div className="relative w-full aspect-video sm:h-52 sm:aspect-auto rounded-2xl overflow-hidden">
          <iframe
            key={song.id}
            className="w-full h-full object-cover"
            src={`https://www.youtube-nocookie.com/embed/${song.youtubeEmbedId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`}
            title={`${song.artist} - ${song.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="flex items-center justify-between py-2 px-3 bg-slate-950/80 border-t border-white/10 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>실제 가수 원곡으로 재생됩니다</span>
          </div>
          <a
            href={song.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
          >
            <span>유튜브에서 보기</span>
            <ExternalLink className="w-3 h-3" />
          </a>
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
      <div className="flex items-center justify-between gap-2 pt-1 relative z-10">
        <button
          onClick={handleNextSong}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          title="다른 힘나는 추천곡 듣기"
        >
          <Shuffle className="w-4 h-4" />
          <span>다른 노래 추천받기 🎵</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          총 {NURSE_PLAYLIST.length}곡 중 랜덤 추천
        </span>
      </div>
    </div>
  );
};
