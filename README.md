# 💰 Gestor de Préstamos

Plataforma web moderna para la administración, seguimiento y amortización de préstamos financieros con soporte para el **Sistema Francés (cuota fija)**, abonos a capital, recálculo dinámico de saldos, control de historial y exportación de estados de cuenta a PDF.

Diseñado con una estética minimalista premium, paleta de contraste adaptativa y modo oscuro integrado.

---

## ✨ Características Principales

- **📊 Dashboard Ejecutivo de Monitoreo:**
  - Resumen global de cartera: saldo total por cobrar, contratos activos y rendimiento estimado.
  - Indicador circular orbital interactivo de amortización en tiempo real.
  - Desglose instantáneo de capital recuperado, inversión base, intereses retornados y flujo total.

- **🏦 Gestión Integral de Préstamos:**
  - Creación de créditos con validación de montos, plazo en meses, tasa de interés anual (% E.A.) y fecha de inicio.
  - Edición en caliente de las condiciones y datos de los préstamos.
  - Eliminación segura con confirmación modal y borrado en cascada de pagos asociados.

- **⚡ Pagos y Abonos Inteligentes (Lógica Francesa):**
  - Registro de recaudos y pagos parciales mediante un cajón desplegable (*Drawer*).
  - Discriminación automática entre porción de interés corriente, capital base y abono extraordinario a capital.
  - Recálculo dinámico de la cuota e impacto directo en el capital insoluto.
  - Edición y actualización de pagos históricos con recalibración de saldo.

- **📑 Tabla de Amortización y Condiciones:**
  - Visualización cronológica de todas las cuotas generadas y proyectadas.
  - Ficha técnica legal con tasas nominales, sistema de amortización y frecuencia de pagos.

- **📄 Exportación de Estados de Cuenta a PDF:**
  - Generación client-side de comprobantes formales en formato PDF listos para imprimir o compartir (vía `jspdf` y `jspdf-autotable`).

- **🌓 Modo Claro y Oscuro:**
  - Temas claro y oscuro pulidos con transiciones suaves utilizando `next-themes`.

---

## 🛠️ Stack Tecnológico

- **Core & Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Lenguaje:** [TypeScript 5](https://www.typescriptlang.org/) / [React 19](https://react.dev/)
- **Estilos & Diseño:** [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://github.com/)
- **Componentes UI:** [Radix UI](https://www.radix-ui.com/) + [Shadcn/UI](https://ui.shadcn.com/) + [Vaul](https://vaul.emilkowal.ski/)
- **Base de Datos:** [SQLite](https://sqlite.org/) con [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) + [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Formularios & Validación:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Iconografía & Gráficos:** [Lucide React](https://lucide.dev/) + [Recharts](https://recharts.org/)
- **Fechas & Documentos:** [date-fns](https://date-fns.org/) + [jsPDF](https://github.com/parallax/jsPDF) + [Sonner](https://sonner.emilkowal.ski/)

---

## 📁 Estructura del Proyecto

```text
gestor-prestamos/
├── src/
│   ├── app/
│   │   ├── actions.ts           # Server Actions (CRUD préstamos y pagos)
│   │   ├── layout.tsx          # Layout principal con ThemeProvider y Sonner
│   │   ├── page.tsx            # Dashboard principal (KPIs y lista de préstamos)
│   │   └── loans/[id]/
│   │       └── page.tsx        # Vista detallada de préstamo y amortización
│   ├── components/
│   │   ├── ui/                 # Componentes base Shadcn / Radix
│   │   ├── loan-header.tsx     # Cabecera de préstamo con exportación PDF y borrado
│   │   ├── loan-stats.tsx      # Métricas ejecutivas y saldo pendiente
│   │   ├── loan-list.tsx       # Listado de tarjetas de crédito
│   │   ├── amortization-tabs.tsx # Tabla de cuotas y condiciones crediticias
│   │   ├── payment-history.tsx # Línea de tiempo scrollable del historial de pagos
│   │   ├── premium-circular-progress.tsx # Gráfico circular orbital de amortización
│   │   ├── register-payment-drawer.tsx   # Cajón de registro de cuotas y abonos
│   │   ├── create-loan-dialog.tsx        # Modal de creación de crédito
│   │   ├── edit-loan-dialog.tsx          # Modal de edición de crédito
│   │   └── theme-toggle.tsx    # Interruptor de modo oscuro / claro
│   ├── db/
│   │   ├── index.ts            # Conexión singleton a SQLite vía Drizzle
│   │   └── schema.ts           # Esquemas de tablas loans y payments
│   └── lib/
│       ├── finances.ts         # Motor matemático de amortización francesa
│       └── utils.ts            # Utilidades de clases Tailwind (cn)
├── sqlite.db                   # Base de datos local SQLite
├── package.json
└── README.md
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js**: v20 o superior
- **Gestor de paquetes**: `pnpm` (recomendado) o `npm`

### 1. Clonar e Instalar Dependencias

```bash
git clone https://github.com/MichaelTaboada2003/gestor-prestamos.git
cd gestor-prestamos
pnpm install
# o con npm: npm install
```

### 2. Base de Datos Local

La base de datos SQLite local se crea automáticamente al ejecutar el servidor, o puedes gestionarla con Drizzle Kit:

```bash
# Para inspeccionar la base de datos visualmente
pnpm drizzle-kit studio
```

### 3. Iniciar el Servidor de Desarrollo

```bash
pnpm dev
# o con npm: npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### 4. Compilación para Producción

```bash
pnpm build
pnpm start
```

---

## 🧮 Lógica Financiera Implementada

El sistema utiliza la fórmula del **Sistema Francés de Amortización** para calcular la cuota mensual fija:

$$C = \frac{P \times i}{1 - (1 + i)^{-n}}$$

Donde:
- $C$ = Valor de la cuota mensual.
- $P$ = Capital o saldo pendiente (*Principal*).
- $i$ = Tasa de interés periódica mensual ($Tasa / 12 / 100$).
- $n$ = Número de cuotas o meses restantes.

Cualquier valor pagado que supere la cuota mensual calculada se aplica de forma íntegra como **Abono Extraordinario a Capital**, recalculando automáticamente el saldo restante y amortizando el crédito en menor tiempo.

---

## 📄 Licencia

Proyecto privado desarrollado para gestión de cartera crediticia personal y comercial.
