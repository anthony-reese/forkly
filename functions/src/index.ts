// functions/src/index.ts
import React from 'react';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PromoEmail } from './templates/PromoEmail';

admin.initializeApp();

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailPromo = onDocumentCreated('wishlists/{uid}/items/{bizId}', async (event) => {
  const { uid, bizId } = event.params;

  const userDoc = await admin.firestore().doc(`users/${uid}`).get();
  const email = userDoc.get('email') as string;

  const emailHtml = await render(React.createElement(PromoEmail, { name: 'Friend', bizName: bizId }));

  await resend.emails.send({
    from: 'Forkly <promos@forkly.app>',
    to: email,
    subject: 'You have a new restaurant promo!',
    html: emailHtml,
  });
});