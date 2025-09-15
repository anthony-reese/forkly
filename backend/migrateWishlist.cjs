/**
 * Migration script to update wishlist items to include full Foursquare data
 * and remove reliance on old Yelp /restaurants collection.
 */

const admin = require("firebase-admin");
const fetch = require("node-fetch");
const fs = require("fs");

const keyPath = process.env.FIREBASE_ADMIN_KEY_PATH || "backend/serviceAccountKey.json";
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

async function migrateWishlist() {
  const usersSnap = await db.collection("wishlists").get();

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    console.log(`Processing wishlist for user: ${uid}`);

    const itemsSnap = await db.collection(`wishlists/${uid}/items`).get();

    for (const itemDoc of itemsSnap.docs) {
      const bizId = itemDoc.id;

      const currentData = itemDoc.data();
      if (currentData.name && currentData.migratedAt) {
        console.log(`Skipping ${bizId}, already migrated`);
        continue;
      }

      console.log(`Migrating wishlist item ${bizId} for user ${uid}`);

      const url = `https://places-api.foursquare.com/places/${bizId}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
          "X-Places-Api-Version": "2025-06-17",
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch ${bizId} from Foursquare:`, res.status);
        continue;
      }

      const place = await res.json();

      const migratedData = {
        id: bizId,
        name: place.name || "Unknown",
        category: place.categories?.[0]?.name || "Unknown",
        rating: place.rating || 0,
        photoUrl: place.photos?.[0]?.prefix
          ? `${place.photos[0].prefix}original${place.photos[0].suffix}`
          : null,
        migratedAt: Date.now(),
      };

      await db.doc(`wishlists/${uid}/items/${bizId}`).set(migratedData, { merge: true });

      console.log(`Migrated wishlist item ${bizId} for user ${uid}`);
    }
  }

  console.log("Migration complete!");
}

migrateWishlist().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
