# 🚀 SETUP: PSF Inventario Dashboard

## Pasos completados

✅ Supabase (base de datos)
✅ Azure (credenciales)
- [ ] GitHub (subir código)
- [ ] Vercel (deploy)
- [ ] OneDrive (carpeta)
- [ ] Primera sincronización

---

## PASO 3: GITHUB

### 3.1 Descargar esta carpeta

1. Descarga la carpeta `psf-inventario` completa
2. Descomprime en tu máquina

### 3.2 Git - Primer deploy

Abre terminal en la carpeta y ejecuta:

```bash
git init
git config user.name "Raúl Landeros"
git config user.email "tu.email@psf.com.mx"
git remote add origin https://github.com/sanyul1979/psf-inventario.git
git add .
git commit -m "Initial commit: PSF Inventario Dashboard"
git branch -M main
git push -u origin main
```

*(Si pide autenticación, usa Personal Access Token de GitHub)*

---

## PASO 4: VERCEL

### 4.1 Conectar Vercel

1. Ve a https://vercel.com
2. Login con GitHub (sanyul1979)
3. "Add New" → "Project"
4. Busca y selecciona `psf-inventario`
5. Click "Import"

### 4.2 Agregar variables de entorno

En el formulario, agrega:

```
NEXT_PUBLIC_SUPABASE_URL = (de Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (de Supabase)
AZURE_CLIENT_ID = (de Azure)
AZURE_CLIENT_SECRET = (de Azure)
AZURE_TENANT_ID = (de Azure)
CRON_SECRET = psf_secret_2026_xyz (algo random)
```

6. Click "Deploy"
7. Espera 3-5 minutos

### 4.3 Configurar Cron Job

En Vercel (Settings → Crons):

```
Path: /api/sync-inventory
Schedule: 0 6 * * *  (6 AM todos los días)
Secret: CRON_SECRET
```

---

## PASO 5: ONEDRIVE

### 5.1 Crear carpeta

1. Office.com → OneDrive
2. Nueva carpeta: `PSF Inventario`
3. Exporta desde SAP como `PSF Inventario.xlsx`
4. Sube a esa carpeta

---

## PASO 6: PROBAR

1. Ve a `https://psf-inventario.vercel.app`
2. Debes ver el dashboard (vacío si no hay datos)
3. A las 6 AM se sincroniza automáticamente

---

## Variables de entorno (resumen)

Tu `.env.local` local (para dev):

```
NEXT_PUBLIC_SUPABASE_URL=https://eoefqncolbfvgzjjdflr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ni07UFjCrkXzMnXXQ2Y9BA_mg1HD...
AZURE_CLIENT_ID=a067210e-59f0-4cb5-b25f-3b8b18b182c0
AZURE_CLIENT_SECRET=(value del secret)
AZURE_TENANT_ID=70ae3a2d-aaad-424a-aa6d-7238fade46b2
CRON_SECRET=psf_secret_2026_xyz
```

---

Avísame cuando termines cada paso 👇
