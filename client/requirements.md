## Packages
framer-motion | Complex animations for page transitions and player state
lucide-react | Icons for the UI
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
Initializes Telegram WebApp on mount.
Uses HTML5 <audio> and <video> elements for playback.
Persistent player state management context required.
