# API Contracts - Mara Productions Catalog

## Resumen del Sistema
Este documento define los contratos entre el frontend y backend para el catálogo de Mara Productions, incluyendo la gestión de productos, configuración del sitio y autenticación administrativa.

## Modelos de Datos

### Product Model
```javascript
{
  _id: ObjectId,
  titulo: String (required),
  descripcion: String (required),
  imagen: String (required), // URL o base64
  pais: String (required),
  fechaLanzamiento: Date (required),
  plataformas: [String], // Solo para juegos y aplicaciones
  categoria: String (required), // 'juegos', 'aplicaciones', 'seriesTV', etc.
  subcategoria: String, // 'pc', 'xboxOne', 'apple', etc.
  createdAt: Date,
  updatedAt: Date
}
```

### SiteConfig Model
```javascript
{
  _id: ObjectId,
  key: String (unique), // 'logo'
  value: String, // URL o base64 del logo
  updatedAt: Date
}
```

## Endpoints API

### Productos

#### GET /api/products
- **Descripción**: Obtiene todos los productos
- **Query params**: 
  - `categoria` (optional): filtrar por categoría
  - `subcategoria` (optional): filtrar por subcategoría
  - `search` (optional): búsqueda por texto
- **Response**: Array de productos

#### POST /api/products
- **Descripción**: Crear nuevo producto
- **Body**: ProductCreate (sin _id, createdAt, updatedAt)
- **Response**: Producto creado
- **Auth**: Requerida

#### PUT /api/products/:id
- **Descripción**: Actualizar producto existente
- **Body**: ProductUpdate
- **Response**: Producto actualizado
- **Auth**: Requerida

#### DELETE /api/products/:id
- **Descripción**: Eliminar producto
- **Response**: { message: "Producto eliminado" }
- **Auth**: Requerida

### Configuración del Sitio

#### GET /api/config/:key
- **Descripción**: Obtiene configuración por clave
- **Response**: { key, value }

#### POST /api/config
- **Descripción**: Actualiza configuración
- **Body**: { key, value }
- **Response**: Configuración actualizada
- **Auth**: Requerida

### Autenticación

#### POST /api/auth/login
- **Descripción**: Autenticación de administrador
- **Body**: { password }
- **Response**: { success: true, message }

## Integración Frontend-Backend

### Datos Mock a Reemplazar
Los datos en `mock.js` serán reemplazados por llamadas API:
- `mockData.juegos.*` → GET /api/products?categoria=juegos&subcategoria=*
- `mockData.aplicaciones.*` → GET /api/products?categoria=aplicaciones&subcategoria=*
- `mockData.seriesTV` → GET /api/products?categoria=seriesTV
- Etc.

### Funcionalidades del Admin Panel

1. **Gestión de Productos**:
   - Crear: POST /api/products
   - Listar: GET /api/products
   - Actualizar: PUT /api/products/:id
   - Eliminar: DELETE /api/products/:id

2. **Configuración del Logo**:
   - Obtener: GET /api/config/logo
   - Actualizar: POST /api/config { key: 'logo', value: logoUrl }

3. **Autenticación**:
   - Login: POST /api/auth/login
   - Validación en cada operación administrativa

### Búsqueda
- Frontend envía término de búsqueda
- Backend busca en campos: titulo, descripcion, pais, plataformas
- Filtrado en tiempo real con debounce

## Estados de Carga
- Loading states para todas las operaciones CRUD
- Error handling con mensajes amigables
- Success notifications para operaciones exitosas

## Validaciones
- Frontend: Validación básica de formularios
- Backend: Validación completa con mongoose schemas
- Manejo de errores de validación y respuestas HTTP apropiadas