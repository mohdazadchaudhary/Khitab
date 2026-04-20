import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Section, Container } from '../components/Layout';

export function Splash() {
  const navigate = useNavigate();

  return (
    <Section background="low" className="min-h-screen flex flex-col justify-center items-center text-center">
      <Container>
        <Typography variant="label" className="mb-4 block tracking-widest text-secondary">
          The Digital Heirloom
        </Typography>
        <Typography variant="headline" className="mb-6 font-serif text-5xl md:text-7xl">
          Write. Wait. Wonder.
        </Typography>
        <Typography variant="body" className="max-w-xl mx-auto mb-10 text-on-surface-variant text-lg">
          Experience the lost art of letter writing. Words travel slowly across the globe, arriving when they are meant to.
        </Typography>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate('/signup')}>
            Start Writing
          </Button>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Unlock Letters
          </Button>
        </div>
      </Container>
    </Section>
  );
}
