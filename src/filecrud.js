'use strict';

const fs = require('fs').promises;
const path = require('path');

/**
 * CRUD File Module
 *
 * Performs Create, Read, Update, and Delete operations on files.
 * Uses fs.promises for all file system operations.
 * All functions return a standardised result object.
 *
 * Phase 4A: Validation layer and response contracts.
 * Phase 4B: Create and Read filesystem operations.
 * Phase 4C: Update and Delete filesystem operations.
 *
 * @module src/filecrud
 */

// ─── Internal Helpers (not exported) ────────────────────────────────

/**
 * Validates that a file path is a non-empty, non-whitespace string.
 *
 * @param {*} filePath - The value to validate.
 * @returns {{ valid: boolean, message: string }}
 */
function validateFilePath(filePath) {
  if (filePath === undefined || filePath === null) {
    return { valid: false, message: 'File path is required' };
  }
  if (typeof filePath !== 'string') {
    return { valid: false, message: 'File path must be a string' };
  }
  if (filePath.trim() === '') {
    return { valid: false, message: 'File path cannot be empty' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates that content is a string (including empty string).
 * undefined is rejected; null is rejected.
 *
 * @param {*} content - The value to validate.
 * @returns {{ valid: boolean, message: string }}
 */
function validateContent(content) {
  if (content === undefined) {
    return { valid: false, message: 'Content is required' };
  }
  if (content === null) {
    return { valid: false, message: 'Content cannot be null' };
  }
  if (typeof content !== 'string') {
    return { valid: false, message: 'Content must be a string' };
  }
  return { valid: true, message: '' };
}

/**
 * Builds a standardised success response object.
 *
 * @param {string} operation - The CRUD operation name.
 * @param {string} filePath  - The file path involved.
 * @param {string} message   - A human-readable success message.
 * @param {*}      [data=null] - Optional data payload (e.g. file content for read).
 * @returns {{ success: boolean, operation: string, filePath: string, message: string, data: * }}
 */
function buildSuccessResponse(operation, filePath, message, data = null) {
  return {
    success: true,
    operation,
    filePath,
    message,
    data,
  };
}

/**
 * Builds a standardised failure response object.
 *
 * @param {string} operation - The CRUD operation name.
 * @param {string} filePath  - The file path involved (may be the invalid input itself).
 * @param {string} message   - A human-readable error message.
 * @returns {{ success: boolean, operation: string, filePath: string, message: string, data: null }}
 */
function buildFailureResponse(operation, filePath, message) {
  return {
    success: false,
    operation,
    filePath: (typeof filePath === 'string') ? filePath : String(filePath ?? ''),
    message,
    data: null,
  };
}

// ─── Public CRUD Functions ──────────────────────────────────────────

/**
 * Creates a new file at the specified path with the given content.
 *
 * Validates filePath and content before performing any filesystem operation.
 * Returns a consistent response object on both success and failure.
 * Never throws.
 *
 * @param {string} filePath - Absolute or relative path for the new file.
 * @param {string} content  - Content to write into the file.
 * @returns {Promise<{ success: boolean, operation: string, filePath: string, message: string, data: * }>}
 */
async function createFile(filePath, content) {
  try {
    const pathCheck = validateFilePath(filePath);
    if (!pathCheck.valid) {
      return buildFailureResponse('create', filePath, pathCheck.message);
    }

    const contentCheck = validateContent(content);
    if (!contentCheck.valid) {
      return buildFailureResponse('create', filePath, contentCheck.message);
    }

    // Check if parent directory exists (do NOT auto-create)
    const dirName = path.dirname(filePath);
    try {
      const dirStat = await fs.stat(dirName);
      if (!dirStat.isDirectory()) {
        return buildFailureResponse('create', filePath, 'Parent path is not a directory');
      }
    } catch (dirErr) {
      if (dirErr.code === 'ENOENT') {
        return buildFailureResponse('create', filePath, 'Directory does not exist');
      }
      return buildFailureResponse('create', filePath, dirErr.message || 'Unknown error');
    }

    // Check if file already exists (do NOT overwrite)
    try {
      await fs.access(filePath);
      // If access() resolves, the file exists
      return buildFailureResponse('create', filePath, 'File already exists');
    } catch (_accessErr) {
      // File does not exist — proceed to create
    }

    // Write the file
    await fs.writeFile(filePath, content, 'utf8');
    return buildSuccessResponse('create', filePath, 'File created successfully');
  } catch (err) {
    if (err.code === 'EACCES') {
      return buildFailureResponse('create', filePath, 'Permission denied');
    }
    return buildFailureResponse('create', filePath, err.message || 'Unknown error');
  }
}

/**
 * Reads and returns the content of the file at the specified path.
 *
 * Validates filePath before performing any filesystem operation.
 * Returns a consistent response object on both success and failure.
 * Never throws.
 *
 * @param {string} filePath - Absolute or relative path of the file to read.
 * @returns {Promise<{ success: boolean, operation: string, filePath: string, message: string, data: * }>}
 */
async function readFile(filePath) {
  try {
    const pathCheck = validateFilePath(filePath);
    if (!pathCheck.valid) {
      return buildFailureResponse('read', filePath, pathCheck.message);
    }

    // Check if path is a directory
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        return buildFailureResponse('read', filePath, 'Path is a directory');
      }
    } catch (statErr) {
      if (statErr.code === 'ENOENT') {
        return buildFailureResponse('read', filePath, 'File not found');
      }
      if (statErr.code === 'EACCES') {
        return buildFailureResponse('read', filePath, 'Permission denied');
      }
      return buildFailureResponse('read', filePath, statErr.message || 'Unknown error');
    }

    // Read the file content
    const data = await fs.readFile(filePath, 'utf8');
    return buildSuccessResponse('read', filePath, 'File read successfully', data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return buildFailureResponse('read', filePath, 'File not found');
    }
    if (err.code === 'EACCES') {
      return buildFailureResponse('read', filePath, 'Permission denied');
    }
    return buildFailureResponse('read', filePath, err.message || 'Unknown error');
  }
}

/**
 * Overwrites the content of an existing file at the specified path.
 *
 * Validates filePath and content before performing any filesystem operation.
 * Returns a consistent response object on both success and failure.
 * Never throws.
 *
 * @param {string} filePath - Absolute or relative path of the file to update.
 * @param {string} content  - New content to write into the file.
 * @returns {Promise<{ success: boolean, operation: string, filePath: string, message: string, data: * }>}
 */
async function updateFile(filePath, content) {
  try {
    const pathCheck = validateFilePath(filePath);
    if (!pathCheck.valid) {
      return buildFailureResponse('update', filePath, pathCheck.message);
    }

    const contentCheck = validateContent(content);
    if (!contentCheck.valid) {
      return buildFailureResponse('update', filePath, contentCheck.message);
    }

    // Check that the file exists and is not a directory (do NOT create)
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        return buildFailureResponse('update', filePath, 'Path is a directory');
      }
    } catch (statErr) {
      if (statErr.code === 'ENOENT') {
        return buildFailureResponse('update', filePath, 'File not found');
      }
      if (statErr.code === 'EACCES') {
        return buildFailureResponse('update', filePath, 'Permission denied');
      }
      return buildFailureResponse('update', filePath, statErr.message || 'Unknown error');
    }

    // Overwrite file contents
    await fs.writeFile(filePath, content, 'utf8');
    return buildSuccessResponse('update', filePath, 'File updated successfully');
  } catch (err) {
    if (err.code === 'EACCES') {
      return buildFailureResponse('update', filePath, 'Permission denied');
    }
    return buildFailureResponse('update', filePath, err.message || 'Unknown error');
  }
}

