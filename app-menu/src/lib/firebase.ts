import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCApo2zZC0DXgo36C3xy62H3Jq9DIQJ5uE',
  authDomain: 'pastapanna-36a1d.firebaseapp.com',
  projectId: 'pastapanna-36a1d',
  storageBucket: 'pastapanna-36a1d.firebasestorage.app',
  messagingSenderId: '198666832551',
  appId: '1:198666832551:web:dc779deea85c5aceef2982',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
