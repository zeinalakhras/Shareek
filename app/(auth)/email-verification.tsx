import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useSignUpStore } from "@/store/useSignUpStore";
import { getApiErrorMessage } from "@/utils/apiError";

const emailVerification = () => {

    const router = useRouter();
    const { email: emailParam, flow } = useLocalSearchParams<{ email?: string; flow?: string }>();

    const email = (emailParam || '').trim();
    const isResetFlow = flow === 'reset';

    const { verifyEmailOtp, verifyResetOtp, resendOtp } = useAuth();
    const clearCredentials = useSignUpStore((state) => state.clearCredentials);

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];

    if (text.length > 1) {
      const pastedCode = text.split("").slice(0, 6);
      pastedCode.forEach((char, i) => {
        newCode[i] = char;
      });
      setCode(newCode);

      const targetIndex = Math.min(pastedCode.length - 1, 5);
      inputs.current[targetIndex]?.focus();
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      Alert.alert("Validation Error", "Please enter the 6-digit code.");
      return;
    }

    if (!email) {
      Alert.alert("Missing email", "We lost track of your email. Please start again.");
      router.replace("/(auth)/sign-in");
      return;
    }

    setIsVerifying(true);

    try {
      if (isResetFlow) {
        const { data } = await verifyResetOtp({ email, otp });

        router.replace({
          pathname: "/(auth)/reset-password",
          params: { email, resetToken: data["reset-token"] ?? "" },
        });
        return;
      }

      await verifyEmailOtp({ email, otp });
      clearCredentials();

      router.replace("/(setup)/success");
    } catch (error) {
      Alert.alert("Verification failed", getApiErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);

    try {
      const { data } = await resendOtp({ email });
      Alert.alert("Code sent", `We sent a new code to ${data.email}.`);
    } catch (error) {
      Alert.alert("Could not resend the code", getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    if (isResetFlow) {
      router.replace("/(auth)/forget-password");
      return;
    }
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="h-full bg-bg">
        <View className="flex-row justify-between mx-4 mb-16">
            <View className="flex-row items-center gap-2">
              <Image
              source={require('../../assets/images/icon-outline.png')}
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
            <Text className="font-semibold text-black">{email || 'your email'}</Text>
        </Text>

        {/* OTP Inputs - Changed to flex-row for LTR */}
        <View className="flex-row gap-2 mb-8">
            {code.map((digit, index) => (
            <TextInput
                key={index}
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
        <TouchableOpacity className="mb-6" activeOpacity={0.7} onPress={handleResend} disabled={isResending}>
            <Text className="text-center text-gray-500">
            Didn't receive the code?{" "}
            <Text className="text-primary-full font-semibold">
              {isResending ? "Sending..." : "Resend Code"}
            </Text>
            </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <CustomButton width='90%' borderColor='#FF8C69' height={50} bgColor='#FF8C69' title="Verify & Continue" titleColor="#FFF" isLoading={isVerifying} handelPress={handleVerify}/>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack}>
            <Text className="text-center text-gray-400">
            {isResetFlow ? '← Back to Forgot Password' : '← Back to Sign In'}
            </Text>
        </TouchableOpacity>
    </View>
    </SafeAreaView>

  );
}



export default emailVerification;
