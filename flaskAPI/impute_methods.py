import pandas as pd
import numpy as np

def handle_imputation(csv_data, method='median', value=None, columns=None):
    try:

        df = pd.DataFrame(csv_data)

        print("Veri Türleri:")
        print(df.dtypes)

        df.replace(r'^\s*$', np.nan, regex=True, inplace=True)

        
        for col in df.select_dtypes(include='object').columns:
            try:
                df[col] = pd.to_numeric(df[col], errors='coerce')
            except:
                continue

        df.dropna(axis=1, how='all', inplace=True)
        print(f"Tamamen NaN veya boş olan sütunlar silindi. Kalan sütunlar: {df.columns.tolist()}")

      
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df_filled = df.copy()

        if method == 'median':
            print("Sayısal sütunlar için median ile dolduruluyor...")
            for col in numeric_cols:
                if col in df.columns:
                    df_filled[col] = df[col].fillna(df[col].median())

        elif method == 'mean':
            print("Sayısal sütunlar için ortalama ile dolduruluyor...")
            for col in numeric_cols:
                if col in df.columns:
                    df_filled[col] = df[col].fillna(df[col].mean())

        elif method == 'value' and value is not None:
            print(f"Tüm veriler sabit değer '{value}' ile dolduruluyor...")
            df_filled = df.fillna(value)

        elif method == 'columns' and columns:
            print(f"Belirtilen sütunlar dolduruluyor: {columns}")
            for col in columns:
                if col in df.columns:
                    if pd.api.types.is_numeric_dtype(df[col]):
                        df_filled[col] = df[col].fillna(df[col].median())
                    else:
                        df_filled[col] = df[col].fillna('Unknown')

        elif method == 'mode':
            print("Kategorik sütunlar için mode ile dolduruluyor...")
            for col in df.select_dtypes(exclude=[np.number]).columns:
                if col in df.columns:
                    mode_val = df[col].mode()
                    if not mode_val.empty:
                        df_filled[col] = df[col].fillna(mode_val[0])
                    else:
                        df_filled[col] = df[col].fillna('Unknown')
        else:
            raise ValueError("Geçersiz imputasyon metodu veya eksik parametre!")

        print("İmputasyon işlemi tamamlandı.")
        return df_filled.to_dict(orient='records')

    except Exception as e:
        print(f"İmputasyon hatası: {e}")
        raise e  

