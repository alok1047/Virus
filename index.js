'use strict';

/**
 * Thunder Hackathon 3.0 — System Info & File CRUD Tool
 *
 * Entry point and CLI dispatcher.
 * Parses command-line arguments and routes to the appropriate module.
 *
 * Usage:
 *   node index.js                          — Display system info and environment variables
 *   node index.js info                     — Display system information only
 *   node index.js env                      — Display environment variables only
 *   node index.js create <path> <content>  — Create a file
 *   node index.js read <path>              — Read a file
 *   node index.js update <path> <content>  — Update a file
 *   node index.js delete <path>            — Delete a file
 *   node index.js help                     — Show help
 *   node index.js --json                   — Output in JSON format
 *
 * @module index
 */

const { getSystemInfo } = require('./src/sysinfo');
const { getEnvInfo } = require('./src/envinfo');
const { createFile, readFile, updateFile, deleteFile } = require('./src/filecrud');
const { formatOutput } = require('./src/formatter');

// ─── Help Text ──────────────────────────────────────────────────────

const HELP_TEXT = `
System Info & File CRUD Tool
=============================

Usage:
  node index.js                          Show system info and environment variables
  node index.js info                     Show system information only
  node index.js env                      Show environment variables only
  node index.js create <path> <content>  Create a new file
  node index.js read <path>              Read a file
  node index.js update <path> <content>  Update an existing file
  node index.js delete <path>            Delete a file
  node index.js help                     Show this help message

Options:
  --json                                 Output in JSON format

Examples:
  node index.js                          Pretty-print system info and env vars
  node index.js --json                   Output system info and env vars as JSON
  node index.js info                     Pretty-print system info only
  node index.js info --json              Output system info as JSON
  node index.js env                      Pretty-print environment variables only
  node index.js env --json               Output environment variables as JSON
  node index.js create test.js "hello"   Create test.js with content "hello"
  node index.js read test.js             Read and display test.js
  node index.js update test.js "world"   Update test.js with content "world"
  node index.js delete test.js           Delete test.js
`.trim();

// ─── Argument Parsing ───────────────────────────────────────────────

/**
 * Parses process.argv into a command, positional arguments, and format.
 *
 * @returns {{ command: string, args: string[], format: string }}
 */
function parseArgs() {
  // Skip node executable and script path
  const rawArgs = process.argv.slice(2);

  // Detect --json flag anywhere in arguments
  const hasJson = rawArgs.some(
    (arg) => arg === '--json' || arg === '-json'
  );
  const format = hasJson ? 'json' : 'pretty';

  // Filter out flags to get positional arguments
  const positional = rawArgs.filter(
    (arg) => arg !== '--json' && arg !== '-json'
  );

  const command = positional[0] || '';
  const args = positional.slice(1);

  return { command, args, format };
}

// ─── Command Handlers ───────────────────────────────────────────────

/**
 * Default command: show system info + environment variables.
 *
 * @param {string} format - Output format ('pretty' or 'json').
 */
function handleDefault(format) {
  const data = {
    systemInfo: getSystemInfo(),
    environmentVariables: getEnvInfo(),
  };
  console.log(formatOutput(data, format));
}

/**
 * Info command: show system information only.
 *
 * @param {string} format - Output format.
 */
function handleInfo(format) {
  const data = {
    systemInfo: getSystemInfo(),
  };
  console.log(formatOutput(data, format));
}

/**
 * Env command: show environment variables only.
 *
 * @param {string} format - Output format.
 */
function handleEnv(format) {
  const data = {
    environmentVariables: getEnvInfo(),
  };
  console.log(formatOutput(data, format));
}

/**
 * Create command: create a file.
 *
 * @param {string[]} args - [filePath, content].
 * @param {string} format - Output format.
 */
async function handleCreate(args, format) {
  if (args.length < 1) {
    console.log('Error: Missing file path.');
    console.log('Usage: node index.js create <path> <content>');
    return;
  }

  const filePath = args[0];
  const content = args.length >= 2 ? args[1] : '';
  const result = await createFile(filePath, content);
  console.log(formatOutput({ crudResult: result }, format));
}

/**
 * Read command: read a file.
 *
 * @param {string[]} args - [filePath].
 * @param {string} format - Output format.
 */
async function handleRead(args, format) {
  if (args.length < 1) {
    console.log('Error: Missing file path.');
    console.log('Usage: node index.js read <path>');
    return;
  }

  const result = await readFile(args[0]);
  console.log(formatOutput({ crudResult: result }, format));
}

/**
 * Update command: update a file.
 *
 * @param {string[]} args - [filePath, content].
 * @param {string} format - Output format.
 */
async function handleUpdate(args, format) {
  if (args.length < 1) {
    console.log('Error: Missing file path.');
    console.log('Usage: node index.js update <path> <content>');
    return;
  }
  if (args.length < 2) {
    console.log('Error: Missing content.');
    console.log('Usage: node index.js update <path> <content>');
    return;
  }

  const result = await updateFile(args[0], args[1]);
  console.log(formatOutput({ crudResult: result }, format));
}

/**
 * Delete command: delete a file.
 *
 * @param {string[]} args - [filePath].
 * @param {string} format - Output format.
 */
async function handleDelete(args, format) {
  if (args.length < 1) {
    console.log('Error: Missing file path.');
    console.log('Usage: node index.js delete <path>');
    return;
  }

  const result = await deleteFile(args[0]);
  console.log(formatOutput({ crudResult: result }, format));
}

// ─── Main Dispatcher ────────────────────────────────────────────────

/**
 * Main entry point. Parses CLI arguments and dispatches to the correct handler.
 * Never throws — all errors are caught and displayed.
 */
async function main() {
  try {
    const { command, args, format } = parseArgs();

    switch (command.toLowerCase()) {
      case '':
        handleDefault(format);
        break;

      case 'info':
        handleInfo(format);
        break;

      case 'env':
        handleEnv(format);
        break;

      case 'create':
        await handleCreate(args, format);
        break;

      case 'read':
        await handleRead(args, format);
        break;

      case 'update':
        await handleUpdate(args, format);
        break;

      case 'delete':
        await handleDelete(args, format);
        break;

      case 'help':
      case '--help':
      case '-help':
      case '-h':
        console.log(HELP_TEXT);
        break;

      default:
        console.log('Unknown command: ' + command);
        console.log('');
        console.log(HELP_TEXT);
        break;
    }
  } catch (err) {
    console.error('Error: ' + (err.message || 'Unknown error'));
    process.exitCode = 1;
  }
}

main();
