import { ExpandableCard } from "@/components/expandable-card";
import { HydrateClient, trpc } from "@/trpc/server";
import { ClientGreeting } from "./client-greeting";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

const page = () => {
  void trpc.hello.prefetch();

  return (
    <div className="size-full">
      <ExpandableCard />

      <HydrateClient>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientGreeting />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </div>
  );
};

export default page;
