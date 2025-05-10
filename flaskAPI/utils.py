import os
import pandas as pd

def save_processed_data(data):
    try:
 
        processed_dir = "flaskAPI/processed/"
        if not os.path.exists(processed_dir):
            os.makedirs(processed_dir)
        
        file_path = os.path.join(processed_dir, "processed_data.csv")
        df = pd.DataFrame(data)
        df.to_csv(file_path, index=False)
        print(f"Veri {file_path} olarak kaydedildi.")
        
    except Exception as e:
        print(f"Veri kaydetme hatası: {e}")
