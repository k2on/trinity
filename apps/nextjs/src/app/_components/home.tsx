import Image from "next/image";
import Link from "next/link";

import { signOut } from "@acme/auth";
import { Button } from "@acme/ui/button";

import Calendar from "./calendar";
import Friends from "./friends";

export default async function Home() {
  return (
    <main className="h-screen">
      <div className="flex flex-row">
        <div className="flex h-screen w-64 flex-col justify-between border-r">
          <div>
            <Image
              className="mx-auto py-4"
              src="/logo.png"
              alt="logo"
              width={100}
              height={100}
            />
            <Friends />
          </div>

          <div className="flex-1" />
          <div>
            <Link href={"/settings"}>
              <Button variant={"outline"}>Calendar Settings</Button>
            </Link>
            <form>
              <Button
                variant={"outline"}
                formAction={async () => {
                  "use server";
                  await signOut();
                }}
              >
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <Calendar />
      </div>
    </main>
  );
}
