//Theres nothing here its useless, theres no custom AI
import React, { useState, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

const INITIAL_MESSAGES = [
  {
    id: '1',
    role: 'assistant',
    text:
      "Hi. I'm your sanctuary assistant. Tell me how you're feeling, and I'll help adjust your environment.",
  },
];

export default function AIScreen({
  navigation,
}) {
  const [messages, setMessages] =
    useState(INITIAL_MESSAGES);

  const [input, setInput] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const scrollRef = useRef(null);

  async function send() {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    console.log(
      'USER MESSAGE:',
      trimmed
    );

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput('');

    setLoading(true);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    try {
      const response = await fetch(
        'YOUR_SUPABASE_EDGE_FUNCTION_URL',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            message: trimmed,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        'AI RESPONSE:',
        data
      );

      const aiMsg = {
        id: (
          Date.now() + 1
        ).toString(),

        role: 'assistant',

        text:
          data.reply ||
          'No response returned.',
      };

      setMessages((prev) => [
        ...prev,
        aiMsg,
      ]);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    } catch (err) {
      console.log(
        'AI ERROR:',
        err
      );

      const errorMsg = {
        id: (
          Date.now() + 2
        ).toString(),

        role: 'assistant',

        text:
          'Something went wrong connecting to the AI.',
      };

      setMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    }

    setLoading(false);
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

      <Text style={styles.star1}>
        ✦
      </Text>

      <Text style={styles.star2}>
        ✧
      </Text>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text
            style={styles.smallLabel}
          >
            SANCTUARY AI
          </Text>

          <Text style={styles.title}>
            ⚡ AI Assistant
          </Text>

          <Text
            style={styles.subtitle}
          >
            Calm guidance for your
            senses.
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

      {/* CHAT */}

      <KeyboardAvoidingView
        style={styles.chatCard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.messageList
          }
        >
          {messages.map((msg) => {
            const isUser =
              msg.role === 'user';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrap,

                  isUser
                    ? styles.messageWrapUser
                    : styles.messageWrapAI,
                ]}
              >
                {!isUser && (
                  <View
                    style={styles.aiBubble}
                  >
                    <Text
                      style={
                        styles.aiBubbleText
                      }
                    >
                      AI
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.messageBubble,

                    isUser
                      ? styles.userBubble
                      : styles.aiMessageBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,

                      isUser
                        ? styles.userMessageText
                        : styles.aiMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading && (
            <View
              style={[
                styles.messageWrap,
                styles.messageWrapAI,
              ]}
            >
              <View
                style={styles.aiBubble}
              >
                <Text
                  style={
                    styles.aiBubbleText
                  }
                >
                  AI
                </Text>
              </View>

              <View
                style={[
                  styles.messageBubble,
                  styles.aiMessageBubble,
                ]}
              >
                <ActivityIndicator
                  color="#CDBDFF"
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* INPUT */}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Tell the AI how you feel..."
            placeholderTextColor="#7E7895"
            value={input}
            onChangeText={setInput}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,

              (!input.trim() ||
                loading) &&
                styles.sendButtonOff,
            ]}
            onPress={send}
            disabled={
              !input.trim() ||
              loading
            }
          >
            <Text
              style={styles.sendText}
            >
              ↑
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,

    backgroundColor: '#080B16',

    paddingHorizontal: 20,
  },

  topGlow: {
    position: 'absolute',

    width: 320,
    height: 320,

    borderRadius: 200,

    backgroundColor:
      'rgba(124,92,255,0.16)',

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

  star1: {
    position: 'absolute',

    top: 140,
    right: 40,

    color:
      'rgba(255,255,255,0.28)',

    fontSize: 18,
  },

  star2: {
    position: 'absolute',

    top: 420,
    left: 24,

    color:
      'rgba(255,255,255,0.15)',

    fontSize: 14,
  },

  header: {
    marginTop: 18,
    marginBottom: 14,

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

  chatCard: {
    flex: 1,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 30,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    overflow: 'hidden',

    marginBottom: 24,
  },

  messageList: {
    padding: 18,

    gap: 14,

    paddingBottom: 30,
  },

  messageWrap: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    gap: 8,
  },

  messageWrapUser: {
    justifyContent: 'flex-end',
  },

  messageWrapAI: {
    justifyContent:
      'flex-start',
  },

  aiBubble: {
    width: 30,
    height: 30,

    borderRadius: 999,

    backgroundColor:
      '#7A5CFF',

    justifyContent: 'center',

    alignItems: 'center',
  },

  aiBubbleText: {
    color: '#fff',

    fontSize: 10,

    fontWeight: '700',
  },

  messageBubble: {
    maxWidth: '78%',

    borderRadius: 22,

    paddingHorizontal: 16,

    paddingVertical: 12,
  },

  aiMessageBubble: {
    backgroundColor:
      'rgba(255,255,255,0.08)',

    borderBottomLeftRadius: 6,
  },

  userBubble: {
    backgroundColor:
      '#7A5CFF',

    borderBottomRightRadius: 6,
  },

  messageText: {
    fontSize: 15,

    lineHeight: 22,
  },

  aiMessageText: {
    color: '#F2EEFF',
  },

  userMessageText: {
    color: '#fff',
  },

  inputRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    padding: 14,

    gap: 10,

    borderTopWidth: 1,

    borderTopColor:
      'rgba(255,255,255,0.05)',
  },

  input: {
    flex: 1,

    minHeight: 48,

    maxHeight: 120,

    backgroundColor:
      'rgba(255,255,255,0.06)',

    borderRadius: 24,

    paddingHorizontal: 18,

    paddingVertical: 12,

    color: '#F4EEFF',

    fontSize: 15,
  },

  sendButton: {
    width: 50,
    height: 50,

    borderRadius: 999,

    backgroundColor:
      '#7A5CFF',

    justifyContent: 'center',

    alignItems: 'center',
  },

  sendButtonOff: {
    opacity: 0.35,
  },

  sendText: {
    color: '#fff',

    fontSize: 24,

    marginTop: -2,
  },
});