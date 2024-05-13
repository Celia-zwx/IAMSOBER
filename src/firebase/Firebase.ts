import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/functions';
import 'firebase/compat/analytics';
import 'firebase/compat/firestore';

const firebaseConfig = require('./firebaseConfig.json');
let app = Firebase.initializeApp(firebaseConfig);

Firebase.analytics();

export const Analytics = Firebase.analytics;
export const Auth = Firebase.auth;
export const Functions = Firebase.functions;
export const FireStore = Firebase.firestore;
export const db = Firebase.firestore(app);