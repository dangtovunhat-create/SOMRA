import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';

import * as IntentLauncher from 'expo-intent-launcher';

export default function HomeScreen({ navigation }) {
  const [hour, setHour] = useState(
    new Date().getHours()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  async function openBluetooth() {
    try {
      if (Platform.OS === 'android') {
        await IntentLauncher.startActivityAsync(
          IntentLauncher.ActivityAction
            .BLUETOOTH_SETTINGS
        );
      } else {
        await Linking.openURL(
          'App-Prefs:Bluetooth'
        );
      }

      console.log(
        'OPENED BLUETOOTH SETTINGS'
      );
    } catch (err) {
      console.log(
        'BLUETOOTH OPEN ERROR:',
        err
      );
    }
  }

  let currentTheme = {};

  if (hour >= 5 && hour < 11) {
    currentTheme = {
      bg: '#172033',
      glow:
        'rgba(255,200,120,0.15)',
      accent: '#FFD38A',
      greeting: 'Good morning',
    };
  } else if (
    hour >= 11 &&
    hour < 17
  ) {
    currentTheme = {
      bg: '#111827',
      glow:
        'rgba(120,150,255,0.14)',
      accent: '#9FC3FF',
      greeting:
        'Good afternoon',
    };
  } else if (
    hour >= 17 &&
    hour < 21
  ) {
    currentTheme = {
      bg: '#0F1022',
      glow:
        'rgba(180,120,255,0.14)',
      accent: '#D4B3FF',
      greeting:
        'Good evening',
    };
  } else {
    currentTheme = {
      bg: '#080B16',
      glow:
        'rgba(124,92,255,0.14)',
      accent: '#A98CFF',
      greeting: 'Good night',
    };
  }

  const adviceList = [
    'The moon does not rush.',
    'Rest is productive too.',
    'Nothing needs solving tonight.',
    'Healing requires slowness.',
    'Your mind deserves quiet.',
    'The night is your sanctuary.',
  ];

  const [advice, setAdvice] =
    useState('');

  useEffect(() => {
    generateAdvice();
  }, []);

  const generateAdvice = () => {
    setAdvice(
      adviceList[
        Math.floor(
          Math.random() *
            adviceList.length
        )
      ]
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor:
            currentTheme.bg,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          currentTheme.bg
        }
      />

      <View
        style={[
          styles.topGlow,
          {
            backgroundColor:
              currentTheme.glow,
          },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
          paddingTop: 25,
        }}
      >
        {/* TOP BAR */}

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={openBluetooth}
          >
            <Text style={styles.topIcon}>
              ⌁
            </Text>

            <Text
              style={styles.topLabel}
            >
              Bluetooth
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topButton}
            onPress={() =>
              navigation.navigate(
                'Profile'
              )
            }
          >
            <Text style={styles.topIcon}>
              ☻
            </Text>

            <Text
              style={styles.topLabel}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}

        <View
          style={styles.heroSection}
        >
          <Text
            style={[
              styles.heroMoon,
              {
                color:
                  currentTheme.accent,
              },
            ]}
          >
            ☾
          </Text>

          <Text
            style={styles.heroTitle}
          >
            {
              currentTheme.greeting
            }
          </Text>

          <Text
            style={
              styles.heroSubtitle
            }
          >
            Your sanctuary awaits.
          </Text>
        </View>

        {/* FEATURES */}

        <View
          style={styles.featureRow}
        >
          <TouchableOpacity
            style={styles.smallCard}
            onPress={() =>
              navigation.navigate(
                'Light'
              )
            }
          >
            <Text
              style={styles.cardEmoji}
            >
              💡
            </Text>

            <Text
              style={styles.cardTitle}
            >
              Lighting
            </Text>

            <Text
              style={styles.cardSub}
            >
              Ambient controls
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallCard}
            onPress={() =>
              navigation.navigate(
                'Smell'
              )
            }
          >
            <Text
              style={styles.cardEmoji}
            >
              🪻
            </Text>

            <Text
              style={styles.cardTitle}
            >
              Aroma
            </Text>

            <Text
              style={styles.cardSub}
            >
              Scent controls
            </Text>
          </TouchableOpacity>
        </View>

        {/* DIARY */}

        <TouchableOpacity
          style={styles.diaryCard}
          onPress={() =>
            navigation.navigate(
              'Mood'
            )
          }
        >
          <Text
            style={
              styles.diarySmall
            }
          >
            PERSONAL SPACE
          </Text>

          <Text
            style={
              styles.diaryTitle
            }
          >
            Diary & Usage
          </Text>

          <Text
            style={styles.diaryText}
          >
            Track moods, dreams,
            sleep quality, and
            emotional patterns.
          </Text>

          <Text
            style={
              styles.diaryArrow
            }
          >
            →
          </Text>
        </TouchableOpacity>

        {/* ADVICE */}

        <View
          style={styles.adviceCard}
        >
          <Text
            style={[
              styles.quoteIcon,
              {
                color:
                  currentTheme.accent,
              },
            ]}
          >
            ✦
          </Text>

          <Text
            style={styles.adviceText}
          >
            {advice}
          </Text>

          <TouchableOpacity
            style={
              styles.refreshButton
            }
            onPress={
              generateAdvice
            }
          >
            <Text
              style={
                styles.refreshText
              }
            >
              New Advice ↻
            </Text>
          </TouchableOpacity>
        </View>

        {/* MUSIC */}

        <TouchableOpacity
          style={styles.musicBar}
          onPress={() =>
            navigation.navigate(
              'Music'
            )
          }
        >
          <Text
            style={styles.albumEmoji}
          >
            🌌
          </Text>

          <View
            style={styles.musicInfo}
          >
            <Text
              style={
                styles.musicSmall
              }
            >
              NOW PLAYING
            </Text>

            <Text
              style={
                styles.musicTitle
              }
            >
              Kanye West — Moon
            </Text>
          </View>

          <Text
            style={
              styles.musicButton
            }
          >
            ⏸
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FLOATING AI */}

      <TouchableOpacity
        style={styles.aiButtonWrap}
        onPress={() =>
          navigation.navigate('AI')
        }
      >
        <View
          style={[
            styles.aiGlow,
            {
              borderColor:
                currentTheme.accent,
            },
          ]}
        >
          <Text style={styles.aiIcon}>
            ⚡
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 18,
  },

  topGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 200,
    top: -90,
    left: -70,
  },

  topBar: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  topButton: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor:
      'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  topIcon: {
    fontSize: 24,
    color: '#D9C7FF',
  },

  topLabel: {
    color: '#ECE6FF',
    fontSize: 12,
    marginTop: 4,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
  },

  heroMoon: {
    fontSize: 42,
  },

  heroTitle: {
    color: '#F6F2FF',
    fontSize: 30,
    fontWeight: '300',
  },

  heroSubtitle: {
    color: '#C5BDD9',
    fontSize: 14,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 12,
  },

  smallCard: {
    width: '48%',
    backgroundColor:
      'rgba(255,255,255,0.05)',
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
  },

  cardEmoji: {
    fontSize: 28,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 8,
  },

  cardSub: {
    color: '#aaa',
    fontSize: 13,
  },

  diaryCard: {
    backgroundColor:
      'rgba(78,72,140,0.14)',
    borderRadius: 26,
    padding: 18,
    marginBottom: 12,
  },

  diarySmall: {
    color: '#BDAEFF',
    fontSize: 11,
  },

  diaryTitle: {
    color: '#fff',
    fontSize: 24,
    marginVertical: 6,
  },

  diaryText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },

  diaryArrow: {
    color: '#fff',
    fontSize: 24,
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  adviceCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',
    borderRadius: 26,
    padding: 18,
    marginBottom: 12,
  },

  quoteIcon: {
    fontSize: 18,
  },

  adviceText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
    fontStyle: 'italic',
    marginVertical: 10,
  },

  refreshButton: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor:
      'rgba(255,255,255,0.06)',
  },

  refreshText: {
    color: '#E7DDFF',
  },

  musicBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(20,20,35,0.95)',
    borderRadius: 24,
    padding: 14,
  },

  albumEmoji: {
    fontSize: 28,
    marginRight: 14,
  },

  musicInfo: {
    flex: 1,
  },

  musicSmall: {
    color: '#999',
    fontSize: 11,
  },

  musicTitle: {
    color: '#fff',
    fontSize: 15,
  },

  musicButton: {
    color: '#fff',
    fontSize: 24,
  },

  aiButtonWrap: {
    position: 'absolute',
    right: 100,
    bottom: 22,
  },

  aiGlow: {
    width: 72,
    height: 72,
    borderRadius: 40,
    backgroundColor: '#5E3DFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  aiIcon: {
    fontSize: 28,
    color: '#FFD98A',
  },
});