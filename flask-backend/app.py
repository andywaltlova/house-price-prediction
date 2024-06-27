from flask import Flask, request, send_from_directory, jsonify, make_response
from marshmallow import ValidationError

import pandas as pd

import os

from model_utils.main import load_model, predict
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from validators import PredictSchema

app = Flask(__name__, static_folder='/app/static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

model = load_model('./model_utils/model.joblib')

db = SQLAlchemy(app)

class PredictedPrice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    longitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    housing_median_age = db.Column(db.Float, nullable=False)
    total_rooms = db.Column(db.Float, nullable=False)
    total_bedrooms = db.Column(db.Float, nullable=False)
    population = db.Column(db.Float, nullable=False)
    households = db.Column(db.Float, nullable=False)
    median_income = db.Column(db.Float, nullable=False)
    is_less_than_1h_ocean = db.Column(db.Boolean, nullable=False, default=False)
    is_inland = db.Column(db.Boolean, nullable=False, default=False)
    is_island = db.Column(db.Boolean, nullable=False, default=False)
    is_near_bay = db.Column(db.Boolean, nullable=False, default=False)
    is_near_ocean = db.Column(db.Boolean, nullable=False, default=False)
    price= db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())


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

    db_name_map = {
        'ocean_proximity_<1H OCEAN': 'is_less_than_1h_ocean',
        'ocean_proximity_INLAND': 'is_inland',
        'ocean_proximity_ISLAND': 'is_island',
        'ocean_proximity_NEAR BAY': 'is_near_bay',
        'ocean_proximity_NEAR OCEAN': 'is_near_ocean'
    }

    try:
        # Attempt to deserialize and validate data
        for key, value in db_name_map.items():
            data[value] = bool(data.pop(key, 0))

        if ocean_proximity := data.pop('ocean_proximity', None):
            key = db_name_map.get(f'ocean_proximity_{ocean_proximity}', None)
            if key:
                data[key] = True

        schema = PredictSchema()
        validated_data = schema.load(data)
    except ValidationError as err:
        response = jsonify(err.messages)
        return _corsify_actual_response(response), 400

    df = pd.DataFrame([validated_data])
    predicted_price = predict(df, model)

    validated_data['price'] = round(predicted_price[0],8)

    prediction_row = PredictedPrice(**validated_data)
    db.session.add(prediction_row)
    db.session.commit()

    predicts_schema = PredictSchema(many=True)
    all_predicts = PredictedPrice.query.order_by(PredictedPrice.created_at.desc()).all()
    result = predicts_schema.dump(all_predicts)
    return _corsify_actual_response(jsonify(result))

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
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)