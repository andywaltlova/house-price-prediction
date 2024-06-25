import React, { useState, useEffect } from 'react';
import { Alert, TextField, Button, Card, CardContent, Container, Grid, Select, MenuItem, InputLabel, FormControl, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const oceanProximityValidValues = [
  '<1H OCEAN', 'INLAND', 'ISLAND', 'NEAR BAY', 'NEAR OCEAN'
];

const SimpleForm = () => {
  // NOTE: The initial state values are set to tone of the example inputs
  const [formData, setFormData] = useState({
    longitude: '-122.64',
    latitude: '38.01',
    housing_median_age: '36',
    total_rooms: '1336',
    total_bedrooms: '258',
    population: '678',
    households: '249',
    median_income: '5.5789',
    ocean_proximity: 'NEAR OCEAN'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every((field) => field !== '');
    setIsFormValid(allFieldsFilled);
  }, [formData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('/api/predict', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      // Give as detailed error message as possible
        if (error.response && error.response.data) {
            setResult({ error: `An error occurred: ${JSON.stringify(error.response.data)}`});
        } else {
            setResult({ error: `An error occurred: ${error.message}` });
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Housing Median Age"
              name="housing_median_age"
              value={formData.housing_median_age}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Total Rooms"
              name="total_rooms"
              value={formData.total_rooms}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Total Bedrooms"
              name="total_bedrooms"
              value={formData.total_bedrooms}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Population"
              name="population"
              value={formData.population}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Households"
              name="households"
              value={formData.households}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Median Income"
              name="median_income"
              value={formData.median_income}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="ocean-proximity-label">Ocean Proximity</InputLabel>
              <Select
                labelId="ocean-proximity-label"
                label="Ocean Proximity"
                name="ocean_proximity"
                value={formData.ocean_proximity}
                onChange={handleInputChange}
                required
              >
                {oceanProximityValidValues.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={!isFormValid || loading}>
              Predict
            </Button>
          </Grid>
        </Grid>
      </form>
      {loading && (
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <CircularProgress />
        </Grid>
      )}
      {!isFormValid && (
        <Alert severity="warning" style={{ marginTop: '20px' }}>
          Please fill in all fields
        </Alert>
      )}
      {result && result.error && (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {result.error}
        </Alert>
      )}
      {result && !result.error && (
        <Card style={{ marginTop: '20px' }} variant='elevation'>
          <CardContent>
            <Typography variant="h2" component="div">
              Price
            </Typography>
            <Typography variant="h3" color="textSecondary">
              ${result.price}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default SimpleForm;
