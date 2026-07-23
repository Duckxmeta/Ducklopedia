import React, { useState } from "react";
import { getAllCategories } from "../data/lore";
import { renderSafeLore } from "../utils/text";
import { Compass, Book, ArrowRight, Star } from "lucide-react";

// Hex colors for dynamic background previews
const BACKGROUND_COLORS = {
  "green": "#4CAF50",
  "blue": "#2196F3",
  "yellow": "#FFEB3B",
  "orange": "#FF9800",
  "purple": "#9C27B0",
  "red": "#F44336"
};

// Image mapping helper matching the assets used in index.html
const getTraitImage = (category, name) => {
  if (category === "Feather") {
    if (name === "White (Pekin)") return "https://i.imgur.com/ykpIueW.png";
    if (name === "Black (Runner)") return "https://i.imgur.com/Udxju5b.png";
    if (name === "Gold (Buff)") return "https://i.imgur.com/JR0MRco.png";
    if (name === "Grey (Ugly Duck)") return "https://i.imgur.com/CFq3KSK.png";
    return "https://i.imgur.com/k8fedpu.png";
  }
  if (category === "Attire") {
    if (name === "Blue Hoodie") return "https://i.imgur.com/rvd6atN.png";
    if (name === "Green Hoodie") return "https://i.imgur.com/1cLnmGf.png";
    if (name === "Beige Shirt") return "https://i.imgur.com/HeQLAo3.png";
    if (name === "Black Tux") return "https://i.imgur.com/kop8UVE.png";
    if (name === "Blue Tux") return "https://i.imgur.com/zdblK9W.png";
    if (name === "Apprentice Wizard") return "https://i.imgur.com/1aVvs6Z.png";
    if (name === "Camo Jacket") return "https://i.imgur.com/ll7VU9i.png";
    if (name === "Apprentice Chef") return "https://i.imgur.com/M7pjNVR.png";
    if (name === "Head Chef") return "https://i.imgur.com/8KrhIrN.png";
    if (name === "Bath Robe") return "https://i.imgur.com/vAjMuBy.png";
    if (name === "Blue Jacket") return "https://i.imgur.com/H71O3Ow.png";
    return "https://i.imgur.com/pR9x7uI.png";
  }
  if (category === "Headwear") {
    if (name === "Wizard Hat") return "https://i.imgur.com/bwrkVZW.png";
    if (name === "Flower") return "https://i.imgur.com/f2Qp1qW.png";
    if (name === "Pretty Flower") return "https://i.imgur.com/2ubp86T.png";
    if (name === "Beige Beanie") return "https://i.imgur.com/62mEMmj.png";
    if (name === "Orange Beanie") return "https://i.imgur.com/CkQIh0h.png";
    if (name === "Maroon Beanie") return "https://i.imgur.com/nsm3vrI.png";
    if (name === "Chef Hat") return "https://i.imgur.com/e9sUXv4.png";
    if (name === "Crown") return "https://i.imgur.com/GDeppff.png";
    if (name === "Forward Blue Cap") return "https://i.imgur.com/O9AczWQ.png";
    if (name === "Backward Blue Cap") return "https://i.imgur.com/24jIJli.png";
    if (name === "Forward Green Cap") return "https://i.imgur.com/358JHgb.png";
    if (name === "Backward Green Cap") return "https://i.imgur.com/0oxrXp5.png";
    if (name === "Forward Purple Cap") return "https://i.imgur.com/BApG54k.png";
    if (name === "Backward Purple Cap") return "https://i.imgur.com/b5eWQX2.png";
    if (name === "Cowboy Hat 1") return "https://i.imgur.com/VNNATuZ.png";
    if (name === "Cowboy Hat 2") return "https://i.imgur.com/52JgAxU.png";
    if (name === "Bucket Hat") return "https://i.imgur.com/LAFdMne.png";
    if (name === "Fancy Top Hat") return "https://i.imgur.com/B9R3Gei.png";
    if (name === "Brown Top Hat") return "https://i.imgur.com/AIcdDzu.png";
    if (name === "Grey Bowler Hat") return "https://i.imgur.com/XI3QBAF.png";
    return "https://i.imgur.com/LdKXmRZ.png";
  }
  if (category === "Accessories") {
    if (name === "Red Sword (Rock)") return "https://i.imgur.com/2UnxvdK.png";
    if (name === "Blue Sword (Scissors)") return "https://i.imgur.com/xsFA9Mg.png";
    if (name === "Green Sword (Paper)") return "https://i.imgur.com/DQ3kjfI.png";
    if (name === "Wings") return "https://i.imgur.com/Bpxiqfc.png";
    return "https://i.imgur.com/hHs5OUb.png";
  }
  if (category === "Eyewear") {
    if (name === "Eyes 1 (Standard)" || name === "Eyes 1") return "https://i.imgur.com/rOOti6Q.png";
    if (name === "Eyes 2 (Determined)" || name === "Eyes 2") return "https://i.imgur.com/MR175T2.png";
    if (name === "Eyes 3 (Wise)" || name === "Eyes 3") return "https://i.imgur.com/7poQkMh.png";
    if (name === "Eyes 4 (Curious)" || name === "Eyes 4") return "https://i.imgur.com/j2DcMVn.png";
    if (name === "Eyes 5" || name === "Black Goggles") return "https://i.imgur.com/gTGkcN6.png";
    if (name === "Yellow Goggles") return "https://i.imgur.com/SOPVYLK.png";
    if (name === "Blue Goggles") return "https://i.imgur.com/qYm5w6J.png";
    if (name === "Black Shades") return "https://i.imgur.com/h3K0Dvv.png";
    if (name === "Blue Shades") return "https://i.imgur.com/QPTbKMs.png";
    if (name === "Green Shades") return "https://i.imgur.com/3RIQ7rC.png";
    if (name === "Laser Eyes") return "https://i.imgur.com/yMt6YLJ.png";
    if (name === "MLG Shades") return "https://i.imgur.com/dVDdj9l.png";
    if (name === "Green Visor") return "https://i.imgur.com/5gcAoNh.png";
    if (name === "Yellow Visor") return "https://i.imgur.com/SWg2WqM.png";
    if (name === "Blue Visor") return "https://i.imgur.com/mSDeZ7E.png";
    if (name === "Purple Visor") return "https://i.imgur.com/txsBbs4.png";
    if (name === "Rainbow Visor") return "https://i.imgur.com/A1kCNKS.png";
    return "https://i.imgur.com/A1kCNKS.png";
  }
  if (category === "Legend") {
    if (name === "The OG Duck") return "https://i.imgur.com/pcn60EC.png";
    if (name === "The Mandarin") return "https://i.imgur.com/wrP5ymE.png";
    if (name === "The BullDuck") return "https://i.imgur.com/FqUe7KS.png";
    return "https://i.imgur.com/OdtiPGK.png";
  }
  if (category === "V2 Egg") {
    return "https://i.imgur.com/jwun0Ca.png";
  }
  return "https://i.imgur.com/pcn60EC.png";
};

