import * as functions from "firebase-functions";
import {db} from "./index";
import {ERROR, Response, User} from "./Constants";
import sha256 from "fast-sha256";


exports.createNewUser = functions.https.onCall(async (data, _context) => {
  // This is the standard response struct. Always declare it at the start of every function.
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };
  // Must use a try-catch block.
  try {
    // Sanity check for user data.
    if (!checkUserData(data)) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }
    // This acquires the table reference.
    const userCollectionRef = db.collection("user");
    // Check if the username or email has already been registered with.
    const dupUsernameSnapShot = await userCollectionRef.where("username", "==", data.username).get();
    const dupEmailSnapShot = await userCollectionRef.where("email", "==", data.email).get();
    if (!dupUsernameSnapShot.empty) {
      response.error = ERROR.USERNAME_IN_USE;
      return response;
    }
    if (!dupEmailSnapShot.empty) {
      response.error = ERROR.EMAIL_IN_USE;
      return response;
    }
    // reference.doc() creates a new table entry (i.e. a new document) and returns a document reference.
    const userDocumentRef = userCollectionRef.doc();
    const newUserData = {
      username: data.username,
      password: sha256(data.password),
      email: data.email,
      age: data.age,
      gender: data.gender,
      is_tobacco_user: data.is_tobacco_user,
      tobacco_length: data.tobacco_length ?? 0,
      is_alcohol_user: data.is_alcohol_user,
      alcohol_length: data.alcohol_length ?? 0,
      alcohol_reset_time: data.is_alcohol_user ? new Date() : null,
      tobacco_reset_time: data.is_tobacco_user ? new Date() : null,
      alcohol_history: [],
      forum_posts: [],
      liked_posts: [],
      disliked_posts: []
    };
    // documentRef.set() will modify the document.
    await userDocumentRef.set(newUserData);
    response.resp = {
      id: userDocumentRef.id
    };
    return response;
  } catch (error) {
    // If an exception occurs on the Firestore side, we need to catch it and change it to our own error type.
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});

function checkUserData(data: any) {
  if (data.age === null || data.gender === null) {
    return false;
  }
  const userData = data as User;
  const usernameRegex = /^[a-zA-Z0-9]{6,20}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return usernameRegex.test(userData.username) && passwordRegex.test(userData.password) && emailRegex.test(userData.email);
}