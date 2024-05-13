import React, {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import AlarmIcon from '@mui/icons-material/Alarm';
import {updateAlcoholAmount, updateAlcoholTobaccoTime} from "../firebase/FirebaseFunctions";
import {BAC_EFFECT_MAPPING, ERROR} from "../constants";
import { Feedback, TobaccoTrackerDialog }  from './TobaccoTrackerDialog';

interface TimerProps {
  isAlcohol: boolean
}

export const Timer = (props: TimerProps) => {
  const [curUserInfo, setCurUserInfo] = useRecoilState(curUserInfoAtom);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [weight, setWeight] = useState(0);
  const [beer, setBeer] = useState(0);
  const [wine, setWine] = useState(0);
  const [liquor, setLiquor] = useState(0);
  const [drinkHours, setDrinkHours] = useState(0);
  const [drinkMinutes, setDrinkMinutes] = useState(0);

  const [bac, setBac] = useState(0);
  const [totalAlcohol, setTotalAlcohol] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({
    level: '',
    healthRisks: '',
    recommendedAction: '',
  });

  const getTime = () => {
    // console.log(props.isAlcohol);
    let time;
    if (props.isAlcohol && curUserInfo.alcohol_reset_time._seconds) {
      const resetTime = curUserInfo.alcohol_reset_time._seconds;
      const resetDate = new Date(resetTime * 1000);
      time = Date.now() - resetDate.getTime();
    } else if (props.isAlcohol) {
      const resetDate = new Date(curUserInfo.alcohol_reset_time);
      time = Date.now() - resetDate.getTime();
    } else if (!props.isAlcohol && curUserInfo.tobacco_reset_time._seconds) {
      const resetTime = curUserInfo.tobacco_reset_time._seconds;
      const resetDate = new Date(resetTime * 1000);
      time = Date.now() - resetDate.getTime();
    } else {
      const resetDate = new Date(curUserInfo.tobacco_reset_time);
      time = Date.now() - resetDate.getTime();
    }

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, [props.isAlcohol, curUserInfo.alcohol_reset_time, curUserInfo.tobacco_reset_time]);

  const handleReset = async () => {
    const curDate = props.isAlcohol ? curUserInfo.alcohol_reset_time : curUserInfo.tobacco_reset_time;
    const newDate = new Date();
    if (props.isAlcohol) {
      setCurUserInfo({
        ...curUserInfo,
        alcohol_reset_time: newDate
      });
      const result = calculateBAC();
      setBac(result[0]);
      setTotalAlcohol(result[1]);
      handleClose();
    } else {
      setCurUserInfo({
        ...curUserInfo,
        tobacco_reset_time: newDate
      });
    }

    // Update firestore User table for alcohol / tobacco time
    // If update fails, restore front end state
    const requestData_1 = {
      id: curUserInfo.id,
      isAlcohol: props.isAlcohol,
      reset_time: newDate
    };
    const resetTimerResponse = (await updateAlcoholTobaccoTime(requestData_1)).data;
    if (resetTimerResponse.error !== ERROR.NO_ERROR) {
      console.log(resetTimerResponse.error);
      if (props.isAlcohol) {
        setCurUserInfo({
          ...curUserInfo,
          alcohol_reset_time: curDate
        });
      } else {
        setCurUserInfo({
          ...curUserInfo,
          tobacco_reset_time: curDate
        });
      }
      return;
    }

    // Update firestore Alcohol table for this time's alcohol usage
    if (props.isAlcohol) {
      const requestData_2 = {
        id: curUserInfo.id,
        time: newDate,
        beer: beer,
        wine: wine,
        liquor: liquor,
        alcohol_amount: totalAlcohol,
      };
      const updateAlcoholUsageResponse = (await updateAlcoholAmount(requestData_2)).data;
      if (updateAlcoholUsageResponse.error !== ERROR.NO_ERROR) {
        console.log(updateAlcoholUsageResponse.error);
      } else {
        console.log(updateAlcoholUsageResponse.resp.alcohol_id);
      }
    } else {
      // TODO: Update firestore Tobacco table for this time's tobacco usage
      
    }
  }

  const handleClose = () => {
    handleDialogClose();
    setWeight(0);
    setBeer(0);
    setWine(0);
    setLiquor(0);
    setDrinkHours(0);
    setDrinkMinutes(0);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleOnFeedbackChange = (feedback: Feedback) => {
    setFeedback(feedback);
  }

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseFloat(event.target.value));
  };

  const handleBeerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBeer(parseFloat(event.target.value));
  };

  const handleWineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWine(parseFloat(event.target.value));
  };

  const handleLiquorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiquor(parseFloat(event.target.value));
  };

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkHours(parseFloat(event.target.value));
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkMinutes(parseFloat(event.target.value));
  };

  const calculateBAC = () => {
    const totalAlcohol = beer * 12 * 0.05 + wine * 5 * 0.12 + liquor * 1.5 * 0.4;
    const genderCoefficient = curUserInfo.gender === 0 ? 0.73 : 0.66;
    const hours = drinkHours + drinkMinutes / 60;
    return [(totalAlcohol * 5.14 / (weight * genderCoefficient)) - 0.015 * hours, totalAlcohol];
  }

  const getBacWarning = () => {
    let state;
    if (bac >= 0.02 && bac <= 0.04) {
      state = "Light-headed";
    } else if (bac > 0.04 && bac <= 0.07) {
      state = "Buzzed";
    } else if (bac > 0.07 && bac <= 0.1) {
      state = "Legally impaired";
    } else if (bac > 0.1 && bac <= 0.15) {
      state = "Drunk";
    } else if (bac > 0.15 && bac <= 0.19) {
      state = "Very Drunk";
    } else if (bac > 0.19 && bac <= 0.24) {
      state = "Dazed and confused";
    } else if (bac > 0.24 && bac <= 0.3) {
      state = "Stupor";
    } else if (bac > 0.3) {
      state = "Coma";
    }
    if (!state) {
      return null;
    }
    const effects = BAC_EFFECT_MAPPING.get(state);
    if (!effects) {
      return null;
    }
    return (
      <Box
        sx={{
          backgroundColor: "red",
          borderRadius: "4px",
          boxShadow: 2,
          p: 2,
          maxWidth: 500,
          mx: "auto",
          mt: 10,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          You are in the state of:
        </Typography>
        <Typography variant="h5" gutterBottom>
          {state}
        </Typography>
        {effects.map((effect, index) => (
          <Typography key={index} variant="body1" component="p" gutterBottom>
            {effect}
          </Typography>
        ))}
      </Box>
    )
  }

  const getFeedback = () => {
    if (!feedback.level) {
      return null;
    }

    return (
      <Box
        sx={{
          backgroundColor: "red",
          borderRadius: "4px",
          boxShadow: 2,
          p: 2,
          maxWidth: 500,
          mx: "auto",
          mt: 10,
          textAlign: "center",
        }}
      >
      <Typography variant="h5" gutterBottom>
        You are in the level of:
      </Typography>
      <Typography variant="h5" gutterBottom>
        {feedback.level}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {feedback.healthRisks}
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        {feedback.recommendedAction}
      </Typography>
    </Box>
    )
  }

  return (
    <div>
      <div className="timer" role="timer">
        <div className="col-4">
          <div className="box">
            <p id="day">{days < 10 ? "0" + days : days}</p>
            <span className="text">Days</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="hour">{hours < 10 ? "0" + hours : hours}</p>
            <span className="text">Hours</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="minute">{minutes < 10 ? "0" + minutes : minutes}</p>
            <span className="text">Minutes</span>
          </div>
        </div>
        <div className="col-4">
          <div className="box">
            <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
            <span className="text">Seconds</span>
          </div>
        </div>
      </div>

      <div style={{marginTop: "30px"}}>
        <Button variant="contained" startIcon={<AlarmIcon/>} onClick={handleClickOpen}>
          Reset
        </Button>

        <Dialog open={props.isAlcohol && dialogOpen} onClose={handleClose}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <TextField
              label="Weight (lbs)"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              value={weight}
              onChange={handleWeightChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
            <TextField
              label="Beer (12 oz) - 5% ABV"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              value={beer}
              onChange={handleBeerChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
            <TextField
              label="Wine (5 oz) - 12% ABV"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              value={wine}
              onChange={handleWineChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
            <TextField
              label="Liquor (1.5 oz) - 40% ABV"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              value={liquor}
              onChange={handleLiquorChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
            <TextField
              label="Hours since first drink"
              type="number"
              InputProps={{inputProps: {min: 0}}}
              value={drinkHours}
              onChange={handleHoursChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
            <TextField
              label="Minutes since first drink"
              type="number"
              InputProps={{inputProps: {min: 0, max: 60}}}
              value={drinkMinutes}
              onChange={handleMinutesChange}
              fullWidth
              style={{marginTop: "10px", marginBottom: "10px"}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleReset} color="error">Reset</Button>
          </DialogActions>
        </Dialog>

        <TobaccoTrackerDialog 
          open={!props.isAlcohol && dialogOpen} 
          onClose={handleDialogClose} 
          onFeedbackChange={handleOnFeedbackChange}
          onReset={handleReset}
        />
      </div>

      {props.isAlcohol ? getBacWarning() : getFeedback()}
    </div>
  );
};