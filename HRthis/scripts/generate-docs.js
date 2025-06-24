#!/usr/bin/env node

/**
 * Documentation Generation Script
 * 
 * Automatically generates JSDoc comments and human-readable explanations
 * for code files that lack proper documentation.
 */

const fs = require('fs');
const path = require('path');

/**
 * Configuration for documentation generation
 */
const CONFIG = {
  srcPath: path.join(__dirname, '../src'),
  templatesPath: path.join(__dirname, '../.github/templates'),
  outputPath: path.join(__dirname, '../docs-generated')
};

/**
 * JSDoc template generator for different code patterns
 */
class JSDocGenerator {
  /**
   * Generates JSDoc for a React component
   * @param {string} componentName - Name of the component
   * @param {string} props - Props interface or type
   * @returns {string} Generated JSDoc comment
   */
  generateComponentDoc(componentName, props = '') {
    return `/**
 * ${componentName} Component
 * 
 * [Human-readable description goes here]
 * 
 * @component
 * @example
 * return (
 *   <${componentName} />
 * )
 * 
 * @param {Object} props - Component properties
${props ? ` * @param {${props}} props.${props.toLowerCase()} - [Description needed]` : ''}
 * @returns {JSX.Element} Rendered component
 */`;
  }

  /**
   * Generates JSDoc for a function
   * @param {string} functionName - Name of the function
   * @param {Array} params - Function parameters
   * @param {string} returnType - Return type
   * @returns {string} Generated JSDoc comment
   */
  generateFunctionDoc(functionName, params = [], returnType = 'void') {
    const paramDocs = params.map(param => 
      ` * @param {${param.type || 'any'}} ${param.name} - [Description needed]`
    ).join('\n');
    
    return `/**
 * ${functionName} Function
 * 
 * [Human-readable description goes here]
 * 
${paramDocs}
 * @returns {${returnType}} [Description needed]
 */`;
  }

  /**
   * Generates JSDoc for a Zustand store
   * @param {string} storeName - Name of the store
   * @returns {string} Generated JSDoc comment
   */
  generateStoreDoc(storeName) {
    return `/**
 * ${storeName} Store
 * 
 * Zustand store for managing ${storeName.toLowerCase()} state and operations.
 * This store handles [specific responsibilities].
 * 
 * @store
 * @example
 * const { data, actions } = use${storeName}Store();
 * 
 * @interface ${storeName}Store
 * @property {Object} state - Current state data
 * @property {Object} actions - Available state actions
 */`;
  }
}

/**
 * Human-readable explanation generator
 */
class HumanExplanationGenerator {
  /**
   * Generates a simple explanation template
   * @param {string} codeType - Type of code (component, function, store, etc.)
   * @param {string} name - Name of the code element
   * @returns {string} Human-readable explanation template
   */
  generateExplanation(codeType, name) {
    const templates = {
      component: `
## Was macht die ${name} Komponente?

Diese Komponente ist verantwortlich für [Hauptfunktion in einfachen Worten].

### Schritt-für-Schritt Erklärung:

1. **Initialisierung**: Beim ersten Laden passiert [was]
2. **Benutzerinteraktion**: Wenn der Nutzer [was macht], dann [was passiert]
3. **Datenverarbeitung**: Die Komponente [verarbeitet/zeigt/speichert] [was]
4. **Ergebnis**: Am Ende wird [was gezeigt/erreicht]

### Analogie:
Stell dir vor, diese Komponente ist wie [Alltagsvergleich]...

### Für neue Teammitglieder:
- Diese Komponente findest du in: [Pfad]
- Sie wird verwendet in: [wo]
- Wichtige Abhängigkeiten: [was]
`,
      function: `
## Was macht die ${name} Funktion?

Diese Funktion [Hauptzweck in einem Satz].

### Was passiert hier?

1. **Eingabe**: Die Funktion erhält [Parameter erklären]
2. **Verarbeitung**: Dann wird [Logik erklären]
3. **Ausgabe**: Am Ende gibt sie [Rückgabe erklären] zurück

### Wann wird sie verwendet?
[Anwendungsfall erklären]

### Beispiel aus dem echten Leben:
Das ist wie wenn du [Alltagsvergleich]...
`,
      store: `
## Was macht der ${name} Store?

Dieser Store ist der "Datenspeicher" für [Bereich]. Er funktioniert wie eine zentrale Ablage für alle Informationen zu [Thema].

### Was wird hier gespeichert?
- [Datentyp 1]: Für [Zweck]
- [Datentyp 2]: Für [Zweck]

### Welche Aktionen gibt es?
1. **[Aktion 1]**: [Was passiert in einfachen Worten]
2. **[Aktion 2]**: [Was passiert in einfachen Worten]

### Analogie:
Stell dir vor, dieser Store ist wie [Alltagsvergleich - z.B. ein Aktenschrank, eine Bibliothek, etc.]...

### Für Entwickler:
- Zugriff über: \`use${name}Store()\`
- Wichtige Aktionen: [Liste]
- Persistiert in: LocalStorage
`
    };

    return templates[codeType] || `
## ${name} Erklärung

[Bitte füge hier eine menschlich verständliche Erklärung hinzu]

### Was macht dieser Code?
[Erklärung in einfachen Worten]

### Warum ist das wichtig?
[Kontext und Zweck erklären]
`;
  }
}

/**
 * File analyzer to determine code patterns and generate appropriate documentation
 */
class CodeAnalyzer {
  constructor() {
    this.jsDocGen = new JSDocGenerator();
    this.explanationGen = new HumanExplanationGenerator();
  }

