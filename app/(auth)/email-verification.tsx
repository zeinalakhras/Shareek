import { View, Text, TextInput, TouchableOpacity , Image } from "react-native";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const emailVerification = () => {

    const router = useRouter() ;

     const [code, setCode] = useState(["", "", "", "", "", ""]);
  // Corrected Ref type to allow nulls
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];

    // Handle "Paste" logic (if text length > 1)
    if (text.length > 1) {
      const pastedCode = text.split("").slice(0, 6);
      pastedCode.forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);
      
      // Focus the last filled input or the 6th one
      const targetIndex = Math.min(pastedCode.length - 1, 5);
      inputs.current[targetIndex]?.focus();
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input when typing
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Backspace logic: move to previous input if current is empty
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView className="h-full bg-bg">
        <View className="flex-row justify-between mx-4 mb-16">
            <View className="flex-row items-center gap-2">
              <Image 
              source={require('../../assets/images/programing.png')}
              className="w-16 h-16"
              resizeMode="cover"
              />
              <Text className="text-3xl font-bold">Shareek</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Image 
              source={require('../../assets/images/security.png')}
              className="w-6 h-6"
              resizeMode="cover"
              />
              <Text className="text-xl">Support</Text>
            </View>
        </View>
        <View className="bg-white items-center mx-6 mt-6 mb-3 py-8 px-4 rounded-2xl gap-2">
            <View className="w-24 h-24 bg-primary-mid rounded-full items-center justify-center mb-4">
              <MaterialCommunityIcons name="email-check-outline" size={40} color="#FF8C69" />
            </View>
        {/* Title */}
        <Text className="text-2xl font-bold text-center mb-2 text-gray-900">
            Verify Your Email
        </Text>

        <Text className="text-center text-gray-500 mb-8 leading-6">
            We've sent a 6-digit code to{"\n"}
            <Text className="font-semibold text-black">hello@example.com</Text>
        </Text>

        {/* OTP Inputs - Changed to flex-row for LTR */}
        <View className="flex-row gap-2 mb-8">
            {code.map((digit, index) => (
            <TextInput
                key={index}
                // THE FIX: Added curly braces to avoid returning the assignment
                ref={(el) => {
                inputs.current[index] = el;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? 6 : 1}
                selectTextOnFocus
                textContentType="oneTimeCode"
                className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-orange-500 text-black"
            />
            ))}
        </View>

        {/* Resend Code */}
        <TouchableOpacity className="mb-6" activeOpacity={0.7}>
            <Text className="text-center text-gray-500">
            Didn't receive the code?{" "}
            <Text className="text-primary-full font-semibold">Resend Code</Text>
            </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Verify & Continue" titleColor="#FFF" handelPress={()=>{router.push('/(auth)/reset-password')}}/>
        {/* Back Button */}
        <TouchableOpacity onPress={ () => router.push('/(auth)/sign-in')}>
            <Text className="text-center text-gray-400">
            ← Back to Sign In
            </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>
     
  );
}
  


export default emailVerification