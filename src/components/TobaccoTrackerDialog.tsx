import React, { useState } from 'react';
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {useRecoilState} from "recoil";
import {updateTobaccoAmount} from "../firebase/FirebaseFunctions";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import {ERROR} from "../constants";

type Props = {
  open: boolean;
  onClose: () => void;
  onFeedbackChange: (feedback: Feedback) => void;
  onReset: () => void;
};

export interface Feedback {
  level: string,
  healthRisks: string,
  recommendedAction: string,
}

export function TobaccoTrackerDialog({ open, onClose, onReset, onFeedbackChange }: Props) {
  const [cigaretteQuantity, setCigaretteQuantity] = useState(0);
  const [cigarQuantity, setCigarQuantity] = useState(0);
  const [smokelessQuantity, setSmokelessQuantity] = useState(0);
  const [curUserInfo, setCurUserInfo] = useRecoilState(curUserInfoAtom);

  function calculateTobaccoLevel() {
    const feedback : Feedback = {
      level: '',
      healthRisks: '',
      recommendedAction: '',
    }
    const totalNicotine = (cigaretteQuantity * 1) + (cigarQuantity * 5) + (smokelessQuantity * 3);
    
    if (totalNicotine == 0) {
      return feedback;
    }

    if (totalNicotine <= 5) {
      feedback.level = 'Light tobacco use';
      feedback.healthRisks = 'High risk for developing health issues related to tobacco use, such as lung cancer, heart disease, and respiratory problems.';
      feedback.recommendedAction = 'Consider quitting tobacco use and seeking professional help to quit, as continued use may lead to severe health issues.';
    } else if (totalNicotine <= 15) {
      feedback.level = 'Moderate tobacco use';
      feedback.healthRisks = 'Low to moderate risk for developing health issues related to tobacco use, such as lung cancer, heart disease, and respiratory problems.';
      feedback.recommendedAction = 'Consider reducing tobacco use or quitting altogether to improve overall health.';
    } else {
      feedback.level = 'Heavy tobacco use';
      feedback.healthRisks = 'Moderate risk for developing health issues related to tobacco use, such as lung cancer, heart disease, and respiratory problems.';
      feedback.recommendedAction = 'Consider reducing tobacco use or quitting altogether to lower the risk of developing serious health issues.';
    }

    return feedback;
  }
  
  const handleReset = async () =>  {
    const newDate = new Date();
    const requestData_2 = {
      id: curUserInfo.id,
      time: newDate,
      cigaretteQuantity: cigaretteQuantity,
      cigarQuantity: cigarQuantity,
      smokelessQuantity: smokelessQuantity
    };
    const updateTobaccoUsageResponse = (await updateTobaccoAmount(requestData_2)).data;
    if (updateTobaccoUsageResponse.error !== ERROR.NO_ERROR) {
      console.log(updateTobaccoUsageResponse.error);
    } else {
      console.log(updateTobaccoUsageResponse.resp.tobacco_id);
    }
    const feedback = calculateTobaccoLevel();
    onFeedbackChange(feedback);
    onReset();
    handleClose();
  }

  const handleClose = () => {
    onClose();
    setCigaretteQuantity(0);
    setCigarQuantity(0);
    setSmokelessQuantity(0);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tobacco Tracker Form</DialogTitle>
      <DialogContent>
        <TextField
          label="Cigarette Quantity"
          type="number"
          InputProps={{inputProps: {min: 0}}}
          value={cigaretteQuantity}
          onChange={(event) => setCigaretteQuantity(parseInt(event.target.value))}
          fullWidth
          style={{marginTop: "10px", marginBottom: "10px"}}
        />
        <TextField
          label="Cigar Quantity"
          type="number"
          InputProps={{inputProps: {min: 0}}}
          value={cigarQuantity}
          fullWidth
          onChange={(event) => setCigarQuantity(parseInt(event.target.value))}
          style={{marginTop: "10px", marginBottom: "10px"}}
        />
        <TextField
          label="Smokeless Tobacco Quantity"
          type="number"
          InputProps={{inputProps: {min: 0}}}
          value={smokelessQuantity}
          onChange={(event) => setSmokelessQuantity(parseInt(event.target.value))}
          fullWidth
          style={{marginTop: "10px", marginBottom: "10px"}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleReset} color="error">
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
