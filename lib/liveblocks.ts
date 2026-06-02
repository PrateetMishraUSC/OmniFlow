import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#64B5F6",
  "#4DD0E1",
  "#81C784",
  "#FFD54F",
  "#FF8A65",
] as const;

function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getCursorColor(userId: string): string {
  return CURSOR_COLORS[hashUserId(userId) % CURSOR_COLORS.length];
}

declare global {
  // eslint-disable-next-line no-var
  var _liveblocks: Liveblocks | undefined;
}

export function getLiveblocksClient(): Liveblocks {
  if (globalThis._liveblocks) return globalThis._liveblocks;
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  globalThis._liveblocks = new Liveblocks({ secret });
  return globalThis._liveblocks;
}
