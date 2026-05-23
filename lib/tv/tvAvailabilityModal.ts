type Listener = (visible: boolean) => void;

const listeners = new Set<Listener>();
let visible = false;

export function subscribeTvAvailabilityModal(listener: Listener) {
  listeners.add(listener);
  listener(visible);
  return () => listeners.delete(listener);
}

export function showTvAvailabilityModal() {
  visible = true;
  listeners.forEach((l) => l(true));
}

export function dismissTvAvailabilityModal() {
  visible = false;
  listeners.forEach((l) => l(false));
}
