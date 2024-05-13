import * as functions from "firebase-functions";
import {ERROR, Post, Response} from "./Constants";
import {db} from "./index";
import * as admin from "firebase-admin";

exports.createForumPost = functions.https.onCall(async (data, _context) => {
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };

  try {
    if (!data.user_id || !data.username || data.is_alcohol_post === null || !data.title || !data.content) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }
    const userDoc = db.collection("user").doc(data.user_id);
    const forumPostCollection = db.collection("forum_post").doc();
    const newForumPostData: Post = {
      user_id: data.user_id,
      username: data.username,
      is_alcohol_post: data.is_alcohol_post,
      title: data.title,
      content: data.content,
      post_time: new Date(),
      liked: 0
    };

    await forumPostCollection.set(newForumPostData);
    await userDoc.update({
      forum_posts: admin.firestore.FieldValue.arrayUnion(forumPostCollection.id)
    });

    response.resp = {
      post_id: forumPostCollection.id
    };

    return response;
  } catch (error) {
    // If an exception occurs on the Firestore side, we need to catch it and change it to our own error type.
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});

exports.fetchForumPosts = functions.https.onCall(async (data, _context) => {
  let response: Response = {
    resp: null,
    error: ERROR.NO_ERROR
  };
  try {
    if (data.isAlcoholPost === null) {
      response.error = ERROR.PARAM_ERROR;
      return response;
    }
    const forumPostRef = db.collection("forum_post").where("is_alcohol_post", "==", data.isAlcoholPost);
    const snapshot = await forumPostRef.get();
    let forumPosts: Post[] = [];
    snapshot.forEach(doc => {
      forumPosts.push({
        id: doc.id,
        ...<Post>doc.data()
      });
    });

    response.resp = {
      forum_posts: forumPosts
    };
    return response;
  } catch (error) {
    response.error = ERROR.FIRESTORE_ERROR;
    return response;
  }
});