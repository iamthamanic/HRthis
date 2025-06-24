#!/usr/bin/env node

/**
 * Automated Quality Check Script
 * 
 * Performs comprehensive code quality analysis based on the 5-point quality framework:
 * 1. JSDoc/TSDoc Documentation Coverage
 * 2. TypeScript Type Safety
 * 3. Code Style and Readability
 * 4. Error Handling Patterns
 * 5. Security Best Practices
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Quality check configuration
 */
const CONFIG = {
  srcPath: path.join(__dirname, '../src'),
  outputPath: path.join(__dirname, '../quality-report.json'),
  thresholds: {
    documentation: 70,    // Minimum JSDoc coverage %
    typeScript: 90,       // Minimum type safety score %
    style: 80,           // Minimum style compliance %
    errorHandling: 60,   // Minimum error handling coverage %
    security: 90         // Minimum security score %
  }
};

/**
 * 1. Documentation Coverage Analysis
 * Checks for JSDoc/TSDoc comments on functions, components, and classes
 */
function checkDocumentationCoverage() {
  console.log('🔍 Analyzing documentation coverage...');
  
  const results = {
    totalFunctions: 0,
    documentedFunctions: 0,
    totalComponents: 0,
    documentedComponents: 0,
    issues: []
  };

  function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    
    // Find React components (function/const components and classes)
    const componentRegex = /(?:export\s+(?:default\s+)?(?:function|const)\s+(\w+)|class\s+(\w+)\s+extends\s+React\.Component)/g;
    const functionRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(/g;
    const jsDocRegex = /\/\*\*[\s\S]*?\*\//g;
    
    let match;
    const foundJSDocs = (content.match(jsDocRegex) || []).length;
    
    // Check components
    while ((match = componentRegex.exec(content)) !== null) {
      results.totalComponents++;
      const componentName = match[1] || match[2];
      const beforeComponent = content.substring(0, match.index);
      const hasDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeComponent);
      
      if (hasDoc) {
        results.documentedComponents++;
      } else {
        results.issues.push({
          type: 'missing-component-doc',
          file: relativePath,
          component: componentName,
          line: (content.substring(0, match.index).match(/\n/g) || []).length + 1
        });
      }
    }
    
    // Check functions
    while ((match = functionRegex.exec(content)) !== null) {
      results.totalFunctions++;
      const functionName = match[1] || match[2];
      const beforeFunction = content.substring(0, match.index);
      const hasDoc = /\/\*\*[\s\S]*?\*\/\s*$/.test(beforeFunction);
      
      if (hasDoc) {
        results.documentedFunctions++;
      } else {
        results.issues.push({
          type: 'missing-function-doc',
          file: relativePath,
          function: functionName,
          line: (content.substring(0, match.index).match(/\n/g) || []).length + 1
        });
      }
    }
  }

  // Recursively analyze all TypeScript files
  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        analyzeFile(filePath);
      }
    });
  }

  walkDirectory(CONFIG.srcPath);
  
  const componentCoverage = results.totalComponents > 0 ? 
    (results.documentedComponents / results.totalComponents) * 100 : 100;
  const functionCoverage = results.totalFunctions > 0 ? 
    (results.documentedFunctions / results.totalFunctions) * 100 : 100;
  const overallCoverage = (componentCoverage + functionCoverage) / 2;
  
  return {
    score: Math.round(overallCoverage),
    componentCoverage: Math.round(componentCoverage),
    functionCoverage: Math.round(functionCoverage),
    issues: results.issues,
    details: results
  };
}

/**
 * 2. TypeScript Type Safety Analysis
 * Checks for any types, missing type annotations, and type errors
 */
