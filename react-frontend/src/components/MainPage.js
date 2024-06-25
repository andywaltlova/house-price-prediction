import React from 'react';
import { CssBaseline, Container, Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import SimpleForm from './SimpleForm';

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
      <Container component="main" maxWidth="sm">
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
