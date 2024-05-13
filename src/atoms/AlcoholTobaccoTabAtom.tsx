import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: sessionStorage,
});

export const alcoholTobaccoTabAtom = atom({
  key: "alcoholTobaccoTabAtom",
  default: "alcohol",
  effects_UNSTABLE: [persistAtom],
});