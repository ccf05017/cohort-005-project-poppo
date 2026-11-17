import { buildGreeting } from "./lib/impl";

/** The package's public surface: one small function over hidden behaviour. */
export function greet(name: string): string {
  return buildGreeting(name);
}
