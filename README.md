# Mini CTF Mobile (Next.js 15)

Infraestructura lista para un mini-CTF de 10 niveles orientado a mobile con App Router y despliegue en Vercel.

## Requisitos
- Node.js 18+
- npm o pnpm

## Scripts
- `npm run dev` – entorno local
- `npm run build` – build de producción
- `npm run start` – servidor de producción
- `npm run lint` – linting

## Estructura
```
/app
  /level/[id]
  /complete
  /api/check
/components
/lib
/hooks
/public/puzzles.json
```

## Añadir puzzles
Edita `public/puzzles.json` manteniendo el formato:
```json
{
  "id": 1,
  "title": "Nombre",
  "prompt": "Descripción del puzzle",
  "answer": "respuesta",
  "hint": "opcional"
}
```

## Deploy en Vercel
1. Haz fork/clone del repositorio y sube los cambios a GitHub.
2. En Vercel, crea un nuevo proyecto importando el repositorio.
3. Usa la configuración por defecto de Next.js (no requiere servidores adicionales).
4. Variable de entorno: ninguna es obligatoria; los niveles se leen desde `public/puzzles.json`.
5. Click en **Deploy**. Las rutas `/`, `/level/[id]`, `/complete` y la API `/api/check` quedarán activas.

El progreso de usuario se almacena en `localStorage`, por lo que no se necesita base de datos.