function checkTypeSafety() {
  console.log('🔧 Analyzing TypeScript type safety...');
  
  let tsErrors = 0;
  let anyTypes = 0;
  let totalFiles = 0;
  const issues = [];

  try {
    // Run TypeScript compiler to check for errors
    const tscOutput = execSync('npx tsc --noEmit --pretty false', { encoding: 'utf8' });
  } catch (error) {
    const errorOutput = error.stdout || error.stderr || '';
    const errorLines = errorOutput.split('\n').filter(line => line.trim());
    tsErrors = errorLines.filter(line => line.includes('error TS')).length;
    
    errorLines.forEach(line => {
      if (line.includes('error TS')) {
        const match = line.match(/(.+\.tsx?)\((\d+),(\d+)\): error TS(\d+): (.+)/);
        if (match) {
          issues.push({
            type: 'typescript-error',
            file: match[1],
            line: parseInt(match[2]),
            column: parseInt(match[3]),
            code: match[4],
            message: match[5]
          });
        }
      }
    });
  }

  // Check for 'any' types
  function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    totalFiles++;
    
    const anyMatches = content.match(/:\s*any\b/g) || [];
    anyTypes += anyMatches.length;
    
    anyMatches.forEach((match, index) => {
      const beforeMatch = content.substring(0, content.indexOf(match));
      const line = (beforeMatch.match(/\n/g) || []).length + 1;
      issues.push({
        type: 'any-type-usage',
        file: relativePath,
        line: line,
        message: 'Usage of "any" type reduces type safety'
      });
    });
  }

  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        analyzeFile(filePath);
      }
    });
  }

  walkDirectory(CONFIG.srcPath);

  // Calculate score: penalize errors and any types
  const errorPenalty = Math.min(tsErrors * 5, 50);
  const anyPenalty = Math.min(anyTypes * 2, 30);
  const score = Math.max(0, 100 - errorPenalty - anyPenalty);

  return {
    score: Math.round(score),
    tsErrors,
    anyTypes,
    totalFiles,
    issues: issues.slice(0, 20) // Limit to first 20 issues
  };
}

/**
 * 3. Code Style and Readability Analysis
 * Uses ESLint and custom metrics for readability
 */
function checkCodeStyle() {
  console.log('🎨 Analyzing code style and readability...');
  
  let eslintScore = 100;
  let eslintIssues = [];
  
  try {
    // Run ESLint and capture output
    execSync('npx eslint src --ext .ts,.tsx --format json > eslint-report.json', { stdio: 'pipe' });
  } catch (error) {
    // ESLint found issues (non-zero exit code)
  }
  
  // Read ESLint report
  try {
    if (fs.existsSync('eslint-report.json')) {
      const eslintData = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));
      eslintIssues = eslintData.reduce((acc, file) => {
        return acc.concat(file.messages.map(msg => ({
          type: 'eslint-issue',
          file: path.relative(process.cwd(), file.filePath),
          line: msg.line,
          column: msg.column,
          severity: msg.severity === 2 ? 'error' : 'warning',
          rule: msg.ruleId,
          message: msg.message
        })));
      }, []);
      
      const errors = eslintIssues.filter(issue => issue.severity === 'error').length;
      const warnings = eslintIssues.filter(issue => issue.severity === 'warning').length;
      eslintScore = Math.max(0, 100 - (errors * 5) - (warnings * 1));
    }
  } catch (error) {
    console.warn('Could not parse ESLint report');
  }
  
  // Check Prettier formatting
  let prettierScore = 100;
  try {
    execSync('npx prettier --check src/**/*.{ts,tsx}', { stdio: 'pipe' });
  } catch (error) {
    prettierScore = 70; // Penalize for formatting issues
  }
  
  const overallScore = (eslintScore + prettierScore) / 2;
  
  return {
    score: Math.round(overallScore),
    eslintScore: Math.round(eslintScore),
    prettierScore,
    issues: eslintIssues.slice(0, 15) // Limit issues
  };
}

/**
 * 4. Error Handling Pattern Analysis
 * Checks for try-catch blocks, error boundaries, and error handling patterns
 */
