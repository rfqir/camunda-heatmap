/* eslint-disable */
import React, { useState } from 'react';
import Heatmap from './pages/heatmap/Heatmap';
import Cockpit from './pages/cockpit/Cockpit';
import Uidashboard from './pages/dashboard/app';
import Ruleconf from './pages/ruleTask/ruleConfiguration';

const App = () => {
  const [route, setRoute] = useState('home');

  const renderPage = () => {
    if (route === 'heatmap') {
      return <Heatmap />;
    } else if (route === 'cockpit') {
      return <Cockpit />;
    } else if (route === 'dashboard') {
      return <Uidashboard />;
    } else if (route === 'ruleconf') {
      return <Ruleconf />;
    } else {
      return (
        <div className="home">
          <h1>Welcome to the Home Page!</h1>
          <p>Choose your destination from the sidebar.</p>
        </div>
      );
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Monitoring Task</h2>
        <button className="sidebar-button bg-red-700" onClick={() => setRoute('home')}>Home</button>
        <button className="sidebar-button" onClick={() => setRoute('heatmap')}>Heatmap</button>
        <button className="sidebar-button" onClick={() => setRoute('cockpit')}>Cockpit</button>
        <button className="sidebar-button" onClick={() => setRoute('dashboard')}>Dashboard</button>
        <button className="sidebar-button" onClick={() => setRoute('ruleconf')}>Rule & Configuration</button>
      </div>
      <div className="content">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;
