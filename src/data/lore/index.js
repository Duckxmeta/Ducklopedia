import feathers from "./feathers.json";
import attire from "./attire.json";
import headwear from "./headwear.json";
import accessories from "./accessories.json";
import eyewear from "./eyewear.json";
import legends from "./legends.json";

// Map of standard category names to their imported database files
export const LORE_DATABASE = {
  Feather: feathers,
  Attire: attire,
  Headwear: headwear,
  Accessories: accessories,
  Eyewear: eyewear,
  Legend: legends,
};

// Default fallback lore text
export const DEFAULT_LORE = "A mysterious duck from the Decent Ducks Sanctuary. Its story is yet to be fully uncovered by the scribes.";

/**
 * Normalises category and trait keys and returns the corresponding lore paragraph.
 * 
 * @param {string} category - e.g. "Feather", "Attire", "Headwear", etc.
 * @param {string} traitValue - e.g. "White (Pekin)", "Blue Hoodie", etc.
 * @returns {string|null} Lore description or null if not found
 */
export function getLoreForTrait(category, traitValue) {
  if (!category || !traitValue) return null;

  // 1. Normalise category key case-insensitively
  const matchedCategoryKey = Object.keys(LORE_DATABASE).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  );
  if (!matchedCategoryKey) return null;

  const categoryDb = LORE_DATABASE[matchedCategoryKey];

  // 2. Normalise trait value case-insensitively
  const matchedValueKey = Object.keys(categoryDb).find(
    (key) => key.toLowerCase() === traitValue.toLowerCase()
  );

  return matchedValueKey ? categoryDb[matchedValueKey] : null;
}

/**
 * Returns all traits grouped by category for explorer browsing.
 */
export function getAllCategories() {
  return Object.keys(LORE_DATABASE).map((categoryName) => ({
    name: categoryName,
    traits: Object.keys(LORE_DATABASE[categoryName]).map((traitName) => ({
      name: traitName,
      description: LORE_DATABASE[categoryName][traitName],
    })),
  }));
}
