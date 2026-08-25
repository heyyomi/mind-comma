import React, { useState, useEffect, useRef } from 'react';
import { RecommendedSong, NURSE_PLAYLIST } from '../data/playlist';
import {
  Play,
  Pause,
  Shuffle,
  Volume2,
  VolumeX,
  ExternalLink,
  Music,
  Heart,
  Sparkles,
  Disc3,
  Radio,
  Tv,
} from 'lucide-react';

interface MusicPlayerCardProps {
  autoPlay?: boolean;
}

export const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({ autoPlay = true }) => {
  // 초기 랜덤 곡 선정
  const [currentSongIndex, setCurrentSongIndex] = useState(() =>
    Math.floor(Math.random() * NURSE_PLAYLIST.length)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const song: RecommendedSong = NURSE_PLAYLIST[currentSongIndex];

  // Web Audio synth refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);

  // 음원 연주 함수 (맑은 벨/오르골 톤 합성)
  const playTone = (freq: number) => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // 따뜻한 삼각파 + 부드러운 사인파 혼합 느낌
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // 엔벨로프 (부드러운 오르골/피아노 벨 어택)
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // 무시
    }
  };

  const startPlayback = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setIsPlaying(true);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 멜로디 루프 타이머 처리
  useEffect(() => {
    if (isPlaying && !showVideo) {
      if (timerRef.current) window.clearInterval(timerRef.current);

      noteIndexRef.current = 0;
      const notes = song.melodyNotes;
      const tempo = song.tempoMs;

      // 첫 음 즉시 재생
      playTone(notes[0]);

      timerRef.current = window.setInterval(() => {
        noteIndexRef.current = (noteIndexRef.current + 1) % notes.length;
        playTone(notes[noteIndexRef.current]);
      }, tempo);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentSongIndex, isMuted, showVideo]);

  // 마운트 시 자동 재생 시도
  useEffect(() => {
    if (autoPlay) {
      startPlayback();
    }
    return () => {
      stopPlayback();
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % NURSE_PLAYLIST.length);
  };

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 border border-indigo-700/50 shadow-xl space-y-4 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* 배경 장식 원형 조명 */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* 헤더: 보건샘의 힐링 뮤직 박스 타이틀 & 태그 */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>보건샘의 힐링 플레이리스트 📻</span>
        </div>
        <span className="text-[11px] font-medium text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
          {song.tag}
        </span>
      </div>

      {/* 본문: LP 디스크 & 곡 정보 */}
      <div className="flex items-center gap-4 relative z-10 pt-1">
        {/* 회전하는 LP 비주얼 */}
        <div className="relative shrink-0">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 border-2 border-indigo-400/40 flex items-center justify-center shadow-lg transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
            }`}
          >
            {/* 바이닐 홈 패턴 */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-700/80 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-sm shadow-inner">
                {song.albumEmoji}
              </div>
            </div>
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
        </div>

        {/* 곡명 및 아티스트 */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base sm:text-lg text-white truncate tracking-tight">
              {song.title}
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium truncate">
            {song.artist}
          </p>

          {/* 이퀄라이저 바 애니메이션 */}
          <div className="flex items-end gap-1 h-3.5 pt-1">
            <span
              className={`w-1 bg-indigo-400 rounded-full transition-all ${
                isPlaying ? 'h-3.5 animate-[bounce_0.6s_infinite_0.1s]' : 'h-1 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-rose-400 rounded-full transition-all ${
                isPlaying ? 'h-2.5 animate-[bounce_0.8s_infinite_0.3s]' : 'h-1 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all ${
                isPlaying ? 'h-3 animate-[bounce_0.5s_infinite_0.2s]' : 'h-1 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-emerald-400 rounded-full transition-all ${
                isPlaying ? 'h-2 animate-[bounce_0.7s_infinite_0.4s]' : 'h-1 opacity-40'
              }`}
            />
            <span className="text-[10px] text-slate-400 pl-1.5">
              {showVideo ? '실제 원곡 스트리밍 재생 중 🎧' : isPlaying ? '힐링 멜로디 연주 중 🎶' : '멜로디 일시정지'}
            </span>
          </div>
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

      {/* 실제 원곡 스트리밍 플레이어 (내장 플레이어 지원) */}
      {showVideo && (
        <div className="relative z-10 rounded-2xl overflow-hidden bg-black/80 border border-white/20 p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner">
            <iframe
              className="w-full h-full object-cover"
              src={`https://www.youtube-nocookie.com/embed/${song.youtubeEmbedId || ''}?autoplay=1&rel=0&modestbranding=1`}
              title={`${song.artist} - ${song.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-300">
            <span>🎵 {song.artist} - {song.title} 원곡 재생 중</span>
            <button
              onClick={() => setShowVideo(false)}
              className="text-xs text-rose-300 hover:text-rose-100 font-semibold px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 하단 컨트롤러 바 */}
      <div className="flex items-center justify-between gap-2 pt-1 relative z-10 flex-wrap">
        <div className="flex items-center gap-2">
          {/* 실제 원곡 영상/음악 바로 재생 토글 */}
          <button
            onClick={() => {
              stopPlayback();
              setShowVideo((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
              showVideo
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
            title="앱 내에서 실제 원곡 바로 듣기"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>{showVideo ? '원곡 닫기' : '🎧 실제 원곡 듣기'}</span>
          </button>

          {/* 멜로디 사운드 재생 / 일시정지 */}
          {!showVideo && (
            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/10 transition-all active:scale-95"
              title={isPlaying ? '멜로디 일시정지' : '배경 멜로디 재생'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>멜로디 멈춤</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>멜로디</span>
                </>
              )}
            </button>
          )}

          {/* 랜덤 다음 곡 추천 버튼 */}
          <button
            onClick={() => {
              handleNextSong();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/10 transition-all active:scale-95"
            title="다른 추천곡 듣기"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>다른 노래</span>
          </button>
        </div>

        {/* 오른쪽 음소거 & 유튜브 새 창 열기 */}
        <div className="flex items-center gap-1.5 ml-auto">
          {!showVideo && (
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-all"
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <a
            href={song.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-white/10"
            title="YouTube 새 창에서 검색하기"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">유튜브</span>
          </a>
        </div>
      </div>
    </div>
  );
};
