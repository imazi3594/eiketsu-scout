export type BeforeInstall = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstall | null = null;
const listeners = new Set<(event: BeforeInstall | null) => void>();

function emit() {
  for (const listener of listeners) listener(deferred);
}

let listening = false;

export function initInstallCapture() {
  if (typeof window === "undefined" || listening) return;
  listening = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as BeforeInstall;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

export function getInstallEvent() {
  return deferred;
}

export function subscribeInstall(listener: (event: BeforeInstall | null) => void) {
  listeners.add(listener);
  listener(deferred);
  return () => {
    listeners.delete(listener);
  };
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function deviceKind() {
  if (typeof navigator === "undefined") return { ios: false, iosChrome: false, android: false };
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/i.test(ua);
  const iosChrome = ios && /CriOS/i.test(ua);
  const android = /Android/i.test(ua);
  return { ios, iosChrome, android };
}
