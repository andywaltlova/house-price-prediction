import React from 'react';
import { CssBaseline, Container, Box, ThemeProvider, createTheme, useMediaQuery, Typography, Grid, Card } from '@mui/material';
import SimpleForm from './SimpleForm';
import Header from './Header';

const MainPage = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
        <Card>
            <Container maxWidth="md">
              <Box sx={{ my: 2 }}>
                <Typography variant="body1" component="p" gutterBottom>
                  Dataset used to train the model: <a href="https://www.kaggle.com/datasets/camnugent/california-housing-prices" target='_blank'>California Housing Prices</a>
                </Typography>
              </Box>
            </Container>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <SimpleForm />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MainPage;
