import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCBmSOZHcPXqAfx9SIbqrLOul3P08mTbk",
  authDomain: "haunting-hoods.firebaseapp.com",
  projectId: "haunting-hoods",
  storageBucket: "haunting-hoods.firebasestorage.app",
  messagingSenderId: "321088190803",
  appId: "1:321088190803:web:125a7461f71f8e067ec9a6",
  measurementId: "G-RTXWBYZVQ2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seed = async () => {
    const campaignId = "2026-08-31";
    await setDoc(doc(db, "whitelist_campaigns", campaignId), {
        slotsTotal: 444,
        claimedCount: 0,
        active: true
    });
    console.log("Seeded database!");
    process.exit(0);
};

seed().catch(console.error);
