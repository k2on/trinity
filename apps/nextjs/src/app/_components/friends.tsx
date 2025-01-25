"use client";

import { useState } from "react";
import { create } from "zustand";

import { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";

interface SelectedState {
  selected: Set<string>;
  toggle: (id: string) => void;
}
export const useSelectedFriendsStore = create<SelectedState>()((set) => ({
  selected: new Set<string>(),
  toggle: (id: string) => {
    set((state) => {
      const newSelected = new Set<string>(state.selected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { selected: newSelected };
    });
  },
}));

export default function Friends() {
  const { data: friends } = api.friends.list.useQuery();
  const { selected, toggle } = useSelectedFriendsStore();

  return (
    <div className="px-2">
      <span className="text-sm font-semibold">Friends</span>

      <div className="flex flex-col gap-2">
        {friends != undefined ? (
          friends.length > 0 ? (
            friends?.map((friend) => (
              <Friend
                isSelected={selected.has(friend.id)}
                onClick={() => {
                  toggle(friend.id);
                }}
                friend={friend}
              />
            ))
          ) : (
            <div className="text-sm">No friends</div>
          )
        ) : null}
      </div>
    </div>
  );
}

function Friend({
  friend,
  isSelected,
  onClick,
}: {
  friend: RouterOutputs["friends"]["list"][number];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} className="flex flex-row items-center gap-2">
      <img src={friend.image || ""} className="h-10 w-10 rounded-full" />
      <span>{friend.name}</span>
    </div>
  );
}
