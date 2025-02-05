import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignUp from "@/features/auth/components/sign-up";
import { auth } from "@/features/auth/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async () => {
  const existingUser = await db.select().from(user);

  if (existingUser.length > 0) {
    return redirect("/sign-in");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/dashboard");
  }

  return <SignUp />;
};

export default SignUpPage;
