"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
import { ThemeToggle } from "@acme/ui/theme";

import { api } from "~/trpc/react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const { mutate } = api.service.addApple.useMutation({
    onSuccess(data, variables, context) {
      router.push("/");
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-lg rounded-xl bg-zinc-900 p-4">
        <ThemeToggle />
        <h1 className="text-2xl font-bold">Apple Calendar Settings</h1>
        <p>
          Generate an app specific password to use with Cal.com at{" "}
          <a target="_blank" href="https://appleid.apple.com/account/manage">
            <b>https://appleid.apple.com/account/manage</b>
          </a>
          . Your credentials will be stored and encrypted.
        </p>
        <br />

        <label>Apple ID</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br />
        <br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br />

        <div className="flex flex-row gap-2">
          <Link href="/">
            <Button variant={"outline"}>Back</Button>
          </Link>
          <Button onClick={() => mutate({ email, password })}>Save</Button>
        </div>
      </div>
    </div>
  );
}
