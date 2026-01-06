# Poetica - Frontend

Modern, animated poetry generation interface built with Next.js 16 and React 19.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **React**: Version 19 with Server Components
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + CSS Modules
- **UI Components**: [shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://framer.com/motion)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev) + [Remix Icons](https://remixicon.com)
- **PDF Export**: [@react-pdf/renderer](https://react-pdf.org), jspdf, html2canvas

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── about/             # About page
│   ├── create/            # Poem creation page
│   ├── favorites/         # Saved poems
│   ├── learn/             # Poetry guides
│   ├── my-poems/          # User's poems
│   └── api/               # API routes
│
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn)
│   ├── landing/          # Landing page sections
│   └── ...               # Feature components
│
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── providers/             # Context providers
├── config/                # App configuration
├── constants/             # App constants
└── utils/                 # Helper functions
```

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key for title generation |

## 🎨 Key Features

- **Poem Creation**: Interactive form with style, tone, and complexity controls
- **AI Title Generation**: Auto-generate titles using Google Gemini
- **PDF Export**: Download poems as styled PDF documents
- **Favorites**: Local storage-based favorites system
- **Learning Section**: Poetry tutorials and guides
- **Responsive Design**: Mobile-first, fully responsive UI
- **Dark Theme**: Beautiful dark-themed interface with animations

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

Configuration is handled via `vercel.json`.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://radix-ui.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
