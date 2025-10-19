# 🎯 Reto Técnico - Sistema de Comentarios

Bienvenido al reto técnico de Agilgob. Tu tarea es agregar un **sistema de comentarios** a la plataforma de decisiones comunitarias.

## 📝 Descripción del Reto

Actualmente los usuarios pueden crear decisiones y votar, pero **no pueden dejar comentarios** para explicar su razonamiento o dar consejos adicionales. Tu tarea es implementar un sistema de comentarios que permita una mejor interacción en la comunidad.

## 🎯 Objetivos

Implementar un sistema de comentarios donde:
- Los usuarios autenticados puedan comentar en cualquier decisión
- Los comentarios se muestren en orden cronológico (más reciente primero)
- El autor del comentario sea visible (nombre y avatar/iniciales)
- Los comentarios tengan timestamp relativo (ej: "hace 2 horas")
- Comentar otorgue karma al usuario

## 📋 Requerimientos Funcionales

### 1. Backend (Laravel)

#### Migration
Crear una nueva tabla `comments` con los siguientes campos:
- `id` - Primary key
- `decision_id` - Foreign key a decisiones
- `user_id` - Foreign key a usuarios
- `content` - Texto del comentario (mínimo 10 caracteres, máximo 1000)
- `timestamps` - created_at, updated_at

#### Model
Crear el modelo `Comment.php` con:
- Relaciones:
  - `belongsTo` User
  - `belongsTo` Decision
- Fillable: `['decision_id', 'user_id', 'content']`
- Cast: `created_at` como datetime

#### API Endpoints
Implementar en `routes/web.php` o crear `CommentController.php`:

1. **Listar comentarios de una decisión**
   - `GET /api/decisions/{decision}/comments`
   - Retorna: JSON con comentarios, datos del usuario (nombre, email), ordenados por más reciente
   - Paginación: 20 por página
   - Debe funcionar sin autenticación (comentarios son públicos)

2. **Crear comentario**
   - `POST /api/decisions/{decision}/comments`
   - Requiere autenticación
   - Body: `{ "content": "texto del comentario" }`
   - Validaciones:
     - Content requerido
     - Mínimo 10 caracteres
     - Máximo 1000 caracteres
   - Retorna: Comentario creado con datos del usuario
   - **Importante**: Al crear comentario con éxito:
     - Incrementar karma del usuario en +5

### 2. Frontend (React + Inertia)

#### Componente `CommentList.jsx`
Crear en `resources/js/Components/Decisions/CommentList.jsx`:
- Recibe: `decision_id` como prop
- Hace fetch a `GET /api/decisions/{decision_id}/comments`
- Muestra lista de comentarios con:
  - Avatar/iniciales del usuario (círculo con 2 primeras letras del nombre)
  - Nombre del usuario
  - Timestamp relativo (usa una librería como `date-fns` o crea helper simple)
  - Contenido del comentario
- Maneja estado de carga y mensajes de "No hay comentarios aún"
- Estilo consistente con el diseño existente (Tailwind)

#### Componente `CommentForm.jsx`
Crear en `resources/js/Components/Decisions/CommentForm.jsx`:
- Recibe: `decision_id` y `onCommentAdded` callback como props
- Textarea para escribir comentario
- Botón "Publicar Comentario"
- Validación en frontend (mínimo 10 caracteres)
- Contador de caracteres (ej: "250/1000")
- Mostrar errores de validación del backend
- Al enviar con éxito:
  - Limpiar textarea
  - Llamar callback `onCommentAdded()` para recargar lista
  - Mostrar mensaje de éxito temporal

#### Integración en `Show.jsx`
Modificar `resources/js/Pages/Decisions/Show.jsx`:
- Agregar sección de comentarios después de las opciones de votación
- Mostrar título "Comentarios (X)" donde X es el número total
- Incluir `CommentForm` (solo si el usuario está autenticado)
- Incluir `CommentList`
- Mantener diseño responsive

## 🎨 Diseño y UX

