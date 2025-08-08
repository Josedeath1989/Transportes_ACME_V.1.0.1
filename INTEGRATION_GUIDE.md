# Guía de Integración Frontend-Backend con Solución CORS

## Resumen de la Configuración

Esta guía describe cómo integrar correctamente el frontend Angular con el backend Laravel, resolviendo problemas de CORS y estableciendo buenas prácticas.

## Configuración Backend (Laravel)

### 1. Variables de Entorno (.env)
```bash
# Backend - Laravel
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:4200
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:4200
```

### 2. Configuración CORS (config/cors.php)
- ✅ Permite múltiples orígenes (localhost:4200, 127.0.0.1:4200)
- ✅ Soporta credenciales (cookies, tokens)
- ✅ Headers específicos configurados
- ✅ Métodos HTTP permitidos
- ✅ Cache de preflight (86400 segundos)

### 3. Comandos de Inicialización
```bash
# Instalar dependencias
cd backend && composer install

# Generar key de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor
php artisan serve --host=0.0.0.0 --port=8000
```

## Configuración Frontend (Angular)

### 1. Variables de Entorno
```typescript
// environment.ts (desarrollo)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  baseUrl: 'http://localhost:8000',
  frontendUrl: 'http://localhost:4200',
  appName: 'Acme Transportes'
};
```

### 2. Comandos de Inicialización
```bash
# Instalar dependencias
cd frontend && npm install

# Iniciar servidor de desarrollo
ng serve --host=0.0.0.0 --port=4200
```

## Verificación de Integración

### 1. Script de Verificación de Conectividad
```bash
#!/bin/bash
# connectivity-check.sh

echo "Verificando conectividad entre frontend y backend..."

# Verificar backend
if curl -s http://localhost:8000/api > /dev/null; then
    echo "✅ Backend está corriendo en http://localhost:8000"
else
    echo "❌ Backend no está disponible"
fi

# Verificar CORS
if curl -s -H "Origin: http://localhost:4200" \
         -H "Access-Control-Request-Method: GET" \
         -X OPTIONS http://localhost:8000/api/conductors > /dev/null; then
    echo "✅ CORS está configurado correctamente"
else
    echo "❌ Problemas con CORS"
fi

# Verificar frontend
if curl -s http://localhost:4200 > /dev/null; then
    echo "✅ Frontend está corriendo en http://localhost:4200"
else
    echo "❌ Frontend no está disponible"
fi
```

### 2. Pruebas de Integración

#### Test de Autenticación
```bash
# Backend - Crear usuario de prueba
php artisan tinker
>>> User::create(['name' => 'Test User', 'email' => 'test@example.com', 'password' => bcrypt('password')])
```

#### Test de API
```bash
# Test de conexión
curl -X GET http://localhost:8000/api/conductors \
  -H "Accept: application/json" \
  -H "Origin: http://localhost:4200"
```

## Solución de Problemas Comunes

### 1. Error CORS
**Síntoma**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solución**:
- Verificar que FRONTEND_URL esté configurado en .env
- Reiniciar el servidor Laravel después de cambios
- Verificar que el puerto coincida exactamente

### 2. Error 419 (CSRF Token)
**Síntoma**: `419 unknown status`

**Solución**:
- Asegurar que `withCredentials: true` esté en las peticiones
- Verificar que SANCTUM_STATEFUL_DOMAINS esté configurado

### 3. Error de Autenticación
**Síntoma**: `401 Unauthorized`

**Solución**:
- Verificar que el token esté siendo enviado correctamente
- Verificar que el token no haya expirado
- Verificar que el endpoint esté protegido correctamente

## Estructura de Archivos Actualizada

### Backend
```
backend/
├── .env (configurado con FRONTEND_URL)
├── config/
│   └── cors.php (configuración optimizada)
└── app/Http/Controllers/Api/
    └── [Controladores con CORS habilitado]
```

### Frontend
```
frontend/
├── src/environments/
│   ├── environment.ts (configurado para localhost:8000)
│   └── environment.prod.ts (configurado para producción)
├── src/app/services/
│   ├── config.service.ts (servicio de configuración)
│   ├── api.service.ts (servicio mejorado con manejo de errores)
│   └── [otros servicios actualizados]
└── src/app/auth.interceptor.ts (interceptor mejorado para CORS)
```

## Comandos Útiles

### Desarrollo
```bash
# Backend
cd backend && php artisan serve --host=0.0.0.0 --port=8000

# Frontend
cd frontend && ng serve --host=0.0.0.0 --port=4200

# Verificación
./connectivity-check.sh
```

### Producción
```bash
# Build de producción
ng build --configuration production

# Configurar nginx/apache para proxy reverso
# Configurar HTTPS
```

## Notas de Seguridad

1. **En producción**:
   - Usar HTTPS
   - Configurar dominios específicos en lugar de wildcard
   - Implementar rate limiting
   - Validar todos los inputs

2. **Variables sensibles**:
   - Nunca commitear .env real
   - Usar variables de entorno del servidor
   - Implementar rotación de tokens

## Soporte

Para problemas adicionales:
1. Verificar logs del backend: `storage/logs/laravel.log`
2. Verificar consola del navegador
3. Usar herramientas de desarrollo (Network tab)
4. Verificar configuración de firewall/proxy
