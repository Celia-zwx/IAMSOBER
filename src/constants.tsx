export enum ERROR {
  NO_ERROR = "No error",
  USERNAME_IN_USE = "The username is already taken",
  EMAIL_IN_USE = "The email is already in use",
  UNAUTHENTICATED = "User not signed in",
  UNAUTHORIZED_ACCESS = "Unauthorized access",
  PARAM_ERROR = "Invalid parameter(s)",
  NOT_FOUND = "Requested document not found",
  FIRESTORE_ERROR = "Firestore error"
}

export const BAC_EFFECT_MAPPING = new Map<string, string[]>([
  ["Light-headed", ["Relaxation", "Sensation of warmth", "Altered mood (\"high\")", "Minor impairment of judgment"]],
  ["Buzzed", ["Relaxation", "Euphoria", "Lower inhibitions", "Minor impairment of reasoning and memory", "Exaggerated emotions (both good and bad)"]],
  ["Legally impaired", ["Euphoria", "Fatigue", "Impairment in: Balance, Speech, Vision, Reaction time and hearing", "Judgment and self-control are impaired"]],
  ["Drunk" ,["\"High\" reduced", "Depressive effect more pronounced (anxiety, depression or unease)", "Gross motor impairment", "Judgment and perception severely impaired"]],
  ["Very drunk", ["Strong state of depression", "Nausea", "Disorientation", "Dizzy", "Increased motor impairment", "Blurred vision", "Judgment further impaired"]],
  ["Dazed and confused", ["Gross disorientation to time and place", "Increased nausea and vomiting", "May need assistance to stand/walk", "Impervious to pain", "Blackout likely"]],
  ["Stupor", ["All mental, physical and sensory functions are severely impaired", "Accidents very likely", "Little comprehension", "May pass out suddenly"]],
  ["Coma", ["Level of surgical amnesia", "Onset of coma", "Possibility of acute alcohol poisoning", "Death due to respiratory arrest is likely in 50% of drinkers"]]
]);

type PostTime = {
  _seconds: number,
  _nanoseconds: number
}

export type Post = {
  id?: string,
  user_id: string,
  username: string,
  is_alcohol_post: boolean,
  title: string,
  content: string,
  post_time: PostTime,
  liked: number
}