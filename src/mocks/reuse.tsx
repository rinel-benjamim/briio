import { Users, ClipboardCheck, Package, Wrench } from "lucide-react-native";
import { colors } from "@/constants";

export interface ReusableItem {
  id: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
  selected: boolean;
}

export const INITIAL_REUSABLE_ITEMS: ReusableItem[] = [
  { id: "1", title: "Mão de obra", summary: "7 trabalhadores · 56 h", icon: <Users size={18} color={colors.textTertiary} />, selected: true },
  { id: "2", title: "Atividades", summary: "2 atividades", icon: <ClipboardCheck size={18} color={colors.textTertiary} />, selected: true },
  { id: "3", title: "Materiais", summary: "3 registos", icon: <Package size={18} color={colors.textTertiary} />, selected: true },
  { id: "4", title: "Equipamentos", summary: "3 equipamentos", icon: <Wrench size={18} color={colors.textTertiary} />, selected: true },
];
