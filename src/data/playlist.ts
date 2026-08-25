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
  youtubeEmbedId: string; // YouTube official video / audio ID
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
    youtubeEmbedId: 'M-mEaN6Y62Y',
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
    youtubeEmbedId: 'EIz09kLzN9k',
  },
  {
    id: 'akmu-nakwon',
    title: '낙원 (feat. 이수현)',
    artist: 'AKMU (악뮤)',
    tag: '🏝️ 평온한 휴식과 안식처',
    albumEmoji: '🕊️',
    bgGradient: 'from-sky-500/20 via-blue-500/10 to-emerald-500/10',
    accentColor: 'text-sky-700 bg-sky-50 border-sky-200',
    cheerMessage:
      '지친 너의 마음에 작은 쉼터가 되어줄게. 복잡한 생각은 잠시 내려놓고 마음의 낙원을 만나보렴 ☁️',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=AKMU+낙원',
    youtubeEmbedId: '5Z13t7-7kGE',
  },
  {
    id: 'soran-study-you',
    title: '너를 공부해',
    artist: '소란 (SORAN)',
    tag: '📚 풋풋하고 다정한 미소',
    albumEmoji: '✏️',
    bgGradient: 'from-amber-500/20 via-yellow-500/10 to-indigo-500/10',
    accentColor: 'text-amber-800 bg-amber-50 border-amber-200',
    cheerMessage:
      '네가 무엇을 좋아하고 어떤 때 행복한지, 너 자신을 더 많이 알아가고 아껴주는 소중한 하루가 되길 바라 🌼',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=소란+너를+공부해',
    youtubeEmbedId: '6bWq9lJ1x5o',
  },
  {
    id: 'txt-134340',
    title: '134340',
    artist: 'TOMORROW X TOGETHER (투모로우바이투게더)',
    tag: '🪐 나만의 고유한 우주와 궤도',
    albumEmoji: '🌌',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-indigo-500/10',
    accentColor: 'text-violet-700 bg-violet-50 border-violet-200',
    cheerMessage:
      '남들과 조금 다른 궤도를 돌고 있어도 괜찮아. 넌 우주에서 오직 하나뿐인 신비롭고 아름다운 별이야 🪐✨',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=투모로우바이투게더+134340',
    youtubeEmbedId: '7Q3oYJ9z6eY',
  },
  {
    id: 'gaho-start',
    title: '시작',
    artist: '가호 (Gaho)',
    tag: '🔥 용기와 열정을 채우는 멜로디',
    albumEmoji: '🏃',
    bgGradient: 'from-orange-500/20 via-red-500/10 to-amber-500/10',
    accentColor: 'text-orange-700 bg-orange-50 border-orange-200',
    cheerMessage:
      '원하는 대로 다 가질 수 있어, 우리들의 꿈은 지금부터 시작이야! 가슴 뛰는 너의 내일을 열렬히 응원해! 💥',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=가호+시작',
    youtubeEmbedId: 'O0StKlRHVeE',
  },
  {
    id: 'day6-happy',
    title: 'HAPPY',
    artist: 'DAY6 (데이식스)',
    tag: '🌈 진심 어린 행복을 바라는 마음',
    albumEmoji: '🍀',
    bgGradient: 'from-teal-500/20 via-emerald-500/10 to-cyan-500/10',
    accentColor: 'text-teal-700 bg-teal-50 border-teal-200',
    cheerMessage:
      '어쩌면 오늘도 울고 싶었을지 모를 너에게, 내일은 반드시 활짝 웃을 수 있는 진짜 행복이 찾아올 거야 ☀️',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=DAY6+HAPPY',
    youtubeEmbedId: 'wFk4c0n_5Vw',
  },
  {
    id: 'doyoung-spring',
    title: '새봄의 노래 (Beginning)',
    artist: '도영 (DOYOUNG)',
    tag: '🌸 따스하게 피어나는 새싹의 용기',
    albumEmoji: '💐',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-amber-500/10',
    accentColor: 'text-pink-700 bg-pink-50 border-pink-200',
    cheerMessage:
      '시린 겨울이 지나면 반드시 눈부신 봄이 오듯, 너의 마음속에도 따스한 꽃이 곧 피어날 거야 🌸',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=도영+새봄의+노래',
    youtubeEmbedId: 'f0Xz4z4p3mU',
  },
  {
    id: 'doyoung-firefly',
    title: '반딧불 (Little Light)',
    artist: '도영 (DOYOUNG)',
    tag: '✨ 어둠 속을 밝히는 작은 빛',
    albumEmoji: '🕯️',
    bgGradient: 'from-indigo-500/20 via-purple-500/10 to-blue-500/10',
    accentColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    cheerMessage:
      '작은 반딧불 하나의 빛도 온 방안을 따스하게 비추듯, 너라는 존재는 누군가에게 커다란 희망이자 빛이란다 💛',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=도영+반딧불',
    youtubeEmbedId: 'v83VpZ1qLMc',
  },
  {
    id: 'jannabi-green',
    title: '초록을거머쥔우리는',
    artist: '잔나비',
    tag: '🍃 싱그러운 초록빛 위로',
    albumEmoji: '🌿',
    bgGradient: 'from-green-500/20 via-emerald-500/10 to-lime-500/10',
    accentColor: 'text-teal-700 bg-teal-50 border-teal-200',
    cheerMessage:
      '풋풋한 우리들의 모든 순간이 푸른 여름날처럼 찬란해. 지친 마음 훌훌 털고 다시 힘차게 걸어가 보자 🌿',
    youtubeSearchUrl: 'https://www.youtube.com/results?search_query=잔나비+초록을거머쥔우리는',
    youtubeEmbedId: 'W1qWfQn54s8',
  },
];
