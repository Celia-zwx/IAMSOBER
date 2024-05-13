import Grid from '@mui/material/Grid';
import {Avatar, createTheme, ThemeProvider, Box} from "@mui/material";
import React from "react";
import {LoginForm} from "../components/LoginForm";
import alcoholImage from '../images/images.png';
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

export function LoginPage() {
  return (

    <Box sx={{ 
      backgroundImage: `url(${alcoholImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
     }}>

      <ThemeProvider theme={theme}>
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" marginTop="24px">
        <Grid style={{ height: "300px", width: "100px" }} />
          <Grid item xs={2}>
            <LoginForm/>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Box>

    
  );
}