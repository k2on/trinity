import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InfinitePager from "react-native-infinite-pager";

import { api, RouterOutputs } from "~/utils/api";

const { height: HEIGHT } = Dimensions.get("window");
const height = HEIGHT - 200;

type Cal = RouterOutputs["service"]["getEvents"][number];

const Page =
  (data: RouterOutputs["service"]["getEvents"]) =>
  ({ index }: { index: number }) => {
    const day = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * index);

    const events =
      data
        ?.reduce(
          (acc, cur) => [
            ...acc,
            ...cur.events.map((e) => ({ ...e, calendar: cur })),
          ],
          [] as (Cal["events"][number] & {
            calendar: { name: string; color: string };
          })[],
        )
        .filter((e) => e.start.toDateString() == day.toDateString()) || [];

    return (
      <View className="flex-1 items-center justify-center">
        <View className="absolute top-0 z-10 w-full flex-1">
          {events.map((event) => (
            <View
              key={event.name}
              style={{
                height:
                  (height * (event.end.getTime() - event.start.getTime())) /
                  (1000 * 60 * 60 * 24),
                top:
                  height *
                  ((event.start.getHours() * 60 + event.start.getMinutes()) /
                    (60 * 24)),
                borderLeftColor: event.calendar.color,
              }}
              className="absolute w-full border-l bg-zinc-800 px-2 pt-2"
            >
              <Text className="text-white">{event.name}</Text>
            </View>
          ))}
        </View>

        <View className="w-full flex-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <View
              key={i}
              style={{ height: height / 24 }}
              className="w-full border-b border-zinc-800"
            ></View>
          ))}
        </View>
      </View>
    );
  };

const MS_DAY = 1000 * 60 * 60;

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

export default function App() {
  const [index, setIndex] = useState(0);

  const { data } = api.service.getEvents.useQuery({
    start: getLastSunday(new Date()),
  });

  return (
    <View className="flex-1">
      <InfinitePager
        PageComponent={Page(data || [])}
        style={{ flex: 1 }}
        pageWrapperStyle={{ flex: 1 }}
        // onPageChange={(index) => {
        //   setIndex(index);
        // }}
      />
    </View>
  );
}
