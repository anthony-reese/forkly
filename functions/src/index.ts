// functions/src/index.ts
import { defineSecret } from 'firebase-functions/params';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PromoEmail } from './templates/PromoEmail';
import * as admin from 'firebase-admin';
import React from 'react';

const resendApiKey = defineSecret('RESEND_KEY');
admin.initializeApp();

export const emailPromo = onDocumentCreated(
  {
    document: 'wishlists/{uid}/items/{bizId}',
    region: 'us-central1',
    secrets: [resendApiKey],
  },
  async (event) => {
    const { uid, bizId } = event.params;
    const itemRef = admin.firestore().doc(`wishlists/${uid}/items/${bizId}`);
    const itemSnap = await itemRef.get();
    const lastNotified = itemSnap.get('lastNotified');
    if (lastNotified) {
      console.log(`Already notified for ${bizId}, skipping.`);
      return;
    }

    const userDoc = await admin.firestore().doc(`users/${uid}`).get();
    const email = userDoc.get('email') as string;

    const emailHtml = await render(
      React.createElement(PromoEmail, { name: 'Friend', bizName: bizId })
    );

    const resend = new Resend(resendApiKey.value());

  try {
    await resend.emails.send({
      from: 'Forkly <promos@forkly.app>',
      to: email,
      subject: `🎉 New deal on ${bizId}`,
      html: emailHtml,
    });

    await itemRef.update({
        lastNotified: admin.firestore.FieldValue.serverTimestamp(),
    });

      console.log(`Promo sent to ${email} for ${bizId}`);
    } catch (error) {
      console.error('Failed to send promo:', error);
    }
  }
);
