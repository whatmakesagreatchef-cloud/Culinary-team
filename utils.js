// utils.js - Shared utility functions
import { CONFIG } from "./config.js";

/**
 * Random number generator
 * @param {number} a - Min value (inclusive)
 * @param {number} b - Max value (inclusive)
 * @returns {number} Random integer between a and b
 */
export function random(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

/**
 * Clamp a number between min and max
 * @param {number} n - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Format money value
 * @param {number} n - Amount
 * @returns {string} Formatted money string
 */
export function money(n) {
  return "$" + Math.max(0, Math.floor(n));
}

/**
 * Format percentage
 * @param {number} n - Number to format as percentage
 * @param {number} decimals - Decimal places (default: 0)
 * @returns {string} Formatted percentage
 */
export function percent(n, decimals = 0) {
  return (n * 100).toFixed(decimals) + "%";
}

/**
 * Get color class based on value and thresholds
 * @param {number} value - Value to check
 * @param {number} good - Good threshold
 * @param {number} bad - Bad threshold
 * @param {boolean} reverse - Reverse logic (lower is better)
 * @returns {string} CSS class name
 */
export function getColorClass(value, good, bad, reverse = false) {
  if (reverse) {
    if (value <= good) return "good";
    if (value >= bad) return "bad";
    return "warn";
  } else {
    if (value >= good) return "good";
    if (value <= bad) return "bad";
    return "warn";
  }
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Calculate weighted average
 * @param {Array<{value: number, weight: number}>} items - Items with values and weights
 * @returns {number} Weighted average
 */
export function weightedAverage(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const weightedSum = items.reduce((sum, item) => sum + (item.value * item.weight), 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Interpolate between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Roll dice with success chance
 * @param {number} chance - Success chance (0-1)
 * @returns {boolean} Success or failure
 */
export function rollChance(chance) {
  return Math.random() < clamp(chance, 0, 1);
}

/**
 * Get stat modifier text
 * @param {number} value - Stat value
 * @returns {string} Formatted modifier (+5, -3, etc)
 */
export function getModifierText(value) {
  if (value === 0) return "0";
  return value > 0 ? `+${value}` : `${value}`;
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + "...";
}

/**
 * Sort array by key
 * @param {Array} arr - Array to sort
 * @param {string} key - Key to sort by
 * @param {boolean} desc - Descending order
 * @returns {Array} Sorted array
 */
export function sortBy(arr, key, desc = false) {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (desc) return bVal - aVal;
    return aVal - bVal;
  });
}

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Calculate stat contribution to score
 * @param {number} stat - Stat value
 * @param {number} weight - Weight multiplier
 * @param {number} baseline - Baseline value for comparison
 * @returns {number} Contribution to score
 */
export function statContribution(stat, weight, baseline = 60) {
  return (stat * weight) / 2;
}

/**
 * Calculate penalty from negative stat
 * @param {number} stat - Stat value
 * @param {number} threshold - Threshold for penalty
 * @param {number} rate - Penalty rate
 * @returns {number} Penalty amount
 */
export function calculatePenalty(stat, threshold, rate) {
  return Math.max(0, (stat - threshold) * rate);
}

export default {
  random,
  clamp,
  money,
  percent,
  getColorClass,
  deepClone,
  debounce,
  generateId,
  formatDate,
  weightedAverage,
  lerp,
  rollChance,
  getModifierText,
  truncate,
  sortBy,
  groupBy,
  statContribution,
  calculatePenalty
};
