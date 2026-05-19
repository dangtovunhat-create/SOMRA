import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'app_settings';

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to load settings:', e);
    return null;
  }
}
export async function updateSettings(partial) {
  try {
    const existing = await loadSettings() || {};
    const merged = { ...existing, ...partial };
    await AsyncStorage.setItem(KEY, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to update settings:', e);
  }
}