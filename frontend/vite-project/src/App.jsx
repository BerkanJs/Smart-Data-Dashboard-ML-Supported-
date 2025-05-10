import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import AuthStore from "./store/AuthStore";
import { useEffect } from 'react';


function App() {
  const { setAuth } = AuthStore();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setAuth(savedToken);
    }
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <Toaster position="top-center" />  
    </div>
  );
}

export default App;