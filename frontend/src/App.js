import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './Pages/List';
import Details from './Pages/Details'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/cves/list" element={<List />} />
        <Route path="/cves/:id" element={<Details />} />
      </Routes>
    </Router>
  );
};



export default App;
