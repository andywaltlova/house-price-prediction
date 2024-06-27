from marshmallow import Schema, fields, validate

class PredictSchema(Schema):
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    housing_median_age = fields.Float(required=True, validate=validate.Range(min=0))
    total_rooms = fields.Float(required=True, validate=validate.Range(min=0))
    total_bedrooms = fields.Float(required=True, validate=validate.Range(min=0))
    population = fields.Float(required=True, validate=validate.Range(min=0))
    households = fields.Float(required=True, validate=validate.Range(min=0))
    median_income = fields.Float(required=True)
    ocean_proximity = fields.String(required=True, validate=validate.OneOf([
        '<1H OCEAN',
        'INLAND',
        'ISLAND',
        'NEAR BAY',
        'NEAR OCEAN',
    ]))
    price = fields.Float(nullable=True, validate=validate.Range(min=0))
    created_at = fields.DateTime(dump_only=True)
    map_url = fields.String(dump_only=True)
