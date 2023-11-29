import React from 'react';
import HomeLayout from './HomeLayout';

export default function App({ children }) {
  return (
    <div className="home-app">
      <div className="page-container">
      <HomeLayout children={children}/>
      </div>
    </div>
  );
}
