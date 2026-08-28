import { View, ScrollView, Text, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Download, Upload, Trash2 } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { dataChangeEmitter } from "@/utils/dataChangeEmitter";
import { useDataService, type ExportData } from "@/services/data.service";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SettingRow } from "@/components/ui/SettingRow";

export default function DataScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const dataService = useDataService();
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    dataService.getCounts().then(setCounts);
  }, []);

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 24,
    },
    section: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.bold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    stats: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      gap: 8,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statLabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    statValue: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
  }));

  const handleExport = async () => {
    try {
      const data = await dataService.exportData();
      const json = JSON.stringify(data, null, 2);
      const fileName = `briio_backup_${new Date().toISOString().slice(0, 10)}.json`;
      const file = new File(Paths.cache, fileName);
      file.write(json);
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Exportar dados Briio",
      });
    } catch (e) {
      Alert.alert("Erro", "Falha ao exportar dados.");
    }
  };

  const handleImport = async () => {
    Alert.alert(
      "Importar dados",
      "Isto irá substituir TODOS os dados atuais. Tem a certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Continuar",
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
              });
              if (result.canceled) return;
              const fileResult = result.assets[0];
              const response = await fetch(fileResult.uri);
              const json = await response.text();
              const data = JSON.parse(json) as ExportData;
              if (data.version !== 1) {
                Alert.alert("Erro", "Formato de ficheiro inválido.");
                return;
              }
              await dataService.importData(data);
              const newCounts = await dataService.getCounts();
              setCounts(newCounts);
              dataChangeEmitter.emit();
              Alert.alert("Sucesso", "Dados importados com sucesso.");
            } catch (e) {
              Alert.alert("Erro", "Ficheiro inválido ou corrompido.");
            }
          },
        },
      ]
    );
  };

  const handleReset = async () => {
    Alert.alert(
      "Resetar base de dados",
      "Isto irá apagar TODOS os dados permanentemente. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await dataService.resetDatabase();
              setCounts({});
              dataChangeEmitter.emit();
              Alert.alert("Sucesso", "Base de dados resetada.");
            } catch (e) {
              Alert.alert("Erro", "Falha ao resetar base de dados.");
            }
          },
        },
      ]
    );
  };

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title="Dados" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.sectionLabel}>Resumo</Text>
          <View style={styles.section}>
            <View style={styles.stats}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total de registos</Text>
                <Text style={styles.statValue}>{totalRecords}</Text>
              </View>
              {Object.entries(counts).map(([table, count]) => (
                <View key={table} style={styles.statRow}>
                  <Text style={styles.statLabel}>{table.replace(/_/g, " ")}</Text>
                  <Text style={styles.statValue}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Backup</Text>
          <View style={styles.section}>
            <SettingRow
              label="Exportar dados"
              description="Guardar cópia dos seus dados"
              icon={<Download size={20} color={colors.primary} />}
              onPress={handleExport}
            />
            <SettingRow
              label="Importar dados"
              description="Restaurar a partir de um ficheiro"
              icon={<Upload size={20} color={colors.primary} />}
              onPress={handleImport}
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Zona de perigo</Text>
          <View style={styles.section}>
            <SettingRow
              label="Resetar base de dados"
              description="Apagar todos os dados permanentemente"
              icon={<Trash2 size={20} color="#EF4444" />}
              onPress={handleReset}
              destructive
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
