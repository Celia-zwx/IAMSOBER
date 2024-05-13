import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {RecoilRoot} from 'recoil';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {NaviBar} from './components/NaviBar';
import {RegisterPage} from "./pages/RegisterPage";
import {LoginPage} from "./pages/LoginPage";
import {UserHomePage} from "./pages/UserHomePage";
import {StatisticsPage} from "./pages/StatisticsPage";
import {TobaccoStatisticsPage} from "./pages/TobaccoStatisticsPage";
import {ForumPage} from "./pages/ForumPage";
import {ForumPostCreationPage} from "./pages/ForumPostCreationPage";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
      <Helmet>
        <title>I AM SOBER</title>
      </Helmet>
        {/* <Helmet titleTemplate="%s | Ticketing_System" defaultTitle="I AM SOBER"/> */}
        <NaviBar/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/home" element={<HomePage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/userHome" element={<UserHomePage/>}/>
          <Route path="/statistics/alcohol" element={<StatisticsPage/>}/>
          <Route path="/statistics/tobacco" element={<TobaccoStatisticsPage/>}/>
          <Route path="/forum" element={<ForumPage/>}/>
          <Route path="/forum/create" element={<ForumPostCreationPage/>}/>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
