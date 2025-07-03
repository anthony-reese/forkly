import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function getBusinessCached(id: string) {
const ref = doc(db, 'restaurants', id);
const snap = await getDoc(ref);

if (snap.exists()) {
 const data = snap.data();
 if (Date.now() - data.lastFetched < TTL) return data; // fresh
}

// miss or stale → fetch Yelp
const res = await fetch(`https://api.yelp.com/v3/businesses/${id}`, {
 headers: { Authorization: `Bearer ${process.env.YELP_API_KEY!}` },
});
const json = await res.json();

await setDoc(ref, { ...json, lastFetched: Date.now() });
return json;
}