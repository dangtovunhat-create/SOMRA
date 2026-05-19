import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Animated,
} from 'react-native';

import { useAudioPlayer } from 'expo-audio';
import { getAsset } from '../assets/index';
const TRACKS = [
  {
    id: '1',
    title: 'Rain on Leaves',
    artist: 'Ambient',
    src: null,
    glow: '#6E5BFF',
  },

  {
    id: '2',
    title: 'Deep Creek',
    artist: 'Ambient',
    src: null,
    glow: '#5C8DFF',
  },

  {
    id: '3',
    title: 'Slow Breath',
    artist: 'Calm',
    src: null,
    glow: '#A56BFF',
  },

  {
    id: '4',
    title: 'Night Wind',
    artist: 'Ambient',
    src: null,
    glow: '#7A5CFF',
  },

  {
    id: '5',
    title: 'Warm Static',
    artist: 'Calm',
    src: null,
    glow: '#5D7AFF',
  },

  {
    id: '6',
    title: 'Morning Fog',
    artist: 'Ambient',
    src: null,
    glow: '#8B6CFF',
  },
];

export default function MusicScreen({
  navigation,
}) {
  const [currentTrack, setCurrentTrack] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentSource, setCurrentSource] =
    useState(null);

  // EXPO AUDIO PLAYER

  const player =
    useAudioPlayer(currentSource);

  // DISC SPIN

  const spinAnim = useRef(
    new Animated.Value(0)
  ).current;

  const spinLoop = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      spinLoop.current = Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        })
      );

      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
    }
  }, [isPlaying]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // LOAD + PLAY

  async function loadAndPlay(track) {
    console.log(
      'TRACK SELECTED:',
      track.title
    );

    setCurrentTrack(track);

    // UI TEST MODE

    if (!track.src) {
      console.log(
        'NO AUDIO FILE YET — UI TEST MODE'
      );

      setIsPlaying(true);

      return;
    }

    // CHANGE SOURCE

    setCurrentSource(track.src);

    // SMALL DELAY TO ALLOW HOOK UPDATE

    setTimeout(() => {
      player.loop = true;

      player.play();
    }, 100);

    setIsPlaying(true);

    console.log(
      'PLAYING:',
      track.title
    );
  }

  // PLAY / PAUSE

  function handlePlayPause() {
    if (!currentTrack) {
      loadAndPlay(TRACKS[0]);

      return;
    }

    if (isPlaying) {
      player.pause();

      setIsPlaying(false);

      console.log(
        'PAUSED:',
        currentTrack.title
      );
    } else {
      player.play();

      setIsPlaying(true);

      console.log(
        'RESUMED:',
        currentTrack.title
      );
    }
  }

  // NEXT

  function handleNext() {
    if (!currentTrack) {
      loadAndPlay(TRACKS[0]);

      return;
    }

    const idx = TRACKS.findIndex(
      (t) => t.id === currentTrack.id
    );

    const next =
      TRACKS[
        (idx + 1) % TRACKS.length
      ];

    console.log(
      'NEXT TRACK:',
      next.title
    );

    loadAndPlay(next);
  }

  // PREVIOUS

  function handlePrev() {
    if (!currentTrack) {
      loadAndPlay(TRACKS[0]);

      return;
    }

    const idx = TRACKS.findIndex(
      (t) => t.id === currentTrack.id
    );

    const prev =
      TRACKS[
        (idx - 1 + TRACKS.length) %
          TRACKS.length
      ];

    console.log(
      'PREVIOUS TRACK:',
      prev.title
    );

    loadAndPlay(prev);
  }

  const displayTrack =
    currentTrack ?? TRACKS[0];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080B16"
      />

      {/* BACKGROUND */}

      <View style={styles.topGlow} />

      <View style={styles.bottomGlow} />

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.smallLabel}>
            AMBIENT AUDIO
          </Text>

          <Text style={styles.title}>
            🎵 Music
          </Text>

          <Text style={styles.subtitle}>
            Drift deeper into your
            sanctuary.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={styles.backArrow}>
            ←
          </Text>
        </TouchableOpacity>
      </View>

      {/* PLAYER */}

      <View style={styles.playerCard}>
        <View
          style={[
            styles.playerGlow,
            {
              backgroundColor:
                displayTrack.glow,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.disc,
            {
              transform: [
                { rotate: spin },
              ],
            },
          ]}
        >
          <View style={styles.discInner} />
        </Animated.View>

        <View style={styles.trackInfo}>
          <Text
            style={styles.trackTitle}
            numberOfLines={1}
          >
            {currentTrack
              ? displayTrack.title
              : 'Choose a track'}
          </Text>

          <Text style={styles.trackArtist}>
            {displayTrack.artist}
          </Text>
        </View>

        {/* CONTROLS */}

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handlePrev}
          >
            <Text
              style={styles.controlIcon}
            >
              ⏮
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playBtn}
            onPress={handlePlayPause}
          >
            <Text style={styles.playIcon}>
              {isPlaying
                ? '⏸'
                : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleNext}
          >
            <Text
              style={styles.controlIcon}
            >
              ⏭
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TRACK LIST */}

      <View style={styles.listCard}>
        <FlatList
          data={TRACKS}
          keyExtractor={(t) => t.id}
          showsVerticalScrollIndicator={
            false
          }
          renderItem={({ item }) => {
            const active =
              currentTrack?.id ===
              item.id;

            return (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.trackRow,
                  active &&
                    styles.trackRowActive,
                ]}
                onPress={() =>
                  loadAndPlay(item)
                }
              >
                {active && (
                  <View
                    style={[
                      styles.rowGlow,
                      {
                        backgroundColor:
                          item.glow,
                      },
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.trackDot,
                    active &&
                      styles.trackDotActive,
                  ]}
                />

                <View
                  style={
                    styles.trackMeta
                  }
                >
                  <Text
                    style={[
                      styles.trackRowTitle,
                      active &&
                        styles.trackRowTitleActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.trackRowSub
                    }
                  >
                    {item.artist}
                  </Text>
                </View>

                <Text
                  style={
                    styles.trackDuration
                  }
                >
                  {item.duration}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,

    backgroundColor: '#080B16',

    paddingHorizontal: 20,
  },

  // BACKGROUND

  topGlow: {
    position: 'absolute',

    width: 320,
    height: 320,

    borderRadius: 200,

    backgroundColor:
      'rgba(124,92,255,0.18)',

    top: -120,
    left: -100,
  },

  bottomGlow: {
    position: 'absolute',

    width: 280,
    height: 280,

    borderRadius: 200,

    backgroundColor:
      'rgba(0,174,255,0.07)',

    bottom: -120,
    right: -80,
  },

  // HEADER

  header: {
    marginTop: 10,
    marginBottom: 18,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  smallLabel: {
    color: '#A98CFF',

    letterSpacing: 2,

    fontSize: 12,

    marginBottom: 8,
  },

  title: {
    color: '#F4EEFF',

    fontSize: 34,

    fontWeight: '300',
  },

  subtitle: {
    marginTop: 6,

    color: '#BEB7D3',

    fontSize: 16,
  },

  backButton: {
    width: 62,
    height: 62,

    borderRadius: 24,

    backgroundColor:
      'rgba(255,255,255,0.06)',

    justifyContent: 'center',

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  backArrow: {
    color: '#E9DEFF',

    fontSize: 34,
  },

  // PLAYER

  playerCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 32,

    padding: 26,

    alignItems: 'center',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    overflow: 'hidden',

    marginBottom: 18,
  },

  playerGlow: {
    position: 'absolute',

    width: 220,
    height: 120,

    borderRadius: 999,

    opacity: 0.12,

    top: 70,

    transform: [
      { scaleX: 1.3 },
      { scaleY: 0.7 },
    ],
  },

  disc: {
    width: 120,
    height: 120,

    borderRadius: 999,

    backgroundColor: '#111',

    borderWidth: 3,

    borderColor:
      'rgba(255,255,255,0.1)',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 20,
  },

  discInner: {
    width: 24,
    height: 24,

    borderRadius: 999,

    backgroundColor:
      'rgba(255,255,255,0.15)',
  },

  trackInfo: {
    alignItems: 'center',
  },

  trackTitle: {
    color: '#F5F1FF',

    fontSize: 34,

    fontWeight: '300',
  },

  trackArtist: {
    marginTop: 4,

    color: '#BEB7D3',

    fontSize: 18,
  },

  controls: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 30,

    marginTop: 26,
  },

  controlBtn: {
    padding: 10,
  },

  controlIcon: {
    fontSize: 28,

    color: '#F4EEFF',
  },

  playBtn: {
    width: 82,
    height: 82,

    borderRadius: 999,

    backgroundColor: '#5C8DFF',

    justifyContent: 'center',

    alignItems: 'center',
  },

  playIcon: {
    color: '#fff',

    fontSize: 32,
  },

  // LIST

  listCard: {
    flex: 1,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    padding: 12,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  trackRow: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 16,

    paddingHorizontal: 14,

    borderRadius: 18,

    marginBottom: 6,

    overflow: 'hidden',
  },

  trackRowActive: {
    backgroundColor:
      'rgba(255,255,255,0.04)',
  },

  rowGlow: {
    position: 'absolute',

    width: 140,
    height: 70,

    borderRadius: 999,

    opacity: 0.12,

    left: -20,
  },

  trackDot: {
    width: 10,
    height: 10,

    borderRadius: 999,

    backgroundColor:
      'rgba(255,255,255,0.2)',

    marginRight: 14,
  },

  trackDotActive: {
    backgroundColor: '#A98CFF',
  },

  trackMeta: {
    flex: 1,
  },

  trackRowTitle: {
    color: '#D7D0EA',

    fontSize: 18,

    fontWeight: '600',
  },

  trackRowTitleActive: {
    color: '#fff',
  },

  trackRowSub: {
    marginTop: 4,

    color: '#8E87A8',

    fontSize: 13,
  },

  trackDuration: {
    color: '#8E87A8',

    fontSize: 13,
  },
});