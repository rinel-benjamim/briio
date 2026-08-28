import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import type { AppSetting } from "@/types";

export default function OnboardingGuard() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const row = await db.getFirstAsync<AppSetting>(
          "SELECT value FROM app_settings WHERE key = ?",
          ["onboarding_completed"]
        );
        if (!row || row.value !== "true") {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
      setChecked(true);
    }
    check();
  }, []);

  return null;
}
