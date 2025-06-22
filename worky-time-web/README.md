# WorkyTime Web App

A modern React web application converted from Expo/React Native. WorkyTime is a comprehensive employee portal with personalized dashboards, time tracking, leave management, gamification, and administrative tools.

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
- **👤 Employee**: `max.mustermann@workytime.de` / `password`
  - Full-time developer with 30 vacation days
  - Complete access to personal features
- **👩‍💼 HR Admin**: `anna.admin@workytime.de` / `password`
  - Full administrative privileges
  - Can manage all employees and approve requests
- **👨‍💻 Part-time Employee**: `tom.teilzeit@workytime.de` / `password`
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
   ```bash
   git clone https://github.com/iamthamanic/workytime.git
   cd workytime/worky-time-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for AI features:

```env
# AI Service Keys (Optional - features work without them)
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key
REACT_APP_GROK_API_KEY=your_grok_key

# App Configuration
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### Building for Production

```bash
# Create production build
npm run build

# Serve locally to test
npx serve -s build
```

## 🏗️ Architecture

### Project Structure
```
src/
├── api/              # AI service integrations
├── navigation/       # Router configuration
├── screens/          # Page components
├── state/           # Zustand stores
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

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

## 🔄 Migration from React Native

This web app was successfully converted from Expo/React Native:

### Key Changes
- ✅ **Components**: `View` → `div`, `Text` → `span/p`, `TouchableOpacity` → `button`
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
```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for modern workplace management**