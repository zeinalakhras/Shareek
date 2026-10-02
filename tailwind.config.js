/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary: {
          full: '#FF8C69' ,
          mid: 'rgba(255,140,105, 0.3)' ,
          light: 'rgba(255,140,105, 0.1)'
        } ,
        bg: '#F8F6F5' ,
        text:{
          title : '#1A1A1A' ,
          placeholder : '#94A0B8' ,
          details: '#7A7A7A'
        } , 
        inputbg: '#F7F4F2' ,
        secondry: {
          one: '#9A9594' ,
          green: '#22C55E' , 
          text: '#A38F85' , 
          red: '#FF5C55'
        }
      }
    },
  },
  plugins: [],
}

