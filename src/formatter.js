'use strict';

/**
 * Output Formatting Module
 *
 * Converts data objects into structured output strings.
 * Supports 'pretty' (human-readable) and 'json' formats.
 * Pure function — no side effects, no console output, no file I/O.
 *
 * @module src/formatter
 */

// ─── Internal Helpers (not exported) ────────────────────────────────

/**
 * Mapping of known top-level keys to human-readable section headers.
 *
 * @type {Object<string, string>}
 */
const SECTION_HEADERS = {
  systemInfo: 'System Information',
  environmentVariables: 'Environment Variables',
  crudResult: 'CRUD Result',
};

/**
 * Converts a camelCase or lowerCamelCase key into a human-readable label.
 *
 * Examples:
 *   osType       → OS Type
 *   cpuArchitecture → CPU Architecture
 *   homeDirectory   → Home Directory
 *   nodeVersion     → Node Version
 *   filePath        → File Path
 *
 * @param {string} key - The camelCase key.
 * @returns {string} Human-readable label.
 */
function humaniseKey(key) {
  if (typeof key !== 'string') return String(key);

  // Split on camelCase boundaries
  const words = key.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');

  return words
    .map((word) => {
      const upper = word.toUpperCase();
      // Keep common acronyms uppercase
      if (['OS', 'CPU', 'ID', 'URL', 'IP', 'RAM', 'API'].includes(upper)) {
        return upper;
      }
      // Capitalise first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Formats a flat key-value object as a readable block of lines.
 *
 * @param {Object} obj - The object to format.
 * @param {string} indent - Indentation prefix for each line.
 * @returns {string} Formatted lines.
 */
function formatFlatObject(obj, indent) {
  const lines = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Nested object — recurse with a sub-header
      lines.push(indent + humaniseKey(key) + ':');
      lines.push(formatFlatObject(value, indent + '  '));
    } else {
      const displayValue = (value === null || value === undefined) ? 'N/A' : String(value);
      lines.push(indent + humaniseKey(key) + ': ' + displayValue);
    }
  }
  return lines.join('\n');
}

/**
 * Renders data in human-readable pretty format.
 *
 * @param {*} data - The data to format.
 * @returns {string} Human-readable string.
 */
function renderPretty(data) {
  if (data === null || data === undefined) {
    return 'No data available';
  }

  if (typeof data !== 'object') {
    return String(data);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return 'No data available';
    return data.map((item, i) => 'Item ' + (i + 1) + ':\n' + renderPretty(item)).join('\n\n');
  }

  const keys = Object.keys(data);
  if (keys.length === 0) {
    return 'No data available';
  }

  const sections = [];

  for (const key of keys) {
    const value = data[key];
    const header = SECTION_HEADERS[key] || humaniseKey(key);

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Section with sub-keys
      const sectionLines = [];
      sectionLines.push(header);
      sectionLines.push('');
      sectionLines.push(formatFlatObject(value, '  '));
      sections.push(sectionLines.join('\n'));
    } else {
      // Top-level primitive key
      const displayValue = (value === null || value === undefined) ? 'N/A' : String(value);
      sections.push(header + ': ' + displayValue);
    }
  }

  return sections.join('\n\n');
}

/**
 * Renders data as pretty-printed JSON.
 * Handles circular references gracefully.
 *
 * @param {*} data - The data to serialise.
 * @returns {string} JSON string or error message.
 */
function renderJson(data) {
  try {
    const result = JSON.stringify(data, null, 2);
    // JSON.stringify returns undefined for undefined input
    return (result !== undefined) ? result : 'undefined';
  } catch (_err) {
    return 'Unable to serialize output';
  }
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Formats a data object as a string for output.
 *
 * Supported formats:
 *   - 'pretty' (default) — human-readable console output
 *   - 'json'             — pretty-printed JSON
 *
 * If an unknown format is provided, falls back to 'pretty'.
 *
 * This function is pure: it performs no I/O, produces no side effects,
 * and never throws.
 *
 * @param {*}      data              - The data to format.
 * @param {string} [format='pretty'] - Output format: 'pretty' or 'json'.
 * @returns {string} Formatted string representation of the data.
 */
function formatOutput(data, format = 'pretty') {
  try {
    const normalised = (typeof format === 'string') ? format.toLowerCase().trim() : 'pretty';

    if (normalised === 'json') {
      return renderJson(data);
    }

    // 'pretty' or any unknown format → fallback to pretty
    return renderPretty(data);
  } catch (_err) {
    // Absolute last resort — should never reach here
    return 'Unable to format output';
  }
}

module.exports = { formatOutput };
