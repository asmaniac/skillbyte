import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/ResumeList.jsx';
import Login from './components/Login.jsx';
import './css/App.css';

const App = () => {
  return (
   <Router> {/*importing router from react to connect to my next pages*/}
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Login" element={<Login />} />
    </Routes>
   </Router>

  )
}
export default App;