import { db, eq, schema } from "@trinity/db";

interface PushOptions {
    userId: string;
    title: string;
    body: string;
}

export const push = async (options: PushOptions) => {
    const user = await db.query.users.findFirst({
        where: eq(schema.users.id, options.userId),
    });
    if (!user) throw Error("User not found");
    if (!user.pushToken) return;
    const message = {
        to: user.pushToken,
        sound: "default",
        title: options.title,
        body: options.body,
        data: { someData: "goes here" },
    };

    console.log("sending", options);
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
};
