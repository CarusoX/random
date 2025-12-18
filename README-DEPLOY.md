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

## 📝 Editar players.json

### Opción 1: Script Local (Recomendado)

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

Luego haz commit y push:
```bash
git add data/players.json
git commit -m "Update players"
git push
```

### Opción 2: Editar Manualmente

1. Edita `data/players.json` localmente
2. Haz commit y push
3. Vercel redeployará automáticamente

## ⚠️ Importante

- `players.json` está en `.gitignore` - se crea automáticamente en Vercel
- Los datos persisten entre deployments pero pueden resetearse si el servidor se reinicia
- Para producción real, considera usar una base de datos (Vercel Postgres, MongoDB, etc.)

## 📚 Documentación Completa

Ver `DEPLOY.md` para más detalles.

