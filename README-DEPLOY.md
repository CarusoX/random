# 🚀 Despliegue Rápido a Vercel

## Pasos Rápidos

1. **Sube tu código a GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Ve a [vercel.com](https://vercel.com) y haz login**

3. **Importa tu repositorio**
   - Click "Add New Project"
   - Selecciona tu repo
   - Vercel detectará Next.js automáticamente
   - Click "Deploy"

4. **¡Listo!** Tu app estará en `tu-proyecto.vercel.app`

## 📝 Editar players.json en Vercel

### Opción 1: API Admin (Recomendado para producción)

1. **Configura la clave admin en Vercel:**
   - Ve a Settings → Environment Variables
   - Agrega: `ADMIN_KEY` = `tu-clave-secreta-muy-segura`
   - Redeploy

2. **Usa el script CLI:**
   ```bash
   # Listar jugadores
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js list https://tu-app.vercel.app

   # Cambiar nivel
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js set https://tu-app.vercel.app <playerId> <nivel>

   # Renombrar
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js rename https://tu-app.vercel.app <playerId> "Nuevo Nombre"

   # Eliminar
   ADMIN_KEY=tu-clave-secreta node scripts/admin-cli.js delete https://tu-app.vercel.app <playerId>
   ```

### Opción 2: Script Local (Solo desarrollo)

```bash
# Listar jugadores
node scripts/edit-players.js list

# Cambiar nivel de un jugador
node scripts/edit-players.js set <playerId> <nivel>

# Renombrar jugador
node scripts/edit-players.js rename <playerId> "Nuevo Nombre"

# Eliminar jugador
node scripts/edit-players.js delete <playerId>
```

**Nota:** Este script solo funciona localmente. Para producción usa la Opción 1.

## ⚠️ IMPORTANTE: Configurar Vercel KV

**Vercel tiene filesystem de solo lectura.** Debes configurar Vercel KV antes de deployar:

1. En Vercel Dashboard → Tu Proyecto → Settings → Storage
2. Click "Create Database" → Selecciona "KV" (Redis)
3. Sigue las instrucciones (Vercel agregará automáticamente las variables de entorno)
4. **Redeploy** el proyecto

Sin KV configurado, las APIs de escritura fallarán con error "read-only file system".

**En desarrollo local:** El código usa filesystem automáticamente si KV no está configurado.

## 📚 Documentación Completa

Ver `DEPLOY.md` para más detalles.

