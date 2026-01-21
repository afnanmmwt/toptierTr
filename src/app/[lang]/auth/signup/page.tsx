import { SignUpForm } from "@components/themes/default/components/auth";
import { Metadata } from "next/types";
export const metadata = { title: `Signup` } satisfies Metadata;
export default async function Page() {
  return <SignUpForm />;
}
export const dynamic = "force-dynamic";
