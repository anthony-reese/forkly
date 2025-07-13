// functions/src/index.ts
import { defineSecret } from 'firebase-functions/params';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PromoEmail } from './templates/PromoEmail';
import * as admin from 'firebase-admin';
import React from 'react';
import webpush from 'web-push';
import { Expo } from 'expo-server-sdk';

const resendApiKey = defineSecret('RESEND_KEY');
const webPushPublicKey = defineSecret('WEB_PUSH_PUBLIC_KEY');
const webPushPrivateKey = defineSecret('WEB_PUSH_PRIVATE_KEY');

admin.initializeApp();

const expo = new Expo();

export const emailPromo = onDocumentCreated(
  {
    document: 'wishlists/{uid}/items/{bizId}',
    region: 'us-central1',
    secrets: [resendApiKey, webPushPublicKey, webPushPrivateKey],
  },
  async (event) => {
    const { uid, bizId } = event.params;

    webpush.setVapidDetails(
      'mailto:support@forkly.app',
      webPushPublicKey.value(),
      webPushPrivateKey.value()
    );

    const itemRef = admin.firestore().doc(`wishlists/${uid}/items/${bizId}`);
    const itemSnap = await itemRef.get();
    const lastNotified = itemSnap.get('lastNotified');

    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    const name = userDoc.get('name') || 'Friend';
    const email = userDoc.get('email') as string | undefined;
    const expoToken = userDoc.get('expoPushToken') as string | undefined;
    const webPushSubscription = userDoc.get('webPushSubscription') as webpush.PushSubscription | undefined;

    const resend = new Resend(resendApiKey.value());

    if (lastNotified) {
      console.log(`Already notified for ${bizId}, skipping.`);
      return;
    }

    try {
      if (email) {
        const emailHtml = await render(React.createElement(PromoEmail, { name, bizName: bizId }));
        await resend.emails.send({
          from: 'Forkly <promos@forkly.app>',
          to: email,
          subject: `🎉 New deal on ${bizId}`,
          html: emailHtml,
        });
        console.log(`Email promo sent to ${email} for ${bizId}`);
      } else {
        console.error(`No email found for user ${uid}, skipping email promo.`);
      }

      if (expoToken && Expo.isExpoPushToken(expoToken)) {
        await expo.sendPushNotificationsAsync([
          {
            to: expoToken,
            sound: 'default',
            title: `🍽️ New deal on ${bizId}`,
            body: 'Check your wishlist for a new restaurant promo!',
            data: { url: `https://forkly.app/wishlist?bizId=${bizId}` },
          },
        ]);
        console.log(`Expo push notification sent to ${uid} for ${bizId}`);
      } else {
        console.log(`No valid Expo token found for user ${uid}, skipping Expo push.`);
      }

      if (webPushSubscription) {
        try {
          await webpush.sendNotification(
            webPushSubscription,
            JSON.stringify({
              title: `🍽️ New deal on ${bizId}`,
              body: 'Check your wishlist for a new restaurant promo!',
              icon: 'https://forkly.app/icon.png',
              url: `https://forkly.app/wishlist?bizId=${bizId}`, 
            })
          );
          console.log(`Web push notification sent to ${uid} for ${bizId}`);
        } catch (webPushError) {
          if (webPushError instanceof webpush.WebPushError && webPushError.statusCode === 410) {
            console.warn(`Web Push subscription for ${uid} is expired. Removing.`);
          } else {
            console.error(`Failed to send Web Push to ${uid}:`, webPushError);
          }
        }
      } else {
        console.log(`No Web Push subscription found for user ${uid}, skipping web push.`);
      }

       await itemRef.update({
        lastNotified: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (error) {
      console.error('Failed to process promo notification:', error);
    }
  }
);
