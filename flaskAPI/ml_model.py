from sklearn.metrics import (
    mean_squared_error, r2_score, accuracy_score,
    confusion_matrix, classification_report
)
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.svm import SVC, SVR
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import numpy as np

def encode_fig_to_base64(fig):
    img_stream = BytesIO()
    fig.savefig(img_stream, format='png')
    img_stream.seek(0)
    img_base64 = base64.b64encode(img_stream.read()).decode('utf-8')
    plt.close(fig)
    return img_base64

def preprocess_data(df):
    for col in df.select_dtypes(include=['object']).columns:
        label_encoder = LabelEncoder()
        df[col] = label_encoder.fit_transform(df[col])
    return df

def train_ml_model(df, target_col, model_type='linear_regression'):
    try:
        df = preprocess_data(df)
        X = df.drop(columns=[target_col])
        y = df[target_col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        if model_type == 'linear_regression':
            model = LinearRegression()
        elif model_type == 'logistic_regression':
            model = LogisticRegression(max_iter=200)
        elif model_type == 'decision_tree_regression':
            model = DecisionTreeRegressor(random_state=42)
        elif model_type == 'decision_tree_classification':
            model = DecisionTreeClassifier(random_state=42)
        elif model_type == 'random_forest_regression':
            model = RandomForestRegressor(random_state=42)
        elif model_type == 'random_forest_classification':
            model = RandomForestClassifier(random_state=42)
        elif model_type == 'svm_regression':
            model = SVR()
        elif model_type == 'svm_classification':
            model = SVC(probability=True)
        else:
            raise ValueError("Geçersiz model tipi!")

        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        metrics = {}
        fig, ax = plt.subplots(figsize=(8, 6))

        if 'classification' in model_type or model_type == 'logistic_regression':
            accuracy = accuracy_score(y_test, y_pred)
            cm = confusion_matrix(y_test, y_pred)
            report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
            metrics = {'Accuracy': accuracy, 'Classification Report': report}

            print(f"Accuracy: {accuracy:.4f}")
            print(classification_report(y_test, y_pred, zero_division=0))

            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
            ax.set_xlabel('Tahmin Edilen Etiketler')
            ax.set_ylabel('Gerçek Etiketler')
            ax.set_title(f'{model_type} - Confusion Matrix')
            plt.tight_layout()

        else:
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, y_pred)
            metrics = {'MSE': mse, 'RMSE': rmse, 'R2': r2}

            print(f"MSE: {mse:.4f}, RMSE: {rmse:.4f}, R2: {r2:.4f}")

            sns.scatterplot(x=y_test, y=y_pred, ax=ax)
            ax.set_xlabel('Gerçek Değerler')
            ax.set_ylabel('Tahmin Edilen Değerler')
            ax.set_title(f'{model_type} - Gerçek vs Tahmin')
            plt.tight_layout()

        fig_base64 = encode_fig_to_base64(fig)
        predictions_list = y_pred.tolist() if hasattr(y_pred, 'tolist') else list(y_pred)

        return {
            'model': str(model),
            'metrics': metrics,
            'figure_base64': fig_base64,
            'predictions': predictions_list
        }

    except Exception as e:
        print(f"Model eğitimi hatası: {e}")
        raise e
