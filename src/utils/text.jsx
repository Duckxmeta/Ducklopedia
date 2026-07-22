import React from "react";

/**
 * Safely parses text containing markdown-like **bold** markers and returns 
 * an array of standard React text nodes and <strong> elements.
 * Prevents XSS vulnerabilities by completely avoiding dangerouslySetInnerHTML.
 * 
 * @param {string} text - The input raw lore description string
 * @returns {React.ReactNode[]} Array of safe React elements
 */
export function renderSafeLore(text) {
  if (!text) return "";
  
  const str = String(text);
  const parts = str.split(/\*\*([^*]+)\*\*/g);
  
  return parts.map((part, idx) => {
    // Odd indexes correspond to captured bold text inside **...**
    if (idx % 2 === 1) {
      return <strong key={idx} className="font-extrabold text-black">{part}</strong>;
    }
    return part;
  });
}
