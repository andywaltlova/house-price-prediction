import React from 'react';
import { CssBaseline, Container, Box, ThemeProvider, createTheme, useMediaQuery, Typography } from '@mui/material';
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
      <Header />
      <Container component="main" maxWidth="false">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <SimpleForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
