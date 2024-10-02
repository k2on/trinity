import { Image } from "expo-image";
import { cssInterop } from "nativewind";
// cssInterop(Image, { className: "style" });

const DEFAULT =
    "https://www.tenforums.com/geek/gars/images/2/types/thumb_14331780800User.png";

interface AvatarProps {
    size: number;
    account: {
        name: string;
        profileImageUrl: string | null;
    } | null;
}

export function Avatar({ size, account }: AvatarProps) {
    return (
        <Image
            transition={500}
            style={{ width: size, height: size, borderRadius: 100 }}
            source={account?.profileImageUrl || DEFAULT}
        />
    );
}
