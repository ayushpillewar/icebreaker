import { useEffect, useCallback } from 'react';
import { useServices } from '../container/ServiceProvider';
import { useUserStore } from '../store/userStore';

/**
 * SRP: loads & persists the user profile — nothing else.
 * DIP: depends on IUserRepository via the container.
 */
export function useUserProfile() {
  const { userRepository } = useServices();
  const { user, isVisible, setUser, setName, setVisible, clearUser } = useUserStore();

  // Hydrate from storage on first mount
  useEffect(() => {
    userRepository.getUser().then((persisted) => {
      if (persisted) setUser(persisted.name);
    });
  }, []);

  const saveName = useCallback(
    async (name: string) => {
      setUser(name);
      const current = useUserStore.getState().user;
      if (current) await userRepository.saveUser(current);
    },
    [setUser, userRepository],
  );

  const updateVisibility = useCallback(
    (visible: boolean) => {
      setVisible(visible);
    },
    [setVisible],
  );

  const reset = useCallback(async () => {
    clearUser();
    await userRepository.clearUser();
  }, [clearUser, userRepository]);

  return { user, isVisible, saveName, updateVisibility, setName, reset };
}
