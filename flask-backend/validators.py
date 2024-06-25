from marshmallow import Schema, fields, validate

class PredictSchema(Schema):
    longitude = fields.Float(required=True)
    latitude = fields.Float(required=True)
    housing_median_age = fields.Float(required=True)
    total_rooms = fields.Float(required=True)
    total_bedrooms = fields.Float(required=True)
    population = fields.Float(required=True)
    households = fields.Float(required=True)
    median_income = fields.Float(required=True)
    ocean_proximity = fields.Str(
        required=True,
        validate=validate.OneOf([
            '<1H OCEAN', 'INLAND', 'ISLAND', 'NEAR BAY', 'NEAR OCEAN'
        ])
    )
