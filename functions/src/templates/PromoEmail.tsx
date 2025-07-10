// src/emplates/PromoEmail.tsx
// Resend’s React-email runtime
import { Html, Body, Container } from '@react-email/components';

export function PromoEmail({ name, bizName }: { name: string; bizName: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <h2>🍽️ New deal on {bizName}</h2>
          <p>Hi {name || 'there'},</p>
          <p>You saved <strong>{bizName}</strong> to your Forkly wishlist.</p>
          <a href="https://forkly.app/wishlist">View my wishlist</a>
        </Container>
      </Body>
    </Html>
  );
}