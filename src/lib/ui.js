// Tiny window-event bus so unrelated components (navbar, hero, palette, chat)
// can open each other without prop drilling or a global store.
export const EVENTS = {
  openChat: 'sg:open-chat',
  togglePalette: 'sg:toggle-palette',
  toast: 'sg:toast',
}

export const openChat = (prompt) =>
  window.dispatchEvent(new CustomEvent(EVENTS.openChat, { detail: { prompt } }))

export const togglePalette = () => window.dispatchEvent(new CustomEvent(EVENTS.togglePalette))

export const showToast = (message) =>
  window.dispatchEvent(new CustomEvent(EVENTS.toast, { detail: { message } }))

export const EMAIL = 'sg6227174@gmail.com'

export const LINKS = {
  github: 'https://github.com/sakshigupta372',
  linkedin: 'https://www.linkedin.com/in/sakshi-gupta-ba858a292/',
  x: 'https://x.com/gupt27951',
}

export const isMac = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)
