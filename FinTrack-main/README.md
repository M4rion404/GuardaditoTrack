# FinTrack - Guía de Instalación y Ejecución

## Instrucciones para Ejecutar el Proyecto

1. **Importante**: Debes utilizar dos terminales separadas para ejecutar el proyecto
2. **Orden de ejecución**:
   - Primero inicia el backend
   - Luego inicia el frontend

### Dependencias usadas en Backend
express	Framework web para crear el servidor.
mongoose	ODM para conectar y trabajar con MongoDB.
cors	Middleware para habilitar solicitudes entre frontend y backend.
dotenv	Permite cargar variables de entorno desde un archivo .env.
nodemon (opcional)	Reinicia automáticamente el servidor al detectar cambios (modo desarrollo).

**Comando de instalación:**
```bash
npm install express mongoose cors dotenv nodemon jsonwebtoken
```

### Frontend
| Dependencia | Descripción |
|-------------|-------------|
| `react` | Librería principal para construir interfaces de usuario |
| `react-dom` | Permite que React se conecte al DOM |
| `axios` | Cliente HTTP para hacer solicitudes al backend |
| `framer-motion` | Proporciona animaciones de transición entre páginas |
| `react-router-dom` | Maneja la navegación entre componentes |

**Comando de instalación:**
```bash
npm install axios react-router-dom framer-motion
```
