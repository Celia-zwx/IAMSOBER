import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: sessionStorage,
});

export const alcoholTobaccoForumAtom = atom({
  key: "alcoholTobaccoForumAtom",
  default: "alcohol",
  effects_UNSTABLE: [persistAtom],
});