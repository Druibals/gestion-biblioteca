
# Sistema de Gestión de Biblioteca

## Objetivo
Sistema de gestión de biblioteca para administrar libros, autores, usuarios y préstamos. Registra libros bajo el nombre de autores, copias referenciando a libros, usuarios y préstamos que estos realicen.

## Requisitos
- PostgreSQL 12+ (o la versión que prefiera el administrador)

- `psql` (cliente de PostgreSQL) o cliente alternativo

- Node.js v14+ (si se usa la parte web/servidor)

- `npm` o `yarn` (opcional, según componentes usados)


## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-repositorio>
   cd gestion-biblioteca
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Copia el archivo `.env.example` a `.env` (si existe) o crea `.env` con los valores necesarios

     ```bash
     cp .env.example .env    # Unix
     copy .env.example .env  # Windows CMD
     ```
   - Abre `.env` y reemplaza los valores genéricos por los de tu entorno.
   - Añade `.env` a `.gitignore` para evitar subir credenciales al repositorio.

   **Variables genéricas (ejemplo — modifica según tu instalación):**
   ```env
   DB_USER=<tu_usuario>
   DB_PASS=<tu_contraseña>
   DB_NAME=<tu_basedatos>
   DB_HOST=localhost
   DB_PORT=5432
   ```

   - Nota: Si cada desarrollador usa nombres distintos para la BD o el usuario, deben actualizar estos valores en su copia local de `.env`.

4. **(Opcional) Crear usuario y base de datos en PostgreSQL**

   Ejecuta en psql con privilegios de superusuario (ajusta nombres/contraseñas):

   ```sql
   CREATE ROLE <tu_usuario> 
   WITH LOGIN PASSWORD '<tu_contraseña>';
   CREATE DATABASE <tu_basedatos> OWNER <tu_usuario>;
   GRANT ALL PRIVILEGES ON DATABASE <tu_basedatos> TO <tu_usuario>;
   ```

   - Ejemplo concreto (no usar en repositorios con contraseñas reales):
   ```sql
   CREATE ROLE biblioteca_user 
   WITH LOGIN PASSWORD 'secreto';
   CREATE DATABASE gestion_biblioteca_dev 
   OWNER biblioteca_user;
   GRANT ALL PRIVILEGES ON DATABASE gestion_biblioteca_dev TO biblioteca_user;
   ```

5. **Puesta en marcha de la aplicación**

   Para arrancar la aplicación en modo desarrollo:

   ```
   npm run dev
   ```
   O bien:

   ```
   node web/app.js
   ```

   La aplicación quedará escuchando en `http://localhost:3000` o el puerto que tengas configurado.

   Para hacer una petición simple contra el endpoint de estado:

   ```
   curl http://localhost:3000/health
   ```
   Debería devolver un 200 OK o un JSON con algún “status: ok”

6. **Inicializar la base de datos con los scripts del directorio `sql/`**

   - Usando `psql` (Bash / Unix):
   ```bash
   psql -U $DB_USER -d $DB_NAME -f sql/01_schema.sql
   psql -U $DB_USER -d $DB_NAME -f sql/02_seed.sql
   psql -U $DB_USER -d $DB_NAME -f sql/03_queries.sql
   ```

   - Usando PowerShell:
   ```powershell
   $env:DB_USER='biblioteca_user'
   $env:DB_NAME='gestion_biblioteca_dev'
   psql -U $env:DB_USER -d $env:DB_NAME -f sql/01_schema.sql
   ```

   - Usando Windows CMD:
   ```cmd
   set DB_USER=biblioteca_user
   set DB_NAME=gestion_biblioteca_dev
   psql -U %DB_USER% -d %DB_NAME% -f sql/01_schema.sql
   ```

   > **Nota:** Si usas un cliente de PostgreSQL distinto a `psql`, ejecuta los archivos SQL como scripts en el orden indicado para obtener los resultados esperados.

## Scripts

- `sql/01_schema.sql`: crea tablas y esquemas (modifica si usas otros nombres)
- `sql/02_seed.sql`: datos iniciales de ejemplo
- `sql/03_queries.sql`: consultas de muestra / validación

## Endpoints disponibles

A continuación se listan las rutas que expone la API.

- `GET /api/health` : Healthcheck de la base de datos. De ser correcto, devuelve un 200 ok o un JSON con "status: ok"

- `GET /api/loans` : Lista el historial de todos los préstamos registrados en el sistema.

- `GET /api/loans/not-retuned` : Lista los préstamos que no hayan sido devueltos.

- `GET /api/authors/top` : Lista los autores con más libros registrados en el sistema **(NO COPIAS)**

## Uso

- Actualiza las variables en `.env` según tu entorno local.
- Si cambias `DB_USER` o `DB_NAME`, adapta los comandos `psql` y los scripts de inicialización. Lo mismo sucede al crear el usuario dentro de PostgreSQL. Se debe hacer referencia a las nuevas credenciales.

   ```env
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=<gestion_biblioteca>
   PGUSER=<biblioteca_user>
   PGPASSWORD=<tu_contraseña>
   PORT=3000
   ```

## Buenas prácticas

- No subas archivos `.env` con credenciales reales al repositorio.
- Mantén los ejemplos de configuración con valores genéricos para que cada desarrollador los personalice.
- Documenta en `docs/` cualquier cambio importante en el esquema o en el flujo de migraciones.