/**
 * Deletes the file at the specified path.
 *
 * Validates filePath before performing any filesystem operation.
 * Returns a consistent response object on both success and failure.
 * Never throws.
 *
 * @param {string} filePath - Absolute or relative path of the file to delete.
 * @returns {Promise<{ success: boolean, operation: string, filePath: string, message: string, data: * }>}
 */
async function deleteFile(filePath) {
  try {
    const pathCheck = validateFilePath(filePath);
    if (!pathCheck.valid) {
      return buildFailureResponse('delete', filePath, pathCheck.message);
    }

    // Check that the file exists and is not a directory
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        return buildFailureResponse('delete', filePath, 'Path is a directory');
      }
    } catch (statErr) {
      if (statErr.code === 'ENOENT') {
        return buildFailureResponse('delete', filePath, 'File not found');
      }
      if (statErr.code === 'EACCES') {
        return buildFailureResponse('delete', filePath, 'Permission denied');
      }
      return buildFailureResponse('delete', filePath, statErr.message || 'Unknown error');
    }

    // Delete the file
    await fs.unlink(filePath);
    return buildSuccessResponse('delete', filePath, 'File deleted successfully');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return buildFailureResponse('delete', filePath, 'File not found');
    }
    if (err.code === 'EACCES') {
      return buildFailureResponse('delete', filePath, 'Permission denied');
    }
    return buildFailureResponse('delete', filePath, err.message || 'Unknown error');
  }
}

module.exports = { createFile, readFile, updateFile, deleteFile };

