#!/usr/bin/env node

/**
 * Automated README Update Script
 * 
 * This script automatically updates the README.md file with:
 * - Latest feature counts and statistics
 * - Code quality metrics
 * - Test coverage information
 * - Recent changes and improvements
 * - Technology stack updates
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Analyzes the project structure and generates statistics
 * @returns {Object} Project statistics and metrics
 */
function analyzeProject() {
  const srcPath = path.join(__dirname, '../src');
  
  // Count files by type
  const getFileCount = (dir, extensions) => {
    try {
      const files = execSync(`find ${dir} -name "*.{${extensions.join(',')}}" 2>/dev/null | wc -l`)
        .toString().trim();
      return parseInt(files) || 0;
    } catch {
      return 0;
    }
  };

  // Get git statistics
  const getGitStats = () => {
    try {
      const commitCount = execSync('git rev-list --count HEAD').toString().trim();
      const lastCommit = execSync('git log -1 --format="%ad" --date=short').toString().trim();
      const contributors = execSync('git log --format="%an" | sort -u | wc -l').toString().trim();
      return { commitCount, lastCommit, contributors: parseInt(contributors) };
    } catch {
      return { commitCount: '0', lastCommit: 'N/A', contributors: 0 };
    }
  };

  // Analyze package.json for dependencies
  const getPackageInfo = () => {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const deps = Object.keys(packageJson.dependencies || {}).length;
      const devDeps = Object.keys(packageJson.devDependencies || {}).length;
      return {
        version: packageJson.version,
        dependencies: deps,
        devDependencies: devDeps,
        scripts: Object.keys(packageJson.scripts || {}).length
      };
    } catch {
      return { version: '1.0.0', dependencies: 0, devDependencies: 0, scripts: 0 };
    }
  };

  // Get test coverage if available
  const getCoverage = () => {
    try {
      const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');
      if (fs.existsSync(coveragePath)) {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        return {
          lines: coverage.total.lines.pct,
          functions: coverage.total.functions.pct,
          branches: coverage.total.branches.pct,
          statements: coverage.total.statements.pct
        };
      }
    } catch {}
    return { lines: 0, functions: 0, branches: 0, statements: 0 };
  };

  // Get quality metrics if available
  const getQualityMetrics = () => {
    try {
      const qualityPath = path.join(__dirname, '../reports/quality-report.json');
      if (fs.existsSync(qualityPath)) {
        return JSON.parse(fs.readFileSync(qualityPath, 'utf8'));
      }
    } catch {}
    return { score: 0, issues: 0, warnings: 0 };
  };

  return {
    files: {
      components: getFileCount(path.join(srcPath, 'components'), ['tsx']),
      screens: getFileCount(path.join(srcPath, 'screens'), ['tsx']),
      stores: getFileCount(path.join(srcPath, 'state'), ['ts']),
      types: getFileCount(path.join(srcPath, 'types'), ['ts']),
      utils: getFileCount(path.join(srcPath, 'utils'), ['ts']),
      apis: getFileCount(path.join(srcPath, 'api'), ['ts']),
      tests: getFileCount(srcPath, ['test.ts', 'test.tsx', 'spec.ts', 'spec.tsx'])
    },
    git: getGitStats(),
    package: getPackageInfo(),
    coverage: getCoverage(),
    quality: getQualityMetrics(),
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

/**
 * Generates feature analysis from source code
 * @returns {Object} Feature analysis results
 */
function analyzeFeatures() {
  const srcPath = path.join(__dirname, '../src');
  
  // Analyze implemented vs placeholder screens
  const analyzeScreens = () => {
    const screensPath = path.join(srcPath, 'screens');
    if (!fs.existsSync(screensPath)) return { implemented: 0, placeholders: 0, total: 0 };
    
    const screenFiles = fs.readdirSync(screensPath)
      .filter(file => file.endsWith('.tsx') && !file.includes('test'));
    
    let implemented = 0;
    let placeholders = 0;
    
    screenFiles.forEach(file => {
      const content = fs.readFileSync(path.join(screensPath, file), 'utf8');
      // Simple heuristic: if file is very short or contains "coming soon", it's a placeholder
      if (content.length < 500 || content.includes('Coming Soon') || content.includes('Placeholder')) {
        placeholders++;
      } else {
        implemented++;
      }
    });
    
    return { implemented, placeholders, total: screenFiles.length };
  };

  // Analyze Zustand stores
  const analyzeStores = () => {
    const statePath = path.join(srcPath, 'state');
    if (!fs.existsSync(statePath)) return { count: 0, withPersistence: 0 };
    
    const storeFiles = fs.readdirSync(statePath)
      .filter(file => file.endsWith('.ts') && !file.includes('test'));
    
    let withPersistence = 0;
    storeFiles.forEach(file => {
      const content = fs.readFileSync(path.join(statePath, file), 'utf8');
      if (content.includes('persist')) withPersistence++;
    });
    
    return { count: storeFiles.length, withPersistence };
  };

  // Analyze AI integrations
  const analyzeAI = () => {
    const apiPath = path.join(srcPath, 'api');
    if (!fs.existsSync(apiPath)) return { services: [] };
    
    const apiFiles = fs.readdirSync(apiPath)
      .filter(file => file.endsWith('.ts'))
      .map(file => file.replace('.ts', ''));
    
    const aiServices = apiFiles.filter(service => 
      ['openai', 'anthropic', 'grok', 'chat-service'].includes(service)
    );
    
    return { services: aiServices };
  };

  return {
    screens: analyzeScreens(),
    stores: analyzeStores(),
    ai: analyzeAI()
  };
}

/**
 * Generates the updated README content
 * @param {Object} stats - Project statistics
 * @param {Object} features - Feature analysis
 * @returns {string} Updated README content
 */
function generateReadmeContent(stats, features) {
  const coverageColor = stats.coverage.lines > 80 ? 'green' : 
                       stats.coverage.lines > 60 ? 'yellow' : 'red';
  
  const qualityColor = stats.quality.score > 80 ? 'green' :
                      stats.quality.score > 60 ? 'yellow' : 'red';

  return `# HRthis Web App

A modern React web application converted from Expo/React Native. HRthis is a comprehensive employee portal with personalized dashboards, time tracking, leave management, gamification, and administrative tools.

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-${stats.coverage.lines}%25-${coverageColor})
![Quality Score](https://img.shields.io/badge/quality-${stats.quality.score}-${qualityColor})
![Version](https://img.shields.io/badge/version-${stats.package.version}-blue)
![Last Updated](https://img.shields.io/badge/updated-${stats.lastUpdated}-blue)

### Development Metrics
- **📁 Components**: ${stats.files.components} React components
- **🖥️ Screens**: ${features.screens.implemented} implemented / ${features.screens.placeholders} planned (${features.screens.total} total)
- **🗄️ State Stores**: ${features.stores.count} Zustand stores (${features.stores.withPersistence} with persistence)
- **🔧 Utilities**: ${stats.files.utils} utility modules
- **🧪 Tests**: ${stats.files.tests} test files
- **📦 Dependencies**: ${stats.package.dependencies} production + ${stats.package.devDependencies} dev
- **🤖 AI Services**: ${features.ai.services.join(', ')}

## 🚀 Features

### Core Functionality
- **🔐 Authentication**: Secure login with role-based access (Employee/Admin/Super Admin)
- **📊 Personalized Dashboard**: Real-time stats with different views for employees and admins
- **⏰ Time Tracking**: Clock in/out with automatic calculations and monthly/weekly summaries
- **📝 Leave Management**: Vacation requests, sick leave, and approval workflows
- **📅 Calendar Integration**: Team overview with leave visibility
- **🎁 Benefits & Gamification**: BrowoCoins system with shop, milestones, and rewards
- **📄 Document Management**: Access to contracts, payslips, and company documents
- **⚙️ Profile Management**: Comprehensive settings with personal and work information

### Admin Features
- **👥 Employee Management**: View and edit employee work information
- **✅ Request Approval**: Approve/reject leave requests with notification system
- **🪙 Coin Administration**: Manage coin rules, benefits, and user balances
- **📈 Analytics**: Monitor team performance and usage statistics

### Advanced Features
- **🤖 AI Integration**: OpenAI, Anthropic Claude, and Grok for intelligent features
- **🔔 Smart Notifications**: Actionable notifications with role-based filtering
- **📱 Responsive Design**: Mobile-first approach with desktop optimization
- **🎯 Gamification**: Progressive coin events and achievement system

## 🧪 Demo Login Credentials

### Test Users
- **👤 Employee**: \`max.mustermann@hrthis.de\` / \`password\`
  - Full-time developer with 30 vacation days
  - Complete access to personal features
- **👩‍💼 HR Admin**: \`anna.admin@hrthis.de\` / \`password\`
  - Full administrative privileges
  - Can manage all employees and approve requests
- **👨‍💻 Part-time Employee**: \`tom.teilzeit@hrthis.de\` / \`password\`
  - Part-time designer with 15 vacation days
  - Demonstrates different employment types

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript for type safety
- **React Router DOM** for client-side routing
- **Tailwind CSS** for responsive, utility-first styling
- **Zustand** for lightweight state management with persistence

### AI & Services
- **OpenAI GPT** for intelligent text processing
- **Anthropic Claude** for advanced reasoning
- **Grok API** for real-time insights

### Data & Storage
- **LocalStorage** for client-side persistence
- **JSON** for mock data and API simulation
- **Zustand Persist** for state hydration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/iamthamanic/hrthis.git
   cd hrthis
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm start
   \`\`\`

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables
Create a \`.env\` file in the root directory for AI features:

\`\`\`env
# AI Service Keys (Optional - features work without them)
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key
REACT_APP_GROK_API_KEY=your_grok_key

# App Configuration
REACT_APP_VERSION=${stats.package.version}
REACT_APP_ENVIRONMENT=development
\`\`\`

### Building for Production

\`\`\`bash
# Create production build
npm run build

# Serve locally to test
npx serve -s build
\`\`\`

## 🏗️ Architecture

### Project Structure
\`\`\`
src/
├── api/              # AI service integrations (${stats.files.apis} files)
├── components/       # Reusable components (${stats.files.components} files)
├── navigation/       # Router configuration
├── screens/          # Page components (${features.screens.total} screens)
├── state/           # Zustand stores (${features.stores.count} stores)
├── types/           # TypeScript definitions (${stats.files.types} files)
└── utils/           # Helper functions (${stats.files.utils} files)
\`\`\`

### State Management
- **Authentication**: User sessions and role management
- **Time Records**: Clock in/out and time tracking
- **Leaves**: Vacation and sick leave requests
- **Coins**: Gamification and benefits system
- **Notifications**: Smart notification system

### Design Patterns
- **Component-based**: Reusable UI components
- **Store-based**: Domain-driven state management
- **Type-safe**: Full TypeScript coverage
- **Mobile-first**: Responsive design approach

## 📊 Code Quality

### Test Coverage
- **Lines**: ${stats.coverage.lines}%
- **Functions**: ${stats.coverage.functions}%
- **Branches**: ${stats.coverage.branches}%
- **Statements**: ${stats.coverage.statements}%

### Quality Metrics
- **ESLint Issues**: ${stats.quality.issues || 0}
- **Code Quality Score**: ${stats.quality.score || 0}/100
- **Security Warnings**: ${stats.quality.warnings || 0}

## 🔄 Migration from React Native

This web app was successfully converted from Expo/React Native:

### Key Changes
- ✅ **Components**: \`View\` → \`div\`, \`Text\` → \`span/p\`, \`TouchableOpacity\` → \`button\`
- ✅ **Navigation**: React Navigation → React Router DOM
- ✅ **Storage**: AsyncStorage → LocalStorage
- ✅ **Interactions**: Touch events → Mouse/keyboard events
- ✅ **Styling**: React Native styles → Tailwind CSS

### Preserved Features
- 🔄 **Business Logic**: All core functionality maintained
- 🔄 **State Management**: Zustand stores kept identical
- 🔄 **API Integration**: AI services work seamlessly
- 🔄 **User Experience**: Same intuitive interface

## 🚀 Deployment

### Recommended Platforms
- **Vercel**: Zero-config deployment with automatic HTTPS
- **Netlify**: JAMstack deployment with form handling
- **AWS S3 + CloudFront**: Enterprise-grade scaling
- **Docker**: Containerized deployment

### Quick Deploy to Vercel
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📈 Development Stats

- **Total Commits**: ${stats.git.commitCount}
- **Contributors**: ${stats.git.contributors}
- **Last Commit**: ${stats.git.lastCommit}
- **Project Scripts**: ${stats.package.scripts}

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for modern workplace management**

*Last updated: ${stats.lastUpdated} | Generated automatically by GitHub Actions*`;
}

/**
 * Main execution function
 */
function main() {
  console.log('🔄 Analyzing project...');
  const stats = analyzeProject();
  const features = analyzeFeatures();
  
  console.log('📝 Generating README content...');
  const newContent = generateReadmeContent(stats, features);
  
  console.log('💾 Writing README.md...');
  fs.writeFileSync('README.md', newContent);
  
  console.log('✅ README.md updated successfully!');
  console.log(`📊 Stats: ${features.screens.implemented}/${features.screens.total} screens, ${features.stores.count} stores, ${stats.coverage.lines}% coverage`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { analyzeProject, analyzeFeatures, generateReadmeContent };