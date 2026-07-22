import feathers from "./feathers.json";
import attire from "./attire.json";
import headwear from "./headwear.json";
import accessories from "./accessories.json";
import eyewear from "./eyewear.json";
import legends from "./legends.json";
import { CATEGORY_ALIASES, TRAIT_ALIASES } from "../traitAliases";

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
 * Normalizes trait strings to generic lowercase format to resolve plural/synonym variations.
 */
export function normalizeTraitName(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\bbackwards\b/g, "backward")
    .replace(/\bhats\b/g, "hat")
    .replace(/\bhat\b/g, "cap")
    .replace(/\bviser\b/g, "visor")
    .replace(/\bhoody\b/g, "hoodie")
    .replace(/\bclothes\b/g, "attire")
    .replace(/\bclothing\b/g, "attire")
    .replace(/\beye\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalises category and trait keys and returns the corresponding lore paragraph.
 * 
 * @param {string} category - e.g. "Feather", "Attire", "Headwear", etc.
 * @param {string} traitValue - e.g. "White (Pekin)", "Blue Hoodie", etc.
 * @returns {string|null} Lore description or null if not found
 */
export function getLoreForTrait(category, traitValue) {
  if (category === undefined || category === null || traitValue === undefined || traitValue === null) return null;

  // Safe string conversion
  const catStr = String(category);
  const valStr = String(traitValue);

  const catLower = catStr.toLowerCase().trim();
  const valLower = valStr.toLowerCase().trim();

  // 1. Resolve normalized category via aliases or direct keys
  const mappedCategory = CATEGORY_ALIASES[catLower] || 
    Object.keys(LORE_DATABASE).find(key => String(key).toLowerCase() === catLower);
    
  if (!mappedCategory) return null;
  const categoryDb = LORE_DATABASE[mappedCategory];

  // 2. Prioritized lookup sequence:
  
  // A. Exact Match
  const exactKey = Object.keys(categoryDb).find(
    (key) => String(key).toLowerCase() === valLower
  );
  if (exactKey) return categoryDb[exactKey];

  // B. Trait Alias check
  const aliasedName = TRAIT_ALIASES[valLower];
  if (aliasedName) {
    const aliasKey = Object.keys(categoryDb).find(
      (key) => String(key).toLowerCase() === aliasedName.toLowerCase()
    );
    if (aliasKey) return categoryDb[aliasKey];
  }

  // C. Normalize and Check
  const normVal = normalizeTraitName(valStr);
  const normKey = Object.keys(categoryDb).find(
    (key) => normalizeTraitName(key) === normVal
  );
  if (normKey) return categoryDb[normKey];

  // D. Fuzzy/Substring Match
  const fuzzyKey = Object.keys(categoryDb).find((key) => {
    const keyNorm = normalizeTraitName(key);
    return keyNorm.includes(normVal) || normVal.includes(keyNorm);
  });

  return fuzzyKey ? categoryDb[fuzzyKey] : null;
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
