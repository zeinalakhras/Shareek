import { View, Text } from 'react-native'

interface stepsProps {
    stepNumber: number,
    stepCount: number
}

const SimpleProgressBar = ({ stepNumber, stepCount }: stepsProps) => {
    const progress = (stepNumber / stepCount) * 100;
    return (
        <View className="mt-2 mb-6">
            <Text className="text-sm font-semibold text-primary-full mb-2">Step {stepNumber} of {stepCount}</Text>
            <View className="h-1.5 bg-[#EFEAE6] rounded-full overflow-hidden">
                <View style={{width:`${progress}%`}} className="h-full bg-primary-full rounded-full" />
            </View>
        </View>
    )
}

export default SimpleProgressBar