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

### 1. Compilar el Frontend Web
Genera la carpeta de producción `dist/` optimizada:
```bash
npm run build
```

### 2. Sincronizar con el proyecto nativo de Android
Sincroniza los assets web hacia la carpeta nativa `android/`:
```bash
npx cap sync android
```

### 3. Generar el APK
- **Vía Android Studio**:
  ```bash
  npx cap open android
  ```
  O abre la carpeta `ME_frontend/android` en Android Studio y selecciona **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
- **Vía Línea de Comandos (con JDK y Android SDK configurados)**:
  ```bash
  cd android
  ./gradlew assembleDebug
  # El APK generado estará en: android/app/build/outputs/apk/debug/app-debug.apk
  ```

> [!TIP]
> Para más detalles sobre la configuración de red y la IP para dispositivos físicos o emuladores, consulta [mobile_build_guide.md](file:///var/www/html/ME_frontend/docs/mobile_build_guide.md).

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
