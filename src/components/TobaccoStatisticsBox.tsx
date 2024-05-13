import {useEffect, useState} from "react";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const TobaccoStatisticsBox = () => {

  const curUserInfo = useRecoilValue(curUserInfoAtom);
  const tobaccoExceedRate = curUserInfo.tobacco_exceed_rate;
  const tobaccoUsageAmount = curUserInfo.tobacco_usage_amount;
  const tobaccoAdvice = curUserInfo.tobacco_advice;
  
  useEffect(() => {
  });

  return (
    <Box
  sx={{
    width: '50%',
    height: '100vh',
    overflowY: 'auto',
    // backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    px: 4,
    py: 2,
    
  }}
>
  <Box sx={{ 
    mb: 2,
    width: '100%',
    pt: 5,
    height: '20vh' ,
    textAlign: 'center',
    border: '5px double blue',
    borderRadius: 10,
    // boxSizing: 'border-box',
  }}>
    <Typography variant="h3">Tobacco Information</Typography>
  </Box>
  <Box sx={{ 
    mb: 2,
    width: '100%',
    p: 2,
    height: '13vh' ,
    textAlign: 'center',
    border: '5px double blue',
    borderRadius: 10,
    // boxSizing: 'border-box',
  }}>
    <Typography variant="body1">
      Tobacco Exceed Rate: {curUserInfo.tobacco_exceed_rate * 100}%
    </Typography>
    <Typography variant="body1">
      Tobacco Usage Amount: {curUserInfo.tobacco_usage_amount} grams
    </Typography>
    
  </Box>
  <Box sx={{ 
    mb: 2,
    width: '100%',
    p: 2,
    height: '40vh' ,
    textAlign: 'center',
    border: '5px double blue',
    borderRadius: 10,
    // boxSizing: 'border-box',
  }}>
    <Typography variant="body1" padding={1.5} fontSize={20}>Tobacco Advice:</Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        {curUserInfo.tobacco_advice.map((advice: string, index: number) => (
          <li key={index}>
            <Typography variant="body1">{advice}</Typography>
          </li>
        ))}
      </Box>
  </Box>
</Box>
  );

}

export default TobaccoStatisticsBox;
