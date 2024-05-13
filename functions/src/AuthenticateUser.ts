import * as functions from "firebase-functions";
import { db } from "./index";
import { ERROR, Response } from "./Constants";
import sha256 from "fast-sha256";

exports.authenticateUser = functions.https.onCall(async (data, _context) => {
  // Initialize the response object with a default value
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };

  try {
    // Find the user with the provided username and password
    const userCollectionRef = db.collection("user");
    const userSnapShot = await userCollectionRef.where("username", "==", data.username)
                                                .where("password", "==", sha256(data.password))
                                                .get();
                                                 
    // If the user is not found, return an error
    if (userSnapShot.empty) {
      response.error = ERROR.UNAUTHORIZED_ACCESS;
      return response;
    }

    // If the user is found, return their data in the response object
    const userData = userSnapShot.docs[0].data();
    userData.id = userSnapShot.docs[0].id;
    response.resp = userData;
    
    return response;
  } catch (error) {
    // If an error occurs, catch it and return an error response
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});
