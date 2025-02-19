import React, { useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import InfinitePager from "react-native-infinite-pager";
import { Stack } from "expo-router";
// import { Image } from "expo-image";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

import { api, RouterOutputs } from "~/utils/api";
import { useSignOut } from "~/utils/auth";

const { width, height: HEIGHT } = Dimensions.get("window");
const height = HEIGHT - 300;

type Cal = RouterOutputs["service"]["getEvents"][number];

type CalMarking = {
  marking: "free" | { name: string };
  start: Date;
  end: Date;
};

const Page =
  (
    data: RouterOutputs["service"]["getEvents"],
    friendEvents: RouterOutputs["service"]["getEventsByFriend"],
  ) =>
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

    function dayFreeTime(date: Date): CalMarking[] {
      if (friendEvents.length == 0) return [];
      const markings: CalMarking[] = [];

      const all =
        friendEvents
          ?.reduce(
            (acc, cur) => [
              ...acc,
              ...cur.events.map((e) => ({ ...e, calendar: cur })),
            ],
            [] as (Cal["events"][number] & {
              calendar: { name: string; color: string };
            })[],
          )
          .filter((e) => e.start.toDateString() == day.toDateString())
          .sort((a, b) => a.start.getTime() - b.start.getTime()) || [];

      const start = new Date(date.getTime());
      start.setHours(0, 0, 0);

      let curr = start;
      for (const event of all) {
        markings.push({
          marking: "free",
          start: curr,
          end: event.start,
        });
        markings.push({
          marking: { name: event.name },
          start: event.start,
          end: event.end,
        });
        curr = event.end;
      }
      const end = new Date(date.getTime());
      end.setHours(23, 59, 59);

      markings.push({
        marking: "free",
        start: curr,
        end,
      });

      return markings;
    }

    const freeTimes = dayFreeTime(day);

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
                width: width - 70,
              }}
              className="absolute ml-12 border-l bg-zinc-800 px-2 pt-2"
            >
              <Text className="text-white">{event.name}</Text>
            </View>
          ))}
        </View>

        <View className="absolute top-0 z-10 w-full flex-1">
          {freeTimes.map((event, i) => (
            <View
              key={i}
              style={{
                height:
                  (height * (event.end.getTime() - event.start.getTime())) /
                  (1000 * 60 * 60 * 24),
                top:
                  height *
                  ((event.start.getHours() * 60 + event.start.getMinutes()) /
                    (60 * 24)),
                right: 0,
                backgroundColor: event.marking == "free" ? "lime" : "gray",
              }}
              className="absolute ml-12 w-1 border-l px-2 pt-2"
            ></View>
          ))}
        </View>

        <View className="w-full flex-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <View
              key={i}
              className="flex flex-row"
              style={{ height: height / 24 }}
            >
              <View className="-mb-2 w-10 justify-end">
                <Text className="text-right text-white">
                  <Text className="text-xs">{i > 11 ? i - 11 : i + 1}</Text>
                  <Text className="text-xs">{i > 10 ? "PM" : "AM"}</Text>
                </Text>
              </View>

              <View className="flex-1 border-b border-zinc-800" />
            </View>
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
  const [selected, setSelected] = useState(new Set<string>());

  const { data } = api.service.getEvents.useQuery({
    start: getLastSunday(new Date()),
  });
  const { data: friendEvents } = api.service.getEventsByFriend.useQuery(
    {
      start: getLastSunday(new Date()),
      userId: selected.size > 0 ? [...selected.values()][0]! : "",
    },
    {
      enabled: selected.size > 0,
    },
  );
  const { data: friends } = api.friends.list.useQuery();

  const { colorScheme } = useColorScheme();
  const signOut = useSignOut();

  return (
    <View className="flex-1">
      <InfinitePager
        PageComponent={Page(data || [], friendEvents || [])}
        style={{ flex: 1 }}
        pageWrapperStyle={{ flex: 1 }}
        // onPageChange={(index) => {
        //   setIndex(index);
        // }}
      />
      <BottomSheet
        enableDynamicSizing={false}
        snapPoints={["20%", "100%"]}
        backgroundStyle={{
          backgroundColor: colorScheme == "dark" ? "#111" : "#eee",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme == "dark" ? "#333" : "#aaa",
        }}
      >
        <BottomSheetView>
          <View className="pt-4">
            <Text>
              {friends?.map((friend) => (
                <Friend
                  key={friend.id}
                  friend={friend}
                  isSelected={selected.has(friend.id)}
                  onPress={() => {
                    const newSelected = new Set([...selected]);
                    if (selected.has(friend.id)) {
                      newSelected.delete(friend.id);
                    } else {
                      newSelected.add(friend.id);
                    }
                    setSelected(newSelected);
                  }}
                />
              ))}
            </Text>
          </View>
          <Button
            onPress={() => {
              signOut();
            }}
            title="Logout"
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

function Friend({
  friend,
  isSelected,
  onPress,
}: {
  friend: RouterOutputs["friends"]["list"][number];
  isSelected: boolean;
  onPress: () => void;
}) {
  const SIZE = 70;

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex flex-col justify-center">
        <Image
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: 50,
            borderColor: "white",
            borderWidth: isSelected ? 4 : 0,
          }}
          source={{ uri: friend.image || "" }}
        />
        <View className="pt-2">
          <Text className="text-center text-white">
            {friend.name?.split(" ")[0]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
