import * as admin from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();
export const db = admin.firestore();

const CreateNewUser = require("./CreateUser");
exports.createNewUser = CreateNewUser.createNewUser;

const AuthenticateUser = require("./AuthenticateUser");
exports.authenticateUser = AuthenticateUser.authenticateUser;

const UpdateUserInfo = require("./UpdateUserInfo");
exports.updateAlcoholTobaccoTime = UpdateUserInfo.updateAlcoholTobaccoTime;
exports.updateUserPostReaction = UpdateUserInfo.updateUserPostReaction;

const StaticsByAlcohol = require("./StatsByAlcohol")
exports.updateAlcoholAmount = StaticsByAlcohol.updateAlcoholAmount;
exports.alcoholAnalysis = StaticsByAlcohol.alcoholAnalysis;

const ForumPost = require("./ForumPost");
exports.createForumPost = ForumPost.createForumPost;
exports.fetchForumPosts = ForumPost.fetchForumPosts;

const StatsByTobacco = require("./StatsByTobacco");
exports.updateTobaccoAmount = StatsByTobacco.updateTobaccoAmount;
exports.tobaccoAnalysis = StatsByTobacco.tobaccoAnalysis;