import React from "react";
import TransitionLayout from "@src/utils/pageTransition";
import HomeWrapper from "@components/themes/default/components/home/homeWrapper/homeWrapper";
import { Metadata } from "next";
// export const metadata = { title: `toptiertravel` } satisfies Metadata;
export default async function Page() {
  return (
    <TransitionLayout>
      <div className="flex  flex-col bg-white dark:bg-gray-900  dark:text-gray-50 ">
        <HomeWrapper />
      </div>
    </TransitionLayout>
  );
}
export const dynamic = "force-dynamic"; // Optional: if data changes often
// export const revalidate = 3600; // ← This enables ISR
