from flask import Blueprint, request, jsonify
from impute_methods import handle_imputation
from ml_model import train_ml_model 
import pandas as pd
impute_routes = Blueprint('impute_routes', __name__)

@impute_routes.route('/impute', methods=['POST'])
def impute_data():
    try:
       
        data = request.get_json()

       
        csv_data = data.get('data')
        method = data.get('method', 'median')  
        columns = data.get('columns', None)  
        value = data.get('value', None)  

     
        result = handle_imputation(csv_data, method, value, columns)
        
        if result is None:
            return jsonify({'error': 'İmputasyon işlemi sırasında bir hata oluştu!'}), 500


        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@impute_routes.route('/train_and_predict', methods=['POST'])
def train_and_predict():
    try:
        data = request.get_json()
        csv_data = data.get('data')
        target_col = data.get('target_column')
        model_type = data.get('model_type', 'linear_regression')

        if not target_col:
            return jsonify({'error': 'Hedef sütun (target_column) belirtilmelidir!'}), 400
        if not isinstance(csv_data, list):
            return jsonify({'error': 'Veri (data) bir liste olmalıdır!'}), 400

        df = pd.DataFrame(csv_data)
        if target_col not in df.columns:
            return jsonify({'error': f'Hedef sütun ({target_col}) verisinde bulunamadı!'}), 400


        result = train_ml_model(df, target_col, model_type)

        model = result['model']
        metrics = result['metrics']
        fig_base64 = result['figure_base64']
        predictions = result.get('predictions', [])  

        return jsonify({
            'message': 'Model başarıyla eğitildi!',
            'metrics': metrics,
            'figure': fig_base64,
            'predictions': predictions 
        }), 200

    except Exception as e:
        return jsonify({'error': f'Bir hata oluştu: {str(e)}'}), 400
