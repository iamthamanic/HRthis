#!/usr/bin/env node

/**
 * Quality Summary Generator
 * 
 * Creates a comprehensive quality summary for GitHub comments and reports
 */

const fs = require('fs');
const path = require('path');

/**
 * Generates a quality summary report
 */
function generateQualitySummary() {
  const qualityReportPath = path.join(__dirname, '../quality-report.json');
  const packageJsonPath = path.join(__dirname, '../package.json');
  
  let qualityData = {};
  let packageData = {};
  
  // Read quality report
  try {
    if (fs.existsSync(qualityReportPath)) {
      qualityData = JSON.parse(fs.readFileSync(qualityReportPath, 'utf8'));
    }
  } catch (error) {
    console.warn('Could not read quality report');
  }
  
  // Read package.json
  try {
    packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    console.warn('Could not read package.json');
  }

  // Generate summary
  const summary = generateMarkdownSummary(qualityData, packageData);
  
  // Write summary file
  fs.writeFileSync('quality-summary.md', summary);
  console.log('✅ Quality summary generated: quality-summary.md');
  
  return summary;
}

/**
 * Generates markdown summary content
 * @param {Object} qualityData - Quality check results
 * @param {Object} packageData - Package.json data
 * @returns {string} Markdown content
 */
function generateMarkdownSummary(qualityData, packageData) {
  const timestamp = new Date().toLocaleString('de-DE');
  const version = packageData.version || '1.0.0';
  
  if (!qualityData.overallScore) {
    return `## 🤖 Automated Quality Check Report

**Zeit**: ${timestamp}
**Version**: ${version}

⚠️ Qualitätsbericht konnte nicht erstellt werden. Möglicherweise sind noch nicht alle Checks implementiert.

---
*Generiert von GitHub Actions*`;
  }

  const { overallScore, results, recommendations } = qualityData;
  const status = overallScore >= 70 ? '✅ BESTANDEN' : '❌ ÜBERARBEITUNG NÖTIG';
  const statusColor = overallScore >= 70 ? '🟢' : '🔴';
  
  let markdown = `## 🤖 Automated Quality Check Report

**Zeit**: ${timestamp}
**Version**: ${version}
**Status**: ${status} ${statusColor}
**Gesamtpunktzahl**: ${overallScore}/100

### 📊 Qualitätsbereiche

| Bereich | Punktzahl | Status |
|---------|-----------|---------|
| 📚 Dokumentation | ${results.documentation?.score || 0}% | ${getStatusEmoji(results.documentation?.score || 0)} |
| 🔧 TypeScript | ${results.typeSafety?.score || 0}% | ${getStatusEmoji(results.typeSafety?.score || 0)} |
| 🎨 Code-Stil | ${results.codeStyle?.score || 0}% | ${getStatusEmoji(results.codeStyle?.score || 0)} |
| 🛡️ Fehlerbehandlung | ${results.errorHandling?.score || 0}% | ${getStatusEmoji(results.errorHandling?.score || 0)} |
| 🔒 Sicherheit | ${results.security?.score || 0}% | ${getStatusEmoji(results.security?.score || 0)} |

`;

  // Add detailed findings
  if (results.documentation) {
    markdown += `### 📚 Dokumentation Details
- **Komponenten dokumentiert**: ${results.documentation.componentCoverage}%
- **Funktionen dokumentiert**: ${results.documentation.functionCoverage}%
- **Fehlende Dokumentationen**: ${results.documentation.issues?.length || 0}

`;
  }

  if (results.typeSafety) {
    markdown += `### 🔧 TypeScript Details
- **TypeScript Fehler**: ${results.typeSafety.tsErrors || 0}
- **"any" Typ Verwendungen**: ${results.typeSafety.anyTypes || 0}
- **Analysierte Dateien**: ${results.typeSafety.totalFiles || 0}

`;
  }

  if (results.codeStyle) {
    markdown += `### 🎨 Code-Stil Details
- **ESLint Score**: ${results.codeStyle.eslintScore}%
- **Prettier Score**: ${results.codeStyle.prettierScore}%
- **Style Issues**: ${results.codeStyle.issues?.length || 0}

`;
  }

  if (results.errorHandling) {
    markdown += `### 🛡️ Fehlerbehandlung Details
- **Async Funktionen mit try-catch**: ${results.errorHandling.asyncScore}%
- **API Calls mit Error Handling**: ${results.errorHandling.apiScore}%
- **Error Boundaries**: ${results.errorHandling.errorBoundaries || 0}

`;
  }

  if (results.security) {
    markdown += `### 🔒 Sicherheit Details
- **npm audit Issues**: ${results.security.auditIssues || 0}
- **Sicherheitsprobleme**: ${results.security.issues?.length || 0}

`;
  }

  // Add recommendations
  if (recommendations && recommendations.length > 0) {
    markdown += `### 💡 Empfehlungen für Verbesserungen

`;
    recommendations.forEach(rec => {
      markdown += `- ${rec}\n`;
    });
    markdown += '\n';
  }

  // Add action items based on score
  if (overallScore < 70) {
    markdown += `### ⚡ Sofortige Maßnahmen erforderlich

Diese Änderungen sollten vor dem Merge behoben werden:

`;
    if (results.documentation?.score < 70) {
      markdown += `- 📚 **Dokumentation verbessern**: JSDoc Kommentare zu wichtigen Funktionen hinzufügen\n`;
    }
    if (results.typeSafety?.score < 70) {
      markdown += `- 🔧 **TypeScript Fehler beheben**: \`npx tsc --noEmit\` ausführen und Fehler korrigieren\n`;
    }
    if (results.codeStyle?.score < 70) {
      markdown += `- 🎨 **Code formatieren**: \`npm run lint:fix\` und \`npm run format\` ausführen\n`;
    }
    if (results.security?.score < 70) {
      markdown += `- 🔒 **Sicherheitsprobleme beheben**: \`npm audit fix\` ausführen\n`;
    }
  } else {
    markdown += `### 🎉 Hervorragende Arbeit!

Die Code-Qualität entspricht unseren Standards. Weiter so! 🚀

`;
  }

  // Add trending information if available
  const previousScores = getPreviousScores();
  if (previousScores) {
    const trend = overallScore - previousScores.lastScore;
    const trendEmoji = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
    markdown += `### 📊 Trend
**Letzte Punktzahl**: ${previousScores.lastScore}
**Änderung**: ${trend > 0 ? '+' : ''}${trend} Punkte ${trendEmoji}

`;
  }

  markdown += `---
*🤖 Automatisch generiert von [Claude Code](https://claude.ai/code) • ${timestamp}*`;

  return markdown;
}

