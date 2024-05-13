import * as functions from "firebase-functions";
import {db} from "./index";
import {ERROR, Response} from "./Constants";
import * as admin from "firebase-admin";

exports.updateAlcoholTobaccoTime = functions.https.onCall(async (data, _context) => {
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };

  try {
    if (!data.id || data.isAlcohol === null || !data.reset_time) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }
    const userDoc = db.collection("user").doc(data.id);
    if (data.isAlcohol) {
      await userDoc.update({
        alcohol_reset_time: new Date(data.reset_time),
      });
    } else {
      await userDoc.update({
        tobacco_reset_time: new Date(data.reset_time),
      });
    }
    response.resp = {
      id: data.id
    };
    return response;
  } catch (error) {
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});

exports.updateUserPostReaction = functions.https.onCall(async (data, _context) => {
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };

  try {
    if (!data.user_id || !data.post_id || data.is_like === null) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }
    const userDoc = db.collection("user").doc(data.user_id);
    const forumPostDoc = db.collection("forum_post").doc(data.post_id);

    if (data.is_like) {
      await userDoc.update({
        liked_posts: admin.firestore.FieldValue.arrayUnion(data.post_id)
      });
      await forumPostDoc.update({
        liked: admin.firestore.FieldValue.increment(1)
      });
    } else {
      await userDoc.update({
        liked_posts: admin.firestore.FieldValue.arrayRemove(data.post_id)
      });
      await forumPostDoc.update({
        liked: admin.firestore.FieldValue.increment(-1)
      });
    }
    response.resp = {
      post_id: data.post_id
    };
    return response;
  } catch (error) {
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});
