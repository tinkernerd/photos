"use client";
// <-- hooks can only be used in client components
import { trpc } from "@/trpc/client";

export function ClientGreeting() {
  const [data] = trpc.hello.useSuspenseQuery();

  return <div>{data.greeting}</div>;
}
