// React component
import React from 'react';
import '../Homepage.css';

import alcoholImage from '../images/alcohol-free.jpg';
import tobaccoImage from '../images/smoke-free.jpg';

export function HomePage() {
  return (
    <div className="HomePage">
      <h1 className='introduction'>WELCOME TO I AM SOBER</h1>
      <p>
        Your personal companion for tracking and reducing your alcohol and tobacco consumption
      </p>
      <p>
        <mark className="highlight">LET US START TODAY !</mark>
      </p> 
      <p>
        Take control of your life and start your journey towards a <mark className="highlight">HEALTHIER LIFESTYLE</mark>
      </p>
      <div className="home-container">
        <div className="left-side">
          <div className="image-container">
            <img src={alcoholImage} alt="Alcohol tracking" />
          </div>
          <div className="text">
            <h2>About Alcohol</h2>
            <p>Unlock your full potential and live your best life with I AM SOBER. 
                Excessive alcohol consumption can have serious consequences for your health and wellbeing, 
                but our app can help you take control of your drinking habits and make more informed decisions about your health. </p>
            <p>With easy-to-use tracking features, monitor your alcohol intake and stay on track towards a healthier, happier you.</p>
            <p>Don't let alcohol hold you back – join our community of like-minded individuals and start your journey towards a better you today!</p>
          </div>
        </div>
        <div className="right-side">
          <div className="image-container">
            <img src={tobaccoImage} alt="Tobacco tracking" />
          </div>
          <div className="text">
            <h2>About Tobacco</h2>
            <p>Smoking is a leading cause of preventable death worldwide, and can lead to a range of health problems such as lung cancer, heart disease, and respiratory illnesses. </p>
            <p>At I AM SOBER, we understand the harmful effects of tobacco use and are committed to helping you take control of your habits. </p>
            <p>Track your tobacco use and make more informed decisions about your health. </p>
            <p>With our support, you can quit smoking and start breathing easier, one step at a time! </p>
          </div>
        </div>
      </div>
    </div>
  );
}