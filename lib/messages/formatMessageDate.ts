function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calendarDaysAgo(reference: Date, target: Date): number {
  const ref = startOfDay(reference).getTime();
  const day = startOfDay(target).getTime();
  return Math.round((ref - day) / 86_400_000);
}

function capitalizeFr(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Date dans la liste des conversations (Aujourd'hui, Hier, …). */
export function formatConversationListDate(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const daysAgo = calendarDaysAgo(now, date);

  if (daysAgo === 0) return "Aujourd'hui";
  if (daysAgo === 1) return 'Hier';

  if (daysAgo < 7) {
    return capitalizeFr(date.toLocaleDateString('fr-FR', { weekday: 'long' }));
  }

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric', year: 'numeric' });
}

/** Séparateur de jour dans un fil de messages (Aujourd'hui, Hier, …). */
export function formatChatDateSeparator(iso: string, now = new Date()): string {
  return formatConversationListDate(iso, now);
}

/** Heure affichée sous chaque bulle. */
export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function messageDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
