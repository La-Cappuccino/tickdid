# TickDid - AI-Enhanced Task Management

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)
![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-blue)
![Maintained](https://img.shields.io/badge/Maintained-yes-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

TickDid is an innovative task management solution that leverages AI capabilities while maintaining strict privacy standards. Built with Next.js and modern web technologies, it offers an intuitive interface for efficient task organization without compromising user privacy or data security.

## 🎯 Overview

TickDid combines powerful task management with AI-driven insights, all while keeping your data private and secure. Perfect for individuals and teams who value both productivity and privacy.

### Why TickDid?

- 🔒 Privacy-first approach with local data storage
- 🧠 AI-enhanced task organization
- ⚡ Lightning-fast performance
- 🎨 Modern, intuitive interface
- 🔄 Real-time updates
- 📱 Responsive across all devices

## 📸 Screenshots

### Dashboard Overview
![TickDid Dashboard](docs/screenshots/dashboard.png)
*Main dashboard showing task management interface with calendar, task stats, and intuitive navigation*

**Key Features Shown:**
- Clean, minimalist interface with violet theme
- Smart task organization and filtering
- Interactive calendar with task integration
- Real-time task statistics and progress tracking
- Responsive sidebar with quick navigation
- Modern card-based task display

## 🌟 Key Features

- **AI-Enhanced Task Management**
  - Intelligent task organization and prioritization
  - Context-aware task grouping and suggestions
  - Smart due date recommendations
  - Automated priority inference
  - Real-time task optimization

- **Privacy-First Design**
  - Zero data collection policy
  - Local-first architecture
  - GDPR and Norwegian privacy law compliance
  - End-to-end encrypted storage
  - Full data sovereignty

- **Modern UI/UX**
  - Clean, minimalist design
  - Customizable violet theme
  - Intuitive task organization
  - Smooth animations
  - Dark/Light modes
  - Interactive dashboard
  - Accessibility focused

## 🛠 Tech Stack

- **Core**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **State**: Zustand with encrypted persistence
- **UI**: Radix UI + Shadcn/ui
- **Storage**: Encrypted IndexedDB/LocalStorage
- **Date Management**: date-fns
- **Build Tools**: Webpack 5
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/La-Cappuccino/tickdid.git

# Navigate to project directory
cd tickdid

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start managing your tasks.

## 🔒 Privacy & Security

### GDPR & Norwegian Privacy Compliance

- **Data Protection**
  - Strict data minimization
  - No personal data collection
  - Complete data portability
  - Transparent processing

- **Legal Framework**
  - Full GDPR compliance
  - Personopplysningsloven adherence
  - Datatilsynet guidelines implementation
  - Regular compliance audits

- **User Rights**
  - Access and portability
  - Deletion and rectification
  - Processing restriction
  - Data export in standard formats

### Security Architecture

- **Client-Side Security**
  - AES-256 encryption for stored data
  - Secure key derivation (PBKDF2)
  - XSS prevention
  - CSRF protection
  - Input sanitization
  - Content Security Policy

- **Data Protection**
  - Zero external transmission
  - Encrypted local storage
  - Secure state management
  - Regular security patches

- **Best Practices**
  - OWASP compliance
  - Regular security audits
  - Automated vulnerability scanning
  - Secure development lifecycle

## 🏗 Architecture

```plaintext
tickdid/
├── src/
│   ├── app/                 # Next.js pages & routing
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   └── features/       # Feature-specific components
│   ├── lib/                # Core business logic
│   │   ├── store/          # State management
│   │   ├── utils/          # Utility functions
│   │   └── hooks/          # Custom React hooks
│   ├── styles/             # Global styles & themes
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
└── tests/                 # Test suites
```

## 💡 Smart Features

1. **Task Intelligence**
   - Priority suggestions
   - Due date recommendations
   - Task grouping
   - Tag management

2. **Data Management**
   - Local-first approach
   - Encrypted storage
   - Automatic backups
   - Data export/import

3. **UI/UX**
   - Responsive design
   - Keyboard shortcuts
   - Gesture support
   - Accessibility features

## 🔄 State Management

- Zustand store with persistence
- Type-safe actions
- Optimized performance
- Local encryption
- Automatic state recovery

## 🎨 Design System

- **Theme**
  - Primary: Violet (#8B5CF6)
  - Secondary: Gray scale
  - System-based dark mode
  - Consistent spacing (4/8/16px)

- **Components**
  - Accessible components
  - WCAG 2.1 compliant
  - Responsive layouts
  - Fluid animations

## 📱 Responsive Design

- Mobile-first approach
- Progressive enhancement
- Touch-optimized
- Breakpoints:
  ```css
  sm: 640px  /* Mobile landscape */
  md: 768px  /* Tablets */
  lg: 1024px /* Laptops */
  xl: 1280px /* Desktops */
  ```

## 🚀 Performance

- Lighthouse score > 90
- Core Web Vitals optimized
- Code splitting
- Image optimization
- Efficient re-renders
- Cached computations

## 🔜 Roadmap

1. **Current**
   - [x] Core task management
   - [x] Local storage
   - [x] GDPR compliance
   - [x] Basic AI features

2. **Next**
   - [ ] Enhanced AI capabilities
   - [ ] Advanced task analytics
   - [ ] Keyboard shortcuts
   - [ ] Data export tools

3. **Future**
   - [ ] Optional cloud sync
   - [ ] Mobile apps
   - [ ] Browser extension
   - [ ] API integration

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md).

## 📬 Contact

- Developer: La-Cappuccino
- Email: echoalgoridata@gmail.com
- Repository: [github.com/La-Cappuccino/tickdid](https://github.com/La-Cappuccino/tickdid)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Shadcn/ui](https://ui.shadcn.com/)
