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
            <div className="flex flex-row items-center justify-center gap-1">
              <Image
                className="py-4 dark:invert"
                src="/logo.png"
                alt="logo"
                width={20}
                height={20}
              />
              <span className="font-bold">Trinity</span>
            </div>

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
