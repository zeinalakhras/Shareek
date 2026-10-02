import { View, Text ,StyleSheet, TextInput, TouchableOpacity , Image } from 'react-native'
import React, { useState } from 'react'


const FormField = ({title , value , handelChangeText ,placeholder}:any) => {
  const [showPassword,setShowPassword]=useState(false)
  return (
    <View style={{ width: '90%' ,rowGap: 2, marginTop:10 }} className='mx-auto'>
      <Text className='text-black'>{title}</Text>
      <View className='flex-row items-center w-full rounded-3xl border-2 border-primary-full focus:border-zinc-200 h-14 px-4'>
          <TextInput 
            className='flex-1 text-black text-base'
            value={value} 
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handelChangeText}
            secureTextEntry={title.includes("Password") && !showPassword}
          />
          {title.includes("Password") && (
              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
                  <Image source={showPassword ? require("../assets/images/eye.png") : require("../assets/images/eye-hide.png") } className='w-6 h-6'/>
              </TouchableOpacity>
          ) }
      </View>
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({
    container:{
        width:"90%" , 
        height: 48 ,
        paddingHorizontal: 16,
        backgroundColor: '#aeaeb0',
        alignSelf: 'stretch',
        marginBottom: 10, 
    }
})