  /**
   * Analyzes a file and generates documentation
   * @param {string} filePath - Path to the file to analyze
   * @returns {Object} Generated documentation
   */
  analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, path.extname(filePath));
    const relativePath = path.relative(CONFIG.srcPath, filePath);
    
    const result = {
      filePath: relativePath,
      fileName,
      type: this.determineFileType(filePath, content),
      hasDocumentation: this.hasExistingDocumentation(content),
      suggestions: []
    };

    if (!result.hasDocumentation) {
      result.suggestions = this.generateDocumentationSuggestions(content, fileName, result.type);
    }

    return result;
  }

  /**
   * Determines the type of file (component, store, utility, etc.)
   * @param {string} filePath - Path to the file
   * @param {string} content - File content
   * @returns {string} File type
   */
  determineFileType(filePath, content) {
    if (filePath.includes('/screens/')) return 'screen';
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/state/')) return 'store';
    if (filePath.includes('/utils/')) return 'utility';
    if (filePath.includes('/api/')) return 'api';
    if (filePath.includes('/types/')) return 'types';
    
    // Content-based detection
    if (content.includes('export default function') || content.includes('const') && content.includes('= ()')) {
      return 'component';
    }
    if (content.includes('create(') && content.includes('zustand')) {
      return 'store';
    }
    
    return 'unknown';
  }

  /**
   * Checks if file already has JSDoc documentation
   * @param {string} content - File content
   * @returns {boolean} Whether documentation exists
   */
  hasExistingDocumentation(content) {
    return content.includes('/**') && content.includes('*/');
  }

  /**
   * Generates documentation suggestions for a file
   * @param {string} content - File content
   * @param {string} fileName - Name of the file
   * @param {string} type - Type of file
   * @returns {Array} Documentation suggestions
   */
  generateDocumentationSuggestions(content, fileName, type) {
    const suggestions = [];

    // Generate JSDoc suggestions
    const jsdocSuggestion = this.generateJSDocSuggestion(content, fileName, type);
    if (jsdocSuggestion) {
      suggestions.push({
        type: 'jsdoc',
        content: jsdocSuggestion
      });
    }

    // Generate human explanation
    const explanation = this.explanationGen.generateExplanation(type, fileName);
    suggestions.push({
      type: 'human-explanation',
      content: explanation
    });

    return suggestions;
  }

  /**
   * Generates JSDoc suggestion based on content analysis
   * @param {string} content - File content
   * @param {string} fileName - Name of the file
   * @param {string} type - Type of file
   * @returns {string|null} JSDoc suggestion
   */
  generateJSDocSuggestion(content, fileName, type) {
    switch (type) {
      case 'component':
      case 'screen':
        return this.jsDocGen.generateComponentDoc(fileName);
      
      case 'store':
        return this.jsDocGen.generateStoreDoc(fileName);
      
      case 'utility':
      case 'api':
        // Find main function to document
        const functionMatch = content.match(/export\s+(?:default\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*=)/);
        if (functionMatch) {
          const funcName = functionMatch[1] || functionMatch[2];
          return this.jsDocGen.generateFunctionDoc(funcName);
        }
        break;
    }
    
    return null;
  }
}

/**
 * Main documentation generation process
 */
function main() {
  console.log('📚 Starting documentation generation...');
  
  const analyzer = new CodeAnalyzer();
  const results = [];

  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        processDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const analysis = analyzer.analyzeFile(filePath);
        if (analysis.suggestions.length > 0) {
          results.push(analysis);
        }
      }
    });
  }

  processDirectory(CONFIG.srcPath);

  // Create output directory
  if (!fs.existsSync(CONFIG.outputPath)) {
    fs.mkdirSync(CONFIG.outputPath, { recursive: true });
  }

  // Generate documentation files
  let generatedCount = 0;
  results.forEach(result => {
    if (result.suggestions.length > 0) {
      const outputFile = path.join(
        CONFIG.outputPath, 
        `${result.fileName}-documentation.md`
      );
      
      let content = `# Documentation for ${result.fileName}\n\n`;
      content += `**File**: \`${result.filePath}\`\n`;
      content += `**Type**: ${result.type}\n\n`;
      
      result.suggestions.forEach(suggestion => {
        if (suggestion.type === 'jsdoc') {
          content += `## JSDoc Suggestion\n\n\`\`\`javascript\n${suggestion.content}\n\`\`\`\n\n`;
        } else if (suggestion.type === 'human-explanation') {
          content += `## Human-Readable Explanation\n\n${suggestion.content}\n\n`;
        }
      });
      
      fs.writeFileSync(outputFile, content);
      generatedCount++;
    }
  });

  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    totalFilesAnalyzed: results.length,
    filesNeedingDocumentation: results.filter(r => r.suggestions.length > 0).length,
    documentationGenerated: generatedCount,
    filesByType: results.reduce((acc, result) => {
      acc[result.type] = (acc[result.type] || 0) + 1;
      return acc;
    }, {})
  };

  fs.writeFileSync(
    path.join(CONFIG.outputPath, 'documentation-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log(`✅ Documentation generation complete!`);
  console.log(`📊 Analyzed ${summary.totalFilesAnalyzed} files`);
  console.log(`📝 Generated documentation for ${generatedCount} files`);
  console.log(`💾 Output saved to: ${CONFIG.outputPath}`);

  return summary;
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { CodeAnalyzer, JSDocGenerator, HumanExplanationGenerator };