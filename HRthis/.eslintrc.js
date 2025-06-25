module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  plugins: [
    'sonarjs',
    'complexity'
  ],
  rules: {
    // Komplexitätsregeln
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/prefer-single-boolean-return': 'error',
    
    // Datei- und Funktionsgröße
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', { max: 10 }],
    
    // Weitere Qualitätsregeln
    'max-depth': ['error', 4],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 4],
    'no-duplicate-imports': 'error',
    
    // React-spezifische Regeln
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/prefer-stateless-function': 'warn'
  },
  overrides: [
    {
      // Weniger strenge Regeln für Test-Dateien
      files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'sonarjs/no-duplicate-string': 'off'
      }
    }
  ]
};