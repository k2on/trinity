"use client";

import { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/react";
import { useSelectedFriendsStore } from "./friends";

const MS_DAY = 1000 * 60 * 60 * 24;

/**
 * Return the last Sunday of the given date
 * @param from
 */
function getLastSunday(from: Date): Date {
  const day = from.getDay();
  const date = new Date(from.getTime() + -day * MS_DAY);
  date.setHours(0, 0, 0, 0);
  return date;
}

type Cal = RouterOutputs["service"]["getEvents"][number];

export default function Calendar() {
  const { selected } = useSelectedFriendsStore();
  const { data } = api.service.getEventsByFriend.useQuery(
    [...selected][0] || "",
    {
      enabled: selected.size > 0,
    },
  );

  const { data: me } = api.service.getEvents.useQuery();

  //   if (!data) return <div>Loading</div>;

  const events =
    me?.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.events.map((e) => ({ ...e, calendar: cur })),
      ],
      [] as (Cal["events"][number] & {
        calendar: { name: string; color: string };
      })[],
    ) || [];

  console.log("events", events);

  const start = getLastSunday(new Date());

  function dayEvents(date: Date) {
    const start = date;
    const end = new Date(date.getTime() + MS_DAY);
    const filtered = events.filter((e) => e.start >= start && e.end <= end);

    return filtered;
  }

  return (
    <div className="flex w-full flex-row">
      {Array.from({ length: 7 }).map((_, i) => (
        <div className="relative w-full" key={i}>
          <div className="inset-right-0 absolute inset-0">
            {dayEvents(new Date(start.getTime() + MS_DAY * i)).map((e) => (
              <div
                style={{
                  top: `calc(100vh * ${(e.start.getHours() * 60 + e.start.getMinutes()) / (60 * 24)})`,
                  height: `calc(100vh * ${(e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60 * 24)})`,
                  borderColor: e.calendar.color,
                }}
                className="absolute w-full border-l bg-secondary pl-2"
              >
                <span className="text-sm">{e.name}</span>
              </div>
            ))}
          </div>

          {i == 8 && (
            <>
              <div
                style={{ top: 370, height: 90 }}
                className="absolute left-1 w-1 rounded-full bg-green-400"
              />
              <div
                style={{ top: 370, height: 90 }}
                className="absolute left-1 w-1 rounded-full bg-green-400 blur"
              />
            </>
          )}

          {Array.from({ length: 24 }).map((_, j) => (
            <div
              style={{ height: "calc(100vh / 24)" }}
              className="border-b border-r"
              key={j}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
