from flask import Flask, request, send_from_directory, jsonify, make_response
from sqlalchemy.ext.hybrid import hybrid_property
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
    ocean_proximity = db.Column(db.String, nullable=False)
    price= db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    @hybrid_property
    def map_url(self):
        return f"https://www.google.com/maps/place/{self.latitude},{self.longitude}"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/predictions', methods=['DELETE','GET', 'OPTIONS'])
def predictions():

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    if request.method == "DELETE":
        db.session.query(PredictedPrice).delete()
        db.session.commit()
        return _corsify_actual_response(jsonify([]))

    predicts_schema = PredictSchema(many=True)
    all_predicts = PredictedPrice.query.order_by(PredictedPrice.created_at.desc()).all()
    result = predicts_schema.dump(all_predicts)
    return _corsify_actual_response(jsonify({"data": result}))


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

    ocean_proximity_valid_values = {
        '<1H OCEAN',
        'INLAND',
        'ISLAND',
        'NEAR BAY',
        'NEAR OCEAN',
    }

    predicts_schema = PredictSchema(many=True)
    try:
        # Attempt to deserialize and validate data

        ocean_proximity = data.pop('ocean_proximity', None)
        if ocean_proximity not in ocean_proximity_valid_values:

            all_predicts = PredictedPrice.query.order_by(PredictedPrice.created_at.desc()).all()
            result = predicts_schema.dump(all_predicts)
            response = jsonify(
                {
                    "errors": [f"Invalid ocean_proximity value: {ocean_proximity}"],
                    "data": result
                 }
            )
            return _corsify_actual_response(response), 400

        schema = PredictSchema()
        data['ocean_proximity'] = ocean_proximity
        validated_data = schema.load(data)
    except ValidationError as err:

        all_predicts = PredictedPrice.query.order_by(PredictedPrice.created_at.desc()).all()
        result = predicts_schema.dump(all_predicts)
        response = jsonify(
            {
                "errors": [
                    f"{k.title().replace('_', ' ')}: {' '.join(v)}"
                    for k, v in err.messages.items()
                ],
                "data": result
                }
        )
        return _corsify_actual_response(response), 400

    ocean_proximity_columns = {f'ocean_proximity_{op}': 0 for op in ocean_proximity_valid_values}
    ocean_proximity_columns[f'ocean_proximity_{ocean_proximity}'] = 1
    predict_data = {**validated_data, **ocean_proximity_columns}
    predict_data.pop('ocean_proximity', None) # Not desired for prediction
    df = pd.DataFrame(
        [predict_data],
        columns=[
            'longitude',
            'latitude',
            'housing_median_age',
            'total_rooms',
            'total_bedrooms',
            'population',
            'households',
            'median_income',
            'ocean_proximity_<1H OCEAN',
            'ocean_proximity_INLAND',
            'ocean_proximity_ISLAND',
            'ocean_proximity_NEAR BAY',
            'ocean_proximity_NEAR OCEAN',
        ]
    )
    predicted_price = predict(df, model)

    validated_data['price'] = round(predicted_price[0], 8)

    db.session.add(PredictedPrice(**validated_data))
    db.session.commit()

    predicts_schema = PredictSchema(many=True)
    all_predicts = PredictedPrice.query.order_by(PredictedPrice.created_at.desc()).all()
    result = predicts_schema.dump(all_predicts)
    return _corsify_actual_response(jsonify({"data": result}))

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