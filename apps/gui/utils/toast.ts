import { toast } from "burnt";

export const error = (title: string) => () => {
    toast({
        preset: "error",
        title,
        message: "Please try again later",
    });
};
