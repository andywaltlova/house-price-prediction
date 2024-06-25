from flask import Flask, request, send_from_directory, jsonify, make_response
from marshmallow import ValidationError

import pandas as pd

import os

from model_utils.main import load_model, predict
from validators import PredictSchema

app = Flask(__name__, static_folder='/app/static')
model = load_model('./model_utils/model.joblib')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict_price():
    """
    Predict the price of a house based on the input data

    """
    if request.method == "OPTIONS": # CORS preflight
        return _build_cors_preflight_response()

    data = request.get_json()
    if not data:
        response = jsonify({"error": "No data provided"})
        return _corsify_actual_response(response), 400

    try:
        # Attempt to deserialize and validate data
        schema = PredictSchema()
        validated_data = schema.load(data)
    except ValidationError as err:
        response = jsonify(err.messages)
        return _corsify_actual_response(response), 400

    ocean_proximity = validated_data.pop('ocean_proximity')

    validated_data['ocean_proximity_<1H OCEAN'] = 0
    validated_data['ocean_proximity_INLAND'] = 0
    validated_data['ocean_proximity_ISLAND'] = 0
    validated_data['ocean_proximity_NEAR BAY'] = 0
    validated_data['ocean_proximity_NEAR OCEAN'] = 0

    validated_data[f"ocean_proximity_{ocean_proximity}"] = 1

    df = pd.DataFrame([validated_data])

    price = predict(df, model)
    # Return the series as a JSON object
    response = jsonify({"price": round(price[0], 8)})

    return _corsify_actual_response(response)

def _build_cors_preflight_response():
    response = make_response()
    # NOTE: This is a security risk, and should be disabled in production
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    # NOTE: This is a security risk, and should be disabled in production
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)