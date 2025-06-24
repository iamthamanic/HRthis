#!/usr/bin/env node

/**
 * Pre-commit Quality Check Script
 * 
 * Lightweight version of the quality check that only analyzes staged files
 * to provide fast feedback during the commit process.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Gets list of staged TypeScript/JavaScript files
 * @returns {Array} List of staged files
 */
function getStagedFiles() {
  try {
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
      .filter(file => file.startsWith('src/'))
      .filter(file => fs.existsSync(file));
    
    return stagedFiles;
  } catch (error) {
    console.warn('Could not get staged files:', error.message);
    return [];
  }
}

/**
 * Quick documentation check for staged files
 * @param {Array} files - List of files to check
 * @returns {Object} Check results
 */
function quickDocumentationCheck(files) {
  let issues = 0;
  const problems = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for exported functions/components without JSDoc
      const exports = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+(\w+)/g) || [];
      const jsdocs = (content.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
      
      if (exports.length > 0 && jsdocs === 0) {
        issues++;
        problems.push({
          file,
          type: 'missing-docs',
          message: `${exports.length} exported items without JSDoc`
        });
      }
    } catch (error) {
      console.warn(`Could not analyze ${file}:`, error.message);
    }
  });
  
  return { issues, problems };
}

/**
 * Quick TypeScript check for staged files
 * @param {Array} files - List of files to check
 * @returns {Object} Check results
 */
function quickTypeScriptCheck(files) {
  let issues = 0;
  const problems = [];
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for 'any' types
      const anyTypes = (content.match(/:\s*any\b/g) || []).length;
      if (anyTypes > 0) {
        issues += anyTypes;
        problems.push({
          file,
          type: 'any-types',
          message: `${anyTypes} usage(s) of 'any' type`
        });
      }
      
      // Check for TODO/FIXME comments
      const todos = (content.match(/\/\/\s*(TODO|FIXME|XXX)/gi) || []).length;
      if (todos > 0) {
        problems.push({
          file,
          type: 'todos',
          message: `${todos} TODO/FIXME comment(s)`
        });
      }
    } catch (error) {
      console.warn(`Could not analyze ${file}:`, error.message);
    }
  });
  
  return { issues, problems };
}

/**
 * Quick style check using ESLint
 * @param {Array} files - List of files to check
 * @returns {Object} Check results
 */
function quickStyleCheck(files) {
  if (files.length === 0) {
    return { issues: 0, problems: [] };
  }
  
  let issues = 0;
  const problems = [];
  
  try {
    // Run ESLint only on staged files
    const fileList = files.join(' ');
    execSync(`npx eslint ${fileList} --format json > .eslint-staged.json`, { stdio: 'pipe' });
  } catch (error) {
    // ESLint found issues
  }
  
  try {
    if (fs.existsSync('.eslint-staged.json')) {
      const eslintResults = JSON.parse(fs.readFileSync('.eslint-staged.json', 'utf8'));
      
      eslintResults.forEach(result => {
        const errors = result.messages.filter(msg => msg.severity === 2).length;
        const warnings = result.messages.filter(msg => msg.severity === 1).length;
        
        if (errors > 0 || warnings > 0) {
          issues += errors + warnings;
          problems.push({
            file: result.filePath,
            type: 'eslint',
            message: `${errors} error(s), ${warnings} warning(s)`
          });
        }
      });
      
      // Clean up
      fs.unlinkSync('.eslint-staged.json');
    }
  } catch (error) {
    console.warn('Could not parse ESLint results');
  }
  
  return { issues, problems };
}

/**
 * Generates a quick summary for the terminal
 * @param {Object} results - All check results
 * @param {Array} files - Staged files
 * @returns {string} Summary message
 */
function generateSummary(results, files) {
  const totalIssues = results.documentation.issues + results.typescript.issues + results.style.issues;
  
  let summary = `\n📊 Pre-commit Quality Check Summary\n`;
  summary += `Files checked: ${files.length}\n`;
  summary += `Total issues: ${totalIssues}\n\n`;
  
  if (results.documentation.issues > 0) {
    summary += `📚 Documentation: ${results.documentation.issues} issues\n`;
  }
  
  if (results.typescript.issues > 0) {
    summary += `🔧 TypeScript: ${results.typescript.issues} issues\n`;
  }
  
  if (results.style.issues > 0) {
    summary += `🎨 Style: ${results.style.issues} issues\n`;
  }
  
  if (totalIssues === 0) {
    summary += `✅ All checks passed! Great work!\n`;
  } else {
    summary += `\n⚠️ Issues found:\n`;
    
    [...results.documentation.problems, ...results.typescript.problems, ...results.style.problems]
      .slice(0, 5) // Show only first 5 issues
      .forEach(problem => {
        const fileName = path.basename(problem.file);
        summary += `  • ${fileName}: ${problem.message}\n`;
      });
    
    if (totalIssues > 5) {
      summary += `  ... and ${totalIssues - 5} more issues\n`;
    }
    
    summary += `\n💡 Run 'npm run lint:fix' to auto-fix style issues\n`;
    summary += `💡 Run 'node scripts/quality-check.js' for detailed analysis\n`;
  }
  
  return summary;
}

/**
 * Main execution function
 */
function main() {
  console.log('🔍 Running pre-commit quality checks...');
  
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    console.log('✅ No TypeScript files staged for commit');
    return 0;
  }
  
  console.log(`📁 Checking ${stagedFiles.length} staged file(s)...`);
  
  // Run quick checks
  const results = {
    documentation: quickDocumentationCheck(stagedFiles),
    typescript: quickTypeScriptCheck(stagedFiles),
    style: quickStyleCheck(stagedFiles)
  };
  
  // Generate and display summary
  const summary = generateSummary(results, stagedFiles);
  console.log(summary);
  
  // Determine if commit should be allowed
  const totalIssues = results.documentation.issues + results.typescript.issues + results.style.issues;
  const criticalIssues = results.style.issues; // Only style issues are critical for commit
  
  if (criticalIssues > 0) {
    console.log('❌ Critical issues found. Please fix before committing.');
    return 1;
  }
  
  if (totalIssues > 0) {
    console.log('⚠️ Non-critical issues found. Consider fixing them soon.');
  }
  
  console.log('✅ Pre-commit checks passed!');
  return 0;
}

// Run if called directly
if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}

module.exports = {
  getStagedFiles,
  quickDocumentationCheck,
  quickTypeScriptCheck,
  quickStyleCheck
};