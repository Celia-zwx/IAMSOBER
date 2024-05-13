import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { db } from "./index";
import { ERROR, Response } from "./Constants";

// interface AlcoholUsageData {
//     id: string,
//     time: Date,
//     beer: number,
//     wine: number,
//     liquor: number,
//     alcohol_amount: number
//   }

const AlcoholAdvice = {
  "Moderate drinking": [
    "Reduced risk of heart disease and stroke", 
    "Improved mood and relaxation", 
    "Increased socialization and enjoyment of social events", 
    "Improved cognitive function"
  ],

  "Binge drinking": [
    "Blackouts and memory loss",
    "Increased risk of accidents and injuries",
    "Increased risk of alcohol poisoning",
    "Increased risk of developing an alcohol use disorder",
    "Increased risk of high blood pressure and heart disease"
  ],

  "Heavy drinking": [
    "Increased risk of liver disease, including cirrhosis and liver cancer",
    "Increased risk of certain types of cancer, such as breast and colon cancer",
    "Increased risk of high blood pressure and stroke",
    "Increased risk of depression and anxiety",
    "Increased risk of alcohol use disorder"
  ],

  "No alcohol": [
    "No alcohol during the past month/week"
  ]
}

exports.updateAlcoholAmount = functions.https.onCall(async (data, _context) => {
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
    const alcoholCollection = db.collection('alcohol').doc();

    const newUserData = {
      user_id: data.id,
      time: new Date(data.time),
      beer: data.beer,
      wine: data.wine,
      liquor: data.liquor,
      alcohol_amount: data.alcohol_amount
    };



    await alcoholCollection.set(newUserData);

    await userDoc.update({
      alcohol_history: admin.firestore.FieldValue.arrayUnion(alcoholCollection.id)
    });

    response.resp = {
      alcohol_id: alcoholCollection.id
    };
    return response;
  } catch (error) {
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});

const numDaysBetween = (d1: Date, d2: Date) => {
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return diff / (1000 * 60 * 60 * 24);
};

exports.alcoholAnalysis = functions.https.onCall(async (data, _context) => {
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };

  try {
    if (!data.id) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }

    let alcohol_dic: { [key: string]: number } = {};
    let exceed_number = 0;
    let total_number = 0;

    const alcoholRef = db.collection('alcohol');
    const snapshot = await alcoholRef.get();
    snapshot.forEach(doc => {
      const alcohol_data = doc.data();
      const d1 = new Date();

      if(((data.interval == "month" || data.interval == undefined || data.interval == null) && numDaysBetween(d1, doc.data().time.toDate()) <= 30) || (data.interval == "week" && numDaysBetween(d1, doc.data().time.toDate()) <= 7)){

        if (alcohol_data.user_id in alcohol_dic) {
          alcohol_dic[alcohol_data.user_id] += alcohol_data.alcohol_amount;
        }
        else {
          alcohol_dic[alcohol_data.user_id] = alcohol_data.alcohol_amount;
        }
      }
    });
    

    for (let key in alcohol_dic) {
      if (key !== data.id) {
        total_number += 1;
        if (alcohol_dic[key] >= alcohol_dic[data.id]) {
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
    console.log(alcohol_dic)

    let advice;
    if (data.interval == "month" || data.interval == undefined || data.interval == null){
      if(alcohol_dic[data.id] == 0) advice = AlcoholAdvice["No alcohol"];
      else if (alcohol_dic[data.id] <= 16) advice = AlcoholAdvice["Moderate drinking"];
      else if(alcohol_dic[data.id] <= 32) advice = AlcoholAdvice["Binge drinking"];
      else advice = AlcoholAdvice["Heavy drinking"];

    }else if(data.interval == "week"){
      if(alcohol_dic[data.id] == 0) advice = AlcoholAdvice["No alcohol"];
      else if (alcohol_dic[data.id] <= 4) advice = AlcoholAdvice["Moderate drinking"];
      else if(alcohol_dic[data.id] <= 8) advice = AlcoholAdvice["Binge drinking"];
      else advice = AlcoholAdvice["Heavy drinking"];
    }

    response.resp = {
      alcohol_amount: alcohol_dic[data.id],
      exceeded: exceed_rate,
      advice: advice
    };
    return response;
  } catch (error) {
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});
