import React, {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel, FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
  Typography
} from "@mui/material";
import {createNewUser} from "../firebase/FirebaseFunctions";
import {ERROR} from "../constants";
import {useSetRecoilState} from "recoil";
import {curUserInfoAtom} from "../atoms/UserInfoAtom";

enum Gender {
  Male,
  Female,
  Not_Binary,
  Not_Chosen
}

const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationForm(props: any) {
  const navigate = useNavigate();
  const setCurUserInfo = useSetRecoilState(curUserInfoAtom);

  // user data
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [age, setAge] = useState<number>(-1);
  const [gender, setGender] = useState<Gender>(3);
  const [isAlcoholUser, setIsAlcoholUser] = useState<boolean>(false);
  const [isTobaccoUser, setIsTobaccoUser] = useState<boolean>(false);
  const [alcoholLength, setAlcoholLength] = useState<number>(-1);
  const [tobaccoLength, setTobaccoLength] = useState<number>(-1);

  // form warning
  const [usernameWarning, setUsernameWarning] = useState<string>("");
  const [emailWarning, setEmailWarning] = useState<string>("");
  const [passwordWarning, setPasswordWarning] = useState<string>("");
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState<string>("");
  const [ageWarning, setAgeWarning] = useState<string>("");
  const [genderWarning, setGenderWarning] = useState<string>("");
  const [alcoholLengthWarning, setAlcoholLengthWarning] = useState<string>("");
  const [tobaccoLengthWarning, setTobaccoLengthWarning] = useState<string>("");
  const [choiceWarning, setChoiceWarning] = useState<string>("");

  const usernameOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setUsername(event.target.value);
  };

  const emailOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setEmail(event.target.value);
  };

  const passwordOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setPassword(event.target.value);
  };

  const confirmPasswordOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setConfirmPassword(event.target.value);
  };

  const ageOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAge(parseInt(event.target.value));
  };

  const genderOnChange = (event: SelectChangeEvent) => {
    setGender(parseInt(event.target.value));
  };

  const isAlcoholUserOnChange = (event: SelectChangeEvent) => {
    setIsAlcoholUser(event.target.value === "yes");
  };

  const isTobaccoUserOnChange = (event: SelectChangeEvent) => {
    setIsTobaccoUser(event.target.value === "yes");
  };

  const alcoholLengthOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setAlcoholLength(parseInt(event.target.value));
    if (!event.target.value) {
      setAlcoholLength(-1);
    }
  };

  const tobaccoLengthOnChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTobaccoLength(parseInt(event.target.value));
    if (!event.target.value) {
      setTobaccoLength(-1);
    }
  };

  const clearWarning = () => {
    setUsernameWarning("");
    setEmailWarning("");
    setPasswordWarning("");
    setConfirmPasswordWarning("");
    setAgeWarning("");
    setGenderWarning("");
    setAlcoholLengthWarning("");
    setTobaccoLengthWarning("");
    setChoiceWarning("");
  }

  const registerNewUser = async () => {
    let dataReady: boolean = true;
    clearWarning();

    if (!username) {
      setUsernameWarning("Please enter your username");
      dataReady = false;
    } else if (!usernameRegex.test(username)) {
      setUsernameWarning("Username must be alphanumeric with length 6-20");
      dataReady = false;
    }

    if (!email) {
      setEmailWarning("Please enter your email address");
      dataReady = false;
    } else if (!emailRegex.test(email)) {
      setEmailWarning("Please enter a valid email address");
      dataReady = false;
    }

    if (!password) {
      setPasswordWarning("Please enter your password");
      dataReady = false;
    } else if (password.length < 8) {
      setPasswordWarning("Password must be longer than 8 characters");
      dataReady = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordWarning("Password must have at least 1 uppercase letter, 1 lower case letter and 1 special letter");
      dataReady = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordWarning("Please confirm your password");
      dataReady = false;
    } else if (confirmPassword.length < 8) {
      setConfirmPasswordWarning("Password must be longer than 8 characters");
      dataReady = false;
    } else if (!passwordRegex.test(password)) {
      setConfirmPasswordWarning("Password must have at least 1 uppercase letter, 1 lower case letter and 1 special letter");
      dataReady = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordWarning("Passwords don't match");
      dataReady = false;
    }

    if (!age || age <= 0) {
      setAgeWarning("Please enter your current age");
      dataReady = false;
    }

    if (gender === 3) {
      setGenderWarning("Please select your gender");
      dataReady = false;
    }

    if (isAlcoholUser && alcoholLength === -1) {
      setAlcoholLengthWarning("Please enter your time (in years) of consuming alcohol");
      dataReady = false;
    } else if (isAlcoholUser && (alcoholLength <= 0 || alcoholLength > age)) {
      setAlcoholLengthWarning("Year(s) of Alcohol is invalid");
      dataReady = false;
    }

    if (isTobaccoUser && tobaccoLength === -1) {
      setTobaccoLengthWarning("Please enter your time (in years) of consuming tobacco");
      dataReady = false;
    } else if (isTobaccoUser && (tobaccoLength <= 0 || tobaccoLength > age)) {
      setAlcoholLengthWarning("Year(s) of Tobacco is invalid");
      dataReady = false;
    }

    if (!isAlcoholUser && !isTobaccoUser) {
      setChoiceWarning("You have to be either alcohol or tobacco user");
      dataReady = false;
    }

    if (!dataReady) return;

    const userData = {
      username: username,
      password: confirmPassword,
      email: email,
      age: age,
      gender: gender,
      is_tobacco_user: isTobaccoUser,
      tobacco_length: tobaccoLength,
      is_alcohol_user: isAlcoholUser,
      alcohol_length: alcoholLength
    };
    const response = (await createNewUser(userData)).data;
    if (response.error === ERROR.USERNAME_IN_USE) {
      setUsernameWarning(ERROR.USERNAME_IN_USE);
    }
    if (response.error === ERROR.EMAIL_IN_USE) {
      setEmailWarning(ERROR.EMAIL_IN_USE);
    }
    if (response.error === ERROR.NO_ERROR) {
      // const curUserInfo = {
      //   ...userData,
      //   id: response.resp.id
      // };
      // setCurUserInfo(curUserInfo);
      navigate("/login");
    }
  }

  return (
    <Fragment>
      <Typography component="h2" variant="h5">
        Signup to start your journey!
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            helperText={emailWarning}
            error={emailWarning !== ""}
            onChange={emailOnChange}
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm password"
            label="Confirm Password"
            type="password"
            id="confirm password"
            autoComplete="current-password"
            autoFocus
            helperText={confirmPasswordWarning}
            error={confirmPasswordWarning !== ""}
            onChange={confirmPasswordOnChange}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="age"
            label="Age"
            type="age"
            id="age"
            autoComplete="age"
            autoFocus
            helperText={ageWarning}
            error={ageWarning !== ""}
            onChange={ageOnChange}
          />

          <br/>

          <FormControl fullWidth error={genderWarning !== ""}>
            <FormLabel id="gender-label">Gender*</FormLabel>
            <RadioGroup
              row
              aria-labelledby="gender-label"
              name="gender-button-group"
              onChange={genderOnChange}
            >
              <FormControlLabel value="0" control={<Radio />} label="Male" />
              <FormControlLabel value="1" control={<Radio />} label="Female" />
              <FormControlLabel value="2" control={<Radio />} label="Non-Binary" />
            </RadioGroup>
            <FormHelperText>{genderWarning}</FormHelperText>
          </FormControl>

          <br/>

          <FormControl fullWidth error={choiceWarning !== ""}>
            <FormLabel id="isAlcoholUser-label">Are You an Alcohol User?*</FormLabel>
            <RadioGroup
              row
              aria-labelledby="isAlcoholUser-label"
              name="isAlcoholUser-button-group"
              defaultValue="no"
              onChange={isAlcoholUserOnChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            <FormHelperText>{choiceWarning}</FormHelperText>
          </FormControl>

          {
            isAlcoholUser ?
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="alcohol_length"
                label="Year(s) of Alcohol"
                type="alcohol_length"
                id="alcohol_length"
                autoComplete="alcohol_length"
                helperText={alcoholLengthWarning}
                error={alcoholLengthWarning !== ""}
                onChange={alcoholLengthOnChange}
              /> : null
          }

          <br/>

          <FormControl fullWidth error={choiceWarning !== ""}>
            <FormLabel id="isTobaccoUser-label">Are You a Tobacco User?*</FormLabel>
            <RadioGroup
              row
              aria-labelledby="isTobaccoUser-label"
              name="isTobaccoUser-button-group"
              defaultValue="no"
              onChange={isTobaccoUserOnChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            <FormHelperText>{choiceWarning}</FormHelperText>
          </FormControl>

          {
            isTobaccoUser ?
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="tobacco_length"
                label="Years of Tobacco"
                type="tobacco_length"
                id="tobacco_length"
                autoComplete="tobacco_length"
                helperText={tobaccoLengthWarning}
                error={tobaccoLengthWarning !== ""}
                onChange={tobaccoLengthOnChange}
              /> : null
          }
        </Grid>

        <br/>

        <Button
          style={{margin: '0 auto', display: "flex"}}
          variant="contained"
          onClick={registerNewUser}
        >
          Register
        </Button>
      </form>
    </Fragment>
  );
}