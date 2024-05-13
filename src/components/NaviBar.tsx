import * as React from 'react';
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import {curUserInfoAtom, defaultUserInfoAtom} from "../atoms/UserInfoAtom";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split('')[0][0]}${name.split('')[1][0]}`,
  };
}

export function NaviBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElStats, setAnchorElStats] = React.useState(null);

  const navigate = useNavigate();
  const [curUserInfo, setCurUserInfo] = useRecoilState(curUserInfoAtom); // This gives us both read & write permission to the atom

  const trackerOnClick = () => {
      navigate("/userHome");
  }

  const alcoholStatsOnClick = () => {
      navigate("/statistics/alcohol");
  }

  const tobaccoStatsOnClick = () => {
    navigate("/statistics/tobacco");
  }

  const forumOnClick = () => {
      navigate("/forum");
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const handleOpenStatsDropDown = (event: any) => {
    setAnchorElStats(event.currentTarget);
  };

  const handleCloseStatsDropDown = () => {
    setAnchorElStats(null);
  }

  const loginOnClick = () => {
    // Navigate to login page.
    navigate("/login");
  }

  const registerOnClick = () => {
    // Navigate to register page.
    navigate("/register");
  }

  const profileOnClick = () => {
    // Navigate to profile page.
  }

  const logoutOnClick = () => {
    setCurUserInfo(defaultUserInfoAtom);
    handleCloseUserMenu();
    navigate("/home");
  }

  const getUserMenuOptions = () => {
    return !curUserInfo.id ? (
      <Box sx={{flexGrow: 0, display: {xs: 'none', md: 'flex'}}}>
        <Button
          key='Register'
          onClick={registerOnClick}
          sx={{my: 2, color: 'white', display: 'block'}}
        >
          Register
        </Button>
        <Button
          key='Login'
          onClick={loginOnClick}
          sx={{my: 2, color: 'white', display: 'block'}}
        >
          Login
        </Button>
      </Box>
    ) : (
      <Box sx={{flexGrow: 0}}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
            <Avatar {...stringAvatar(curUserInfo.username)} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{mt: '45px'}}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem key='profile' onClick={profileOnClick}>
            <Typography textAlign="center">Profile</Typography>
          </MenuItem>
          <MenuItem key='logout' onClick={logoutOnClick}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    );
  }

  const getMenuOptions = () => {
    return curUserInfo.id ? (
      <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
        <Button
          key="Tracker"
          onClick={trackerOnClick}
          sx={{my: 2, color: 'white', display: 'block'}}
        >
          Tracker
        </Button>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpenStatsDropDown}
          sx={{my: 2, color: 'white', display: 'block'}}
          key="Statistics"
        >
          Statistics
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElStats}
          keepMounted
          open={Boolean(anchorElStats)}
          onClose={handleCloseStatsDropDown}
        >
          <MenuItem onClick={alcoholStatsOnClick}>Alcohol</MenuItem>
          <MenuItem onClick={tobaccoStatsOnClick}>Tobacco</MenuItem>
        </Menu>
        <Button
          key="News"
          onClick={forumOnClick}
          sx={{my: 2, color: 'white', display: 'block'}}
        >
          Forum
        </Button>
      </Box>
    ) : (
      <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
      </Box>
    );
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HOME
          </Typography>

          {getMenuOptions()}

          {getUserMenuOptions()}

        </Toolbar>
      </Container>
    </AppBar>
  );
}