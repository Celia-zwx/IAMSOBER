import {useEffect, useState} from "react";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const StatisticsBox = () => {

  const curUserInfo = useRecoilValue(curUserInfoAtom);
  const alcoholExceedRate = curUserInfo.alcohol_exceed_rate;
  const alcoholUsageAmount = curUserInfo.alcohol_usage_amount;
  const alcoholAdvice = curUserInfo.alcohol_advice;
  
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
    <Typography variant="h3">Alcohol Information</Typography>
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
      Alcohol Exceed Rate: {curUserInfo.alcohol_exceed_rate * 100}%
    </Typography>
    <Typography variant="body1">
      Alcohol Usage Amount: {curUserInfo.alcohol_usage_amount}
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
    <Typography variant="body1" padding={1.5} fontSize={20}>Alcohol Advice:</Typography>
      <Box component="ul" sx={{ pl: 2 }}>
        {curUserInfo.alcohol_advice.map((advice: string, index: number) => (
          <li key={index}>
            <Typography variant="body1">{advice}</Typography>
          </li>
        ))}
      </Box>
  </Box>
</Box>
  );

}

