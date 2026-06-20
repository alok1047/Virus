'use strict';

/**
 * Environment Variable Module
 *
 * Reads and returns selected environment variables from the current process.
 * Missing variables are reported as "Not set" rather than undefined.
 *
 * Uses only the built-in `process.env` object. No external packages,
 * no filesystem access, no dotenv.
 *
 * @module src/envinfo
 */

/**
 * Default list of environment variable names to collect.
 * @type {string[]}
 */
const DEFAULT_ENV_VARS = [
  'PATH',
  'HOME',
  'USER',
  'SHELL',
  'LANG',
  'NODE_ENV',
  'TERM',
  'EDITOR',
];

/**
 * Collects and returns selected environment variables.
 *
 * Behaviour:
 * - If `varNames` is omitted, undefined, null, or not an array,
 *   the default curated list (`DEFAULT_ENV_VARS`) is used.
 * - If `varNames` is an empty array, an empty object is returned.
 * - If `varNames` is a non-empty array, only those variables are collected.
 *
 * For every variable name in the list:
 * - If the variable exists in `process.env`, its value is returned as-is.
 * - If the variable is missing, undefined, or null, the value "Not set" is returned.
 *
 * This function never throws. If `process.env` access fails entirely,
 * all variables are returned as "Not set".
 *
 * @param {string[]} [varNames] - Optional array of environment variable names to collect.
 *                                 Defaults to DEFAULT_ENV_VARS if omitted.
 * @returns {Object.<string, string>} Object mapping variable names to their values
 *                                     or "Not set" for missing variables.
 */
function getEnvInfo(varNames) {
  try {
    // Determine which list of variable names to use
    const names = Array.isArray(varNames) ? varNames : DEFAULT_ENV_VARS;

    const result = {};

    for (const name of names) {
      try {
        const value = process.env[name];
        result[name] = (value !== undefined && value !== null) ? value : 'Not set';
      } catch (_err) {
        result[name] = 'Not set';
      }
    }

    return result;
  } catch (_err) {
    // If everything fails, return all defaults as "Not set"
    const fallback = {};
    const names = Array.isArray(varNames) ? varNames : DEFAULT_ENV_VARS;
    for (const name of names) {
      fallback[name] = 'Not set';
    }
    return fallback;
  }
}

module.exports = { getEnvInfo, DEFAULT_ENV_VARS };

