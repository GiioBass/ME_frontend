# Requisitos para compilar el APK (Capacitor)

Para convertir esta aplicación web en un **APK instalable** en teléfonos Android, usaremos **Capacitor**, que envuelve la web dentro de una aplicación nativa. 

### ¿Qué necesitas instalar en tu máquina (Ubuntu/Linux)?

1. **Android Studio y Android SDK:**
   - Necesitas descargar e instalar Android Studio.
   - Asegúrate de instalar el **Android SDK**, las **SDK Platform-Tools** y un **emulador** (opcional si pruebas directo en tu teléfono físico).
   
2. **Configuración de Variables de Entorno:**
   - Debes exportar `ANDROID_HOME` en tu `~/.bashrc` o `~/.zshrc`:
     ```bash
     export ANDROID_HOME=$HOME/Android/Sdk
     export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
     ```

3. **Java Development Kit (JDK):**
   - Android requiere Java (usualmente OpenJDK 17 o superior).
   - Puedes instalarlo con: `sudo apt install openjdk-17-jdk`.

### Construcción y Sincronización de la Aplicación

Dado que la aplicación móvil correra separada de tu entorno local de desarrollo, es crítico **configurar la dirección IP** por donde la app del celular buscará al backend de Python.

#### 1. Configurar la URL del Backend (`.env`)

En la raíz del proyecto web (`ME_frontend/`), debe existir un archivo `.env`. Si no está, créalo.

Configura la variable `VITE_API_URL` apuntando a la **IP de tu computadora en tu red local** (NO uses `localhost` ni `127.0.0.1`, o el celular se buscará a sí mismo).

Ejemplo de cómo debe verse tu archivo `.env`:
```env
# Reemplaza la IP por la IPv4 real de tu máquina (búscala con el comando ipconfig en Windows o ip a en Linux)
# y el puerto donde corre tu backend (por defecto 8001):
VITE_API_URL=http://192.168.1.15:8001/api/v1
```

*(Nota: Asegúrate también de que tu servidor de Python backend esté escuchando en la IP `0.0.0.0` para poder recibir peticiones externas).*

#### 2. Compilar el Frontend

Cada vez que hagas un cambio en el código (ya sean componentes de React, estilos o variables de entorno en el `.env`), **siempre** debes compilar el proyecto web primero:

```bash
cd /var/www/html/ME_frontend
npm run build
```

#### 3. Sincronizar hacia Android

Luego de construir la web en la carpeta `dist/`, usa este comando de Capacitor para copiar inyectando los archivos HTML/JS hacia las entrañas nativas del código de Android (`android/app/src/main/assets/...`):

```bash
npx cap sync android
```

#### 4. Producir el APK o lanzar Emulador

Una vez esté la carpeta nativa actualizada, simplemente lanza Android Studio:

```bash
npx cap open android
```

- En Android Studio espera que cargue completamente el `Gradle Sync`.
- Selecciona tu emulador o tu dispositivo físico conectado por USB.
- Haz clic en el botón verde de Play (`Run 'app'`) para correr e instalar el APK, o en el menú superior anda a `Build > Build Bundle(s) / APK(s) > Build APK(s)` si solo quieres generar el archivo para compartirlo.
