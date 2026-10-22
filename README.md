# Carlos Carballo · Portafolio con mini-CMS

Portafolio personal en modo oscuro con un panel `/admin` protegido por PIN que edita el contenido en tiempo real sobre Firestore.

**Stack:** React 19 + Vite · Tailwind CSS v4 · Framer Motion · React Router · Firebase (Hosting, Firestore, Auth anónimo).

- **Sitio:** https://carlos-carballo-awesome-resume.web.app
- **Diseño en Figma** (tokens, estilos de texto y página desktop): https://www.figma.com/design/mXS81Jd12LtRPHD2zFnuUz

## Correr en local

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```

Sin credenciales de Firebase en `.env` el sitio corre en **modo local**: el contenido se guarda en `localStorage` y el PIN de `/admin` es `VITE_ADMIN_PIN` (por defecto `2468`). Así puedes diseñar y cargar contenido antes de tocar Firebase.

## Conectar Firebase (proyecto `carlos-carballo-awesome-resume`)

1. Consola de Firebase → Configuración del proyecto → *Tus apps* → añade una app **Web** y copia el `firebaseConfig` a `.env` (`VITE_FIREBASE_*`).
2. **Firestore** → crea la base de datos en modo producción.
3. **Authentication** → Métodos de acceso → habilita **Anónimo**.
4. Despliega reglas y crea el PIN + semilla:

```bash
firebase login
firebase use carlos-carballo-awesome-resume
firebase deploy --only firestore:rules
node scripts/seed-firestore.mjs        # primera vez: crea config/admin con un PIN y publica la semilla
node scripts/seed-firestore.mjs 123456 # después: pasa el PIN actual para republicar la semilla
npm run deploy                          # build + hosting + reglas
```

5. Entra a `https://<tu-sitio>.web.app/admin` con el PIN. Para cambiarlo: pestaña **Ajustes**.

### Cómo funciona el PIN

- El cliente inicia sesión anónima y escribe `unlock/{uid}` con el PIN.
- Las reglas de Firestore solo aceptan esa escritura si `sha256(pin)` coincide con `config/admin.pinHash` (documento no legible desde el cliente).
- `config/admin` solo puede crearse una vez (bootstrap) y solo puede actualizarse desde una sesión ya desbloqueada.
- Escribir `portfolio/main` exige que exista `unlock/{uid}`.
- El PIN nunca viaja en el bundle ni se guarda en documentos públicos. Usa una frase de 8+ caracteres; para producción seria cambia el gate por Firebase Auth con email/contraseña.

## Estructura

```
src/
  data/schema.ts        Tipos del documento Firestore `portfolio/main`
  data/seed.ts          Contenido inicial (placeholders marcados [EDITAR])
  tokens.css            Tokens de diseño (color, escala φ, espaciado, utilidades)
  lib/firebase.ts       Inicialización condicional de Firebase
  lib/content.ts        Suscripción en tiempo real + guardado (Firestore o local)
  lib/admin.ts          Desbloqueo por PIN
  components/           Hero, Experience, Skills, Projects, About, Footer, Nav
  components/admin/     PinGate, Editor, primitivas de formulario
  pages/                Home (/) y Admin (/admin)
firestore.rules         Reglas de seguridad
firebase.json           Hosting SPA + emuladores
```

## Principios de diseño aplicados

| Principio | Implementación |
|---|---|
| Jerarquía tipográfica | Escala modular φ (1.618) desde 16 px: 12 · 16 · 20 · 26 · 42 · 68 px, Inter + JetBrains Mono |
| Espacio negativo | `--spacing-macro` (96 px) entre secciones, `--spacing-gutter` (24 px) y `--spacing-micro` (12 px) dentro de componentes |
| Gestalt · Proximidad | Stack y skills agrupados en pastillas pegadas a su contexto |
| Gestalt · Región común | Cada proyecto, experiencia y hobby vive en una `card` con borde y fondo propios |
| Color y contraste | Fondo `#0B0F14`, texto `#E8EDF2` (16.9:1), acento `#2DD4BF` (11.5:1), texto secundario `#A3B0BF` (9.1:1): todo AAA |
| Movimiento | Entradas `fadeUp` al entrar en viewport, `prefers-reduced-motion` respetado |
