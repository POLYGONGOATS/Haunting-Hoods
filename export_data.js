const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Parse .env.local
let envRaw = '';
try {
    envRaw = fs.readFileSync('.env.local', 'utf8');
} catch (e) {
    console.error("Could not find .env.local");
    process.exit(1);
}

const env = {};
envRaw.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportData() {
  console.log('Fetching whitelist claims from Firestore...');
  try {
    const querySnapshot = await getDocs(collection(db, 'whitelist_claims'));
    const claims = [];
    querySnapshot.forEach((doc) => {
      claims.push({ id: doc.id, ...doc.data() });
    });
    
    fs.writeFileSync('whitelist_claims.json', JSON.stringify(claims, null, 2));
    console.log(`Successfully exported ${claims.length} claims to whitelist_claims.json`);
    
    if (claims.length > 0) {
      const keys = ['twitterHandle', 'walletAddress', 'quoteTweetLink', 'claimNumber', 'createdAt'];
      const csv = [
        keys.join(','),
        ...claims.map(c => keys.map(k => {
           let val = c[k] || '';
           if (k === 'createdAt' && val && val.seconds) {
              val = new Date(val.seconds * 1000).toISOString();
           }
           return `"${val.toString().replace(/"/g, '""')}"`;
        }).join(','))
      ].join('\n');
      fs.writeFileSync('whitelist_claims.csv', csv);
      console.log('Successfully created whitelist_claims.csv');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

exportData();
