import { Functions } from './Firebase';

export const FirebaseFunction = (name: string) => {
  return Functions().httpsCallable(name);
};

export const createNewUser = FirebaseFunction("createNewUser");
export const authenticateUser = FirebaseFunction("authenticateUser");
export const updateAlcoholTobaccoTime = FirebaseFunction("updateAlcoholTobaccoTime");
export const updateUserPostReaction = FirebaseFunction("updateUserPostReaction");
export const updateAlcoholAmount = FirebaseFunction("updateAlcoholAmount");
export const alcoholAnalysis = FirebaseFunction("alcoholAnalysis");
export const updateTobaccoAmount = FirebaseFunction("updateTobaccoAmount");
export const tobaccoAnalysis = FirebaseFunction("tobaccoAnalysis");
export const createForumPost = FirebaseFunction("createForumPost");
export const fetchForumPosts = FirebaseFunction("fetchForumPosts");