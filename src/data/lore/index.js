import feathers from "./feathers.json";
import attire from "./attire.json";
import headwear from "./headwear.json";
import accessories from "./accessories.json";
import eyewear from "./eyewear.json";
import legends from "./legends.json";
import backgrounds from "./backgrounds.json";
import { CATEGORY_ALIASES, TRAIT_ALIASES } from "../traitAliases";
import { SOLANA_TRAIT_MAP, BODY_FEATHER_MAP, EYE_TRAIT_MAP } from "../traitMapping";

// Map of standard category names to their imported database files
export const LORE_DATABASE = {
  Feather: feathers,
  Attire: attire,
  Headwear: headwear,
  Accessories: accessories,
  Eyewear: eyewear,
  Legend: legends,
  Background: backgrounds,
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
 * Resolves 1/1 legend lore by scanning the duck name or attributes against the Legend database.
 */
export function getLegendLore(name, attributes) {
  const nameStr = String(name || "").toLowerCase();
  
  // 1. Check if the attributes specify a Legend trait value
  if (Array.isArray(attributes)) {
    const legendAttr = attributes.find(
      a => String(a.trait_type || '').toLowerCase() === "legend" || 
           String(a.trait_type || '').toLowerCase() === "1/1" ||
           String(a.value || '').toLowerCase() === "1/1"
    );
    if (legendAttr && legendAttr.value && String(legendAttr.value).toLowerCase() !== "1/1") {
      const match = getLoreForTrait("Legend", legendAttr.value);
      if (match) return match;
    }
  }

  // 2. Scan name for any direct key in legends.json
  const legendsDb = LORE_DATABASE["Legend"];
  const matchedKey = Object.keys(legendsDb).find(key => {
    const keyLower = String(key).toLowerCase();
    // E.g. name "Decent Duck - The OG Duck" contains "the og duck"
    return nameStr.includes(keyLower) || keyLower.includes(nameStr);
  });

  if (matchedKey) {
    return legendsDb[matchedKey];
  }

  // 3. If it's explicitly marked as 1/1 but doesn't match a specific legend name, return a default 1/1 legend placeholder
  const isOneOfOne = nameStr.includes("1/1") || 
    (Array.isArray(attributes) && attributes.some(
      a => String(a.value || '').toLowerCase() === "1/1" || String(a.trait_type || '').toLowerCase() === "1/1"
    ));
    
  if (isOneOfOne) {
    return "A legendary 1/1 Decent Duck. Its tale is unique and spoken of in hushed tones across the Sanctuary, a singular sentinel of the flock.";
  }

  return null;
}

/**
 * Normalises category and trait keys and returns the corresponding lore paragraph.
 * 
 * @param {string} category - e.g. "Feather", "Attire", "Headwear", etc.
 * @param {string} traitValue - e.g. "White (Pekin)", "Blue Hoodie", etc.
 * @returns {string|null} Lore description or null if not found
 */
/**
 * Helper to fetch structured background details (title, theme, lore) for a color name.
 */
export function getBackgroundDetails(color) {
  if (!color) return null;
  const cleanColor = normalizeTraitName(color).replace(/\bbackgrounds?\b/g, "").trim();
  const db = LORE_DATABASE["Background"];
  const matchedKey = Object.keys(db).find(
    (key) => String(key).toLowerCase() === cleanColor
  );
  return matchedKey ? db[matchedKey] : null;
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

  // Helper to ensure we return a string even if the database has a structured object
  const resolveLoreString = (val) => {
    if (val && typeof val === "object") {
      return val.lore || "";
    }
    return val;
  };

  // A. Check SOLANA_TRAIT_MAP mapping lookup first (hidden translation)
  const mapKey = `${catLower}:${valLower}`;
  const mappedInfo = SOLANA_TRAIT_MAP[mapKey];
  if (mappedInfo) {
    const mappedCategory = mappedInfo.category;
    const mappedValue = mappedInfo.loreKey;
    const categoryDb = LORE_DATABASE[mappedCategory];
    if (categoryDb) {
      const matchKey = Object.keys(categoryDb).find(
        (key) => String(key).toLowerCase() === String(mappedValue).toLowerCase()
      );
      if (matchKey) return resolveLoreString(categoryDb[matchKey]);
    }
  }

  // 1. Resolve normalized category via aliases or direct keys
  const mappedCategory = CATEGORY_ALIASES[catLower] || 
    Object.keys(LORE_DATABASE).find(key => String(key).toLowerCase() === catLower);
    
  if (!mappedCategory) return null;
  const categoryDb = LORE_DATABASE[mappedCategory];

  // B. Body-to-Feather Breed Mapping Check
  if (mappedCategory === "Feather") {
    const breedName = BODY_FEATHER_MAP[valLower];
    if (breedName) {
      const breedKey = Object.keys(categoryDb).find(
        (key) => String(key).toLowerCase() === breedName.toLowerCase()
      );
      if (breedKey) return resolveLoreString(categoryDb[breedKey]);
    }
  }

  // C. Eye/Eyewear Mapping Check
  if (mappedCategory === "Eyewear") {
    const eyeAlias = EYE_TRAIT_MAP[valLower];
    if (eyeAlias) {
      const eyeKey = Object.keys(categoryDb).find(
        (key) => String(key).toLowerCase() === eyeAlias.toLowerCase()
      );
      if (eyeKey) return resolveLoreString(categoryDb[eyeKey]);
    }
  }

  // 2. Perform normalized value matching (handle typos, suffixes, background words)
  let normVal = normalizeTraitName(valStr);
  if (mappedCategory === "Background") {
    normVal = normVal.replace(/\bbackgrounds?\b/g, "").trim();
  }

  // 3. Prioritized lookup sequence within primary category:
  
  // A. Exact Match (with background cleaning if necessary)
  const exactKey = Object.keys(categoryDb).find((key) => {
    const keyLower = String(key).toLowerCase();
    const cleanValLower = mappedCategory === "Background" ? valLower.replace(/\bbackgrounds?\b/g, "").trim() : valLower;
    return keyLower === cleanValLower || keyLower.replace(/\bbackgrounds?\b/g, "").trim() === cleanValLower;
  });
  if (exactKey) return resolveLoreString(categoryDb[exactKey]);

  // B. Trait Alias check
  const aliasedName = TRAIT_ALIASES[valLower];
  if (aliasedName) {
    const aliasKey = Object.keys(categoryDb).find(
      (key) => String(key).toLowerCase() === aliasedName.toLowerCase()
    );
    if (aliasKey) return resolveLoreString(categoryDb[aliasKey]);
  }

  // C. Normalize and Check
  const normKey = Object.keys(categoryDb).find(
    (key) => normalizeTraitName(key) === normVal
  );
  if (normKey) return resolveLoreString(categoryDb[normKey]);

  // D. Fuzzy/Substring Match
  const fuzzyKey = Object.keys(categoryDb).find((key) => {
    const keyNorm = normalizeTraitName(key).replace(/\bbackgrounds?\b/g, "").trim();
    return keyNorm.includes(normVal) || normVal.includes(keyNorm);
  });
  if (fuzzyKey) return resolveLoreString(categoryDb[fuzzyKey]);

  // 4. Cross-Category / Global Fallback Lookup:
  // If no match is found under primary category, search across ALL other databases!
  for (const catName of Object.keys(LORE_DATABASE)) {
    if (catName === mappedCategory) continue; // Skip primary category already searched
    const db = LORE_DATABASE[catName];

    // Check exact match
    const crossExact = Object.keys(db).find(
      (key) => String(key).toLowerCase() === valLower
    );
    if (crossExact) return resolveLoreString(db[crossExact]);

    // Check normalized match
    let crossNormVal = normVal;
    if (catName === "Background") {
      crossNormVal = crossNormVal.replace(/\bbackgrounds?\b/g, "").trim();
    }
    const crossNormKey = Object.keys(db).find(
      (key) => normalizeTraitName(key) === crossNormVal
    );
    if (crossNormKey) return resolveLoreString(db[crossNormKey]);

    // Check fuzzy match
    const crossFuzzyKey = Object.keys(db).find((key) => {
      const keyNorm = normalizeTraitName(key).replace(/\bbackgrounds?\b/g, "").trim();
      return keyNorm.includes(crossNormVal) || crossNormVal.includes(keyNorm);
    });
    if (crossFuzzyKey) return resolveLoreString(db[crossFuzzyKey]);
  }

  return null;
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
