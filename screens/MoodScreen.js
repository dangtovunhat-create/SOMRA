import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

function getPageDates(offset) {
  const dates = [];

  for (let i = 1; i >= 0; i--) {
    const d = new Date();

    d.setDate(
      d.getDate() - (offset * 2 + i)
    );

    dates.push(
      d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
  }

  return dates;
}

export default function MoodScreen({
  navigation,
}) {
  const [pageOffset, setPageOffset] =
    useState(0);

  const [entries, setEntries] =
    useState({});

  const [records, setRecords] =
    useState({});

  // LOAD SAVED JOURNAL

  useEffect(() => {
    AsyncStorage.getItem(
      'mood_settings'
    ).then((raw) => {
      if (!raw) return;

      const saved = JSON.parse(raw);

      setEntries(saved.entries ?? {});
    });
  }, []);

  // LOAD RECORDS

  useEffect(() => {
    AsyncStorage.getItem(
      'daily_records'
    ).then((raw) => {
      if (raw)
        setRecords(JSON.parse(raw));
    });
  }, []);

  function getRowData(daysBack) {
    const now = Date.now();

    const relevant = Object.values(
      records
    ).filter((r) => {
      const diff =
        (now -
          new Date(r.date).getTime()) /
        86400000;

      return diff <= daysBack;
    });

    if (!relevant.length)
      return {
        smell: '—',
        light: null,
        sleep: '—',
      };

    // SMELL MODE

    const smellCount = {};

    relevant.forEach((r) => {
      if (r.smell)
        smellCount[r.smell] =
          (smellCount[r.smell] ?? 0) +
          1;
    });

    const smell =
      Object.keys(smellCount).sort(
        (a, b) =>
          smellCount[b] -
          smellCount[a]
      )[0] ?? '—';

    // LIGHT MODE

    const lightCount = {};

    relevant.forEach((r) => {
      if (r.lightColour)
        lightCount[r.lightColour] =
          (lightCount[r.lightColour] ??
            0) + 1;
    });

    const light =
      Object.keys(lightCount).sort(
        (a, b) =>
          lightCount[b] -
          lightCount[a]
      )[0] ?? null;

    // AVG SLEEP

    const sleepVals = relevant
      .filter((r) => r.sleepHours)
      .map((r) => r.sleepHours);

    const avg = sleepVals.length
      ? sleepVals.reduce(
          (a, b) => a + b,
          0
        ) / sleepVals.length
      : null;

    const sleep = avg
      ? `${Math.floor(avg)}h ${Math.round(
          (avg % 1) * 60
        )}m`
      : '—';

    return {
      smell,
      light,
      sleep,
    };
  }

  const PERIODS = [
    {
      label: 'Yesterday',
      days: 1,
    },

    {
      label: 'Last week',
      days: 7,
    },

    {
      label: 'Last month',
      days: 30,
    },

    {
      label: 'Last year',
      days: 365,
    },
  ];

  function save(patch) {
    AsyncStorage.getItem(
      'mood_settings'
    ).then((raw) => {
      const current = raw
        ? JSON.parse(raw)
        : {};

      const merged = {
        ...current,
        ...patch,
      };

      console.log(
        'MOOD SETTINGS SAVED'
      );

      console.log(
        'Journal Entries:',
        Object.keys(
          merged.entries ?? {}
        ).length
      );

      AsyncStorage.setItem(
        'mood_settings',
        JSON.stringify(merged)
      );
    });
  }

  const updateEntry = (key, text) => {
    const updated = {
      ...entries,
      [key]: text,
    };

    setEntries(updated);

    save({
      entries: updated,
    });
  };

  const pageDates =
    getPageDates(pageOffset);

  const leftKey = pageDates[0];

  const rightKey = pageDates[1];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080B16"
      />

      {/* BACKGROUND GLOWS */}

      <View style={styles.topGlow} />

      <View style={styles.bottomGlow} />

      {/* STARS */}

      <Text style={styles.star1}>✦</Text>

      <Text style={styles.star2}>✧</Text>

      {/* HEADER */}

      <View style={styles.header}>
        <View>
          <Text style={styles.smallLabel}>
            MEMORY ARCHIVE
          </Text>

          <Text style={styles.title}>
            Mood Journal
          </Text>

          <Text style={styles.subtitle}>
            Reflect on your sanctuary.
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

      {/* TABLE */}

      <View style={styles.topHalf}>
        <View style={styles.tableRow}>
          <View style={styles.periodCell} />

          <View style={styles.colCell}>
            <Text style={styles.colHeader}>
              Smell
            </Text>
          </View>

          <View style={styles.colCell}>
            <Text style={styles.colHeader}>
              Light
            </Text>
          </View>

          <View style={styles.colCell}>
            <Text style={styles.colHeader}>
              Sleep
            </Text>
          </View>
        </View>

        {PERIODS.map(
          ({ label, days }) => {
            const {
              smell,
              light,
              sleep,
            } = getRowData(days);

            return (
              <View
                key={label}
                style={styles.tableRow}
              >
                <View
                  style={styles.periodCell}
                >
                  <Text
                    style={
                      styles.periodText
                    }
                  >
                    {label}
                  </Text>
                </View>

                <View
                  style={styles.colCell}
                >
                  <Text
                    style={
                      styles.cellText
                    }
                  >
                    {smell}
                  </Text>
                </View>

                <View
                  style={styles.colCell}
                >
                  {light ? (
                    <View
                      style={[
                        styles.colorSwatch,
                        {
                          backgroundColor:
                            light,
                        },
                      ]}
                    />
                  ) : (
                    <Text
                      style={
                        styles.cellText
                      }
                    >
                      —
                    </Text>
                  )}
                </View>

                <View
                  style={styles.colCell}
                >
                  <Text
                    style={
                      styles.cellText
                    }
                  >
                    {sleep}
                  </Text>
                </View>
              </View>
            );
          }
        )}
      </View>

      {/* DIARY */}

      <View style={styles.bottomHalf}>
        <View style={styles.bookSpread}>
          {/* LEFT PAGE */}

          <View style={styles.page}>
            <Text style={styles.pageDate}>
              {leftKey}
            </Text>

            <TextInput
              style={styles.pageInput}
              multiline
              placeholder="Write here..."
              placeholderTextColor="#6E6788"
              value={
                entries[leftKey] || ''
              }
              onChangeText={(t) =>
                updateEntry(leftKey, t)
              }
              textAlignVertical="top"
            />
          </View>

          {/* SPINE */}

          <View style={styles.spine} />

          {/* RIGHT PAGE */}

          <View style={styles.page}>
            <Text style={styles.pageDate}>
              {rightKey}
            </Text>

            <TextInput
              style={styles.pageInput}
              multiline
              placeholder="Write here..."
              placeholderTextColor="#6E6788"
              value={
                entries[rightKey] || ''
              }
              onChangeText={(t) =>
                updateEntry(rightKey, t)
              }
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* PAGE CONTROLS */}

        <View style={styles.flipRow}>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() =>
              setPageOffset(
                (p) => p + 1
              )
            }
          >
            <Text style={styles.flipBtnText}>
              ◀ Older
            </Text>
          </TouchableOpacity>

          <Text style={styles.flipLabel}>
            {pageOffset === 0
              ? 'Today'
              : `${pageOffset * 2}d ago`}
          </Text>

          <TouchableOpacity
            style={[
              styles.flipBtn,
              pageOffset === 0 &&
                styles.flipBtnDisabled,
            ]}
            onPress={() =>
              setPageOffset((p) =>
                Math.max(0, p - 1)
              )
            }
            disabled={pageOffset === 0}
          >
            <Text style={styles.flipBtnText}>
              Newer ▶
            </Text>
          </TouchableOpacity>
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

    paddingTop: 6,

    paddingBottom: 20,
  },

  // BACKGROUND

  topGlow: {
    position: 'absolute',

    width: 340,
    height: 340,

    borderRadius: 999,

    backgroundColor:
      'rgba(124,92,255,0.16)',

    top: -140,
    left: -110,
  },

  bottomGlow: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 999,

    backgroundColor:
      'rgba(0,174,255,0.08)',

    bottom: -100,
    right: -70,
  },

  star1: {
    position: 'absolute',

    top: 130,
    right: 42,

    color:
      'rgba(255,255,255,0.24)',

    fontSize: 18,
  },

  star2: {
    position: 'absolute',

    top: 360,
    left: 26,

    color:
      'rgba(255,255,255,0.16)',

    fontSize: 15,
  },

  // HEADER

  header: {
    marginBottom: 14,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  smallLabel: {
    color: '#A98CFF',

    letterSpacing: 2,

    fontSize: 12,

    marginBottom: 6,
  },

  title: {
    color: '#F4EEFF',

    fontSize: 34,

    fontWeight: '300',
  },

  subtitle: {
    marginTop: 5,

    color: '#BEB7D3',

    fontSize: 15,
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

  // TABLE

  topHalf: {
    flex: 3.3,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 28,

    overflow: 'hidden',

    marginBottom: 14,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  tableRow: {
    flex: 1,

    flexDirection: 'row',

    borderBottomWidth: 1,

    borderBottomColor:
      'rgba(255,255,255,0.05)',
  },

  periodCell: {
    width: 92,

    justifyContent: 'center',

    paddingLeft: 12,

    backgroundColor:
      'rgba(255,255,255,0.04)',

    borderRightWidth: 1,

    borderRightColor:
      'rgba(255,255,255,0.05)',
  },

  periodText: {
    fontSize: 11,

    fontWeight: '700',

    color: '#C6B7FF',

    letterSpacing: 0.5,
  },

  colCell: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    borderRightWidth: 1,

    borderRightColor:
      'rgba(255,255,255,0.05)',
  },

  colHeader: {
    fontSize: 11,

    fontWeight: '700',

    color: '#8E88A8',

    letterSpacing: 1,
  },

  cellText: {
    fontSize: 12,

    color: '#F4EEFF',
  },

  colorSwatch: {
    width: 22,
    height: 22,

    borderRadius: 6,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.2)',
  },

  // JOURNAL

  bottomHalf: {
    flex: 4.5,
  },

  bookSpread: {
    flex: 1,

    flexDirection: 'row',

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderRadius: 28,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',

    marginBottom: 12,
  },

  page: {
    flex: 1,

    padding: 16,

    backgroundColor:
      'rgba(13,16,28,0.82)',
  },

  pageDate: {
    fontSize: 11,

    fontWeight: '700',

    color: '#B9A6FF',

    marginBottom: 10,

    textTransform: 'uppercase',

    letterSpacing: 1.5,
  },

  pageInput: {
    flex: 1,

    fontSize: 14,

    color: '#E9DEFF',

    lineHeight: 24,

    fontFamily: 'monospace',
  },

  spine: {
    width: 10,

    backgroundColor:
      'rgba(124,92,255,0.24)',
  },

  // BUTTONS

  flipRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingHorizontal: 4,
  },

  flipBtn: {
    backgroundColor:
      'rgba(124,92,255,0.18)',

    borderRadius: 999,

    paddingVertical: 8,

    paddingHorizontal: 18,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  flipBtnDisabled: {
    opacity: 0.35,
  },

  flipBtnText: {
    color: '#F4EEFF',

    fontSize: 13,

    fontWeight: '700',
  },

  flipLabel: {
    fontSize: 13,

    color: '#A7A1BE',

    fontWeight: '500',
  },
});