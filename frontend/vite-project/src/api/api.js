import axios from 'axios';


const api = axios.create({
  baseURL: 'http://127.0.0.1:5001/',  
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = async () => {
  try {
    const response = await api.get('/your-endpoint');  
    return response.data;
  } catch (error) {
    console.error("API isteği hatası:", error);
    throw error;
  }
};


export const uploadData = async (formData) => {
  try {
    const response = await api.post('/your-upload-endpoint', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("API isteği hatası:", error);
    throw error;
  }
};


export const imputeData = async ({ data, method }) => {
  try {
    const response = await axios.post("http://127.0.0.1:5001/impute", {
      data: data,
      method: method
    });
    return response.data;
  } catch (error) {
    console.error("İmputasyon hatası:", error);
    throw error;
  }
};

export const trainAndPredict = async ({ data, target_column, model_type }) => {
  try {
    console.log("Gönderilen veri:", { data, target_column, model_type });

    const response = await axios.post("http://127.0.0.1:5001/train_and_predict", {
      data: data,
      target_column: target_column,
      model_type: model_type,
    });

    if (response.data.error) {
      throw new Error(response.data.error); 
    }

    return response.data;
  } catch (error) {
    console.error("Model eğitimi ve tahmin hatası:", error);
  
    throw new Error(error.response?.data?.error || "Bilinmeyen hata oluştu");
  }
};
