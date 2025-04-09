// Modified useShopFetchMyBack hook
export const useShopFetchMyBack = () => {
  const { setUserBackgroundId, setBackImg, setUserCharacterId, setName } =
    userMyCharActions();

  const { mutate, isPending } = useMutation({
    mutationFn: async (backgroundId: number) => {
      // Server API call
      console.log(`Sending backgroundId to server: ${backgroundId}`);
      return { success: true };
    },
  });

  // Select background by ID
  const handleFetchShopBack = (backgroundId: number) => {
    // 1. Find background info
    const selectedBackground = backgroundShopConfig.find(
      (bg) =>
        bg.userBackgroundId === backgroundId || bg.productId === backgroundId,
    );

    if (selectedBackground) {
      // 2. Update Zustand state
      setUserBackgroundId(backgroundId);
      setBackImg(selectedBackground.image);

      console.log(
        `Applied background '${selectedBackground.characterName}' (ID: ${backgroundId})`,
      );

      // Don't automatically change character here
      // Let the component handle character switching separately
    } else {
      console.error(`Background ID ${backgroundId} not found`);

      // Apply default background (first one) if not found
      if (backgroundShopConfig.length > 0) {
        const defaultBackground = backgroundShopConfig[0];
        setUserBackgroundId(defaultBackground.productId);
        setBackImg(defaultBackground.image);
      }
    }

    // Server communication
    mutate(backgroundId);
  };

  // Select background by name
  const handleFetchShopBackByName = (backgroundName: string) => {
    // Find background info by name
    const selectedBackground = backgroundShopConfig.find(
      (bg) => bg.characterName === backgroundName,
    );

    if (selectedBackground) {
      console.log(`Found background by name: ${backgroundName}`);
      // Process selection with found background
      handleFetchShopBack(selectedBackground.userBackgroundId);
    } else {
      console.error(`Could not find background with name "${backgroundName}"`);
    }
  };

  // Check if background is selectable
  const isBackgroundSelectable = (
    backgroundName: string,
    currentCharName: string | undefined,
  ): boolean => {
    if (!currentCharName) return true; // All selectable if no character is selected

    // Check if this is a basic/default background
    const isBasicBackground =
      backgroundToCharacterMap[backgroundName] !== undefined;

    // For basic backgrounds: allow selection even if it's for another character
    // The component will handle the character switching
    if (isBasicBackground) {
      return true;
    }

    // Common backgrounds are always selectable
    return commonBackgrounds.includes(backgroundName);
  };

  return {
    handleFetchShopBack,
    handleFetchShopBackByName,
    isBackgroundSelectable,
    isPending,
  };
};