export default function LoreExplorer() {
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedTrait, setSelectedTrait] = useState(categories[0]?.traits[0] || null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTrait(category.traits[0] || null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[500px]">
      
      {/* Left Column: Category Selector */}
      <div className="w-full md:w-1/4 bg-[#ece3cf]/30 border border-stone-300 rounded-xl p-4 shadow-sm flex flex-col justify-start">
        <h3 className="font-serif text-xl text-amber-950 font-bold mb-4 flex items-center gap-2 border-b border-stone-300 pb-2">
          <Compass className="w-5 h-5 text-amber-800" /> Index chapters
        </h3>
        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {categories.map((category) => {
            const isSelected = selectedCategory.name === category.name;
            return (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-4 py-2.5 rounded-lg font-serif text-base transition-all flex items-center justify-between border ${
                  isSelected
                    ? "bg-[#a0522d] text-white border-amber-950 shadow-sm"
                    : "bg-white/60 text-stone-700 border-stone-200 hover:bg-white/80"
                }`}
              >
                <span>{category.name}s</span>
                <ArrowRight className={`w-4 h-4 opacity-50 ${isSelected ? "text-white" : "text-stone-500"}`} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle Column: Trait Selection Grid */}
      <div className="w-full md:w-2/5 bg-white/40 border border-stone-300 rounded-xl p-4 shadow-inner flex flex-col">
        <h3 className="font-serif text-xl text-amber-950 font-bold mb-4 border-b border-stone-300 pb-2 flex items-center gap-2">
          <Book className="w-5 h-5 text-amber-800" /> Choose {selectedCategory?.name} trait
        </h3>
        
        <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[480px] pr-1">
          {selectedCategory?.traits.map((trait) => {
            const isSelected = selectedTrait && selectedTrait.name === trait.name;
            const traitImage = getTraitImage(selectedCategory.name, trait.name);

            return (
              <button
                key={trait.name}
                onClick={() => setSelectedTrait(trait)}
                className={`flex flex-col items-center p-3 rounded-lg border transition-all text-center ${
                  isSelected
                    ? "bg-amber-100/70 border-amber-850 shadow-sm"
                    : "bg-white/80 border-stone-200 hover:bg-stone-50"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-md overflow-hidden flex items-center justify-center mb-2 drop-shadow-sm border border-stone-200"
                  style={{
                    backgroundColor: selectedCategory.name === "Background" 
                      ? (BACKGROUND_COLORS[trait.name.toLowerCase()] || "transparent")
                      : "transparent"
                  }}
                >
                  <img
                    src={traitImage}
                    alt={trait.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = "https://i.imgur.com/pcn60EC.png";
                    }}
                  />
                </div>
                <span className="font-serif text-sm font-bold text-stone-800 line-clamp-2">
                  {trait.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detailed Backstory Parchment */}
      <div className="w-full md:w-7/20 flex-grow bg-[#fdf6e3]/70 border border-stone-300 rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
        {/* Parchment border decoration */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-900/30 rounded-tl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-900/30 rounded-tr pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-900/30 rounded-bl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-900/30 rounded-br pointer-events-none"></div>

        {selectedTrait ? (
          <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col items-center text-center border-b border-stone-300 pb-4 mb-4">
              <div
                className="w-28 h-28 rounded-xl overflow-hidden flex items-center justify-center mb-3 drop-shadow-md border-2 border-stone-200 p-1"
                style={{
                  backgroundColor: selectedCategory.name === "Background" 
                    ? (BACKGROUND_COLORS[selectedTrait.name.toLowerCase()] || "transparent")
                    : "transparent"
                }}
              >
                <img
                  src={getTraitImage(selectedCategory.name, selectedTrait.name)}
                  alt={selectedTrait.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase font-semibold">
                Category: {selectedCategory.name}
              </span>
              <h2 className="font-serif text-2xl font-bold text-amber-950 mt-1">
                {selectedTrait.name}
              </h2>
            </div>

            <div className="flex-grow overflow-y-auto max-h-[260px] pr-2">
              <p className="font-serif text-stone-850 leading-relaxed text-base italic">
                {renderSafeLore(
                  selectedTrait.description && typeof selectedTrait.description === "object"
                    ? (selectedTrait.description.lore || selectedTrait.description.description || "")
                    : selectedTrait.description
                )}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-250 flex items-center justify-center gap-1.5 text-amber-900/60 font-serif text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Decent Ducks</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
            <Book className="w-16 h-16 opacity-30 mb-4" />
            <p className="font-serif text-lg italic">Select a trait to reveal its ancient backstory.</p>
          </div>
        )}
      </div>

    </div>
  );
}
