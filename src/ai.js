import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';
import { GoogleGenAI } from '@google/genai';

export const MODEL = 'gemini-3.8-flash';
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load the CLI's own .env first, then allow a project-local .env to fill any gaps.
loadEnv({ path: path.join(PACKAGE_ROOT, '.env'), quiet: true });
loadEnv({ quiet: true });

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === 'your_google_ai_studio_api_key_here') {
    throw new Error(
      'Missing GEMINI_API_KEY. Copy .env.example to .env and add your Google AI Studio key.',
    );
  }

  return new GoogleGenAI({ apiKey });
}

function cleanResponse(text) {
  return (text ?? '')
    .trim()
    .replace(/^```(?:markdown|md|text)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

/**
 * Generate a Conventional Commit message from a staged diff.
 * @param {string} diff
 * @returns {Promise<string>}
 */
export async function generateCommitMessage(diff) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      'You are a senior software engineer who writes precise Git commit messages.',
      'Write ONE Conventional Commit message for the diff below.',
      'Use the format: type(scope): summary',
      'Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore.',
      'Keep the subject in the imperative mood, under 72 characters, and do not end with a period.',
      'Add a short body (1-3 bullet points) only if the change is non-trivial.',
      'Return only the commit message, with no code fences, quotes, or commentary.',
      '',
      'Diff:',
      diff,
    ].join('\n'),
    config: {
      temperature: 0.2,
      maxOutputTokens: 512,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const message = cleanResponse(response.text);

  if (!message) {
    throw new Error('Gemini returned an empty commit message.');
  }

  return message;
}

/**
 * Generate a structured Pull Request description in Markdown.
 * @param {string} branchData
 * @returns {Promise<string>}
 */
export async function generatePRDescription(branchData) {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      'You are a senior software engineer writing a Pull Request description.',
      'Use the commit history and diff below to produce GitHub-flavored Markdown with these sections:',
      '## Summary',
      '## Changes',
      '## Testing',
      'Keep it factual and concise. Use bullet points. Do not invent tests that were not run.',
      'Return only the Markdown, with no code fences around it.',
      '',
      'Branch data:',
      branchData,
    ].join('\n'),
    config: {
      temperature: 0.3,
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const description = cleanResponse(response.text);

  if (!description) {
    throw new Error('Gemini returned an empty PR description.');
  }

  return description;
}
