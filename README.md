# Sistema de Decisiones Comunitarias

Una plataforma web donde los usuarios pueden crear decisiones importantes de su vida y recibir votos de la comunidad para ayudarles a decidir.

## ⚠️ IMPORTANTE PARA CANDIDATOS

**NO HAGAS FORK DE ESTE REPOSITORIO**

Para mantener la confidencialidad de tu solución:
1. **Clona** el repositorio (no hagas fork)
2. **Crea tu propio repositorio publico** en tu cuenta
3. **Envía el link de tu repositorio** cuando completes el reto

Esto evita que otros candidatos puedan ver tu solución.

## 🚀 Características Principales

### Sistema de Usuarios
- ✅ Registro y autenticación completa
- ✅ Perfil con karma y badges automáticos
- ✅ Badges: "Overthinker", "Decisivo", "Consejero"
- ✅ Sistema de karma por participación

### Gestión de Decisiones
- ✅ Crear decisiones con múltiples opciones (2-4)
- ✅ Categorías: Carrera, Técnica, Vida, Financiera, Startup
- ✅ Decisiones anónimas opcionales
- ✅ Fecha de expiración configurable
- ✅ Estados: Draft, Open, Decided, Expired, Archived

### Sistema de Votación
- ✅ Un voto por usuario por decisión
- ✅ Comentarios opcionales en votos
- ✅ Visualización con barras de progreso
- ✅ Resultados en tiempo real
- ✅ No puedes votar en tus propias decisiones

### Dashboard Personal
- ✅ Estadísticas de decisiones y votos
- ✅ Karma acumulado visible
- ✅ Badge actual del usuario
- ✅ Acciones rápidas

## 📋 Requisitos

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM
- SQLite (incluido)

## 🛠️ Instalación

### 1. Clonar el repositorio (NO HAGAS FORK)
```bash
git clone https://github.com/Agilgob/reto-candidatos.git
cd reto-candidatos
```

### 2. Instalar dependencias de PHP
```bash
composer install
```

### 3. Configurar entorno
```bash
cp .env.example .env
php artisan key:generate
```

### 4. Instalar dependencias de Node
```bash
npm install
```

### 5. Crear y poblar la base de datos
```bash
# Crear las tablas
php artisan migrate

# Opcional: Poblar con datos de prueba (20 decisiones, 8 usuarios)
php artisan db:seed --class=DecisionSeeder
```

## 👥 Usuarios de Prueba

Si ejecutaste el seeder, puedes usar estos usuarios:

| Email | Nombre | Contraseña |
|-------|--------|------------|
| ana@test.com | Ana García | password123 |
| carlos@test.com | Carlos Rodríguez | password123 |
| maria@test.com | María López | password123 |
| juan@test.com | Juan Martínez | password123 |
| laura@test.com | Laura Sánchez | password123 |
| pedro@test.com | Pedro Gómez | password123 |
| sofia@test.com | Sofia Fernández | password123 |
| diego@test.com | Diego Ruiz | password123 |

## 🏃‍♂️ Ejecutar la Aplicación

### Terminal 1 - Backend Laravel
```bash
php artisan serve
```
La aplicación estará disponible en: http://127.0.0.1:8000

### Terminal 2 - Frontend Vite (desarrollo con hot reload)
```bash
npm run dev
```

### Para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
laravel-app/
├── app/
│   ├── Http/Controllers/
│   │   ├── DecisionController.php    # API de decisiones
│   │   ├── VoteController.php        # Sistema de votación
│   │   └── DashboardController.php   # Dashboard
│   └── Models/
│       ├── Decision.php              # Modelo de decisión
│       ├── Option.php                # Opciones de decisión
│       ├── Vote.php                  # Votos
│       └── User.php                  # Usuario extendido
├── database/
│   ├── data/
│   │   └── decisions.json           # Datos de prueba
│   ├── migrations/                  # Migraciones de BD
│   └── seeders/
│       └── DecisionSeeder.php       # Seeder con 20 decisiones
├── resources/
│   └── js/
│       ├── Components/
│       │   └── Decisions/           # Componentes React
│       └── Pages/
│           └── Decisions/           # Páginas de decisiones
│               ├── Index.jsx        # Lista de decisiones
│               ├── Create.jsx       # Crear decisión
│               ├── Show.jsx         # Ver y votar
│               ├── MyDecisions.jsx  # Mis decisiones
│               └── VotedDecisions.jsx # Decisiones votadas
└── routes/
    └── web.php                      # Rutas de la aplicación
```

## 🔄 Datos de Prueba

El seeder incluye 20 decisiones realistas en español sobre:
- Cambios de trabajo y carrera profesional
- Decisiones técnicas (frameworks, bases de datos)
- Vida personal (mudanzas, relaciones)
- Inversiones y finanzas
- Emprendimiento y startups

Para regenerar los datos:
```bash
# Limpiar y repoblar todo
php artisan migrate:fresh --seed --seeder=DecisionSeeder

# Solo añadir más decisiones (mantiene usuarios)
php artisan db:seed --class=DecisionSeeder
```

## 🎯 Funcionalidades para Probar

1. **Registro/Login**: Crea una cuenta nueva o usa los usuarios de prueba
2. **Explorar Decisiones**: Ve todas las decisiones activas con filtros
3. **Votar**: Participa en decisiones abiertas con votos y comentarios
4. **Crear Decisión**: Pide ayuda a la comunidad con tu dilema
5. **Dashboard**: Ve tus estadísticas, karma y badge
6. **Mis Decisiones**: Gestiona y marca tus decisiones como resueltas
7. **Decisiones Votadas**: Revisa en qué has participado

## 🏗️ Stack Tecnológico

- **Backend**: Laravel 12.x
- **Frontend**: React con Inertia.js
- **Base de Datos**: SQLite
- **CSS**: Tailwind CSS
- **Iconos**: Heroicons
- **Build**: Vite

## 📝 API Endpoints

### Públicos
- `GET /api/decisions` - Lista de decisiones
- `GET /api/decisions/{id}` - Ver decisión

### Autenticados
- `POST /api/decisions` - Crear decisión
- `PUT /api/decisions/{id}` - Actualizar decisión
- `DELETE /api/decisions/{id}` - Eliminar decisión
- `GET /api/my-decisions` - Mis decisiones
- `GET /api/voted-decisions` - Decisiones votadas
- `POST /api/votes` - Votar
- `DELETE /api/votes/{id}` - Eliminar voto

## 🐛 Solución de Problemas

### La base de datos está vacía
```bash
php artisan migrate:fresh --seed --seeder=DecisionSeeder
```

### Los estilos no cargan
```bash
npm run build
```

### Error de permisos en storage
```bash
chmod -R 775 storage bootstrap/cache
```

## 📄 Licencia

MIT License