type Handler = () => void;

let showAuthHandler: Handler | null = null;

export function setShowAuthHandler(handler: Handler | null) {
  showAuthHandler = handler;
}

export function requestShowAuthPhase() {
  showAuthHandler?.();
}
