import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { App as GenerateLoot } from './Pages/GenerateLoot';
import { ViewInventory } from './Pages/ViewInventory';
import Login from './Pages/Login';
import CreateUser from './Pages/CreateUser';
import './App.css'

export const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/home" element={<GenerateLoot />} />
          <Route path="/generate" element={<GenerateLoot />} />
          <Route path="/inventory" element={<ViewInventory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
