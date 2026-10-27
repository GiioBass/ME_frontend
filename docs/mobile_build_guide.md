# Guía de Compilación Móvil Android (Capacitor)

Esta guía detalla los requisitos, configuración de red y comandos para compilar la aplicación web en un **APK instalable para Android** usando **Capacitor 8**.

---

## 1. Requisitos del Sistema y Herramientas (Linux / Fedora)

Capacitor 8 requiere **Java 21** y las herramientas de compilación de Android (API 35 o 36).

### A. Java Development Kit (JDK 21)
El proyecto requiere JDK 21 (usamos Eclipse Temurin 21):
- Ubicación instalada: `~/.jdk/temurin-21`

### B. Android SDK & Herramientas de Línea de Comandos
- Ubicación instalada: `~/Android/Sdk`
- Componentes instalados:
  - `cmdline-tools/latest` (`sdkmanager`)
  - `platform-tools` (`adb`)
  - `platforms;android-36` y `platforms;android-35`
  - `build-tools;36.0.0` y `build-tools;35.0.0`

### C. Variables de Entorno
Deben estar presentes en tu archivo `~/.bashrc` (o `~/.zshrc`):

```bash
# Entorno de Compilación Android & Java 21
export JAVA_HOME="$HOME/.jdk/temurin-21"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

Para aplicar cambios en la terminal actual:
```bash
source ~/.bashrc
```

---

## 2. Configuración de Red para el Backend (`.env`)

> [!IMPORTANT]
> En un teléfono o emulador Android, `localhost` o `127.0.0.1` apunta al **propio dispositivo móvil**, no a tu computadora de desarrollo.

Configura la variable `VITE_API_URL` en el archivo `.env` de [ME_frontend](file:///var/www/html/ME_frontend/.env):

```env
# Opción A: Teléfono físico conectado a la misma red Wi-Fi
# (Obtén la IP de tu PC con `ip a` o `hostname -I`)
VITE_API_URL=http://192.168.1.15:8001/api/v1

# Opción B: Emulador oficial de Android Studio
VITE_API_URL=http://10.0.2.2:8001/api/v1
```

*(Asegúrate de que el backend de Python esté corriendo escuchando en `0.0.0.0:8001`)*.

---

## 3. Comandos de Compilación

### Opción Rápida (Todo en uno)
Genera el build web optimizado, sincroniza assets hacia la carpeta nativa y compila el APK con Gradle:

```bash
cd /var/www/html/ME_frontend
npm run build:android
```

El archivo APK resultante se genera en:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Opción Paso a Paso (Línea de Comandos)

Si deseas ejecutar cada paso por separado:

1. **Compilar el frontend web (`dist/`)**:
   ```bash
   npm run build
   ```

2. **Sincronizar assets web con Android**:
   ```bash
   npx cap sync android
   ```

3. **Compilar el APK con el wrapper de Gradle**:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

---

## 4. Instalación del APK en Dispositivo Físico (Vía USB / ADB)

1. Conecta tu teléfono Android por cable USB y asegúrate de tener activada la opción **Depuración por USB** (USB Debugging) en las *Opciones de desarrollador*.
2. Verifica que `adb` reconozca tu dispositivo:
   ```bash
   adb devices
   ```
3. Instala el APK compilado directamente:
   ```bash
   cd /var/www/html/ME_frontend/android
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 5. Compilación Vía Android Studio (GUI)

Si prefieres trabajar con la interfaz gráfica de Android Studio:

```bash
npx cap open android
```

1. Espera a que Android Studio termine el proceso de **Gradle Sync**.
2. Conecta tu teléfono o selecciona un Emulador (AVD).
3. Haz clic en el botón **Run 'app'** (ícono verde de Play) o en el menú superior selecciona:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
