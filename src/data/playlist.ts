export interface RecommendedSong {
  id: string;
  title: string;
  artist: string;
  tag: string;
  albumEmoji: string;
  cheerMessage: string;
  youtubeUrl: string;
  youtubeEmbedId: string;
}

export const NURSE_PLAYLIST: RecommendedSong[] = [
  {
    id: 'akmu-heart',
    title: '기쁨, 슬픔, 아름다운 마음',
    artist: 'AKMU (악뮤)',
    tag: '🌿 마음에 온기를 채우는 곡',
    albumEmoji: '🌱',
    cheerMessage:
      '슬픔도 기쁨도 모두 너라는 아름다운 마음의 조각들이란다. 지금 느끼는 모든 감정은 충분히 소중해 💚',
    youtubeUrl: 'https://youtu.be/SNn_H_Q2moo',
    youtubeEmbedId: 'SNn_H_Q2moo',
  },
  {
    id: 'akmu-lovelee',
    title: 'Love Lee',
    artist: 'AKMU (악뮤)',
    tag: '✨ 비타민처럼 통통 튀는 힐링',
    albumEmoji: '💖',
    cheerMessage:
      '너는 존재 자체로 너무 사랑스럽고 반짝이는 사람이야! 너만의 매력으로 오늘 하루도 자신 있게! 🌟',
    youtubeUrl: 'https://youtu.be/EIz09kLzN9k',
    youtubeEmbedId: 'EIz09kLzN9k',
  },
  {
    id: 'akmu-nakwon',
    title: '소문의 낙원',
    artist: 'AKMU (악뮤)',
    tag: '🏝️ 평온한 휴식과 안식처',
    albumEmoji: '🕊️',
    cheerMessage:
      '지친 너의 마음에 작은 쉼터가 되어줄게. 복잡한 생각은 잠시 내려놓고 마음의 낙원을 만나보렴 ☁️',
    youtubeUrl: 'https://youtu.be/D54StAZFUrc',
    youtubeEmbedId: 'D54StAZFUrc',
  },
  {
    id: 'soran-study-you',
    title: '너를 공부해',
    artist: '소란 (SORAN)',
    tag: '📚 풋풋하고 다정한 미소',
    albumEmoji: '✏️',
    cheerMessage:
      '네가 무엇을 좋아하고 어떤 때 행복한지, 너 자신을 더 많이 알아가고 아껴주는 소중한 하루가 되길 바라 🌼',
    youtubeUrl: 'https://youtu.be/fRPpDJwzJgU',
    youtubeEmbedId: 'fRPpDJwzJgU',
  },
  {
    id: 'gaho-start',
    title: '시작',
    artist: '가호 (Gaho)',
    tag: '🔥 용기와 열정을 채우는 멜로디',
    albumEmoji: '🏃',
    cheerMessage:
      '원하는 대로 다 가질 수 있어, 우리들의 꿈은 지금부터 시작이야! 가슴 뛰는 너의 내일을 열렬히 응원해! 💥',
    youtubeUrl: 'https://youtu.be/6LDg0YGYVw4',
    youtubeEmbedId: '6LDg0YGYVw4',
  },
  {
    id: 'day6-happy',
    title: 'HAPPY',
    artist: 'DAY6 (데이식스)',
    tag: '🌈 진심 어린 행복을 바라는 마음',
    albumEmoji: '🍀',
    cheerMessage:
      '어쩌면 오늘도 울고 싶었을지 모를 너에게, 내일은 반드시 활짝 웃을 수 있는 진짜 행복이 찾아올 거야 ☀️',
    youtubeUrl: 'https://youtu.be/sWXGbkM0tBI',
    youtubeEmbedId: 'sWXGbkM0tBI',
  },
  {
    id: 'doyoung-spring',
    title: '새봄의 노래 (Beginning)',
    artist: '도영 (DOYOUNG)',
    tag: '🌸 따스하게 피어나는 새싹의 용기',
    albumEmoji: '💐',
    cheerMessage:
      '시린 겨울이 지나면 반드시 눈부신 봄이 오듯, 너의 마음속에도 따스한 꽃이 곧 피어날 거야 🌸',
    youtubeUrl: 'https://youtu.be/a5TheCP_T1Q',
    youtubeEmbedId: 'a5TheCP_T1Q',
  },
  {
    id: 'doyoung-firefly',
    title: '반딧불 (Little Light)',
    artist: '도영 (DOYOUNG)',
    tag: '✨ 어둠 속을 밝히는 작은 빛',
    albumEmoji: '🕯️',
    cheerMessage:
      '작은 반딧불 하나의 빛도 온 방안을 따스하게 비추듯, 너라는 존재는 누군가에게 커다란 희망이자 빛이란다 💛',
    youtubeUrl: 'https://youtu.be/UZjGcAjd8Ok',
    youtubeEmbedId: 'UZjGcAjd8Ok',
  },
  {
    id: 'jannabi-green',
    title: '초록을거머쥔우리는',
    artist: '잔나비',
    tag: '🍃 싱그러운 초록빛 위로',
    albumEmoji: '🌿',
    cheerMessage:
      '풋풋한 우리들의 모든 순간이 푸른 여름날처럼 찬란해. 지친 마음 훌훌 털고 다시 힘차게 걸어가 보자 🌿',
    youtubeUrl: 'https://youtu.be/tKt0yuPcqKk',
    youtubeEmbedId: 'tKt0yuPcqKk',
  },
  {
    id: 'day6-page',
    title: '한 페이지가 될 수 있게',
    artist: 'DAY6 (데이식스)',
    tag: '📖 찬란하고 눈부신 청춘의 한 페이지',
    albumEmoji: '🎸',
    cheerMessage:
      '오늘 우리가 함께 보낸 이 시간도 찬란하고 빛나는 너의 청춘의 멋진 한 페이지가 될 거야! 힘차게 가보자! 🚀',
    youtubeUrl: 'https://youtu.be/vnS_jn2uibs',
    youtubeEmbedId: 'vnS_jn2uibs',
  },
];
