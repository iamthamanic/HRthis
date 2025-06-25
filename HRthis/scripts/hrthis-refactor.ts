#!/usr/bin/env ts-node

import { Command } from 'commander';
import { RefactorWatchdog } from './checkRefactor';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('hrthis-refactor')
  .description('HRthis Automatisches Refactoring-Tool')
  .version('1.0.0');

// Haupt-Scan-Kommando
program
  .command('scan')
  .description('Scannt das Projekt nach Refactoring-Kandidaten')
  .option('-v, --verbose', 'Detaillierte Ausgabe')
  .option('--auto', 'Automatisches Refactoring für alle Kandidaten')
  .option('--max-lines <number>', 'Maximale Zeilenzahl pro Datei', '300')
  .option('--max-complexity <number>', 'Maximale Komplexität', '15')
  .action(async (options) => {
    const watchdog = new RefactorWatchdog({
      verbose: options.verbose,
      autoRefactor: options.auto,
      maxLines: parseInt(options.maxLines),
      maxComplexity: parseInt(options.maxComplexity)
    });

    console.log('🔍 Scanne Projekt nach Refactoring-Kandidaten...\n');
    const candidates = await watchdog.scanForRefactorCandidates();
    await watchdog.generateReport(candidates);

    if (options.auto && candidates.length > 0) {
      console.log('🤖 Starte automatisches Refactoring...\n');
      for (const candidate of candidates) {
        await watchdog.triggerRefactoring(candidate.filePath);
      }
    }
  });

// Einzelne Datei refactorieren
program
  .command('file <filepath>')
  .description('Refactoriert eine spezifische Datei')
  .option('-v, --verbose', 'Detaillierte Ausgabe')
  .option('--auto', 'Automatisches Refactoring')
  .action(async (filepath, options) => {
    const watchdog = new RefactorWatchdog({
      verbose: options.verbose,
      autoRefactor: options.auto
    });

    if (!fs.existsSync(filepath)) {
      console.error(`❌ Datei nicht gefunden: ${filepath}`);
      process.exit(1);
    }

    await watchdog.triggerRefactoring(filepath);
  });

// Interaktiver Modus
program
  .command('interactive')
  .alias('i')
  .description('Interaktiver Refactoring-Modus')
  .action(async () => {
    const watchdog = new RefactorWatchdog({ verbose: true });
    
    console.log('🎯 Interaktiver Refactoring-Modus\n');
    const candidates = await watchdog.scanForRefactorCandidates();
    
    if (candidates.length === 0) {
      console.log('✅ Alle Dateien sind in gutem Zustand!\n');
      return;
    }

    console.log(`Gefundene Kandidaten: ${candidates.length}\n`);
    
    // Hier könnte ein interaktives Menü implementiert werden
    // Für jetzt zeigen wir die Kandidaten und lassen den User wählen
    candidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.filePath}`);
      console.log(`   Zeilen: ${candidate.lineCount}`);
      candidate.reasons.forEach(reason => {
        console.log(`   ⚠️  ${reason}`);
      });
      console.log('');
    });

    console.log('💡 Wähle eine Datei zum Refactoring:');
    console.log('   npm run refactor file <pfad>');
    console.log('   oder für alle: npm run refactor scan --auto\n');
  });

// Stats-Kommando
program
  .command('stats')
  .description('Zeigt Projekt-Statistiken')
  .action(async () => {
    const watchdog = new RefactorWatchdog({ verbose: true });
    
    console.log('📊 HRthis Projekt-Statistiken\n');
    console.log('==============================\n');
    
    const candidates = await watchdog.scanForRefactorCandidates();
    const totalFiles = await countFiles('./src');
    
    console.log(`📁 Gesamt-Dateien: ${totalFiles}`);
    console.log(`⚠️  Refactoring-Kandidaten: ${candidates.length}`);
    console.log(`✅ Gesunde Dateien: ${totalFiles - candidates.length}`);
    console.log(`📈 Gesundheits-Score: ${Math.round((totalFiles - candidates.length) / totalFiles * 100)}%\n`);
    
    if (candidates.length > 0) {
      const avgLines = candidates.reduce((sum, c) => sum + c.lineCount, 0) / candidates.length;
      console.log(`📏 Durchschnittliche Zeilenzahl (Problemdateien): ${Math.round(avgLines)}`);
      
      const reasonCounts = new Map<string, number>();
      candidates.forEach(c => {
        c.reasons.forEach(reason => {
          const key = reason.split(':')[0];
          reasonCounts.set(key, (reasonCounts.get(key) || 0) + 1);
        });
      });
      
      console.log('\n🔍 Häufigste Probleme:');
      Array.from(reasonCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([reason, count]) => {
          console.log(`   ${reason}: ${count}x`);
        });
    }
    
    console.log('\n💡 Empfohlene nächste Schritte:');
    if (candidates.length > 0) {
      console.log('   1. npm run refactor interactive');
      console.log('   2. npm run refactor scan --auto');
      console.log('   3. npm run lint:fix');
    } else {
      console.log('   🎉 Projekt ist in gutem Zustand!');
    }
    console.log('');
  });

// Hilfsfunktion zum Zählen der Dateien
async function countFiles(dir: string): Promise<number> {
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  let count = 0;
  
  for (const file of files) {
    if (file.isDirectory()) {
      count += await countFiles(path.join(dir, file.name));
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
      count++;
    }
  }
  
  return count;
}

// Fehlerbehandlung
program.on('command:*', () => {
  console.error('❌ Unbekannter Befehl: %s', program.args.join(' '));
  console.log('💡 Verfügbare Befehle: scan, file, interactive, stats');
  console.log('   Für Hilfe: npm run refactor --help');
  process.exit(1);
});

// Hilfe anzeigen wenn keine Argumente
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);