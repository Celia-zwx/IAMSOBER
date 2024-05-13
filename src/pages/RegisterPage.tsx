import Grid from '@mui/material/Grid';
import {Avatar, createTheme, ThemeProvider, Box} from "@mui/material";
import React from "react";
// import LogoPic from "../images/logo192.png";
import {RegistrationForm} from "../components/RegistrationForm";
import alcoholImage from '../images/dMITv8.jpeg';
const theme = createTheme({
  palette: {
    primary: {main: "#1976D2"}, //blue
    secondary: {main: "#3e4444"}, //gray
    background: {default: "#88B04B"},
 },
  typography: {
    h1: {
      fontSize: 200,
    },
    h2: {
      fontSize: 5,
    },
  },
});

export function RegisterPage() {
  return (

    <Box sx={{ 
      backgroundImage: `url(${alcoholImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
     }}>

      <ThemeProvider theme={theme}>
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" marginTop="24px">
          <Avatar/>
          <Grid item xs={2}>
            <RegistrationForm/>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>

    
  );
}