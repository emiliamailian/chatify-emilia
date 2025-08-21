# chatify-emilia

Minimal React + Vite-klient för Chatify-API:t.

## Kom igång

```bash
npm install
npm run dev  # lokalt
npm run build && npm run preview  # producera build lokalt
```

## Deploy på Netlify

Build settings:
- Base directory: (tom)
- Build command: `npm run build`
- Publish directory: `dist`

## Säkerhet & auth
- CSP i `index.html`
- CSRF hämtas via PATCH `/csrf` och skickas med `X-CSRF-Token`
- JWT decode i Login sparar `user` i localStorage
- DOMPurify sanerar meddelanden
