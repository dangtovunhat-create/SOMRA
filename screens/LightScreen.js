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

import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPicker from 'react-native-wheel-color-picker';

function getBrightness(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return Math.round((r * 299 + g * 587 + b * 114) / 1000);
}

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
    <View style={{ height: ITEM_HEIGHT * 3, overflow: 'hidden' }}>
      <View style={styles.selectionBand} pointerEvents="none" />

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
        onMomentumScrollEnd={e => {
          const idx = Math.round(
            e.nativeEvent.contentOffset.y / ITEM_HEIGHT
          );

          onChange(idx);
        }}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.drumItem}>
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

export default function LightScreen({ navigation }) {
  const [colour, setColour] = useState('#a98cff');

  const [brightness, setBrightness] = useState(70);

  const [turnOff, setTurnOff] = useState(false);

  const [hours, setHours] = useState(0);

  const [mins, setMins] = useState(30);

  useEffect(() => {
    AsyncStorage.getItem('light_settings').then(raw => {
      if (!raw) return;

      const saved = JSON.parse(raw);

      setTurnOff(saved.turnOff ?? false);
      setHours(saved.hours ?? 0);
      setMins(saved.mins ?? 30);
      setColour(saved.colour ?? '#a98cff');
      setBrightness(saved.brightness ?? 70);
    });
  }, []);

  function save(patch) {

    AsyncStorage.getItem('light_settings').then(raw => {
  
      const current = raw
        ? JSON.parse(raw)
        : {};
  
      const merged = {
        ...current,
        ...patch,
      };
  
      console.log('LIGHT SETTINGS SAVED');
      console.log('Colour:', merged.colour);
      console.log('Brightness:', merged.brightness);
      console.log('Auto Off:', merged.turnOff);
      console.log('Hours:', merged.hours);
      console.log('Minutes:', merged.mins);
  
      AsyncStorage.setItem(
        'light_settings',
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

      {/* GLOWS */}

      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* STARS */}

      <Text style={styles.star1}>✦</Text>
      <Text style={styles.star2}>✧</Text>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.smallLabel}>
            AMBIENT CONTROL
          </Text>

          <Text style={styles.title}>
            Light Adjust
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      {/* MAIN */}

      <View style={styles.mainArea}>
        {/* COLOR PICKER */}

        <View style={styles.wheelWrap}>
          <ColorPicker
            color={colour}
            onColorChangeComplete={c => {
              setColour(c);

              save({
                colour: c,
                brightness,
              });
            }}
            thumbSize={28}
            sliderHidden={true}
            noSnap={true}
            row={false}
          />
        </View>

        {/* BRIGHTNESS */}

        <View style={styles.brightnessWrap}>
          <Text style={styles.brightnessIcon}>
            ☀
          </Text>

          <Slider
            style={styles.verticalSlider}
            minimumValue={0}
            maximumValue={100}
            value={brightness}
            minimumTrackTintColor={colour}
            maximumTrackTintColor="rgba(255,255,255,0.12)"
            thumbTintColor="#F4EEFF"
            onValueChange={v => {
              setBrightness(v);

              save({
                brightness: v,
              });
            }}
            step={1}
            vertical={true}
          />

          <Text style={styles.brightnessText}>
            {brightness}%
          </Text>
        </View>
      </View>

      {/* TIMER CARD */}

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
            onValueChange={v => {
              setTurnOff(v);

              save({
                turnOff: v,
              });
            }}
            trackColor={{
              false: '#2A2D42',
              true: '#7A5CFF',
            }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.timerDescription}>
          Automatically dim and disable lights
          as your sanctuary prepares for sleep.
        </Text>

        <View
          style={[
            styles.drumRow,
            !turnOff && styles.drumRowDisabled,
          ]}
        >
          <DrumColumn
            items={HOURS}
            selectedIndex={hours}
            disabled={!turnOff}
            onChange={v => {
              setHours(v);

              save({
                hours: v,
              });
            }}
          />

          <Text style={styles.colonText}>:</Text>

          <DrumColumn
            items={MINS}
            selectedIndex={mins}
            disabled={!turnOff}
            onChange={v => {
              setMins(v);

              save({
                mins: v,
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
    backgroundColor: 'rgba(124,92,255,0.18)',
    top: -120,
    left: -100,
  },

  bottomGlow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 200,
    backgroundColor: 'rgba(0,174,255,0.08)',
    bottom: -120,
    right: -80,
  },

  star1: {
    position: 'absolute',
    top: 120,
    right: 40,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 18,
  },

  star2: {
    position: 'absolute',
    top: 340,
    left: 30,
    color: 'rgba(255,255,255,0.18)',
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

  backButton: {
    width: 62,
    height: 62,
    borderRadius: 24,

    backgroundColor: 'rgba(255,255,255,0.06)',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  backArrow: {
    color: '#E9DEFF',
    fontSize: 34,
  },

  // MAIN

  mainArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  wheelWrap: {
    width: '82%',
    height: 420,
  },

  // BRIGHTNESS

  brightnessWrap: {
    width: '14%',
    height: 360,

    backgroundColor: 'rgba(255,255,255,0.05)',

    borderRadius: 30,

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingVertical: 20,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  brightnessIcon: {
    color: '#FFD98A',
    fontSize: 22,
  },

  verticalSlider: {
    height: 220,
    width: 280,

    transform: [{ rotate: '-90deg' }],
  },

  brightnessText: {
    color: '#F4EEFF',
    fontSize: 16,
  },

  // TIMER CARD

  timerCard: {
    marginTop: 10,

    backgroundColor: 'rgba(255,255,255,0.05)',

    borderRadius: 30,

    padding: 22,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
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

    backgroundColor: 'rgba(124,92,255,0.08)',

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