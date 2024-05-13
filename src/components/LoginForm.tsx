import {useNavigate} from "react-router-dom";
import React, {Fragment, useState} from "react";
import {alcoholAnalysis, authenticateUser, tobaccoAnalysis} from "../firebase/FirebaseFunctions";
import {ERROR} from "../constants";
import {useRecoilState} from "recoil";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {Button, Grid, TextField, Typography} from "@mui/material";

export function LoginForm() {
  const navigate = useNavigate();

  const [curUserInfo, setCurUserInfo] = useRecoilState(curUserInfoAtom);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [usernameWarning, setUsernameWarning] = useState<string>("");
  const [passwordWarning, setPasswordWarning] = useState<string>("");

  const usernameOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setUsernameWarning("");
    setUsername(event.target.value);
  };

  const passwordOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setPasswordWarning("");
    setPassword(event.target.value);
  };

  const clearWarnings = () => {
    setUsernameWarning("");
    setPasswordWarning("");
  }

  const loginHandler = async () => {
    let dataReady: boolean = true;
    clearWarnings();
    if (!username) {
      setUsernameWarning("Please enter your username");
      dataReady = false;
    }
    if (!password) {
      setPasswordWarning("Please enter your password");
      dataReady = false;
    }
    if (!dataReady) return;

    const loginData = {
      username: username,
      password: password
    };

    const loginResponse = (await authenticateUser(loginData)).data;

    const alcoholAnalysisRequest = {
      id: loginResponse.resp.id
    };

    const tobaccoAnalysisRequest = {
      id: loginResponse.resp.id
    };

    const alcoholStatsResponse = (await alcoholAnalysis(alcoholAnalysisRequest)).data;
    const tobaccoStatsResponse = (await tobaccoAnalysis(tobaccoAnalysisRequest)).data;

    if (loginResponse.error !== ERROR.NO_ERROR) {
      console.log(loginResponse.ERROR);
      return;
    } else if (alcoholStatsResponse.error !== ERROR.NO_ERROR) {
      console.log(alcoholStatsResponse.ERROR);
      return;
    } else if (tobaccoStatsResponse.error !== ERROR.NO_ERROR) {
      console.log(tobaccoStatsResponse.ERROR);
      return;
    } else {
      // loginResponse.resp.liked_posts = new Set<string>(loginResponse.resp.liked_posts);
      // console.log(loginResponse.resp.liked_posts);
      setCurUserInfo({
        ...loginResponse.resp,
        alcohol_usage_amount: alcoholStatsResponse.resp.alcohol_amount,
        alcohol_exceed_rate: alcoholStatsResponse.resp.exceeded,
        alcohol_advice: alcoholStatsResponse.resp.advice,
        tobacco_usage_amount: tobaccoStatsResponse.resp.tobacco_amount,
        tobacco_exceed_rate: tobaccoStatsResponse.resp.exceeded,
        tobacco_advice: tobaccoStatsResponse.resp.advice,        
      });
      navigate("/userHome");
    }

  }

  return (
    <Fragment>
      <Typography component="h2" variant="h5" style={{marginBottom: "30px"}}>
        Login to see your journey!
      </Typography>
      <br/>
      <form noValidate>
        <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            helperText={usernameWarning}
            error={usernameWarning !== ""}
            onChange={usernameOnChange}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            helperText={passwordWarning}
            error={passwordWarning !== ""}
            onChange={passwordOnChange}
          />


          <br/>

          <Button
            style={{margin: '0 auto', display: "flex"}}
            variant="contained"
            onClick={loginHandler}
          >
            Login
          </Button>
        </Grid>
      </form>
    </Fragment>
  );
}