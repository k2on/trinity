"use client";

import { useEffect, useState } from "react";

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

  const [now, setNow] = useState(new Date());

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

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex w-full flex-row">
      <div className="relative flex w-full flex-row">
        <div className="absolute z-10 w-full border-b bg-background">
          <div className="flex w-full flex-row">
            <div className="w-12" />
            <div className="flex w-full flex-row py-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date(start.getTime() + i * MS_DAY);

                return (
                  <div className="relative w-full text-center" key={i}>
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        d.getDay()
                      ]
                    }{" "}
                    {d.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row">
          <div className="w-12 overflow-hidden">
            {Array.from({ length: 23 }).map((_, j) => (
              <div
                style={{ height: "calc(100vh / 24)" }}
                className="pr-2 pt-6 text-right text-sm"
                key={j}
              >
                <span className="pr-1 font-semibold text-muted-foreground">
                  {j > 11 ? j - 11 : j + 1}
                </span>
                <span className="text-[8px] font-semibold text-muted-foreground">
                  {j > 10 ? "PM" : "AM"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-row">
            {Array.from({ length: 7 }).map((_, i) => (
              <div className="relative w-full" key={i}>
                <div className="inset-right-0 absolute inset-0">
                  {dayEvents(new Date(start.getTime() + MS_DAY * i)).map(
                    (e) => (
                      <div
                        style={{
                          top: `calc(100vh * ${(e.start.getHours() * 60 + e.start.getMinutes()) / (60 * 24)})`,
                          height: `calc(100vh * ${(e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60 * 24)})`,
                          borderColor: e.calendar.color,
                        }}
                        className="absolute w-full border-l bg-secondary pl-2"
                      >
                        <span className="text-xs">{e.name}</span>
                      </div>
                    ),
                  )}
                </div>

                {i == now.getDay() && (
                  <>
                    <div
                      style={{
                        top: `calc(100vh * ${(now.getHours() * 60 + now.getMinutes()) / (60 * 24)})`,
                      }}
                      className="absolute h-1 w-full bg-red-600 blur"
                    />
                    <div
                      style={{
                        top: `calc(100vh * ${(now.getHours() * 60 + now.getMinutes()) / (60 * 24)})`,
                      }}
                      className="absolute h-1 w-full rounded-full bg-red-600"
                    />
                  </>
                )}

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
        </div>
      </div>
    </div>
  );
}
