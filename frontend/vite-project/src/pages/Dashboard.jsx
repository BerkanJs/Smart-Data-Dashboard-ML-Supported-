// Dashboard.jsx
import React, { useState, useEffect } from "react"; 
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import MissingDataChart from "../components/MissingDataChart";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import AnimatedBackground from "../components/AnimatedBackground"; 
import { useDataStore } from "../store/dataStore"; 
import axios from 'axios';
import Sidebar from "../components/Sidebar/Sidebar";
import DataPreviewTable from "../components/DataPreviewTable";

const Dashboard = () => {
  const { userId } = useParams(); // <-- Bu satır doğru şekilde userId'yi alacak şekilde kaldı
  const navigate = useNavigate();
  
  const { fetchData } = useDataStore(); 
  const [userData, setUserData] = useState(null);
  
  const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Lütfen bir dosya seçin");
      return;
    }
  
    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("userId", userId); // <-- userId parametresi burada kullanılıyor
  
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token);
      formData.append("email", decoded.email); 
    } catch (error) {
      console.error("Error decoding token", error);
    }
  
    setUploading(true);
    setError(null);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/data/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      setUploadedFileName(response.data.fileName);
  
      await fetchData(userId); // <-- Burada fetchData'yi doğru userId ile çağırıyoruz
    } catch (error) {
      console.log(error);
      setError("Yükleme sırasında bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      setUserData(decoded);
  
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      
      // 'userId' parametresini fetchData fonksiyonuna gönderiyoruz
      if (userId) {  // <-- Burada userId'nin doğru olduğundan emin olun
        fetchData(userId);  // <-- userId'yi burada kullanıyoruz
      } else {
        console.error("userId parametresi eksik.");
      }
  
      setChartData([12, 19, 3, 5, 2]); 
    } catch (error) {
      toast.error("Invalid token.");
      console.log(error);
      navigate("/login");
    }
  }, [navigate, userId, fetchData]);  // <-- useEffect'in bağımlılıklarını doğru şekilde belirttim
  
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 relative">
      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>
  
      <div className="w-full sm:w-11/12 md:w-9/12 lg:w-8/12 xl:w-7/12 px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <Navbar className="w-full fixed top-0 left-0 right-0 z-20 bg-white shadow-md" />
        
        {/* Sidebar */}
        <Sidebar />
    
        {/* CSV Yükleme Bölümü */}
        <div className="my-8">
          <input
            type="file"
            onChange={handleFileChange}
            className="border-2 p-2 rounded-lg"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="ml-4 bg-gray-800 cursor-pointer hover:scale-105 duration-300 transition-all text-white p-2 rounded-lg"
          >
            {uploading ? "Yükleniyor..." : "CSV Yükle"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>} {/* Hata mesajı */}
          {/* Yüklenen dosyanın adı */}
          {uploadedFileName && (
            <p className="mt-4 text-green-500">Yüklenen Dosya: {uploadedFileName}</p>
          )}
        </div>
    
        {/* Kullanıcı Bilgisi */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-10 w-full mt-20">
          {userData && (
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Welcome,</h2>
              <p className="text-xl font-medium text-gray-800 mt-2">
                User ID: {userData.userId}
              </p>
              <p className="text-lg text-indigo-600 mt-1">{userData.email}</p>
            </div>
          )}
        </div>
    
        {/* Dashboard Cards */}
        <DashboardCards data={useDataStore((state) => state.data)} />
    
        {/* Chart Component */}
        <div className="w-full bg-white shadow-lg rounded-xl p-8 mt-8">
          <DataPreviewTable data={useDataStore((state) => state.data)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