/**
 * Gets emoji for status based on score
 * @param {number} score - Score percentage
 * @returns {string} Status emoji
 */
function getStatusEmoji(score) {
  if (score >= 80) return '✅';
  if (score >= 60) return '⚠️';
  return '❌';
}

/**
 * Gets previous scores for trending (mock implementation)
 * @returns {Object|null} Previous scores data
 */
function getPreviousScores() {
  try {
    const historyPath = path.join(__dirname, '../quality-history.json');
    if (fs.existsSync(historyPath)) {
      const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
      return history.length > 1 ? { lastScore: history[history.length - 2].score } : null;
    }
  } catch (error) {
    // No history available
  }
  return null;
}

/**
 * Saves current score to history
 * @param {number} score - Current overall score
 */
function saveScoreToHistory(score) {
  try {
    const historyPath = path.join(__dirname, '../quality-history.json');
    let history = [];
    
    if (fs.existsSync(historyPath)) {
      history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    }
    
    history.push({
      timestamp: new Date().toISOString(),
      score: score
    });
    
    // Keep only last 10 entries
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.warn('Could not save score to history:', error.message);
  }
}

/**
 * Main execution function
 */
function main() {
  const summary = generateQualitySummary();
  
  // Extract score for history if available
  try {
    const qualityReportPath = path.join(__dirname, '../quality-report.json');
    if (fs.existsSync(qualityReportPath)) {
      const qualityData = JSON.parse(fs.readFileSync(qualityReportPath, 'utf8'));
      if (qualityData.overallScore) {
        saveScoreToHistory(qualityData.overallScore);
      }
    }
  } catch (error) {
    console.warn('Could not save score to history');
  }
  
  return summary;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateQualitySummary, generateMarkdownSummary };