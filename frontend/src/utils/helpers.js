// Format seconds to MM:SS
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format date to "Mon July 25 2026"
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get current date in format
export const getCurrentDate = () => {
  return formatDate(new Date());
};

// Generate random avatar ID (1-12)
export const getRandomAvatar = () => {
  return `avatar${Math.floor(Math.random() * 12) + 1}`;
};

// Avatar icons map
export const avatarIcons = {
  avatar1: 'User',
  avatar2: 'Zap',
  avatar3: 'Target',
  avatar4: 'Rocket',
  avatar5: 'Brain',
  avatar6: 'Flame',
  avatar7: 'Heart',
  avatar8: 'Star',
  avatar9: 'Coffee',
  avatar10: 'Laptop',
  avatar11: 'Book',
  avatar12: 'Music'
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
};

// Vibrate phone (if supported)
export const vibrate = (pattern = 200) => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    console.warn('Vibration API not supported on this device/browser');
    return;
  }

  try {
    // Ensure pattern is array or number
    const finalPattern = Array.isArray(pattern) ? pattern : [pattern];

    // Attempt vibration
    const success = navigator.vibrate(finalPattern);
    console.log(`Vibration attempted: ${success ? 'Success' : 'Failed/Blocked'}`, finalPattern);
  } catch (err) {
    console.error('Vibration error:', err);
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate token format (64 bytes = 128 hex chars)
export const isValidToken = (token) => {
  return token && token.length === 128 && /^[0-9a-fA-F]+$/.test(token);
};

// Calculate streak
export const calculateStreak = (lastActive) => {
  if (!lastActive) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActiveDate = new Date(lastActive);
  lastActiveDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActiveDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 0 ? 1 : diffDays === 1 ? 1 : 0;
};