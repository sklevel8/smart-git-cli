#!/usr/bin/env node
import { Command } from 'commander';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  assertGitRepo,
  executeCommit,
  getBranchDiff,
  getStagedDiff,
} from '../src/git.js';
import { generateCommitMessage, generatePRDescription } from '../src/ai.js';

const program = new Command();

program
  .name('smart-git')
  .description('AI-powered Git commit and pull request summarizer')
  .version('1.0.0');

program
  .command('commit')
  .description('Generate and execute a Conventional Commit for staged changes')
  .option('-d, --dry-run', 'print the generated message without committing')
  .action(async (options) => {
    try {
      assertGitRepo();

      const diff = getStagedDiff();
      console.log('Generating commit message with Gemini...\n');

      const message = await generateCommitMessage(diff);

      console.log('-'.repeat(60));
      console.log(message);
      console.log('-'.repeat(60));

      if (options.dryRun) {
        console.log('\nDry run: no commit was created.');
        return;
      }

      const rl = createInterface({ input, output });
      const answer = await rl.question('\nCommit with this message? (y/N): ');
      rl.close();

      if (!/^y(es)?$/i.test(answer.trim())) {
        console.log('Commit cancelled.');
        return;
      }

      const result = executeCommit(message);
      console.log(`\n${result}`);
    } catch (error) {
      console.error(`\nError: ${error.message}`);
      process.exitCode = 1;
    }
  });

program
  .command('pr')
  .description('Generate a Markdown Pull Request description from branch history')
  .option('-b, --base <branch>', 'base branch to compare against', 'main')
  .action(async (options) => {
    try {
      assertGitRepo();

      const branchData = getBranchDiff(options.base);
      console.log(`Generating PR description against "${options.base}"...\n`);

      const description = await generatePRDescription(branchData);
      console.log(description);
    } catch (error) {
      console.error(`\nError: ${error.message}`);
      process.exitCode = 1;
    }
  });

await program.parseAsync(process.argv);
