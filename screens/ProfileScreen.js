// screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { supabase } from '../supabase';

export default function ProfileScreen({
  navigation,
}) {
  const [mode, setMode] =
    useState('signin');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [checking, setChecking] =
    useState(true);

  // ── SESSION CHECK ─────────────────────────────────────────

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(
        ({
          data: { session },
        }) => {
          setUser(
            session?.user ?? null
          );

          setChecking(false);
        }
      );

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user ?? null
          );
        }
      );

    return () =>
      subscription.unsubscribe();
  }, []);

  // ── AUTH ──────────────────────────────────────────────────

  async function handleSubmit() {
    if (
      !email.includes('@') ||
      password.length < 6
    ) {
      Alert.alert(
        'Check your details',
        'Enter a valid email and password.'
      );

      return;
    }

    setLoading(true);

    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword(
            {
              email,
              password,
            }
          )
        : await supabase.auth.signUp({
            email,
            password,
          });

    setLoading(false);

    if (error) {
      Alert.alert(
        'Error',
        error.message
      );
    } else if (
      mode === 'signup'
    ) {
      Alert.alert(
        'Almost there',
        'Check your email to confirm your account.'
      );
    }
  }

  async function handleSignOut() {
    setLoading(true);

    await supabase.auth.signOut();

    setLoading(false);

    setEmail('');

    setPassword('');
  }

  // ── LOADING ───────────────────────────────────────────────

  if (checking) {
    return (
      <SafeAreaView
        style={[
          styles.safe,
          styles.loadingWrap,
        ]}
      >
        <ActivityIndicator
          size="large"
          color="#A98CFF"
        />
      </SafeAreaView>
    );
  }

  // ── SIGNED IN ─────────────────────────────────────────────

  if (user) {
    const initials =
      (
        user.email ?? '?'
      )[0].toUpperCase();

    return (
      <SafeAreaView
        style={styles.safe}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#080B16"
        />

        {/* BACKGROUND */}

        <View
          style={styles.topGlow}
        />

        <View
          style={styles.bottomGlow}
        />

        {/* HEADER */}

        <View
          style={styles.header}
        >
          <View>
            <Text
              style={
                styles.smallLabel
              }
            >
              PERSONAL SPACE
            </Text>

            <Text
              style={styles.title}
            >
              👤 Profile
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Your sanctuary
              identity.
            </Text>
          </View>

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backArrow
              }
            >
              ←
            </Text>
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}

        <View
          style={styles.profileCard}
        >
          <View
            style={
              styles.avatarCircle
            }
          >
            <Text
              style={
                styles.avatarInitial
              }
            >
              {initials}
            </Text>
          </View>

          <Text
            style={
              styles.profileEmail
            }
          >
            {user.email}
          </Text>

          <Text
            style={
              styles.profileSub
            }
          >
            Signed in
          </Text>
        </View>

        {/* INFO CARD */}

        <View
          style={styles.infoCard}
        >
          <View
            style={
              styles.infoBlock
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              USER ID
            </Text>

            <Text
              style={
                styles.infoText
              }
              numberOfLines={1}
            >
              {user.id}
            </Text>
          </View>

          <View
            style={
              styles.divider
            }
          />

          <View
            style={
              styles.infoBlock
            }
          >
            <Text
              style={
                styles.infoLabel
              }
            >
              MEMBER SINCE
            </Text>

            <Text
              style={
                styles.infoText
              }
            >
              {new Date(
                user.created_at
              ).toLocaleDateString(
                'en-US',
                {
                  year:
                    'numeric',
                  month:
                    'long',
                  day: 'numeric',
                }
              )}
            </Text>
          </View>
        </View>

        {/* SIGN OUT */}

        <TouchableOpacity
          style={
            styles.primaryButton
          }
          onPress={
            handleSignOut
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={
                styles.primaryText
              }
            >
              Sign Out
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── AUTH SCREEN ───────────────────────────────────────────

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080B16"
      />

      {/* BACKGROUND */}

      <View style={styles.topGlow} />

      <View
        style={styles.bottomGlow}
      />

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text
            style={styles.smallLabel}
          >
            PERSONAL SPACE
          </Text>

          <Text style={styles.title}>
            👤 Profile
          </Text>

          <Text
            style={styles.subtitle}
          >
            Enter your sanctuary.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.backArrow}
          >
            ←
          </Text>
        </TouchableOpacity>
      </View>

      {/* TOGGLE */}

      <View style={styles.modeWrap}>
        {['signin', 'signup'].map(
          (m) => {
            const active =
              mode === m;

            return (
              <TouchableOpacity
                key={m}
                style={[
                  styles.modeButton,
                  active &&
                    styles.modeButtonActive,
                ]}
                onPress={() =>
                  setMode(m)
                }
              >
                <Text
                  style={[
                    styles.modeText,
                    active &&
                      styles.modeTextActive,
                  ]}
                >
                  {m ===
                  'signin'
                    ? 'Sign In'
                    : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* FORM */}

      <View style={styles.formCard}>
        <Text
          style={styles.inputLabel}
        >
          EMAIL
        </Text>

        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text
          style={[
            styles.inputLabel,
            { marginTop: 20 },
          ]}
        >
          PASSWORD
        </Text>

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#777"
          value={password}
          onChangeText={
            setPassword
          }
          secureTextEntry
        />
      </View>

      {/* SUBMIT */}

      <TouchableOpacity
        style={
          styles.primaryButton
        }
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={
              styles.primaryText
            }
          >
            {mode ===
            'signin'
              ? 'Sign In'
              : 'Create Account'}
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,

    backgroundColor:
      '#080B16',

    paddingHorizontal: 20,
  },

  loadingWrap: {
    justifyContent: 'center',

    alignItems: 'center',
  },

  // BACKGROUND

  topGlow: {
    position: 'absolute',

    width: 320,
    height: 320,

    borderRadius: 999,

    backgroundColor:
      'rgba(124,92,255,0.16)',

    top: -120,
    left: -100,
  },

  bottomGlow: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 999,

    backgroundColor:
      'rgba(0,174,255,0.08)',

    bottom: -120,
    right: -80,
  },

  // HEADER

  header: {
    marginTop: 10,

    marginBottom: 26,

    flexDirection: 'row',

    justifyContent:
      'space-between',

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

  // SIGNED IN

  profileCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    paddingVertical: 36,

    alignItems: 'center',

    marginBottom: 18,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  avatarCircle: {
    width: 96,
    height: 96,

    borderRadius: 999,

    backgroundColor:
      '#7A5CFF',

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 18,
  },

  avatarInitial: {
    color: '#fff',

    fontSize: 42,

    fontWeight: '700',
  },

  profileEmail: {
    color: '#F4EEFF',

    fontSize: 18,

    fontWeight: '600',
  },

  profileSub: {
    marginTop: 6,

    color: '#AFA7C7',

    fontSize: 14,
  },

  // INFO

  infoCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    padding: 22,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    marginBottom: 18,
  },

  infoBlock: {
    marginBottom: 12,
  },

  infoLabel: {
    color: '#A98CFF',

    letterSpacing: 2,

    fontSize: 11,

    marginBottom: 10,
  },

  infoText: {
    color: '#F4EEFF',

    fontSize: 14,
  },

  divider: {
    height: 1,

    backgroundColor:
      'rgba(255,255,255,0.08)',

    marginVertical: 14,
  },

  // AUTH

  modeWrap: {
    flexDirection: 'row',

    backgroundColor:
      'rgba(255,255,255,0.05)',

    padding: 6,

    borderRadius: 22,

    marginBottom: 18,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  modeButton: {
    flex: 1,

    paddingVertical: 14,

    borderRadius: 16,

    alignItems: 'center',
  },

  modeButtonActive: {
    backgroundColor:
      '#7A5CFF',
  },

  modeText: {
    color: '#AAA3C1',

    fontSize: 15,

    fontWeight: '600',
  },

  modeTextActive: {
    color: '#fff',
  },

  formCard: {
    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    padding: 22,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    marginBottom: 18,
  },

  inputLabel: {
    color: '#A98CFF',

    letterSpacing: 2,

    fontSize: 11,

    marginBottom: 10,
  },

  input: {
    backgroundColor:
      'rgba(255,255,255,0.06)',

    borderRadius: 18,

    paddingHorizontal: 18,

    paddingVertical: 16,

    color: '#F4EEFF',

    fontSize: 16,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.06)',
  },

  // BUTTON

  primaryButton: {
    height: 68,

    borderRadius: 999,

    backgroundColor:
      '#7A5CFF',

    justifyContent: 'center',

    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '700',
  },
});