### Ejemplo de estructura visual:
```
┌─────────────────────────────────────────┐
│  Comentarios (12)                       │
├─────────────────────────────────────────┤
│  [Si está autenticado]                  │
│  ┌───────────────────────────────────┐  │
│  │ Escribe un comentario...          │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│  [Publicar Comentario]  250/1000        │
├─────────────────────────────────────────┤
│  ┌──┬──────────────────────────────┐   │
│  │AM│ Ana María · hace 2 horas     │   │
│  └──┘ Yo tomaría la opción 2       │   │
│       porque...                     │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  ┌──┬──────────────────────────────┐   │
│  │JM│ Juan Martínez · hace 1 día   │   │
│  └──┘ Considerando tu situación... │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Estilos sugeridos:
- Avatar: Círculo de 40x40px con fondo color primario y letras blancas
- Comentarios: Fondo gris claro, bordes redondeados, padding generoso
- Textarea: Altura mínima 80px, auto-expandible preferiblemente
- Botón: Estilo consistente con los botones de votación

## ✅ Checklist de Entregables

### Código
- [ ] Migration `create_comments_table` ejecutada exitosamente
- [ ] Modelo `Comment.php` con relaciones correctas
- [ ] 2 endpoints API funcionando (`GET` y `POST`)
- [ ] Validaciones implementadas correctamente
- [ ] Sistema de karma actualizado (+5 por comentario)
- [ ] Componente `CommentList.jsx` funcional
- [ ] Componente `CommentForm.jsx` funcional
- [ ] Integración en página `Show.jsx`

### Calidad
- [ ] Código limpio y bien indentado
- [ ] Nombres de variables descriptivos
- [ ] Sin errores de consola JavaScript
- [ ] Sin warnings de PHP/Laravel
- [ ] Manejo de errores implementado
- [ ] Validaciones frontend y backend

### Documentación
- [ ] Actualizar `README.md` con la nueva feature
- [ ] Comentarios en código donde sea necesario
- [ ] Commits atómicos con mensajes claros

### Extras (Opcionales - No requeridos)
- [ ] Tests PHPUnit para los endpoints de comentarios
- [ ] Editar/eliminar comentario (solo el autor)
- [ ] Confirmación antes de publicar comentario
- [ ] Notificación al dueño de la decisión cuando comentan
- [ ] Paginación infinita (scroll) en lugar de botones

## 🚀 Cómo Empezar

1. **Asegúrate de que el proyecto funciona**
   ```bash
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed --class=DecisionSeeder
   ```

2. **Crea una rama para tu solución**
   ```bash
   git checkout -b feature/sistema-comentarios
   ```

3. **Empieza por el backend**
   - Crea la migration
   - Crea el modelo
   - Implementa los endpoints
   - Prueba con Postman/Insomnia

4. **Continúa con el frontend**
   - Crea los componentes
   - Integra en Show.jsx
   - Prueba en el navegador

5. **Prueba todo el flujo**
   - Crear comentarios
   - Ver comentarios
   - Verificar karma

## 📤 Entrega

1. **Crea tu propio repositorio público** (NO hagas fork)
2. **Pushea tu solución** en la rama `feature/sistema-comentarios`
3. **Envía el link del repositorio**
4. **Incluye en el README**:
   - Screenshots de la funcionalidad
   - Instrucciones para probar tu implementación
   - Cualquier decisión técnica importante que hayas tomado

## 🎓 Criterios de Evaluación

| Criterio | Peso |
|----------|------|
| Funcionalidad completa | 40% |
| Código limpio y bien estructurado | 25% |
| UI/UX consistente y usable | 20% |
| Manejo de errores | 10% |
| Documentación | 5% |

### Lo que buscamos:
✅ Que funcione sin bugs obvios
✅ Código fácil de leer y mantener
✅ Buenas prácticas de Laravel y React
✅ Validaciones correctas
✅ Diseño consistente con la app existente
✅ Commits organizados

### No es necesario:
❌ Sobre-ingeniería o patrones complejos
❌ Tests exhaustivos (aunque son un plus)
❌ Features extras no solicitadas
❌ Diseño pixel-perfect

## 💡 Consejos

- **Lee todo el documento antes de empezar**
- **Prueba frecuentemente** mientras desarrollas
- **Usa las herramientas de debug**: `dd()`, `console.log()`, DevTools
- **Revisa el código existente** para mantener consistencia
- **Haz commits pequeños y frecuentes**
- **No te compliques**: La solución simple y funcional es mejor que la perfecta pero incompleta
- **Gestiona tu tiempo**: 3hrs backend + 2hrs frontend es una distribución razonable

## ❓ ¿Dudas?

Si algo no está claro en los requerimientos:
- Toma la decisión más razonable
- Documéntala en el README
- Continúa con el desarrollo

**No hay trampa ni preguntas con doble interpretación. Queremos ver cómo resuelves problemas reales.**

## 🎉 ¡Buena suerte!

Estamos emocionados de ver tu solución. Recuerda: preferimos código funcional y limpio sobre una solución perfecta pero incompleta.

**Tiempo máximo sugerido: 5 horas**

Si llegas a las 5 horas y no terminaste todo, entrega lo que tengas funcionando y documenta qué te faltó.
