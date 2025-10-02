import { type Game } from "../data/games";

export interface SavedCardData {
  game: Game | null;
  character: string;
}

export interface SavedGameData {
  [cardName: string]: SavedCardData;
}

const STORAGE_KEY = "favorite-games-data";

export const saveCardData = (
  cardName: string,
  game: Game | null,
  character: string = "",
): void => {
  try {
    const existingData = loadAllData();
    existingData[cardName] = {
      game,
      character,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error("Error saving card data:", error);
  }
};

export const loadCardData = (cardName: string): SavedCardData => {
  try {
    const allData = loadAllData();
    return allData[cardName] || { game: null, character: "" };
  } catch (error) {
    console.error("Error loading card data:", error);
    return { game: null, character: "" };
  }
};

export const loadAllData = (): SavedGameData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading all data:", error);
    return {};
  }
};

export const clearCardData = (cardName: string): void => {
  try {
    const existingData = loadAllData();
    delete existingData[cardName];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error("Error clearing card data:", error);
  }
};

export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing all data:", error);
  }
};

export const hasSavedData = (): boolean => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data !== null && Object.keys(JSON.parse(data)).length > 0;
  } catch {
    return false;
  }
};

export const exportData = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) || "{}";
  } catch (error) {
    console.error("Error exporting data:", error);
    return "{}";
  }
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};
