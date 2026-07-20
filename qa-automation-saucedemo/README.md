# QA Automation Challenge - SauceDemo (Swag Labs)

Este proyecto contiene una suite de automatización de pruebas extremo a extremo (E2E) para la aplicación SauceDemo utilizando Playwright con TypeScript, estructurado bajo el patrón de diseño Page Object Model (POM).

---

## Tecnologías Utilizadas

*   Lenguaje: TypeScript
*   Framework de Pruebas: Playwright (v1.61.1)
*   Gestión de Variables de Entorno: Dotenv
*   Integración Continua: GitHub Actions

---

## Estructura del Proyecto

```text
qa-automation-saucedemo/
├── .github/workflows/
│   └── playwright.yml         # Pipeline de Integración Continua en GitHub Actions
├── pages/                     # Clases Page Object Model (POM)
│   ├── LoginPage.ts           # Interacciones de la página de Login
│   ├── InventoryPage.ts       # Interacciones del catálogo/inventario de productos
│   ├── CartPage.ts            # Interacciones del carrito de compras
│   └── CheckoutPage.ts        # Interacciones del flujo de checkout (datos, resumen y fin)
├── tests/tests/               # Scripts de pruebas automatizadas
│   ├── saucedemo.spec.ts      # Casos de prueba de UI (Obligatorios y Data-Driven)
│   └── api.spec.ts            # Casos de prueba básicos de API (Opcional)
├── playwright.config.ts       # Configuración global de Playwright
├── package.json               # Dependencias y scripts de ejecución
└── tsconfig.json              # Configuración del compilador de TypeScript
```

---

## Instalación y Configuración

Siga los siguientes pasos para ejecutar el proyecto:

1. Clonar el repositorio y abrir la carpeta del proyecto.
2. Instalar las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Instalar los navegadores de Playwright:
   ```bash
   npx playwright install --with-deps
   ```
4. Configurar el archivo de variables de entorno. El proyecto utiliza un archivo `.env` en la raíz del espacio de trabajo con las siguientes claves:
   ```env
   USER_NAME=standard_user
   PASSWORD=secret_sauce
   ```

---

## Ejecución de Pruebas

Los comandos disponibles para iniciar las pruebas son los siguientes:

*   Ejecutar todas las pruebas (UI y API) en todos los navegadores:
    ```bash
    npm test
    ```
*   Ejecutar pruebas únicamente en Chromium:
    ```bash
    npx playwright test --project=chromium
    ```
*   Ejecutar pruebas con la interfaz de usuario de Playwright:
    ```bash
    npx playwright test --ui
    ```
*   Ejecutar un archivo de prueba específico:
    *   Pruebas de UI:
        ```bash
        npx playwright test tests/tests/saucedemo.spec.ts
        ```
    *   Pruebas de API:
        ```bash
        npx playwright test tests/tests/api.spec.ts
        ```
*   Abrir el reporte HTML tras una ejecución:
    ```bash
    npx playwright show-report
    ```

---

## Análisis Manual

A continuación se presenta la documentación del análisis manual del sitio y la estrategia propuesta para liberaciones a producción.

### 1. Cinco Casos de Prueba Adicionales

*   **TC-01: Ordenamiento de productos por precio ascendente**
    *   *Precondición*: Usuario autenticado en la página de catálogo.
    *   *Pasos*: Seleccionar la opción "Price (low to high)" en el desplegable de ordenamiento.
    *   *Resultado esperado*: El listado muestra los productos organizados del precio más bajo al más alto de forma correcta.

*   **TC-02: Navegación y consistencia del detalle de producto**
    *   *Precondición*: Usuario autenticado en la página de catálogo.
    *   *Pasos*: Hacer clic en el nombre de un artículo y verificar los datos mostrados (nombre, precio, descripción e imagen).
    *   *Resultado esperado*: La página de detalles muestra información idéntica a la tarjeta correspondiente en el catálogo principal.

*   **TC-03: Persistencia del carrito tras recarga de página**
    *   *Precondición*: Usuario autenticado con artículos agregados al carrito.
    *   *Pasos*: Presionar F5 o recargar el navegador y observar el indicador de cantidad de artículos.
    *   *Resultado esperado*: El estado del carrito se mantiene intacto tras actualizar el navegador.

