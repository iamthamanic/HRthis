# WorkyTime Web App

A React web application converted from the Expo/React Native WorkyTime app. This is an employee portal with features for time tracking, leave requests, training management, and more.

## Features

- **Authentication**: Login system with employee and admin roles
- **Dashboard**: Quick overview of vacation days, coins, training, and work hours
- **Leave Management**: Request vacation time and submit sick leave
- **Time Tracking**: View and manage work time records
- **Training System**: Complete training courses and manage learning progress
- **Benefits**: Redeem benefits using earned coins
- **Document Management**: Access important documents
- **Calendar**: View team schedules and important dates

## Demo Login Credentials

- **Employee**: max.mustermann@workytime.de / password
- **Admin**: anna.admin@workytime.de / password

## Tech Stack

- **React 19** with TypeScript
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Zustand** for state management
- **AI Services**: OpenAI, Anthropic Claude, Grok integration
- **Local Storage** for data persistence

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the app

## Environment Variables

For AI features to work, you'll need to set up environment variables:

```
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key
REACT_APP_GROK_API_KEY=your_grok_key
```

## Building for Production

```bash
npm run build
```

## Integration with Larger Systems

This web app is designed to be integrated into larger systems like Browo AI. The modular architecture allows for easy embedding and customization.

## Architecture

- **Components**: Reusable UI components following web standards
- **State Management**: Zustand stores for different domains (auth, training, coins, etc.)
- **API Services**: Modular API clients for different services
- **Routing**: React Router DOM for navigation
- **Styling**: Tailwind CSS for responsive design

## Differences from React Native Version

- Replaced React Native components with HTML equivalents
- Used React Router DOM instead of React Navigation
- Replaced AsyncStorage with localStorage
- Converted touch interactions to mouse/keyboard events
- Maintained all business logic and state management