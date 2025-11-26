# Banca Henar Corporate Portal

Portal web corporativo para la gestión bancaria empresarial de Banca Henar (BHNR).

## 📋 Requisitos Previos

### Node.js y npm

Este proyecto requiere **Node.js** (versión 18.x o superior) y **npm** (viene incluido con Node.js).

#### Instalación en Linux (Ubuntu/Debian)

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js v20 (LTS recomendado)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debería mostrar v20.x.x
npm --version   # Debería mostrar 10.x.x
```

#### Instalación en Ubuntu WSL (Windows Subsystem for Linux)

Si estás usando Ubuntu en WSL dentro de Windows, sigue estos pasos:

```bash
# Abrir Ubuntu desde el menú de Windows o Terminal
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version

# IMPORTANTE: Asegúrate de trabajar en el sistema de archivos de WSL
# (no en /mnt/c/...) para mejor rendimiento
cd ~
pwd  # Debería mostrar /home/tu-usuario
```

**Recomendaciones para WSL:**

- Trabaja en el sistema de archivos de Linux (`/home/tu-usuario`) en lugar del montaje de Windows (`/mnt/c/`) para mejor rendimiento
- Usa Windows Terminal para una mejor experiencia
- Puedes acceder a los archivos de WSL desde Windows en: `\\wsl$\Ubuntu\home\tu-usuario`

#### Instalación en macOS

##### Opción 1: Usando Homebrew (recomendado)

```bash
# Instalar Homebrew si no lo tienes
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node@20

# Verificar instalación
node --version
npm --version
```

##### Opción 2: Descarga directa

- Visita [nodejs.org](https://nodejs.org/)
- Descarga el instalador LTS para macOS
- Ejecuta el instalador .pkg

#### Instalación en Windows

##### Opción 1: Descarga directa (recomendado)

- Visita [nodejs.org](https://nodejs.org/)
- Descarga el instalador LTS para Windows (.msi)
- Ejecuta el instalador y sigue las instrucciones
- Reinicia el terminal después de la instalación

##### Opción 2: Usando Chocolatey

```powershell
# En PowerShell como Administrador
choco install nodejs-lts
```

##### Opción 3: Usando Winget

```powershell
winget install OpenJS.NodeJS.LTS
```

### Angular CLI

Una vez instalado Node.js, instala Angular CLI globalmente:

```bash
npm install -g @angular/cli@18
```

Verifica la instalación:

```bash
ng version
```

---

## 🚀 Instalación del Proyecto

### 1. Clonar el repositorio (si aplica)

```bash
git clone <repository-url>
cd banca-henar-project/cnt_frontend/bhnr-portal
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo:

- Angular 18
- Tailwind CSS
- RxJS
- Y otras librerías necesarias

---

## 🏃 Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm start
```

O alternativamente:

```bash
ng serve
```

La aplicación estará disponible en: **<http://localhost:4200>**

#### Opciones útiles

```bash
# Abrir automáticamente en el navegador
npm start -- --open

# Ejecutar en un puerto diferente
npm start -- --port 4300

# Modo watch (recarga automática)
npm start -- --watch
```

### Modo Producción

```bash
# Construir para producción
npm run build

# Los archivos compilados estarán en dist/bhnr-portal/browser/
```

---

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests end-to-end
npm run e2e
```

---

## 📁 Estructura del Proyecto

```text
bhnr-portal/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios, guards, modelos core
│   │   │   ├── guards/        # Route guards (auth.guard.ts)
│   │   │   ├── models/        # Modelos de datos
│   │   │   └── services/      # Servicios (auth.service.ts)
│   │   ├── features/          # Módulos de funcionalidades
│   │   │   ├── dashboard/     # Panel de control corporativo
│   │   │   ├── onboarding/    # Wizard de alta de empresas
│   │   │   └── public/        # Páginas públicas (landing, login)
│   │   ├── layouts/           # Layouts (public-layout, dashboard-layout)
│   │   └── shared/            # Componentes compartidos
│   ├── styles.css             # Estilos globales + Tailwind
│   └── index.html             # HTML principal
├── public/                    # Archivos estáticos (imágenes, logos)
├── angular.json               # Configuración de Angular
├── tailwind.config.js         # Configuración de Tailwind CSS
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias del proyecto
```

---

## 🎨 Tecnologías Utilizadas

- **Framework:** Angular 18 (standalone components)
- **Estilos:** Tailwind CSS 3.4
- **Lenguaje:** TypeScript 5.5
- **Build:** Angular CLI + Vite
- **Estado:** Angular Signals (sin NgRx)

---

## 🔧 Scripts Disponibles

```json
{
  "start": "ng serve",                    // Servidor de desarrollo
  "build": "ng build",                    // Build de producción
  "watch": "ng build --watch",            // Build en modo watch
  "test": "ng test",                      // Tests unitarios
  "lint": "ng lint",                      // Linter
  "format": "prettier --write \"src/**/*.{ts,html,css}\""  // Formatear código
}
```

---

## 🌐 URLs de la Aplicación

| Ruta | Descripción |
|------|-------------|
| `/` o `/home` | Landing page pública |
| `/auth/login` | Pantalla de login |
| `/app/dashboard` | Panel corporativo (requiere auth) |
| `/create-account` | Wizard de alta de empresas (requiere auth) |

---

## 🐛 Solución de Problemas

### Error: `command not found: node` o `command not found: npm`

- Asegúrate de haber instalado Node.js correctamente
- Reinicia la terminal después de la instalación
- Verifica la variable PATH

### Error: `npm install` falla con permisos

**Linux/macOS:**

```bash
sudo chown -R $USER:$USER ~/.npm
npm cache clean --force
npm install
```

### Vulnerabilidades en `npm install`

Es normal ver algunas vulnerabilidades leves. Para corregirlas:

```bash
# Corregir vulnerabilidades sin breaking changes
npm audit fix

# Ver detalles
npm audit
```

### Puerto 4200 ya en uso

```bash
# Matar el proceso en el puerto 4200
# Linux/macOS
lsof -ti:4200 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process

# O usar otro puerto
npm start -- --port 4300
```

### Error: `Cannot find module '@angular/core'`

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Soporte

Para problemas o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

## 📄 Licencia

Proyecto privado - Banca Henar © 2025

---

## 📚 Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Node.js Official Site](https://nodejs.org)
- [Angular CLI Reference](https://angular.dev/tools/cli)