function checkErrorHandling() {
  console.log('🛡️ Analyzing error handling patterns...');
  
  const results = {
    totalAsyncFunctions: 0,
    asyncWithTryCatch: 0,
    totalApiCalls: 0,
    apiCallsWithErrorHandling: 0,
    errorBoundaries: 0,
    issues: []
  };

  function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    
    // Find async functions
    const asyncFunctionRegex = /async\s+(?:function\s+\w+|\w+\s*=>|\(\s*\)\s*=>)/g;
    let match;
    while ((match = asyncFunctionRegex.exec(content)) !== null) {
      results.totalAsyncFunctions++;
      
      // Check if there's a try-catch in the vicinity
      const functionStart = match.index;
      const nextFunctionMatch = asyncFunctionRegex.exec(content);
      const functionEnd = nextFunctionMatch ? nextFunctionMatch.index : content.length;
      const functionBody = content.substring(functionStart, functionEnd);
      
      if (functionBody.includes('try') && functionBody.includes('catch')) {
        results.asyncWithTryCatch++;
      } else {
        results.issues.push({
          type: 'missing-error-handling',
          file: relativePath,
          line: (content.substring(0, functionStart).match(/\n/g) || []).length + 1,
          message: 'Async function without try-catch block'
        });
      }
    }
    
    // Find API calls (fetch, axios, etc.)
    const apiCallRegex = /(?:fetch\(|axios\.|api\.|\.get\(|\.post\(|\.put\(|\.delete\()/g;
    while ((match = apiCallRegex.exec(content)) !== null) {
      results.totalApiCalls++;
      
      // Simple heuristic: check for .catch or try-catch nearby
      const callStart = Math.max(0, match.index - 500);
      const callEnd = Math.min(content.length, match.index + 500);
      const context = content.substring(callStart, callEnd);
      
      if (context.includes('.catch') || context.includes('try') || context.includes('catch')) {
        results.apiCallsWithErrorHandling++;
      } else {
        results.issues.push({
          type: 'unhandled-api-call',
          file: relativePath,
          line: (content.substring(0, match.index).match(/\n/g) || []).length + 1,
          message: 'API call without error handling'
        });
      }
    }
    
    // Check for Error Boundaries
    if (content.includes('componentDidCatch') || content.includes('ErrorBoundary')) {
      results.errorBoundaries++;
    }
  }

  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        analyzeFile(filePath);
      }
    });
  }

  walkDirectory(CONFIG.srcPath);
  
  const asyncScore = results.totalAsyncFunctions > 0 ? 
    (results.asyncWithTryCatch / results.totalAsyncFunctions) * 100 : 100;
  const apiScore = results.totalApiCalls > 0 ? 
    (results.apiCallsWithErrorHandling / results.totalApiCalls) * 100 : 100;
  const overallScore = (asyncScore + apiScore) / 2;
  
  return {
    score: Math.round(overallScore),
    asyncScore: Math.round(asyncScore),
    apiScore: Math.round(apiScore),
    errorBoundaries: results.errorBoundaries,
    issues: results.issues.slice(0, 10),
    details: results
  };
}

/**
 * 5. Security Best Practices Analysis
 * Checks for common security issues and best practices
 */
