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
    is_less_than_1h_ocean = fields.Boolean(required=True)
    is_inland = fields.Boolean(required=True)
    is_island = fields.Boolean(required=True)
    is_near_bay = fields.Boolean(required=True)
    is_near_ocean = fields.Boolean(required=True)
    price = fields.Float(nullable=True, validate=validate.Range(min=0))
    created_at = fields.DateTime(dump_only=True)
