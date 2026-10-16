import { TouchableOpacity, Text, DimensionValue, ActivityIndicator } from 'react-native'
import React from 'react'

interface ButtonProps {
  width?: DimensionValue;
  height?: number;            
  borderColor?: string;      
  borderWidth?: number;        
  bgColor?: string;            
  title: string;           
  titleColor?: string;   
  handelPress: () => void;
  disable?: boolean;
  isLoading?: boolean;
}

const CustomButton = ({
  width, 
  borderColor, 
  borderWidth = 1, 
  height, 
  bgColor, 
  title, 
  isLoading, 
  titleColor = '#fff', 
  disable, 
  handelPress
}: ButtonProps) => {
  const isDisabled = disable || isLoading;

  return (
    <TouchableOpacity
      className='mx-auto my-2'
      style={{
        width: width, 
        height: height, 
        backgroundColor: bgColor, 
        borderColor: borderColor, 
        borderWidth: borderWidth, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 20,
        opacity: isDisabled ? 0.6 : 1 
      }}
      onPress={handelPress}
      activeOpacity={0.7}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator color={titleColor} />
      ) : (
        <Text style={{ textAlign: "center", fontSize: 16, color: titleColor }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default CustomButton