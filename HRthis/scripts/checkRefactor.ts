#!/usr/bin/env ts-node

import { Project, SourceFile } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface RefactorCandidate {
  filePath: string;
  reasons: string[];
  lineCount: number;
  complexity?: number;
}

interface RefactorConfig {
  maxLines: number;
  maxComplexity: number;
  srcDirectory: string;
  autoRefactor: boolean;
  verbose: boolean;
}

class RefactorWatchdog {
  private project: Project;
  private config: RefactorConfig;

  constructor(config: Partial<RefactorConfig> = {}) {
    this.config = {
      maxLines: 300,
      maxComplexity: 15,
      srcDirectory: './src',
      autoRefactor: false,
      verbose: false,
      ...config
    };

    this.project = new Project({
      tsConfigFilePath: './tsconfig.json',
    });
  }

  /**
   * Scannt alle TypeScript/React-Dateien nach Refactoring-Kandidaten
   */
  async scanForRefactorCandidates(): Promise<RefactorCandidate[]> {
    const candidates: RefactorCandidate[] = [];
    
    // Lade alle .ts/.tsx-Dateien aus dem src-Verzeichnis
    const sourceFiles = this.project.addSourceFilesAtPaths([
      `${this.config.srcDirectory}/**/*.ts`,
      `${this.config.srcDirectory}/**/*.tsx`
    ]);

    if (this.config.verbose) {
      console.log(`📁 Scanning ${sourceFiles.length} files in ${this.config.srcDirectory}...`);
    }

    for (const sourceFile of sourceFiles) {
      const candidate = this.analyzeFile(sourceFile);
      if (candidate) {
        candidates.push(candidate);
      }
    }

    return candidates;
  }

  /**
   * Analysiert eine einzelne Datei auf Refactoring-Bedarf
   */
  private analyzeFile(sourceFile: SourceFile): RefactorCandidate | null {
    const filePath = sourceFile.getFilePath();
    const reasons: string[] = [];
    
    // Zeilen zählen (ohne leere Zeilen und Kommentare)
    const lineCount = this.getSignificantLineCount(sourceFile);
    
    // Prüfe Dateigröße
    if (lineCount > this.config.maxLines) {
      reasons.push(`Datei zu groß: ${lineCount} Zeilen (max: ${this.config.maxLines})`);
    }

    // Prüfe Funktionskomplexität
    const complexFunctions = this.findComplexFunctions(sourceFile);
    if (complexFunctions.length > 0) {
      reasons.push(`${complexFunctions.length} komplexe Funktionen gefunden`);
    }

    // Prüfe zu viele Abhängigkeiten/Imports
    const importCount = sourceFile.getImportDeclarations().length;
    if (importCount > 20) {
      reasons.push(`Zu viele Imports: ${importCount} (empfohlen: <20)`);
    }

    // Prüfe React-spezifische Probleme
    const reactIssues = this.findReactIssues(sourceFile);
    if (reactIssues.length > 0) {
      reasons.push(...reactIssues);
    }

    if (reasons.length > 0) {
      return {
        filePath,
        reasons,
        lineCount,
        complexity: complexFunctions.length > 0 ? Math.max(...complexFunctions) : undefined
      };
    }

    return null;
  }

