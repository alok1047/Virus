'use strict';

const os = require('os');

/**
 * System Information Module
 *
 * Collects operating system details, CPU architecture, hostname,
 * Node.js version, platform information, and user home directory.
 *
 * Uses only the Node.js built-in `os` module and `process` object.
 * Each field is collected independently with its own error handling,
 * so a failure in one field does not affect the others.
 *
 * @module src/sysinfo
 */

/**
 * Safely executes a function and returns its result.
 * Returns "Unavailable" if the function throws or returns undefined/null.
 *
 * @param {Function} fn - A function that returns the desired value.
 * @returns {string} The value as a string, or "Unavailable" on failure.
 */
function safeCollect(fn) {
  try {
    const value = fn();
    if (value === undefined || value === null) {
      return 'Unavailable';
    }
    return String(value);
  } catch (_err) {
    return 'Unavailable';
  }
}

/**
 * Collects and returns system information.
 *
 * Gathers exactly the following data points:
 * - osType: Operating system name (e.g. "Darwin", "Linux", "Windows_NT")
 * - osRelease: OS kernel version string (e.g. "23.1.0")
 * - osPlatform: Platform identifier (e.g. "darwin", "linux", "win32")
 * - cpuArchitecture: CPU architecture (e.g. "arm64", "x64")
 * - hostname: Machine hostname
 * - nodeVersion: Node.js runtime version (e.g. "v20.11.0")
 * - homeDirectory: Current user's home directory path
 *
 * Every field is guaranteed to exist in the returned object.
 * No field will ever be undefined — failed collections return "Unavailable".
 *
 * @returns {{ osType: string, osRelease: string, osPlatform: string, cpuArchitecture: string, hostname: string, nodeVersion: string, homeDirectory: string }}
 *   System information object with all 7 required fields.
 */
function getSystemInfo() {
  return {
    osType:          safeCollect(() => os.type()),
    osRelease:       safeCollect(() => os.release()),
    osPlatform:      safeCollect(() => os.platform()),
    cpuArchitecture: safeCollect(() => os.arch()),
    hostname:        safeCollect(() => os.hostname()),
    nodeVersion:     safeCollect(() => process.version),
    homeDirectory:   safeCollect(() => os.homedir()),
  };
}

module.exports = { getSystemInfo };
