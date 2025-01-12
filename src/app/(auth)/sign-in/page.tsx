import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignIn from "@/features/auth/components/sign-in";
import { auth } from "@/features/auth/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/dashboard");
  }

  return <SignIn />;
};

export default SignInPage;
