# Mystic Explorers - Frontend

Client web interface built with React 19, TypeScript, TailwindCSS, and Vite.

## Quickstart & Execution

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   The `.env` file points to the backend API:
   ```env
   VITE_API_URL=http://localhost:8001/api/v1
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at [http://localhost:5173/](http://localhost:5173/) (or the next available port like `5174`).

---

## Compilación Web & Android (APK / Capacitor)

### Compilación Rápida (En un solo comando)
Ejecuta la compilación web, sincroniza assets y genera el APK de depuración directamente:
```bash
npm run build:android
```
El APK generado estará en:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Compilación Paso a Paso (CLI / Terminal)

1. **Compilar el Frontend Web**:
   ```bash
   npm run build
   ```
2. **Sincronizar con el proyecto nativo de Android**:
   ```bash
   npx cap sync android
   ```
3. **Compilar el APK con Gradle**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

4. **Instalar el APK en un dispositivo físico conectado por USB**:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

---

### Compilación Vía Android Studio (GUI)
Si prefieres usar la interfaz visual de Android Studio:
```bash
npx cap open android
```
- Espera la sincronización de Gradle.
- Selecciona **Build > Build Bundle(s) / APK(s) > Build APK(s)** o presiona el botón **Run** para desplegar en tu emulador/teléfono.

> [!TIP]
> Para la configuración de variables de entorno (`JAVA_HOME`, `ANDROID_HOME`) y la configuración de IP de red para el backend, consulta la [Guía de Compilación Móvil](file:///var/www/html/ME_frontend/docs/mobile_build_guide.md).

---


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
