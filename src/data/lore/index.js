import feathers from "./feathers.json";
import attire from "./attire.json";
import headwear from "./headwear.json";
import accessories from "./accessories.json";
import eyewear from "./eyewear.json";
import legends from "./legends.json";

// Alias mapping for flexible trait classification in on-chain metadata
export const CATEGORY_MAP = {
  body: "Feather",
  skin: "Feather",
  feathers: "Feather",
  feather: "Feather",
  
  attire: "Attire",
  clothes: "Attire",
  clothing: "Attire",
  shirt: "Attire",
  
  headwear: "Headwear",
  hat: "Headwear",
  hats: "Headwear",
  
  accessories: "Accessories",
  accessory: "Accessories",
  backpack: "Accessories",
  weapon: "Accessories",
  
  eyewear: "Eyewear",
  eyes: "Eyewear",
  glasses: "Eyewear",
  shades: "Eyewear",
  
  legend: "Legend",
  legends: "Legend"
};

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

  const catLower = category.toLowerCase().trim();
  const valLower = traitValue.toLowerCase().trim();

  // 1. Resolve normalized category via maps or search
  const mappedCategory = CATEGORY_MAP[catLower] || 
    Object.keys(LORE_DATABASE).find(key => key.toLowerCase() === catLower);
    
  if (!mappedCategory) return null;
  const categoryDb = LORE_DATABASE[mappedCategory];

  // 2. Perform exact matching first
  const exactKey = Object.keys(categoryDb).find(
    (key) => key.toLowerCase() === valLower
  );
  if (exactKey) return categoryDb[exactKey];

  // 3. Perform normalized value matching (handle typos and suffixes)
  let normalizedVal = valLower
    .replace(/\bviser\b/g, "visor")
    .replace(/\bhoody\b/g, "hoodie");

  // Clean common trailing descriptors for fuzzy comparison
  if (mappedCategory === "Feather") {
    normalizedVal = normalizedVal.replace(/\bduck\b/g, "").trim();
  }

  // Exact check on normalized string
  const normExactKey = Object.keys(categoryDb).find(
    (key) => key.toLowerCase() === normalizedVal
  );
  if (normExactKey) return categoryDb[normExactKey];

  // 4. Perform fuzzy/substring matching
  const fuzzyKey = Object.keys(categoryDb).find((key) => {
    const keyLower = key.toLowerCase();
    return keyLower.includes(normalizedVal) || normalizedVal.includes(keyLower);
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
