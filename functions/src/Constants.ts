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
  alcohol_history: Array<string>,
  forum_posts: Array<string>,
  liked_posts: Array<string>
}

export type Post = {
  id?: string,
  user_id: string,
  username: string,
  is_alcohol_post: boolean,
  title: string,
  content: string,
  post_time: Date,
  liked: number
}

export enum Gender {
  Male,
  Female,
  Not_Binary
}

export type Response = {
  resp: object | null,
  error: ERROR | null
}

export enum ERROR {
  NO_ERROR= "No error",
  USERNAME_IN_USE = "The username is already taken",
  EMAIL_IN_USE = "The email is already in use",
  UNAUTHENTICATED = "User not signed in",
  UNAUTHORIZED_ACCESS = "Unauthorized access",
  PARAM_ERROR = "Invalid parameter(s)",
  NOT_FOUND = "Requested document not found",
  FIRESTORE_ERROR = "Firestore error",
  INVALID_USERID = "UserId is invalid or not exists"
}