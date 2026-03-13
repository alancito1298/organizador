'use client';

import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    fetch('https://backend-organizador.vercel.app/test')
      .then(res => {
        console.log('STATUS:', res.status);
        return res.text();
      })
      .then(data => console.log('BODY:', data))
      .catch(err => console.error('ERROR:', err));
  }, []);

  return <h1>Mirá la consola</h1>;
}