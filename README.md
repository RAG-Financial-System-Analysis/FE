# Frontend Application

Frontend application for RAG (Retrieval-Augmented Generation) system built with React and TypeScript.

## 📋 Prerequisites

- **Node.js**: Version >= 20.0.0 and < 21.0.0
- **npm**: Version 8+ (comes with Node.js)

## 🚀 Getting Started

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd FE
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🛠️ Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build the application for production     |
| `npm run preview`      | Preview the production build locally     |
| `npm run lint`         | Run ESLint to check code quality         |
| `npm run lint:fix`     | Run ESLint and automatically fix issues  |
| `npm run prettier`     | Check code formatting with Prettier      |
| `npm run prettier:fix` | Format code with Prettier                |

## 🏗️ Tech Stack

- **React**: ^19.2.0 - UI library
- **TypeScript**: ~5.9.3 - Type safety
- **Vite**: 7.2.5 (Rolldown) - Build tool and dev server
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting

## 📁 Project Structure

```
FE/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── App.tsx      # Main application component
│   ├── main.tsx     # Application entry point
│   └── index.css    # Global styles
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

## 🔧 Configuration

### ESLint
The project uses ESLint with TypeScript and React-specific rules. Configuration is in `eslint.config.js`.

### Prettier
Code formatting rules are defined in `.prettierrc`.

### TypeScript
TypeScript configuration is split across multiple files:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application-specific settings
- `tsconfig.node.json` - Node.js-specific settings

## 🤝 Contributing

1. Ensure your Node.js version is >= 20.0.0 and < 21.0.0
2. Install dependencies: `npm install`
3. Run linting: `npm run lint`
4. Run formatting: `npm run prettier`
5. Test your changes: `npm run dev`

## 📝 Notes

- This project uses Rolldown-Vite as the build tool for improved performance
- React 19.2.0 includes the latest features and improvements
- All code should follow the ESLint and Prettier configurations