  /**
   * Zählt signifikante Zeilen (ohne Leerzeilen und Kommentare)
   */
  private getSignificantLineCount(sourceFile: SourceFile): number {
    const text = sourceFile.getFullText();
    const lines = text.split('\n');
    
    return lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             !trimmed.startsWith('//') && 
             !trimmed.startsWith('/*') && 
             !trimmed.startsWith('*');
    }).length;
  }

  /**
   * Findet Funktionen mit hoher Komplexität
   */
  private findComplexFunctions(sourceFile: SourceFile): number[] {
    const complexities: number[] = [];
    
    // Analysiere Funktionen und Methoden
    sourceFile.getFunctions().forEach(func => {
      const complexity = this.calculateCyclomaticComplexity(func.getBodyText() || '');
      if (complexity > this.config.maxComplexity) {
        complexities.push(complexity);
      }
    });

    // Analysiere Arrow Functions und Methoden in Klassen
    sourceFile.getClasses().forEach(cls => {
      cls.getMethods().forEach(method => {
        const complexity = this.calculateCyclomaticComplexity(method.getBodyText() || '');
        if (complexity > this.config.maxComplexity) {
          complexities.push(complexity);
        }
      });
    });

    return complexities;
  }

  /**
   * Einfache zyklomatische Komplexitätsberechnung
   */
  private calculateCyclomaticComplexity(code: string): number {
    const keywords = ['if', 'else', 'while', 'for', 'switch', 'case', 'catch'];
    const operators = ['&&', '||', '?'];
    let complexity = 1; // Basis-Komplexität
    
    // Zähle Keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    // Zähle Operatoren separat
    operators.forEach(operator => {
      const escapedOperator = operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = code.match(new RegExp(escapedOperator, 'g'));
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  /**
   * Findet React-spezifische Probleme
   */
  private findReactIssues(sourceFile: SourceFile): string[] {
    const issues: string[] = [];
    const text = sourceFile.getFullText();
    
    // Zu viele useState Hooks
    const useStateMatches = text.match(/useState/g);
    if (useStateMatches && useStateMatches.length > 8) {
      issues.push(`Zu viele useState Hooks: ${useStateMatches.length} (empfohlen: <8)`);
    }
    
    // Zu viele useEffect Hooks
    const useEffectMatches = text.match(/useEffect/g);
    if (useEffectMatches && useEffectMatches.length > 5) {
      issues.push(`Zu viele useEffect Hooks: ${useEffectMatches.length} (empfohlen: <5)`);
    }
    
    // Inline Styles statt CSS Klassen
    const inlineStyleMatches = text.match(/style=\{/g);
    if (inlineStyleMatches && inlineStyleMatches.length > 3) {
      issues.push(`Zu viele Inline-Styles: ${inlineStyleMatches.length} (verwende CSS-Klassen)`);
    }
    
    return issues;
  }

  /**
   * Führt ESLint-Analyse durch und sammelt Komplexitätsprobleme
   */
  private async runESLintAnalysis(): Promise<string[]> {
    try {
      const result = execSync('npx eslint src --format json', { encoding: 'utf-8' });
      const eslintResults = JSON.parse(result);
      
      const complexityIssues: string[] = [];
      
      eslintResults.forEach((fileResult: any) => {
        fileResult.messages.forEach((message: any) => {
          if (message.ruleId && (
            message.ruleId.includes('complexity') || 
            message.ruleId.includes('sonarjs')
          )) {
            complexityIssues.push(`${fileResult.filePath}: ${message.message}`);
          }
        });
      });
      
      return complexityIssues;
    } catch (error) {
      if (this.config.verbose) {
        console.warn('⚠️ ESLint-Analyse fehlgeschlagen:', error);
      }
      return [];
    }
  }

  /**
   * Generiert einen Refactoring-Report
   */
  async generateReport(candidates: RefactorCandidate[]): Promise<void> {
    console.log('\n🔍 REFACTORING WATCHDOG REPORT');
    console.log('================================\n');
    
    if (candidates.length === 0) {
      console.log('✅ Alle Dateien sind in gutem Zustand! Kein Refactoring nötig.\n');
      return;
    }

    console.log(`❗ ${candidates.length} Datei(en) benötigen Refactoring:\n`);
    
    candidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.filePath}`);
      console.log(`   📏 Zeilen: ${candidate.lineCount}`);
      candidate.reasons.forEach(reason => {
        console.log(`   ⚠️  ${reason}`);
      });
      console.log('');
    });

    // ESLint-Probleme hinzufügen
    const eslintIssues = await this.runESLintAnalysis();
    if (eslintIssues.length > 0) {
      console.log('📋 ESLint Komplexitätsprobleme:');
      eslintIssues.forEach(issue => {
        console.log(`   🔴 ${issue}`);
      });
      console.log('');
    }

    // Empfehlungen
    console.log('💡 EMPFOHLENE AKTIONEN:');
    console.log('======================');
    console.log('1. Führe aus: npm run refactor <dateiPfad>');
    console.log('2. Oder automatisch: npm run refactor:auto');
    console.log('3. Manuelle ESLint-Fixes: npm run lint:fix\n');
  }

  /**
   * Automatisches Refactoring für eine Datei
   */
  async triggerRefactoring(filePath: string): Promise<void> {
    console.log(`🔄 Starte Refactoring für: ${filePath}`);
    
    const refactorPrompt = this.generateRefactorPrompt(filePath);
    
    if (this.config.autoRefactor) {
      // Hier würde der Claude-API-Call stehen
      console.log('🤖 Claude-Refactoring würde hier ausgeführt...');
      console.log(`Prompt: ${refactorPrompt}`);
    } else {
      console.log('📋 Kopiere diesen Prompt für Claude:');
      console.log('=====================================');
      console.log(refactorPrompt);
      console.log('=====================================\n');
    }
  }

  /**
   * Generiert einen Prompt für Claude zum Refactoring
   */
  private generateRefactorPrompt(filePath: string): string {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    return `Bitte refactore die folgende TypeScript/React-Datei aus dem HRthis-Projekt:

DATEI: ${filePath}

ZIELE:
- Reduziere die Komplexität und Dateigröße
- Teile große Komponenten in kleinere auf
- Verbessere das State Management
- Optimiere React Hooks Usage
- Folge React Best Practices
- Behalte die bestehende Funktionalität bei

AKTUELLE DATEI:
\`\`\`typescript
${fileContent}
\`\`\`

Bitte erstelle einen Refactoring-Plan und implementiere die Verbesserungen. Achte besonders auf:
1. Komponenten-Aufspaltung
2. Custom Hooks für Logik-Extraktion
3. Memoization wo sinnvoll
4. Saubere Props-Interfaces
5. Konsistente Code-Stil mit dem Rest des Projekts`;
  }
}

// CLI-Interface
async function main() {
  const args = process.argv.slice(2);
  const config: Partial<RefactorConfig> = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    autoRefactor: args.includes('--auto')
  };

  const watchdog = new RefactorWatchdog(config);

  // Spezifische Datei refactorieren
  const fileIndex = args.findIndex(arg => arg === '--file' || arg === '-f');
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    const filePath = args[fileIndex + 1];
    await watchdog.triggerRefactoring(filePath);
    return;
  }

  // Vollständiger Scan
  console.log('🔍 Starte Refactoring-Analyse...\n');
  const candidates = await watchdog.scanForRefactorCandidates();
  await watchdog.generateReport(candidates);

  // Auto-Refactoring für alle Kandidaten
  if (config.autoRefactor && candidates.length > 0) {
    console.log('🤖 Starte automatisches Refactoring...\n');
    for (const candidate of candidates) {
      await watchdog.triggerRefactoring(candidate.filePath);
    }
  }
}

// Führe das Script aus, wenn es direkt aufgerufen wird
if (require.main === module) {
  main().catch(console.error);
}

export { RefactorWatchdog };
export type { RefactorCandidate, RefactorConfig };