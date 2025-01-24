"use client";

import { useState } from "react";

import { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

export default function Friends() {
  const { data: friends } = api.friends.list.useQuery();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col gap-2">
      {friends?.map((friend) => (
        <span
          onClick={() =>
            setSelected((s) => {
              s.has(friend.id) ? s.delete(friend.id) : s.add(friend.id);
              return s;
            })
          }
        >
          <Friend friend={friend} />
        </span>
      ))}
    </div>
  );
}

function Friend({
  friend,
}: {
  friend: RouterOutputs["friends"]["list"][number];
}) {
  return (
    <div className="flex flex-row items-center gap-2">
      <img src={friend.image || ""} className="h-10 w-10 rounded-full" />
      <span>{friend.name}</span>
    </div>
  );
}
