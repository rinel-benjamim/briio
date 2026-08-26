import { Tabs } from "expo-router";
import { Home, Building2, FileText, Menu } from "lucide-react-native";
import { colors } from "@/constants";
import { CustomTabBar } from "@/components/ui/TabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "INÍCIO",
          tabBarIcon: ({ color }) => <Home size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "OBRAS",
          tabBarIcon: ({ color }) => <Building2 size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "RELATÓRIOS",
          tabBarIcon: ({ color }) => <FileText size={18} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "MAIS",
          tabBarIcon: ({ color }) => <Menu size={18} color={color} />,
        }}
      />
    </Tabs>
  );
}