*   **TC-04: Reinicio completo del estado de la aplicación**
    *   *Precondición*: Usuario con flujo de compra en proceso y artículos añadidos.
    *   *Pasos*: Desplegar el menú lateral de navegación y presionar "Reset App State".
    *   *Resultado esperado*: El contador del carrito se limpia y todos los botones de los artículos regresan al estado inicial de "Add to cart".

*   **TC-05: Enlaces funcionales a redes sociales en pie de página**
    *   *Precondición*: Usuario posicionado en cualquier sección de la aplicación.
    *   *Pasos*: Hacer clic en los enlaces de redes sociales (Twitter, Facebook, LinkedIn) ubicados en el footer.
    *   *Resultado esperado*: Cada enlace abre la red oficial de la marca en una pestaña externa del navegador.

### 2. Tres Escenarios Negativos

*   **Escenario Negativo 1: Finalización del checkout con campos obligatorios vacíos**
    *   *Descripción*: Iniciar el checkout con un producto en el carrito y presionar "Continue" dejando en blanco los campos de nombre, apellido o código postal.
    *   *Resultado esperado*: Se impide el avance y se muestra un mensaje descriptivo indicando el campo faltante (por ejemplo, "Error: First Name is required").

*   **Escenario Negativo 2: Autenticación con credenciales bloqueadas**
    *   *Descripción*: Intentar ingresar utilizando la cuenta del usuario "locked_out_user".
    *   *Resultado esperado*: El sistema bloquea el acceso e indica que el usuario ha sido deshabilitado temporal o permanentemente.

*   **Escenario Negativo 3: Intento de evasión de inicio de sesión**
    *   *Descripción*: Tratar de acceder de forma directa mediante la URL a la ruta de catálogo ("/inventory.html") en una sesión limpia sin autenticar.
    *   *Resultado esperado*: Redirección inmediata a la página de login con un aviso de acceso no autorizado.

### 3. Dos Posibles Riesgos o Defectos Encontrados

*   **Ausencia de validación de formato en el formulario de envío (Checkout)**
    *   *Descripción*: El formulario inicial de checkout no valida el formato del código postal (permite letras y caracteres especiales) ni del nombre y apellido (permite ingresar números o caracteres aleatorios). Esto representa un riesgo operativo, ya que datos de dirección incorrectos pasarían al backend o a APIs de pasarela y logística, provocando errores posteriores.

*   **Falta de validaciones o límites de stock en cantidades**
    *   *Descripción*: La aplicación restringe la adición de cada producto a una única unidad (el botón de "Add to cart" cambia a "Remove"). No existe un selector de cantidad. Para un flujo comercial normal, esto introduce el riesgo de no cumplir con las expectativas del usuario de comprar más de un artículo de la misma referencia de manera directa.

### 4. Estrategia de Pruebas Antes de Liberar a Producción (Pre-release)

Para asegurar una puesta en producción exitosa y mitigar fallos imprevistos, se aplicarían los siguientes niveles de pruebas:

*   **Pruebas de Humo (Smoke Testing)**
    *   *Objetivo*: Validar los flujos esenciales (login, adición de producto al carrito y compra completa exitosa).
    *   *Justificación*: Asegura que los caminos críticos del negocio que generan transacciones estén operativos. Si falla la facturación o la autenticación, la aplicación queda inservible.

*   **Pruebas de Regresión Automatizadas**
    *   *Objetivo*: Ejecutar la suite completa para comprobar flujos secundarios, validaciones negativas y respuestas ante errores comunes.
    *   *Justificación*: Permite confirmar que nuevas características, configuraciones o correcciones de bugs no han afectado funcionalidades preexistentes de la plataforma.

*   **Pruebas Multiplataforma (Cross-Browser y Dispositivos)**
    *   *Objetivo*: Correr las pruebas automáticamente en los motores Chromium, Firefox y WebKit (emulando vistas móviles).
    *   *Justificación*: Una gran parte de los usuarios de e-commerce navegan desde teléfonos móviles y navegadores variados (como Safari en iOS). Las diferencias de renderizado o compatibilidad de scripts en estos entornos suelen causar caídas en la tasa de conversión si no se verifican previamente.

*   **Validaciones de Integración y Fallos en Red**
    *   *Objetivo*: Simular latencias altas en las respuestas de servicios externos y respuestas erróneas controladas.
    *   *Justificación*: Al depender de llamadas REST y pasarelas de cobro, la aplicación debe ser tolerante a caídas de red y reaccionar de forma elegante sin colapsar el navegador del usuario.
