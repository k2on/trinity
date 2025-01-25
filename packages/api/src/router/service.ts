import type { TRPCRouterRecord } from "@trpc/server";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ICAL from "ical.js";
import { collectionQuery, createDAVClient } from "tsdav";
import { z } from "zod";

import { env } from "@acme/auth/env";
import { desc, eq } from "@acme/db";
import { db } from "@acme/db/client";
import { CalendarService, CreatePostSchema, Post } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";
import { symmetricDecrypt, symmetricEncrypt } from "../util";

dayjs.extend(isBetween);

export type Cal = {
  name: string;
  color: string;
  events: Event[];
};

export type Event = {
  start: Date;
  end: Date;
  name: string;
};

async function getClient(userId: string) {
  const secret = env.UNDERLAP_SECRET;

  const service = await db.query.CalendarService.findFirst({
    where: eq(CalendarService.userId, userId),
  });
  if (!service) return null;

  const credentials = JSON.parse(
    symmetricDecrypt(service.credentials!, secret),
  ) as { email: string; password: string };
  console.log("credentials", credentials);

  const client = await createDAVClient({
    serverUrl: "https://caldav.icloud.com",
    credentials: {
      username: credentials.email,
      password: credentials.password,
    },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });

  return client;
}

const MS_DAY = 1000 * 60 * 60 * 24;

function getLastSunday(from: Date): Date {
  const day = from.getDay();
  const date = new Date(from.getTime() + -day * MS_DAY);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function getCalendarForUser(userId: string, startTime: Date) {
  const client = await getClient(userId);

  if (!client) return [];

  const calendars = await client.fetchCalendars();

  //   const startTime = getLastSunday(new Date());
  const startISOString = startTime.toISOString();
  const endTime = new Date(startTime.getTime() + 1000 * 60 * 60 * 24 * 7);

  const cals: Cal[] = [];

  for (const calendar of calendars) {
    const o = await client.fetchCalendarObjects({
      calendar,
      timeRange: {
        start: startTime.toISOString(),
        end: endTime.toISOString(),
      },
    });

    const events: Event[] = [];

    for (const obj of o) {
      if (!obj.data) continue;

      const jcalData = new ICAL.Component(ICAL.parse(obj.data));
      const vevents = jcalData.getAllSubcomponents("vevent");
      vevents.forEach((vevent) => {
        const event = new ICAL.Event(vevent);

        // No not push "full day" events
        if (event.startDate.isDate) return;

        if (event.isRecurring()) {
          let maxIterations = 365;
          if (
            ["HOURLY", "SECONDLY", "MINUTELY"].includes(
              event.getRecurrenceTypes(),
            )
          ) {
            console.error(
              `Won't handle [${event.getRecurrenceTypes()}] recurrence`,
            );
            return;
          }

          const start = dayjs(startTime);
          const end = dayjs(endTime);
          const startDate = ICAL.Time.fromDateTimeString(startISOString);
          startDate.hour = event.startDate.hour;
          startDate.minute = event.startDate.minute;
          startDate.second = event.startDate.second;
          const iterator = event.iterator();
          // const iterator = event.iterator(startDate);
          let current: ICAL.Time;
          let currentEvent;
          let currentStart = null;
          let currentError;

          while (
            maxIterations > 0 &&
            (currentStart === null || currentStart.isAfter(end) === false) &&
            // this iterator was poorly implemented, normally done is expected to be
            // eturned
            (current = iterator.next())
          ) {
            maxIterations -= 1;

            try {
              // @see https://github.com/mozilla-comm/ical.js/issues/514
              currentEvent = event.getOccurrenceDetails(current);
            } catch (error) {
              if (error instanceof Error && error.message !== currentError) {
                currentError = error.message;
                console.error("error", error);
              }
            }
            if (!currentEvent) return;
            // do not mix up caldav and icalendar! For the recurring events here, the timezone
            // provided is relevant, not as pointed out in https://datatracker.ietf.org/doc/html/rfc4791#section-9.6.5
            // where recurring events are always in utc (in caldav!). Thus, apply the time zone here.
            //   if (vtimezone) {
            //     const zone = new ICAL.Timezone(vtimezone);
            //     currentEvent.startDate =
            //       currentEvent.startDate.convertToZone(zone);
            //     currentEvent.endDate = currentEvent.endDate.convertToZone(zone);
            //   }
            currentStart = dayjs(currentEvent.startDate.toJSDate());

            if (currentStart.isBetween(start, end) === true) {
              events.push({
                name: event.summary,
                start: currentStart.toDate(),
                end: currentEvent.endDate.toJSDate(),
              });
            }
          }
          if (maxIterations <= 0) {
            console.warn(
              "could not find any occurrence for recurring event in 365 iterations",
            );
          }
          return;
        }

        events.push({
          name: event.summary,
          start: event.startDate.toJSDate(),
          end: event.endDate.toJSDate(),
        });
      });
    }

    cals.push({
      // @ts-ignore
      name: calendar.displayName,
      // @ts-ignore
      color: calendar.calendarColor,
      events,
    });
  }
  return cals;
}

export const serviceRouter = {
  addApple: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const secret = env.UNDERLAP_SECRET;
      console.log("Secret", secret);

      const credentials = symmetricEncrypt(
        JSON.stringify({
          email: input.email,
          password: input.password,
        }),
        secret,
      );

      await ctx.db.insert(CalendarService).values({
        userId: ctx.session.user.id,
        type: "apple",
        credentials,
      });

      return true;
    }),
  getEvents: protectedProcedure
    .input(z.object({ start: z.date() }))
    .query(async ({ ctx, input }) => {
      return await getCalendarForUser(ctx.session.user.id, input.start);
    }),
  getEventsByFriend: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        start: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await getCalendarForUser(input.userId, input.start);
    }),
} satisfies TRPCRouterRecord;
