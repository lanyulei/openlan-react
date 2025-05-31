export function setItem(key: string, token: string) {
  try {
    window.localStorage.setItem(key, token);
  } catch (e) {
    console.error('Failed to set local value:', e);
  }
}

export function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.error('Failed to get local value:', e);
    return null;
  }
}

export function removeItem(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove local value:', e);
  }
}
