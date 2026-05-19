import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ITEM_HEIGHT = 56;

const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, '0')
);

const MINS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0')
);

function DrumColumn({
  items,
  selectedIndex,
  onChange,
  disabled,
}) {
  const ref = useRef(null);

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) return;

    const timer = setTimeout(() => {
      ref.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: true,
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  return (
    <View
      style={{
        height: ITEM_HEIGHT * 3,
        overflow: 'hidden',
      }}
    >
      <View
        style={styles.selectionBand}
        pointerEvents="none"
      />

      <ScrollView
        ref={ref}
        scrollEnabled={!disabled}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT,
        }}
        onLayout={() => {
          mounted.current = true;

          ref.current?.scrollTo({
            y: selectedIndex * ITEM_HEIGHT,
            animated: false,
          });
        }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.y /
              ITEM_HEIGHT
          );

          onChange(idx);
        }}
      >
        {items.map((item, i) => (
          <View
            key={i}
            style={styles.drumItem}
          >
            <Text
              style={[
                styles.drumText,
                i === selectedIndex &&
                  styles.drumTextSelected,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const SCENTS = [
  {
    key: 'strawberry',
    emoji: '🍓',
    label: 'Strawberry',
    glow: '#FF5DAA',
  },

  {
    key: 'apple',
    emoji: '🍎',
    label: 'Apple',
    glow: '#FF5D7A',
  },

  {
    key: 'banana',
    emoji: '🍌',
    label: 'Banana',
    glow: '#B46BFF',
  },

  {
    key: 'orange',
    emoji: '🍊',
    label: 'Orange',
    glow: '#FF9D4D',
  },
];

export default function SmellScreen({
  navigation,
}) {
  const [active, setActive] =
    useState(null);

  const [turnOff, setTurnOff] =
    useState(false);

  const [hours, setHours] = useState(0);

  const [mins, setMins] = useState(30);

  // LOAD SAVED SETTINGS

  useEffect(() => {
    AsyncStorage.getItem(
      'smell_settings'
    ).then((raw) => {
      if (!raw) return;

      const saved = JSON.parse(raw);

      setActive(saved.active ?? null);

      setTurnOff(saved.turnOff ?? false);

      setHours(saved.hours ?? 0);

      setMins(saved.mins ?? 30);

      console.log(
        'LOADED SMELL SETTINGS:',
        saved
      );
    });
  }, []);

  // SAVE FUNCTION

  function save(patch) {
    AsyncStorage.getItem(
      'smell_settings'
    ).then((raw) => {
      const current = raw
        ? JSON.parse(raw)
        : {};

      const merged = {
        ...current,
        ...patch,
      };

      console.log(
        'SMELL SETTINGS SAVED'
      );

      console.log(
        'Selected Smell:',
        merged.active
      );

      console.log(
        'Auto Off:',
        merged.turnOff
      );

      console.log(
        'Hours:',
        merged.hours
      );

      console.log(
        'Minutes:',
        merged.mins
      );

      AsyncStorage.setItem(
        'smell_settings',
        JSON.stringify(merged)
      );
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080B16"
      />

      {/* BACKGROUND */}

      <View style={styles.topGlow} />

      <View style={styles.bottomGlow} />

      {/* STARS */}

      <Text style={styles.star1}>✦</Text>

      <Text style={styles.star2}>✧</Text>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.smallLabel}>
            AROMA CONTROL
          </Text>

          <Text style={styles.title}>
            🌹 Smell Adjust
          </Text>

          <Text style={styles.subtitle}>
            Set the mood. Breathe the
            magic.
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

      {/* SCENTS */}

      <View style={styles.grid}>
        {SCENTS.map((s) => {
          const on = active === s.key;

          return (
            <TouchableOpacity
              key={s.key}
              activeOpacity={0.85}
              style={styles.scentWrap}
              onPress={() => {
                const next = on
                  ? null
                  : s.key;

                setActive(next);

                save({
                  active: next,
                  turnOff,
                  hours,
                  mins,
                });
              }}
            >
              {/* GLOW */}

              {on && (
                <>
                  <View
                    style={[
                      styles.glowBurst,
                      {
                        backgroundColor:
                          s.glow,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.glowCore,
                      {
                        backgroundColor:
                          s.glow,
                      },
                    ]}
                  />
                </>
              )}

              {/* EMOJI */}

              <Text
                style={[
                  styles.scentEmoji,
                  on &&
                    styles.scentEmojiActive,
                ]}
              >
                {s.emoji}
              </Text>

              {/* LABEL */}

              <Text
                style={[
                  styles.scentLabel,
                  on &&
                    styles.scentLabelActive,
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TIMER */}

      <View style={styles.timerCard}>
        <View style={styles.timerTop}>
          <View>
            <Text style={styles.timerSmall}>
              SLEEP AUTOMATION
            </Text>

            <Text style={styles.timerTitle}>
              Wind-down Timer
            </Text>
          </View>

          <Switch
            value={turnOff}
            onValueChange={(v) => {
              setTurnOff(v);

              save({
                turnOff: v,
                active,
                hours,
                mins,
              });
            }}
            trackColor={{
              false: '#2A2D42',
              true: '#7A5CFF',
            }}
            thumbColor="#fff"
          />
        </View>

        <Text
          style={styles.timerDescription}
        >
          Automatically disable scent
          diffusion as your sanctuary
          prepares for rest.
        </Text>

        <View
          style={[
            styles.drumRow,
            !turnOff &&
              styles.drumRowDisabled,
          ]}
        >
          <DrumColumn
            items={HOURS}
            selectedIndex={hours}
            disabled={!turnOff}
            onChange={(v) => {
              setHours(v);

              save({
                hours: v,
                active,
                turnOff,
                mins,
              });
            }}
          />

          <Text style={styles.colonText}>
            :
          </Text>

          <DrumColumn
            items={MINS}
            selectedIndex={mins}
            disabled={!turnOff}
            onChange={(v) => {
              setMins(v);

              save({
                mins: v,
                active,
                turnOff,
                hours,
              });
            }}
          />
        </View>
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
      'rgba(0,174,255,0.08)',

    bottom: -120,
    right: -80,
  },

  // STARS

  star1: {
    position: 'absolute',

    top: 120,
    right: 40,

    color:
      'rgba(255,255,255,0.3)',

    fontSize: 18,
  },

  star2: {
    position: 'absolute',

    top: 340,
    left: 30,

    color:
      'rgba(255,255,255,0.18)',

    fontSize: 15,
  },

  // HEADER

  header: {
    marginTop: 10,
    marginBottom: 10,

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

  // SCENTS

  grid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    rowGap: 26,

    marginBottom: -30,

    paddingHorizontal: 6,
  },

  scentWrap: {
    width: '47%',

    height: 165,

    justifyContent: 'center',

    alignItems: 'center',
  },

  glowBurst: {
    position: 'absolute',

    width: 160,
    height: 160,

    borderRadius: 999,

    opacity: 0.24,

    transform: [
      { scaleX: 1.2 },
      { scaleY: 0.7 },
    ],
  },

  glowCore: {
    position: 'absolute',

    width: 90,
    height: 90,

    borderRadius: 999,

    opacity: 0.32,
  },

  scentEmoji: {
    fontSize: 82,

    opacity: 0.72,
  },

  scentEmojiActive: {
    opacity: 1,

    textShadowColor: '#ffffff',

    textShadowOffset: {
      width: 0,
      height: 0,
    },

    textShadowRadius: 22,
  },

  scentLabel: {
    marginTop: 10,

    color: '#BEB7D3',

    fontSize: 22,

    fontWeight: '500',
  },

  scentLabelActive: {
    color: '#F5F1FF',

    fontWeight: '700',

    textShadowColor:
      'rgba(180,110,255,0.9)',

    textShadowOffset: {
      width: 0,
      height: 0,
    },

    textShadowRadius: 10,
  },

  // TIMER CARD

  timerCard: {
    marginTop: 30,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    padding: 22,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    paddingBottom: 8,
  },

  timerTop: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  timerSmall: {
    color: '#B9A6FF',

    letterSpacing: 2,

    fontSize: 12,

    marginBottom: 6,
  },

  timerTitle: {
    color: '#F5F1FF',

    fontSize: 28,

    fontWeight: '300',
  },

  timerDescription: {
    marginTop: 12,
    marginBottom: 22,

    color: '#BEB7D3',

    lineHeight: 22,

    fontSize: 15,
  },

  // DRUMS

  drumRow: {
    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    gap: 8,

    marginTop: -10,
  },

  drumItem: {
    height: ITEM_HEIGHT,

    width: 76,

    justifyContent: 'center',

    alignItems: 'center',
  },

  drumText: {
    fontSize: 18,

    color: '#6B6880',
  },

  drumTextSelected: {
    fontSize: 26,

    color: '#A98CFF',

    fontWeight: '700',
  },

  selectionBand: {
    position: 'absolute',

    top: ITEM_HEIGHT,

    left: 0,
    right: 0,

    height: ITEM_HEIGHT,

    borderTopWidth: 1,

    borderBottomWidth: 1,

    borderColor: '#7A5CFF',

    backgroundColor:
      'rgba(124,92,255,0.08)',

    borderRadius: 14,

    zIndex: 1,
  },

  colonText: {
    color: '#F5F1FF',

    fontSize: 28,

    marginHorizontal: 4,
  },

  drumRowDisabled: {
    opacity: 0.28,
  },
});