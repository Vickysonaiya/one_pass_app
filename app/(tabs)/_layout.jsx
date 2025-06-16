import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name='home' options={{title:"Home"}}/>
        <Tabs.Screen name='login' options={{title:"Login"}}/>
        <Tabs.Screen name='enter-otp' options={{title:"Enter-otp"}}/>
    </Tabs>
  )
}

export default TabsLayout