function checkSecurity() {
  console.log('🔒 Analyzing security best practices...');
  
  const issues = [];
  let score = 100;
  
  // Check npm audit
  let auditIssues = 0;
  try {
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditOutput);
    auditIssues = auditData.metadata.vulnerabilities.total || 0;
    score -= Math.min(auditIssues * 5, 40);
  } catch (error) {
    // npm audit might fail, that's ok
  }
  
  // Check for hardcoded secrets
  function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    
    // Common secret patterns
    const secretPatterns = [
      { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/, type: 'api-key' },
      { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, type: 'password' },
      { pattern: /secret\s*[:=]\s*['"][^'"]{10,}['"]/, type: 'secret' },
      { pattern: /token\s*[:=]\s*['"][^'"]{20,}['"]/, type: 'token' }
    ];
    
    secretPatterns.forEach(({ pattern, type }) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        // Skip if it's a placeholder or environment variable
        if (match[0].includes('your_') || match[0].includes('YOUR_') || 
            match[0].includes('process.env') || match[0].includes('${')) {
          continue;
        }
        
        issues.push({
          type: 'potential-secret',
          file: relativePath,
          line: (content.substring(0, match.index).match(/\n/g) || []).length + 1,
          secretType: type,
          message: `Potential hardcoded ${type} found`
        });
        score -= 10;
      }
    });
    
    // Check for eval() usage
    if (content.includes('eval(')) {
      issues.push({
        type: 'dangerous-function',
        file: relativePath,
        message: 'Usage of eval() function detected'
      });
      score -= 15;
    }
    
    // Check for innerHTML usage
    const innerHTMLMatches = content.match(/innerHTML\s*=|dangerouslySetInnerHTML/g) || [];
    innerHTMLMatches.forEach(() => {
      issues.push({
        type: 'xss-risk',
        file: relativePath,
        message: 'Potential XSS risk with innerHTML/dangerouslySetInnerHTML'
      });
      score -= 5;
    });
  }

  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        analyzeFile(filePath);
      }
    });
  }

  walkDirectory(CONFIG.srcPath);
  
  return {
    score: Math.max(0, Math.round(score)),
    auditIssues,
    issues: issues.slice(0, 10)
  };
}

/**
 * Generate summary report
 */
function generateReport(results) {
  const overallScore = Math.round(
    (results.documentation.score + 
     results.typeSafety.score + 
     results.codeStyle.score + 
     results.errorHandling.score + 
     results.security.score) / 5
  );
  
  const report = {
    timestamp: new Date().toISOString(),
    overallScore,
    passed: overallScore >= 70,
    results,
    recommendations: []
  };
  
  // Generate recommendations
  if (results.documentation.score < CONFIG.thresholds.documentation) {
    report.recommendations.push('Add JSDoc comments to functions and components');
  }
  if (results.typeSafety.score < CONFIG.thresholds.typeScript) {
    report.recommendations.push('Fix TypeScript errors and reduce "any" type usage');
  }
  if (results.codeStyle.score < CONFIG.thresholds.style) {
    report.recommendations.push('Fix ESLint issues and run Prettier formatting');
  }
  if (results.errorHandling.score < CONFIG.thresholds.errorHandling) {
    report.recommendations.push('Add try-catch blocks to async functions and API calls');
  }
  if (results.security.score < CONFIG.thresholds.security) {
    report.recommendations.push('Address security vulnerabilities and remove hardcoded secrets');
  }
  
  return report;
}

/**
 * Main execution function
 */
function main() {
  console.log('🚀 Starting comprehensive quality check...\n');
  
  const results = {
    documentation: checkDocumentationCoverage(),
    typeSafety: checkTypeSafety(),
    codeStyle: checkCodeStyle(),
    errorHandling: checkErrorHandling(),
    security: checkSecurity()
  };
  
  console.log('\n📊 Quality Check Results:');
  console.log(`📚 Documentation: ${results.documentation.score}%`);
  console.log(`🔧 Type Safety: ${results.typeSafety.score}%`);
  console.log(`🎨 Code Style: ${results.codeStyle.score}%`);
  console.log(`🛡️ Error Handling: ${results.errorHandling.score}%`);
  console.log(`🔒 Security: ${results.security.score}%`);
  
  const report = generateReport(results);
  console.log(`\n🏆 Overall Score: ${report.overallScore}% ${report.passed ? '✅' : '❌'}`);
  
  // Save report
  fs.writeFileSync(CONFIG.outputPath, JSON.stringify(report, null, 2));
  console.log(`💾 Report saved to: ${CONFIG.outputPath}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  // Exit with error code if quality is below threshold
  process.exit(report.passed ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkDocumentationCoverage,
  checkTypeSafety,
  checkCodeStyle,
  checkErrorHandling,
  checkSecurity,
  generateReport
};