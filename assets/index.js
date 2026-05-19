import 'react-native-url-polyfill/auto';
export const ASSETS = {
  bluetooth: { type: 'emoji', value: '🔵' },
  profile: { type: 'emoji', value: '👤' },
  light: { type: 'emoji', value: '☀️' },
  smell: { type: 'emoji', value: '🌹' },
  lightning: { type: 'emoji', value: '⚡' },
  musicNote: { type: 'emoji', value: '🎵' },
  rainOnLeaves: { type: 'audio', src: null },
  deepCreek: { type: 'audio', src: null },
  slowBreath: { type: 'audio', src: null },
  nightWind: { type: 'audio', src: null },
  warmStatic: { type: 'audio', src: null },
  morningFog: { type: 'audio', src: null },
  colorWheel: { type: 'emoji', value: '🎨' },   
  book: { type: 'emoji', value: '📖' },
  strawberry: { type: 'emoji', value: '🍓' },
  apple: { type: 'emoji', value: '🍎' },
  banana: { type: 'emoji', value: '🍌' },
  orange: { type: 'emoji', value: '🍊' },
  profileAvatar: { type: 'emoji', value: '🧑' },
  aiIcon: { type: 'emoji', value: '🤖' },
  backArrow: { type: 'emoji', value: '⬅️' },
  TempBackArrowSmell: { type: 'require', src: require('./shittybackarrow.jpg') },
};
export function getAsset(key) {
  return ASSETS[key] ?? { type: 'emoji', value: '❓' };
}
