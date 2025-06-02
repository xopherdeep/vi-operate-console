<div align="center">
  <img src="public/assets/images/Logo.svg" alt="Vi Operate Console Logo" width="180" />
  <h1>Vi Operate Console</h1>
  <p>Advanced AI-powered workforce management and forecasting platform</p>
  
  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=flat-square" alt="Built with Next.js"></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/Language-TypeScript-blue?style=flat-square" alt="Language TypeScript"></a>
    <a href="https://ui.shadcn.com"><img src="https://img.shields.io/badge/UI-Shadcn%2FUI-purple?style=flat-square" alt="UI Shadcn/UI"></a>
    <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square" alt="Deployed on Vercel"></a>
  </p>
</div>

## 📋 Contents

- [📋 Contents](#-contents)
- [🔍 Overview](#-overview)
  - [Target Users](#target-users)
  - [Key Value Propositions](#key-value-propositions)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🧩 Key Concepts](#-key-concepts)
  - [Navigation Structure](#navigation-structure)
- [📸 Screenshots](#-screenshots)
- [📁 File Structure](#-file-structure)
  - [Component Organization](#component-organization)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [💻 Development Workflow](#-development-workflow)
  - [Branch Naming Convention](#branch-naming-convention)
  - [Code Quality Checks](#code-quality-checks)
  - [Pre-commit Hooks](#pre-commit-hooks)
- [🔐 Environment Variables](#-environment-variables)
- [📦 Deployment](#-deployment)
  - [Vercel Deployment](#vercel-deployment)
  - [Manual Deployment](#manual-deployment)
- [🧪 Testing](#-testing)
- [❓ Troubleshooting](#-troubleshooting)
  - [Common Issues](#common-issues)
- [🗺️ Roadmap](#️-roadmap)
- [👥 Contributing](#-contributing)
- [📄 License](#-license)

## 🔍 Overview

Vi Operate Console is a comprehensive workforce management and forecasting platform specifically designed for call centers and other operational environments. The platform leverages artificial intelligence to transform how organizations predict demand, schedule staff, and allocate resources.

### Target Users
- **Call Center Managers**: Monitor performance, optimize staffing levels
- **Workforce Planners**: Develop efficient schedules based on historical patterns
- **Operations Directors**: Track KPIs and make data-driven strategic decisions
- **Agents/Staff**: View schedules, monitor performance metrics, manage time off

### Key Value Propositions
- Reduce operational costs by 15-25% through AI-optimized staffing
- Improve customer satisfaction with automated forecasting
- Increase agent retention through better schedule optimization
- Deliver actionable insights through integrated dashboards and reports

## ✨ Features

- **AI-Powered Forecasting**: Predictive models for call volume, handling time, and staffing needs
- **Dynamic Dashboards**: Real-time monitoring of operational KPIs and agent performance
- **Automated Scheduling**: AI-optimized staff schedules that balance service levels and costs
- **Workflow Automation**: Customizable processes for forecasting, scheduling, and reporting
- **Integration Hub**: Connect with existing telephony systems, CRMs, and HR platforms
- **Alert System**: Proactive notifications for staffing shortages and performance issues

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org) for server components and routing
- **Language**: [TypeScript](https://www.typescriptlang.org) for type safety and developer experience
- **Authentication**: [Auth.js](https://authjs.dev) for secure user authentication
- **Database**: [Postgres](https://vercel.com/postgres) for structured data storage
- **Deployment**: [Vercel](https://vercel.com/docs/concepts/next.js/overview) for seamless deployment
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- **Components**: [Shadcn UI](https://ui.shadcn.com/) for accessible, reusable UI components
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) for performance and usage tracking
- **Formatting**: [Prettier](https://prettier.io) for consistent code formatting
- **State Management**: React hooks and context for client-side state
- **AI Integration**: Custom AI models for forecasting and optimization

## 🧩 Key Concepts

The platform revolves around these key resources:

- **Archetypes**: Data models for understanding historical patterns and forecasting future trends
- **Agents**: AI agents that perform specific tasks within workflows (forecasting, scheduling, analysis)
- **Workflows**: Automated processes that deliver forecasting and scheduling outputs
- **Sources**: Data integration points that provide inputs for forecasting and analysis
- **Reports**: Customizable views of historical data, forecasts, and performance metrics

### Navigation Structure

- **Dashboards**: Operational views for call center staffing and management
- **Reports**: Historical analysis and forecasting reports
- **Automations**: Workflows, Agents, Cron Jobs, Triggers, Data Streams
- **Archetypes**: Data models for pattern recognition
- **Sources**: Integration with external data sources

## 📸 Screenshots

<!-- Add 2-3 screenshots showing key features of the application -->
<!-- ![Dashboard View](public/assets/images/screenshots/dashboard.png) -->
<!-- ![Forecasting View](public/assets/images/screenshots/forecasting.png) -->
<!-- ![Agent Performance](public/assets/images/screenshots/agent-performance.png) -->

## 📁 File Structure

The project follows a page-centric architecture using Next.js App Router:

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   ├── error.tsx         # Root error handling
│   ├── not-found.tsx     # 404 page
│   ├── console/          # Main application
│   │   ├── layout.tsx    # Console layout
│   │   ├── page.tsx      # Console home page
│   │   ├── error.tsx     # Console error handling
│   │   ├── dashboards/   # Dashboard pages
│   │   ├── reports/      # Reports pages
│   │   ├── automations/  # Automation pages
│   │   │   ├── page.tsx  # Main automations page
│   │   │   ├── tabs.tsx  # Navigation tabs
│   │   │   ├── _common/  # Shared automation components
│   │   │   ├── builder/  # Legacy builder (redirects)
│   │   │   ├── create/   # Automation creation flow
│   │   │   ├── services/ # Automation-specific services
│   │   │   └── workflows/# Workflow-specific pages
│   │   │       └── builder/ # Visual workflow builder
│   │   ├── archetypes/   # Archetype pages
│   │   └── sources/      # Data source pages
│   ├── api/              # API routes
│   │   ├── agents/       # AI agents endpoints
│   │   ├── archetypes/   # Archetypes endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── automations/  # Automations endpoints
│   │   ├── metrics/      # Metrics and analytics endpoints
│   │   ├── reports/      # Reports endpoints
│   │   ├── seed/         # Database seeding endpoints
│   │   ├── sources/      # Data sources endpoints
│   │   └── workflows/    # Workflows endpoints
│   ├── auth/             # Authentication pages
│   │   └── page.tsx      # Login/signup page
│   └── dev/              # Developer tools pages
│       ├── page.tsx      # Developer home page
│       └── tools/        # Development utilities
│
├── components/           # Reusable UI components
│   ├── animated-background.tsx # Background animation component
│   ├── hydration-boundary.tsx  # React hydration boundary component
│   ├── index.ts          # Component exports
│   ├── web-vitals-tracker.tsx  # Performance metrics tracking
│   ├── common/           # Common components
│   │   ├── layout/       # Layout components
│   │   ├── navigation/   # Navigation components
│   │   ├── patterns/     # UI design patterns
│   │   └── ui/           # UI primitives (shadcn/ui)
│   ├── generated-bg/     # Background graphics generators
│   │   ├── box.ts
│   │   ├── c-shape.ts
│   │   ├── generated-bg.tsx
│   │   ├── hexagon.ts
│   │   ├── l-shape.ts
│   │   ├── platform.ts
│   │   ├── pyramid.ts
│   │   ├── sacred.ts
│   │   ├── stepped.ts
│   │   ├── t-shape.ts
│   │   ├── u-shape.ts
│   │   └── zigzag.ts
│   └── interactive-background/  # Interactive background components
│       └── interactive-background.tsx
│
├── constants/            # Application constants
│   └── connection-icons.ts # Icons for connection types
│
├── hooks/                # Custom React hooks
│   ├── index.ts
│   └── useAutomations.tsx # Automation-specific hooks
│
├── lib/                  # Utilities and services
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database utilities
│   ├── utils.ts          # General utilities
│   ├── api/              # API client and endpoints
│   │   ├── client.ts
│   │   └── endpoints.ts
│   ├── db/               # Database client and operations
│   │   ├── client.ts
│   │   ├── index.ts
│   │   ├── mock-data.ts
│   │   ├── mock-db.ts
│   │   ├── operations.ts
│   │   ├── schema.ts
│   │   └── mock-data/    # Structured mock data
│   ├── hooks/            # Library-specific hooks
│   │   ├── useApiContent.tsx
│   │   ├── useDataContent.tsx
│   │   ├── useFastRefreshState.ts
│   │   └── useIsMobile.ts
│   ├── mock-data/        # Mock data for development
│   │   ├── automations.ts
│   │   ├── helpers.ts
│   │   ├── inbound-call-center.ts
│   │   ├── index.ts
│   │   ├── outbound-call-center.ts
│   │   ├── reports.ts
│   │   ├── sources.ts
│   │   ├── types.ts
│   │   └── workflow-templates.ts
│   ├── services/         # Business logic services
│   │   └── dashboard-service.ts
│   └── utils/            # Utility functions
│       ├── fast-refresh.ts
│       ├── index.ts
│       ├── random.ts
│       └── refresh-dev-tools.ts
│
├── providers/            # React context providers
│   └── query-provider.tsx
│
├── services/             # Global business logic services (top-level)
│
├── styles/               # Global styles
│   ├── _globals.css
│   ├── animations.css
│   ├── base.css
│   ├── components.css
│   ├── tailwind.css
│   ├── theme.css
│   └── utilities.css
│
└── types/                # TypeScript type definitions
    ├── agent.d.ts        # AI agent types
    ├── archetype.d.ts    # Archetype data model types
    ├── automation.d.ts   # Automation process types
    ├── charts.d.ts       # Chart and visualization types
    ├── common.d.ts       # Shared type definitions
    ├── dashboard.d.ts    # Dashboard layout and data types
    ├── forecast.d.ts     # Forecasting types
    ├── index.ts          # Type exports
    ├── report.d.ts       # Reporting types
    ├── schedule.d.ts     # Scheduling types
    ├── source.d.ts       # Data source types
    ├── user.d.ts         # User and authentication types
    └── workflow.d.ts     # Workflow types
```

### Component Organization

The project follows these organization principles:

1. **Page-Centric Structure**: Each page in the `app/` directory represents a route in the application
2. **Component Reuse**: Common components in `components/common/` are extensively used across different page sections
3. **Feature Isolation**: Each feature (dashboards, reports, automations, etc.) has its own directory with page-specific components
4. **Separation of Concerns**: UI components are separate from business logic (in hooks and services)
5. **Module Organization**: Feature-specific components are organized within their respective module directories (e.g., `automations/_common/`)

This structure allows for:
- Clear separation between pages and reusable components
- Efficient component reuse across different sections
- Easy navigation between related files
- Scalable organization as more features are added
- Feature-specific components kept close to their usage

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [pnpm](https://pnpm.io/) (v8.0.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/vi-operate-console.git
cd vi-operate-console
```

2. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
pnpm install
```

4. Set up the database:

```bash
pnpm db:setup
```

5. Start the development server:

```bash
pnpm dev
```

You should now be able to access the application at http://localhost:3000.

## 💻 Development Workflow

### Branch Naming Convention

- `feature/`: New features or enhancements
- `fix/`: Bug fixes
- `docs/`: Documentation changes
- `refactor/`: Code refactoring
- `test/`: Adding or modifying tests

### Code Quality Checks

We use several tools to ensure code quality:

```bash
# Run ESLint
pnpm lint

# Run TypeScript type checking
pnpm type-check

# Format code with Prettier
pnpm format

# Run all checks
pnpm validate
```

### Pre-commit Hooks

We use [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to run code quality checks before each commit.

## 🔐 Environment Variables

The following environment variables are required:

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vi_operate

# Authentication
AUTH_SECRET=your-auth-secret
NEXTAUTH_URL=http://localhost:3000

# External APIs
API_KEY=your-api-key
```

For a complete list, see `.env.example`.

## 📦 Deployment

### Vercel Deployment

The easiest way to deploy the application is with [Vercel](https://vercel.com):

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy

### Manual Deployment

For manual deployment:

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 🧪 Testing

We use [Vitest](https://vitest.dev) for unit and integration tests:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## ❓ Troubleshooting

### Common Issues

- **Database connection errors**: Ensure your PostgreSQL server is running and the `DATABASE_URL` is correct
- **Authentication issues**: Check that `AUTH_SECRET` and `NEXTAUTH_URL` are properly configured
- **Build failures**: Make sure all dependencies are installed with `pnpm install`

For more help, check the [issue tracker](https://github.com/your-org/vi-operate-console/issues).

## 🗺️ Roadmap

- **Q2 2025**: Multi-channel forecasting capabilities
- **Q3 2025**: Advanced AI-driven scheduling optimization
- **Q4 2025**: Integration with workforce management systems

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
