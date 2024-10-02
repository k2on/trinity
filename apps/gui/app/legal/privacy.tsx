import { View, Text } from "react-native";

export default function Page() {
    return (
        <View className="flex flex-1">
            <Text className="text-4xl text-white">
                Privacy Policy for Trinity Social
            </Text>
            <View className="flex flex-col gap-4 flex-1">
                <Text className="text-white">
                    <Text className="font-bold">1. Introduction</Text>
                    {"\n"}This Privacy Policy explains how Koon Industries LLC
                    collects, uses, stores, and shares user data. By using our
                    services, you agree to the collection and use of information
                    in accordance with this policy.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">2. Data Collection</Text>
                    {"\n"}We collect the following types of personal data:
                </Text>
                <Text className="text-white">- Name</Text>
                <Text className="text-white">- Phone Number</Text>
                <Text className="text-white">- Profile Image</Text>
                <Text className="text-white">
                    <Text className="font-bold">3. Data Usage</Text>
                    {"\n"}User data is used to:
                </Text>
                <Text className="text-white">
                    - Allow users on the platform to communicate with each
                    other.
                </Text>
                <Text className="text-white">
                    - Enhance our service through data analytics.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">
                        4. Data Sharing and Disclosure
                    </Text>
                    {"\n"}- We share phone numbers with Twilio for
                    authentication and SMS updates regarding driver status.
                </Text>
                <Text className="text-white">
                    - User data may be disclosed if required by law.
                </Text>
                <Text className="text-white">
                    - Text SMS opt-in data is not shared with 3rd parties.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">
                        5. Data Storage and Security
                    </Text>
                    {"\n"}- User data is stored on our secured servers,
                    accessible only by authorized Koon Industries LLC
                    administrators.
                </Text>
                <Text className="text-white">
                    - We implement robust security measures to protect user
                    data.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">
                        6. User Rights and Choices
                    </Text>
                    {"\n"}- Users can request the deletion of their reservations
                    by contacting Koon Industries LLC at max@koonindustries.com.
                </Text>
                <Text className="text-white">
                    - Users are informed about data collection through our use
                    of cookies and third-party services like Google Maps API and
                    Google Analytics.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">
                        7. International Data Transfers
                    </Text>
                    {"\n"}- Currently, we operate exclusively within the United
                    States and do not transfer data internationally.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">8. Children Privacy</Text>
                    {"\n"}- Our services are not directed to children under the
                    age of 13. We do not knowingly collect personal information
                    from children under 13.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">9. Policy Updates</Text>
                    {"\n"}- Any changes to our Privacy Policy will be
                    communicated to organizations subscribed to our services via
                    email.
                </Text>
                <Text className="text-white">
                    <Text className="font-bold">10. Contact Information</Text>
                    {"\n"}For any privacy-related questions or concerns, please
                    contact us at the same details provided in our Terms of
                    Service: max@koonindustries.com.
                </Text>
            </View>
        </View>
    );
}
