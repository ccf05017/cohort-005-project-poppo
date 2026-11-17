// Internal to the example package: reachable only through ../index.ts.
export function buildGreeting(name: string): string {
  const trimmed = name.trim();
  return trimmed === "" ? "Hello, stranger!" : `Hello, ${trimmed}!`;
}
