import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppNavigator } from './navigation/AppNavigator';

function App() {
  return (
    <Router>
      <AppNavigator />
    </Router>
  );
}

export default App;