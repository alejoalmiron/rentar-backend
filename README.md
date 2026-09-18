# 🚗 Rentar - Sistema de Alquiler de Vehículos (API REST & GraphQL)

Proyecto desarrollado para el **Hito 1** de la materia (UNLa). Incluye backend en Node.js con Express, ORM Prisma sobre MySQL, documentación interactiva en Swagger, Apollo Server para GraphQL y cliente en React.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegurate de tener instalado en tu equipo:
* **Node.js** (Versión LTS v18 o superior)
* **MySQL Server** (v8.0+) o gestor local como MySQL Workbench / XAMPP
* **Git** y **Visual Studio Code**

---

## 🚀 Guía de Instalación y Configuración Local (Backend)

Sigue estos pasos para levantar el entorno de desarrollo backend en tu computadora:

### 1. Clonar el repositorio e instalar dependencias
git clone <LINK_DEL_REPOSITORIO>
cd rentar-backend
npm install

### 2. Configurar las variables de entorno
Crea un archivo llamado .env en la raíz del proyecto con la siguiente estructura:
PORT=5000
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/rentar_db"

> Nota: Reemplaza usuario y contraseña por tus credenciales locales de MySQL.

### 3. Crear la base de datos en MySQL
Abre tu cliente de MySQL (Workbench, DBeaver, PHPMyAdmin, etc.) y ejecuta:
CREATE DATABASE rentar_db;

### 4. Sincronizar Prisma con la base de datos
Ejecuta el siguiente comando para generar las tablas y relaciones automáticas en MySQL:
npx prisma db push

### 5. Iniciar el servidor
npm run dev

Si todo se configuró correctamente, verás en la consola:
* 🚀 Servidor base: http://localhost:5000
* 📄 Documentación Swagger: http://localhost:5000/api-docs

---

## 📁 Arquitectura del Proyecto Backend (src/)

src/
├── config/        # Configuraciones generales (Swagger, DB, etc.)
├── controllers/   # Lógica de negocio e interacción con Prisma ORM
├── routes/        # Definición de endpoints REST y anotaciones OpenAPI
└── index.js       # Punto de entrada y servidor Express

---

## 👥 Distribución y Módulos de Trabajo

### 📌 Integrante 1 — Setup e Infraestructura (Completado)
* Inicialización del proyecto con Express, ES Modules y .env.
* Configuración del modelo Prisma para MySQL (Vehiculo, Cliente, Reserva).
* Integración de Swagger UI en /api-docs.

### 📌 Integrante 2 — REST: ABM de Vehículos y Clientes
* Crear controladores: src/controllers/vehiculo.controller.js y src/controllers/cliente.controller.js.
* Crear rutas: src/routes/vehiculo.routes.js y src/routes/cliente.routes.js.
* Implementar operaciones CRUD (Alta, Baja lógica, Modificación, Lectura) usando Prisma Client.

### 📌 Integrante 3 — REST: Gestión de Reservas y Validaciones
* Crear controlador y rutas en src/controllers/reserva.controller.js y src/routes/reserva.routes.js.
* Implementar Alta de Reservas validando disponibilidad de fechas y cálculo de importe total.
* Implementar Cancelación y Cambio de estado de la reserva.

### 📌 Integrante 4 — GraphQL: Consultas Avanzadas y Filtros
* Configurar Apollo Server dentro de Express (/graphql).
* Definir Schemas (typeDefs) y Resolvers.
* Implementar búsquedas avanzadas: vehículos disponibles por rango de fechas, filtros por tipo/precio e historial de reservas.

---

## ⚛️ Guía para el Integrante 5 — Frontend (React + Vite)

El desarrollo del Frontend se realiza mediante una aplicación independiente en React que consumirá la API Backend[cite: 1].

### 1. Inicialización del proyecto Frontend
En una carpeta independiente a este repositorio (o dentro de una subcarpeta frontend/), inicializa el proyecto:
npm create vite@latest rentar-frontend -- --template react
cd rentar-frontend
npm install
npm install axios react-router-dom
npm run dev

### 2. Conexión con el Backend
* Base URL de la API REST: http://localhost:5000/api
* Endpoint de GraphQL: http://localhost:5000/graphql

### 3. Tareas a desarrollar en React:
* Vistas principales: 
  - ABM y listado de Vehículos / Clientes.
  - Formulario de Alta de Reserva con selector de fechas.
  - Buscador/Filtro de autos disponibles (conectado a REST o GraphQL).
* Consumo de API: Integrar axios o fetch para peticiones HTTP a los endpoints creados por el equipo.
