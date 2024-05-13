import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db } from "./index";
import { ERROR, Response } from "./Constants";

// new added
const TobaccoAdvice = {
  "Non-smoker": [
    "Reduced risk of lung cancer and other respiratory diseases",
    "Improved cardiovascular health",
    "Improved sense of taste and smell",
    "Reduced risk of premature aging"
  ],
  "Occasional smoker": [
    "Increased risk of lung cancer and other respiratory diseases",
    "Increased risk of heart disease and stroke",
    "Increased risk of oral and throat cancers",
    "Reduced lung function",
    "Reduced sense of taste and smell"
  ],
  "Regular smoker": [
    "High risk of lung cancer and other respiratory diseases",
    "High risk of heart disease and stroke",
    "High risk of oral and throat cancers",
    "Reduced lung function",
    "Reduced sense of taste and smell"
  ],
  "Quitter": [
    "Reduced risk of lung cancer and other respiratory diseases",
    "Improved cardiovascular health",
    "Improved sense of taste and smell",
    "Reduced risk of premature aging"
  ]
}

exports.updateTobaccoAmount = functions.https.onCall(async (data, _context) => {
    let response: Response = {
      resp: null,
      error: ERROR.NO_ERROR
    };
  
    try {
      if (!data.id) {
        response.error = ERROR.PARAM_ERROR;
        return response;
      }
      const userDoc = db.collection("user").doc(data.id);
      const tobaccoCollection = db.collection('tobacco').doc();
  
      const newUserData = {
        user_id: data.id,
        time: new Date(data.time),
        cigaretteQuantity: data.cigaretteQuantity,
        cigarQuantity: data.cigarQuantity,
        smokelessQuantity: data.smokelessQuantity
      };
  
      await tobaccoCollection.set(newUserData);
  
      await userDoc.update({
        tobacco_history: admin.firestore.FieldValue.arrayUnion(tobaccoCollection.id)
      });
  
      response.resp = {
        tobacco_id: tobaccoCollection.id
      };
      return response;
    } catch (error) {
      response.error = ERROR.FIRESTORE_ERROR;
      return response;
    }
  });

  // new added 
  const numDaysBetween = (d1: Date, d2: Date) => {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
  };
  
  exports.tobaccoAnalysis = functions.https.onCall(async (data, _context) => {
    let response: Response = {
      resp: null,
      error: ERROR.NO_ERROR
    };
  
    try {
      if (!data.id) {
        response.error = ERROR.PARAM_ERROR;
        return response;
      }
  
      let tobacco_dic: { [key: string]: number } = {};
      let exceed_number = 0;
      let total_number = 0;
  
      const tobaccoRef = db.collection('tobacco');
      const snapshot = await tobaccoRef.get();
      snapshot.forEach(doc => {
        // Data read table
        const tobacco_data = doc.data();
        const d1 = new Date();
        const cigarQuantity = tobacco_data.cigarQuantity || 0; // default to 0 if cigarQuantity is not defined
        const cigaretteQuantity = tobacco_data.cigaretteQuantity || 0; // default to 0 if cigaretteQuantity is not defined
        const smokelessQuantity = tobacco_data.smokelessQuantity || 0; // default to 0 if smokelessQuantity is not defined
        const cigarAmount = cigarQuantity * 20; // assume 1 cigar contain 20 grams of tobacco
        const cigaretteAmount = cigaretteQuantity * 1; 
        const smokelessAmount = smokelessQuantity * 3; 
        const tobacco_amount = cigarAmount + cigaretteAmount + smokelessAmount;

        // calculate tobacco_amount on tobacco_data
        if(((data.interval == "month" || data.interval == undefined || data.interval == null) && numDaysBetween(d1, doc.data().time.toDate()) <= 30) || (data.interval == "week" && numDaysBetween(d1, doc.data().time.toDate()) <= 7)){
  
          if (tobacco_data.user_id in tobacco_dic) {
            tobacco_dic[tobacco_data.user_id] += tobacco_amount;
          }
          else {
            tobacco_dic[tobacco_data.user_id] = tobacco_amount;
          }
        }
      });
      
      for (let key in tobacco_dic) {
        if (key !== data.id) {
          total_number += 1;
          if (tobacco_dic[key] >= tobacco_dic[data.id]) {
            exceed_number += 1;
          }
        }
      }
  
      let exceed_rate;
      if (total_number == 0) {
        exceed_rate = 1;
      } else {
        exceed_rate = exceed_number / total_number;
      }
      console.log(data.interval, data.id)
      console.log(tobacco_dic)
  
      let advice;
      if (data.interval == "month" || data.interval == undefined || data.interval == null){
        if(tobacco_dic[data.id] == 0) advice = TobaccoAdvice["Non-smoker"];
        else if (tobacco_dic[data.id] < 10) advice = TobaccoAdvice["Occasional smoker"];
        else advice = TobaccoAdvice["Regular smoker"];
  
      }else if(data.interval == "week"){
        if(tobacco_dic[data.id] == 0) advice = TobaccoAdvice["Non-smoker"];
        else if (tobacco_dic[data.id] < 2) advice = TobaccoAdvice["Occasional smoker"];
        else advice = TobaccoAdvice["Regular smoker"];
      }
  
      response.resp = {
        tobacco_amount: tobacco_dic[data.id],
        exceeded: exceed_rate,
        advice: advice
      };
      return response;
    } catch (error) {
      response.error = ERROR.FIRESTORE_ERROR;
      return response;
    }
  });
  