// Cette déclaration permet d'étendre l'interface Window pour inclure pixelPumpApp
interface Window {
  pixelPumpApp?: {
    refreshDashboard?: () => Promise<void>;
    refreshUserData?: () => Promise<void>;
  };
}
