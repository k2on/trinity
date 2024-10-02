import { authConfig } from "@trinity/auth";
import { makeAuth } from "@koons/auth";
import { db, eq, schema } from "@trinity/db";
import {
    createUploadthing,
    UploadThingError,
    createRouteHandler,
} from "uploadthing/server";
import z from "zod";
import type { FileRouter } from "uploadthing/server";

const f = createUploadthing();

const uploadRouter = {
    profileImage: f({
        image: {
            maxFileSize: "4MB",
        },
    })
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await makeAuth(authConfig)(req.headers);

            // If you throw, the user will not be able to upload
            if (!session) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: session.userId };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            // This code RUNS ON YOUR SERVER after upload

            const r = await db
                .update(schema.users)
                .set({
                    profileImageUrl: file.url,
                })
                .where(eq(schema.users.id, metadata.userId));

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;

export const { GET, POST } = createRouteHandler({
    router: uploadRouter,

    // Apply an (optional) custom config:
    // config: { ... },
});
