import { create } from 'zustand';
import axios from 'axios';

export const useDataStore = create((set) => ({
  data: [],
  loading: false,
  error: null,
  fetchData: async (userId) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/api/data/get/${userId}`);
      console.log("Veri Getirildi: ", response.data);
      set({ data: response.data, loading: false });
    } catch (error) {
      console.error("Veri Çekme Hatası: ", error);
      set({ error: error.message || 'Veri çekme hatası', loading: false });
    }
  },
  uploadData: async (formData) => {  
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/data/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Veri Yüklendi: ", response.data); 
      set({ loading: false });
      return response.data;
    } catch (error) {
      console.error("Veri Yükleme Hatası: ", error);
      set({ error: error.message || 'Veri yükleme hatası', loading: false });
      throw error;
    }
  },
}));

