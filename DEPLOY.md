# Guía de Despliegue a Vercel

## Pasos para Desplegar

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
git init  # Si no está inicializado
git add .
git commit -m "Initial commit"
```

### 2. Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub/GitLab/Bitbucket
3. Importa tu repositorio

### 3. Configurar el Proyecto en Vercel

1. En el dashboard de Vercel, haz clic en "Add New Project"
2. Selecciona tu repositorio
3. Vercel detectará automáticamente que es un proyecto Next.js
4. Configuración recomendada:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)
   - **Install Command**: `npm install` (automático)

### 4. Variables de Entorno

**IMPORTANTE:** Configura la clave admin para poder editar players.json:

1. Ve a Settings → Environment Variables
2. Agrega una nueva variable:
   - **Name**: `ADMIN_KEY`
   - **Value**: Una clave secreta segura (ej: `mi-clave-super-secreta-123`)
   - **Environment**: Production, Preview, Development (marca todas)
3. Haz clic en "Save"
4. **Redeploy** el proyecto para que la variable tome efecto

### 5. Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el build
3. Tu aplicación estará disponible en `tu-proyecto.vercel.app`

### 6. Configuración de Dominio Personalizado (Opcional)

1. Ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Archivos de Datos en Vercel

### Importante sobre `/data`

Los archivos en `/data` (players.json, ciphers.json) se crean automáticamente cuando las APIs se ejecutan por primera vez. Sin embargo:

- **En Vercel**: Los archivos se crean en el filesystem del servidor
- **Persistencia**: Los archivos persisten entre deployments pero se reinician si el servidor se reinicia
- **Para producción**: Considera usar una base de datos (Vercel Postgres, MongoDB, etc.) para datos persistentes

### Editar players.json en Vercel

**Vercel es serverless - NO hay acceso SSH directo.** Usa el endpoint admin:

#### Opción 1: Script CLI Admin (Recomendado)

1. **Configura `ADMIN_KEY` en Vercel** (ver paso 4 arriba)

2. **Usa el script desde tu máquina local:**
   ```bash
   # Listar todos los jugadores
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js list https://tu-app.vercel.app

   # Cambiar nivel de un jugador
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js set https://tu-app.vercel.app <playerId> <nivel>

   # Renombrar jugador
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js rename https://tu-app.vercel.app <playerId> "Nuevo Nombre"

   # Eliminar jugador
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js delete https://tu-app.vercel.app <playerId>
   ```

#### Opción 2: Usar curl o Postman

```bash
# Listar jugadores
curl -H "Authorization: Bearer tu-clave-secreta" \
  https://tu-app.vercel.app/api/admin/players

# Actualizar jugador
curl -X POST \
  -H "Authorization: Bearer tu-clave-secreta" \
  -H "Content-Type: application/json" \
  -d '{"playerId":"player-123","currentLevel":5}' \
  https://tu-app.vercel.app/api/admin/players
```

#### Opción 3: Script Local (Solo desarrollo)

El script `edit-players.js` solo funciona localmente. Para producción usa la Opción 1.

## Notas Importantes

1. **players.json está en .gitignore**: Esto es correcto para desarrollo local, pero significa que no se subirá al repo. En Vercel se creará automáticamente.

2. **Para producción real**: Considera migrar a una base de datos:
   - Vercel Postgres (recomendado)
   - MongoDB Atlas
   - Supabase
   - PlanetScale

3. **Build y Deploy**: Vercel detecta automáticamente cambios en tu repo y redeploya.

4. **Logs**: Puedes ver logs en tiempo real en el dashboard de Vercel → Deployments → [tu deployment] → Logs

## Comandos Útiles

```bash
# Ver logs locales
npm run dev

# Build local para probar
npm run build
npm start

# Verificar antes de deployar
npm run lint
```

## Troubleshooting

### Error: "Cannot find module"
- Asegúrate de que `package.json` tenga todas las dependencias
- Ejecuta `npm install` localmente para verificar

### Error: "Build failed"
- Revisa los logs en Vercel dashboard
- Verifica que no haya errores de TypeScript: `npm run lint`

### Los datos no persisten
- Los archivos en `/data` pueden resetearse en Vercel
- Considera migrar a una base de datos para producción

