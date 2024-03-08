import React from 'react';
import { BrowserRouter as Router ,Routes, Route } from 'react-router-dom';
import Home from './component/home';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        {/* <Route path="/" element={<h1>hero</h1>} /> */}
        <Route index path="/" element={<Home/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
