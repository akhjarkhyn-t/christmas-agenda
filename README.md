# Agenda UI

A modern, animated agenda timeline application with a beautiful hero section featuring fireworks, snow, and a building illustration.

## Features

- 🎆 Animated fireworks display
- ❄️ Snowflake animations
- 🏢 Golomt building illustration
- 📅 Interactive agenda timeline
- 🎉 Afterparty suggestions section
- ✨ Smooth scroll animations

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Canvas API for animations

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for Vercel deployment.

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration
4. Deploy!

The project includes:
- `vercel.json` - Vercel configuration
- Proper SPA routing setup
- Public assets configuration

## Project Structure

```
├── public/
│   └── golomt-building.svg
├── src/
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── AgendaTimeline.jsx
│   │   ├── TimelineItem.jsx
│   │   └── AfterParty.jsx
│   ├── data/
│   │   ├── agendaData.js
│   │   └── afterPartyData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vercel.json
├── vite.config.js
└── package.json
```

