import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Settings, User, LogOut } from "lucide-react"; // Lucide ikonları
import AuthStore from "../store/AuthStore";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import axios from 'axios';
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { setAuth } = AuthStore(); 
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
  
      try {
       
        const response = await axios.delete(`http://localhost:5000/api/data/delete/${userId}`);
        
     
        console.log("Backend Yanıtı:", response.data);
  
        if (response.data.message === "Kullanıcıya ait veriler bulunamadı.") {
      
          toast.success("Çıkış yapıldı. Kullanıcıya ait veri bulunamadı.");
        } else {
          
          toast.success("Çıkış yapıldı ve veriler silindi.");
        }
  
        
        localStorage.removeItem("token");
        setAuth(null); 
  
      
        navigate("/login");
  
      } catch (err) {
     
        console.log("Hata Detayları:", err);
  
        
        if (err.response) {
          console.log("Backend Hata Mesajı:", err.response.data);
  
          
  
        } else {
          toast.error("Bir hata oluştu.");
        }
  
        
        localStorage.removeItem("token");
        setAuth(null);
        navigate("/login");
      }
    } else {
     
      toast.error("Lütfen önce giriş yapın.");
      navigate("/login"); 
    }
  };
  
  
  
  

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home size={20} /> },


  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        setAuth(null);
        navigate("/login");
        toast.error("Session expired. Please login again.");
      }
    }
  }, [token, navigate, setAuth]);

  return (
<header className=" text-white shadow-lg">
  <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    {/* Logo */}
    <div className="flex items-center space-x-3">
      <Home size={30} className="text-white hover:text-[#3a5bb2] transition-colors duration-300" />
      <span className="text-2xl font-semibold text-gray-100 hover:text-[#3a5bb2] transition-colors duration-300">MyDashboard</span>
    </div>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center space-x-8">
      {menuItems.slice(1).map(item => (
        <Link
          key={item.name}
          to={item.path}
          className="flex items-center space-x-2 hover:text-[#3a5bb2] transition-all duration-300 transform hover:scale-105"
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="ml-4 btn btn-sm text-white  transition-all duration-300"
      >
        <LogOut size={20} className="mr-2" /> Log Out
      </button>
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden flex items-center justify-center text-white"
    >
      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </nav>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <motion.div
      className="md:hidden bg-[#0a1e3e] text-white py-4 space-y-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      {menuItems.map(item => (
        <Link
          key={item.name}
          to={item.path}
          className="flex items-center space-x-2 block px-6 py-3 hover:bg-[#3a5bb2] transition duration-300"
          onClick={() => setIsMobileMenuOpen(false)} // menü kapansın
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}

      {/* Mobile Logout Button */}
      <button
        onClick={() => {
          setIsMobileMenuOpen(false);
          handleLogout();
        }}
        className="block w-full text-left px-6 py-3 bg-black text-white hover:bg-[#333] transition duration-300"
      >
        <LogOut size={20} className="mr-2" /> Log Out
      </button>
    </motion.div>
  )}
</header>

  );
};

export default Navbar;
