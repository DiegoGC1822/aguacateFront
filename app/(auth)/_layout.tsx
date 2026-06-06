import { Redirect, Slot } from "expo-router";
import { useAuth } from "../../presentation/viewmodel/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) return null;

  if (isAuthenticated) {
    return <Redirect href="/(protected)/home" />;
  }

  return <Slot />;
}
