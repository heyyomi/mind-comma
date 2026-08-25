export interface RecommendedSong {
  id: string;
  title: string;
  artist: string;
  tag: string;
  albumEmoji: string;
  bgGradient: string;
  accentColor: string;
  cheerMessage: string;
  youtubeSearchUrl: string;
  melodyNotes: number[]; // MIDI note or frequencies for web audio synth
  tempoMs: number;
}

export const NURSE_PLAYLIST: RecommendedSong[] = [
  {
    id: 'akmu-heart',
    title: '기쁨 슬픔 아름다운 마음',
    artist: 'AKMU (악뮤)',
    tag: '🌿 마음에 온기를 채우는 곡',
    albumEmoji: '🌱',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-indigo-500/10',
    accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    cheerMessage:
      '슬픔도 기쁨도 모두 너라는 아름다운 마음의 조각들이란다. 지금 느끼는 모든 감정은 충분히 소중해 💚',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=AKMU+기쁨+슬픔+아름다운+마음',
    melodyNotes: [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33, 523.25],
    tempoMs: 380,
  },
  {
    id: 'akmu-lovelee',
    title: 'Love Lee',
    artist: 'AKMU (악뮤)',
    tag: '✨ 비타민처럼 통통 튀는 힐링',
    albumEmoji: '💖',
    bgGradient: 'from-rose-500/20 via-pink-500/10 to-amber-500/10',
    accentColor: 'text-rose-700 bg-rose-50 border-rose-200',
    cheerMessage:
      '너는 존재 자체로 너무 사랑스럽고 반짝이는 사람이야! 너만의 매력으로 오늘 하루도 자신 있게! 🌟',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=AKMU+Love+Lee',
    melodyNotes: [659.25, 659.25, 783.99, 880.0, 987.77, 880.0, 783.99, 659.25, 587.33],
    tempoMs: 280,
  },
  {
    id: 'jannabi-green',
    title: '초록을거머쥔우리는',
    artist: '잔나비',
    tag: '🍃 싱그러운 초록빛 위로',
    albumEmoji: '🍀',
    bgGradient: 'from-green-500/20 via-emerald-500/10 to-lime-500/10',
    accentColor: 'text-teal-700 bg-teal-50 border-teal-200',
    cheerMessage:
      '풋풋한 우리들의 모든 순간이 푸른 여름날처럼 찬란해. 지친 마음 훌훌 털고 다시 힘차게 걸어가 보자 🌿',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=잔나비+초록을거머쥔우리는',
    melodyNotes: [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25],
    tempoMs: 360,
  },
  {
    id: 'jannabi-for-lovers',
    title: '주저하는 연인들을 위해',
    artist: '잔나비',
    tag: '☕ 마음이 몽글몽글해지는 온기',
    albumEmoji: '🌙',
    bgGradient: 'from-amber-500/20 via-orange-500/10 to-indigo-500/10',
    accentColor: 'text-amber-800 bg-amber-50 border-amber-200',
    cheerMessage:
      '때로는 천천히 쉬어가도 괜찮아. 서두르지 않아도 돼, 네 마음에 따뜻한 온기가 항상 머물기를 바라 🍵',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=잔나비+주저하는+연인들을+위해',
    melodyNotes: [440.0, 523.25, 659.25, 783.99, 659.25, 523.25, 440.0, 392.0],
    tempoMs: 440,
  },
  {
    id: 'okdal-today',
    title: '수고했어, 오늘도',
    artist: '옥상달빛',
    tag: '🌙 토닥토닥 다정한 위로',
    albumEmoji: '🕯️',
    bgGradient: 'from-indigo-500/20 via-blue-500/10 to-slate-500/10',
    accentColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    cheerMessage:
      '오늘 하루도 정말 고생 많았어. 아무도 몰라줘도 네가 얼마나 최선을 다했는지 보건샘은 다 알고 있단다 토닥토닥 🤍',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=옥상달빛+수고했어+오늘도',
    melodyNotes: [523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 659.25, 523.25],
    tempoMs: 400,
  },
  {
    id: 'iu-celebrity',
    title: 'Celebrity',
    artist: '아이유 (IU)',
    tag: '🌟 넌 세상에서 가장 빛나는 별',
    albumEmoji: '✨',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-pink-500/10',
    accentColor: 'text-violet-700 bg-violet-50 border-violet-200',
    cheerMessage:
      '잊지 마, 넌 흐린 어둠 속에서도 유일하게 빛나는 특별한 별이자 단 하나뿐인 셀러브리티야 💫',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=아이유+Celebrity',
    melodyNotes: [659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 587.33],
    tempoMs: 320,
  },
  {
    id: 'day6-page',
    title: '한 페이지가 될 수 있게',
    artist: 'DAY6 (데이식스)',
    tag: '⚡ 벅차오르는 에너지와 용기',
    albumEmoji: '🎸',
    bgGradient: 'from-blue-500/20 via-cyan-500/10 to-indigo-500/10',
    accentColor: 'text-blue-700 bg-blue-50 border-blue-200',
    cheerMessage:
      '오늘 우리가 함께 보낸 이 시간도 찬란하고 빛나는 너의 청춘의 멋진 한 페이지가 될 거야! 힘차게 가보자! 🚀',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=DAY6+한+페이지가+될+수+있게',
    melodyNotes: [523.25, 659.25, 783.99, 1046.5, 783.99, 880.0, 1046.5, 1174.66],
    tempoMs: 250,
  },
];
