import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import {Gender} from "../../functions/src/Constants";

const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: sessionStorage,
});

export type User = {
  id?: string,
  username: string,
  password: string,
  email: string,
  age: number,
  gender: Gender,
  is_tobacco_user: boolean,
  tobacco_length?: number,
  is_alcohol_user: boolean,
  alcohol_length?: number,
  alcohol_reset_time?: Date,
  tobacco_reset_time?: Date,
  alcohol_history?: string[],
  forum_posts: string[],
  liked_posts: string[],
  alcohol_usage_amount?: number,
  alcohol_exceed_rate?: number,
  alcohol_advice?: string[]
}

export const defaultUserInfoAtom: User = {
  alcohol_history: undefined,
  forum_posts: [],
  id: "",
  username: "",
  password: "",
  email: "",
  age: -1,
  gender: 3,
  is_tobacco_user: false,
  tobacco_length: 0,
  tobacco_reset_time: undefined,
  is_alcohol_user: false,
  alcohol_length: 0,
  alcohol_reset_time: undefined,
  alcohol_usage_amount: 0,
  alcohol_exceed_rate: 0,
  alcohol_advice: [],
  liked_posts: []
};

export const curUserInfoAtom = atom({
  key: "curUserInfoAtom",
  default: defaultUserInfoAtom,
  effects_UNSTABLE: [persistAtom],
});