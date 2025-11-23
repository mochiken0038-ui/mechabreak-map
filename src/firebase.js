// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ↓ 自分の Firebase プロジェクト設定をここに貼る
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
