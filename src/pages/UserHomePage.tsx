import React from "react";
import {Timer} from "../components/Timer";
import {useRecoilState, useRecoilValue} from "recoil";
import {alcoholTobaccoTabAtom} from "../atoms/AlcoholTobaccoTabAtom";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup, SelectChangeEvent,
} from "@mui/material";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";

export function UserHomePage() {
  const [alcoholTobaccoTab, setAlcoholTobaccoTab] = useRecoilState(alcoholTobaccoTabAtom);
  const curUserInfo = useRecoilValue(curUserInfoAtom);

  const handleChange = (event: SelectChangeEvent) => {
    setAlcoholTobaccoTab(event.target.value);
  }

  const getTimerComponent = () => {
    if (alcoholTobaccoTab === "alcohol" && curUserInfo.is_alcohol_user) {
      return (
        <div>
          <h1 className="header">
            You Have Been Sober For
          </h1>
          <Timer isAlcohol={true}/>
        </div>
      );
    } else if (alcoholTobaccoTab === "alcohol" && !curUserInfo.is_alcohol_user) {
      return (
        <div>
          <h1 className="header">
            You Are Not An Alcohol User! Keep On!
          </h1>
        </div>
      );
    } else if (alcoholTobaccoTab === "tobacco" && curUserInfo.is_tobacco_user) {
      return (
        <div>
          <h1 className="header">
            You Have Been Sober For
          </h1>
          <Timer isAlcohol={false}/>
        </div>
      );
    } else if (alcoholTobaccoTab === "tobacco" && !curUserInfo.is_tobacco_user) {
      return (
        <div>
          <h1 className="header">
            You Are Not A Tobacco User! Keep On!
          </h1>
        </div>
      );
    }
  }

  return (
    <div className="app">
      <div className="container">
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="alcohol-tobacco-label"
            name="isAlcoholUser-button-group"
            defaultValue={alcoholTobaccoTab}
            onChange={handleChange}
          >
            <FormControlLabel
              value="alcohol"
              control={<Radio color="warning" />}
              label="Alcohol"
              sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 36,
              },
            }}/>
            <FormControlLabel
              value="tobacco"
              control={<Radio color="warning" />}
              label="Tobacco"
              sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 36,
              },
            }}/>
          </RadioGroup>
        </FormControl>
        {getTimerComponent()}
      </div>
    </div>
  );
}