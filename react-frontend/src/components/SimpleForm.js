import React, { useState, useEffect } from 'react';
import { Alert, TextField, Button, Container, Grid, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import DataTable from './DataTable';

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

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every((field) => field !== '');
    setIsFormValid(allFieldsFilled);
  }, [formData]);

  useEffect(() => {
    if (!data.data) {
      axios.get('/api/predictions').then((response) => {
          console.log(response.data.data)
          setData(response.data);
      }).catch((error) => {
        // Give as detailed error message as possible
        if (error?.response?.data?.errors) {
          console.log(error.response.data)
          setData(error.response.data);
        } else {
          setData({ errors: ['An unknown error occurred. Please try again later.'] });
        }
      })
    }}, []);

  const handleClear = () => {
    setLoading(true);
    axios.delete('/api/predictions').then((response) => {
      setData(response.data);
      setLoading(false);
    });
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setData(null);

    axios.post('/api/predict', formData).then(
        (response) => {
        setData(response.data);
    }).catch((error) => {
        setData(error.response.data);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <Container maxWidth="false">
      <Container maxWidth='sm'>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                error={formData.longitude === ''}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                error={formData.latitude === ''}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="ocean-proximity-label">Ocean Proximity</InputLabel>
                <Select
                  labelId="ocean-proximity-label"
                  label="Ocean Proximity"
                  name="ocean_proximity"
                  value={formData.ocean_proximity}
                  onChange={handleInputChange}
                  error={formData.ocean_proximity === ''}
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
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Housing Median Age"
                name="housing_median_age"
                value={formData.housing_median_age}
                onChange={handleInputChange}
                error={formData.housing_median_age === '' || formData.housing_median_age < 0}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Rooms"
                name="total_rooms"
                value={formData.total_rooms}
                onChange={handleInputChange}
                error={formData.total_rooms === '' || formData.total_rooms < 0}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Total Bedrooms"
                name="total_bedrooms"
                value={formData.total_bedrooms}
                onChange={handleInputChange}
                error={formData.total_bedrooms === '' || formData.total_bedrooms < 0}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Population"
                name="population"
                value={formData.population}
                onChange={handleInputChange}
                error={formData.population === '' || formData.population < 0}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Households"
                name="households"
                value={formData.households}
                onChange={handleInputChange}
                error={formData.households === '' || formData.households < 0}
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Median Income"
                name="median_income"
                value={formData.median_income}
                onChange={handleInputChange}
                error={formData.median_income === '' || formData.median_income < 0}
                required
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                endIcon={<AutoFixHighIcon />}
                type="submit" variant="contained" color="primary" disabled={!isFormValid || loading}>
                Predict
              </Button>
              <Button
                endIcon={<DeleteForeverIcon />}
                variant="contained" color="error" style={{ marginLeft: '10px' }}
                onClick={handleClear}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </form>
        {!isFormValid && (
          <Alert severity="warning" style={{ marginTop: '20px' }}>
            Please fill in all fields
          </Alert>
        )}
        {data?.errors && (
          data.errors.map((error) => (
            <Alert key={error} severity="error" style={{ marginTop: '10px' }}>
              {error}
            </Alert>
          ))
        )}
      </Container>
      <Container maxWidth='100%'>
        <DataTable rows={data?.data === undefined ? [] : data.data } loading={loading} />
      </Container>
    </Container>
  );
};

export default SimpleForm;
