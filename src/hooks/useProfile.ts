import { useState, useEffect, useCallback } from "react";
import { useProfileRepository, type CreateProfileInput } from "@/repositories/profile.repository";
import type { Profile } from "@/types";

export function useProfile() {
  const profileRepo = useProfileRepository();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await profileRepo.findFirst();
      setProfile(data);
    } catch (e) {
      console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (input: CreateProfileInput) => {
    const result = await profileRepo.upsert(input);
    setProfile(result);
    return result;
  }, []);

  return { profile, loading, save, refresh };
}
