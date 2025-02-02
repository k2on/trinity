import { redirect } from "next/navigation";

import { auth, signIn } from "@acme/auth";
import { Button } from "@acme/ui/button";

import Home from "./_components/home";

export default async function Page() {
  const session = await auth();
  if (!session)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold">Welcome to Trinity</h1>

        <form>
          <Button
            size="lg"
            formAction={async () => {
              "use server";
              await signIn("apple");
            }}
          >
            Apple Sign
          </Button>
          <br />
          <br />

          <Button
            size="lg"
            formAction={async () => {
              "use server";
              await signIn("google");
            }}
          >
            Google Sign
          </Button>
        </form>
      </div>
    );

  return <Home />;
}
