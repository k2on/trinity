import { View, Text } from "react-native";

export default function Page() {
    return (
        <View>
            <Text className="text-4xl text-white">
                Terms of Service for Trinity
            </Text>
            <View className="flex flex-col gap-4">
                <Text className="text-white">
                    Welcome to Trinity! These Terms of Service ("Terms")
                    govern your access to and use of our mobile and web
                    applications ("Service") provided by Koon Industries LLC.
                    ("us", "we", or "our"). By accessing or using the Service,
                    you agree to comply with these Terms. If you do not agree,
                    please do not use the Service.
                </Text>
                <Text className="text-white">
                    To use our services, users must register using a phone
                    number and a One-Time Password (OTP). We collect essential
                    information such as name and, optionally, a profile picture.
                </Text>

                <Text className="text-white">
                    Users are responsible for ensuring their actions comply with
                    all applicable laws and safety standards. Koon Industries
                    LLC is not responsible for the actions of any user on the
                    platform.
                </Text>

                <Text className="text-white">
                    We prioritize protecting user data, adhering to best
                    practices in data security and privacy. Please refer to our
                    Privacy Policy for detailed information on how we handle
                    user data.
                </Text>
                <Text className="text-white">
                    Koon Industries LLC shall not be liable for indirect,
                    incidental, special, consequential, or punitive damages
                    arising out of or related to your use of our services, to
                    the fullest extent permitted by law.
                </Text>

                <Text className="text-white">
                    Users agree to indemnify and hold harmless Koon Industries
                    LLC from any claims, liabilities, or expenses arising from
                    their use of the services, violation of these Terms, or
                    violation of any applicable laws.
                </Text>

                <Text className="text-white">
                    We reserve the right to modify these Terms at any time.
                    Changes will be effective immediately upon posting on our
                    platform.
                </Text>
                <Text className="text-white">
                    These Terms shall be governed by the laws of the
                    jurisdiction in which our company is registered. All
                    disputes related to these Terms will be resolved under the
                    jurisdiction of these laws.
                </Text>

                <Text>
                    If you have any questions about these Terms, please contact
                    us at max@koonindustries.com.
                </Text>
            </View>
        </View>
    );
}
