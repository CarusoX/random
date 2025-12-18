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

### 4. Configurar Redis (Base de Datos)

**CRÍTICO:** Vercel tiene un filesystem de solo lectura. Necesitas configurar Redis para almacenar datos:

**Opción A: Vercel KV (Recomendado)**
1. En el Dashboard de Vercel → Tu proyecto → Settings → Storage
2. Click "Create Database" → Selecciona "KV" (Redis)
3. Vercel agregará automáticamente las variables de entorno

**Opción B: Redis externo (Redis Labs, Upstash, etc.)**
1. Crea una cuenta en un proveedor de Redis (Redis Labs, Upstash, etc.)
2. Crea una base de datos Redis
3. Obtén la URL de conexión (formato: `redis://...`)
4. En Vercel → Settings → Environment Variables:
   - Agrega `REDIS_URL` con tu URL de Redis
   - Marca Production, Preview, Development

**Redeploy** el proyecto para que las variables tomen efecto.

**Nota:** En desarrollo local, el código usará filesystem automáticamente si `REDIS_URL` no está configurado.

### 5. Variables de Entorno Adicionales

**Configura la clave admin para poder editar players.json:**

1. Ve a Settings → Environment Variables
2. Agrega una nueva variable:
   - **Name**: `ADMIN_KEY`
   - **Value**: Una clave secreta segura (ej: `mi-clave-super-secreta-123`)
   - **Environment**: Production, Preview, Development (marca todas)
3. Haz clic en "Save"
4. **Redeploy** el proyecto para que la variable tome efecto

### 6. Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el build
3. Tu aplicación estará disponible en `tu-proyecto.vercel.app`

### 7. Configuración de Dominio Personalizado (Opcional)

1. Ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar DNS

## Almacenamiento de Datos

### Redis (Producción)

El proyecto usa **Redis** para almacenar datos en producción:
- **Players**: Se almacenan en Redis con la clave `players`
- **Ciphers**: Se almacenan en Redis con la clave `ciphers`
- **Persistencia**: Los datos persisten permanentemente en Redis
- **Rendimiento**: Muy rápido, perfecto para serverless
- **Configuración**: Usa la variable de entorno `REDIS_URL`

### Filesystem (Desarrollo Local)

En desarrollo local (sin variables de KV configuradas), el código usa automáticamente el filesystem:
- Los archivos se guardan en `/data/players.json` y `/data/ciphers.json`
- Funciona perfectamente para desarrollo y testing

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

#### Opción 3: Script Local (Desarrollo o Producción con Redis)

El script `edit-players.js` funciona tanto localmente como con Redis:

**Con Redis (producción o desarrollo):**
```bash
# Configura REDIS_URL
export REDIS_URL="redis://default:password@host:port"

# Listar jugadores
node scripts/edit-players.js list

# Cambiar nivel
node scripts/edit-players.js set <playerId> <nivel>

# Renombrar
node scripts/edit-players.js rename <playerId> "Nuevo Nombre"

# Eliminar
node scripts/edit-players.js delete <playerId>
```

**Sin Redis (solo desarrollo local):**
```bash
# Funciona igual, pero usa el archivo local data/players.json
node scripts/edit-players.js list
```

**Nota:** El script detecta automáticamente si `REDIS_URL` está configurado y usa Redis. Si no, usa el filesystem local.

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
- **Con Redis configurado**: Los datos persisten en Redis, no hay problema
- **Sin Redis**: Los archivos en `/data` pueden resetearse en Vercel (filesystem de solo lectura)
- **Solución**: Configura `REDIS_URL` en Vercel (ver paso 4 arriba)

