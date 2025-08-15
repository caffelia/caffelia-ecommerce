# Configuración del Proyecto Caffelia E-commerce

## Configuración del Backend (Medusa)

1. Copia el archivo `env.example` a `.env` en el directorio `caffelia-ecommerce/`:
```bash
cd caffelia-ecommerce
cp env.example .env
```

2. Edita el archivo `.env` y configura las siguientes variables:
   - `S3_ACCESS_KEY_ID`: Tu clave de acceso de AWS S3
   - `S3_SECRET_ACCESS_KEY`: Tu clave secreta de AWS S3
   - `DATABASE_URL`: URL de tu base de datos PostgreSQL
   - `JWT_SECRET`: Clave secreta para JWT (puede ser cualquier string aleatorio)
   - `COOKIE_SECRET`: Clave secreta para cookies (puede ser cualquier string aleatorio)

## Configuración del Storefront (Next.js)

1. Copia el archivo `env.example` a `.env.local` en el directorio `caffelia-ecommerce-storefront/`:
```bash
cd caffelia-ecommerce-storefront
cp env.example .env.local
```

2. Edita el archivo `.env.local` y configura:
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`: Tu clave pública de Medusa
   - `MEDUSA_BACKEND_URL`: URL de tu backend Medusa (por defecto: http://localhost:9000)

## Configuración de Regiones en Medusa Admin

1. Accede a tu panel de administración de Medusa
2. Ve a la sección de Regiones
3. Asegúrate de que existe una región con el código de país `es` (España)
4. Configura la moneda y la configuración fiscal para España

## Características Implementadas

- **Idioma por defecto**: Español (es)
- **Ruta por defecto**: `/es`
- **Moneda por defecto**: EUR (Euro)
- **Formato de números**: Español (es-ES)

## Iniciar el Proyecto

1. **Backend**:
```bash
cd caffelia-ecommerce
yarn dev
```

2. **Storefront**:
```bash
cd caffelia-ecommerce-storefront
yarn dev
```

El storefront estará disponible en `http://localhost:8000` y automáticamente redirigirá a `/es` para el contenido en español.
