import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useUserDucks from "../hooks/useUserDucks";
import { getLoreForTrait, DEFAULT_LORE, getLegendLore, getBackgroundDetails } from "../data/lore";
import { CONFIG } from "../config";
import { renderSafeLore } from "../utils/text";
import { CATEGORY_ALIASES, DISPLAY_CATEGORIES } from "../data/traitAliases";
import { BODY_FEATHER_MAP, EYE_TRAIT_MAP, EYEWEAR_MAP, ATTIRE_MAP, normalizeEyewearName, HEADWEAR_MAP } from "../data/traitMapping";
import { BookOpen, ShieldAlert, Sparkles, Wallet, Award, Camera, X, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function MyDucks() {
  const { publicKey, connected } = useWallet();
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Derive wallet address string
  const walletAddress = publicKey ? publicKey.toString() : null;

  // Consume the custom hook
  const { ducks, loading, loadingStep, error } = useUserDucks(walletAddress, isDemoMode);

  const exportAsPng = async () => {
    const shareNode = document.getElementById("social-share-card-content");
    if (!shareNode) return;
    setIsExporting(true);
    try {
      // Small timeout to allow render/asset loading if needed
      await new Promise(resolve => setTimeout(resolve, 150));
      const canvas = await html2canvas(shareNode, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#16100b",
        scale: 2, // Double resolution for sharp text/assets
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${selectedDuck.name.replace(/\s+/g, "_")}_LoreCard.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Automatically select the first duck in the list when data loads
  useEffect(() => {
    if (ducks.length > 0) {
      setSelectedDuck(ducks[0]);
      setSelectedTrait(null);
    } else {
      setSelectedDuck(null);
      setSelectedTrait(null);
    }
  }, [ducks]);

  // Reset demo mode when wallet is connected/disconnected
  useEffect(() => {
    if (connected) {
      setIsDemoMode(false);
    }
  }, [connected]);



  // Fallback description for items without custom trait lore (e.g. V2 eggs)
  const getFallbackLore = (duck) => {
    if (!duck) return DEFAULT_LORE;
    const nameLower = String(duck.name || '').toLowerCase();
    if (nameLower.includes("egg")) {
      return "An unhatched Decent Ducks egg. Lore coming soon!";
    }
    return DEFAULT_LORE;
  };

  // Helper to map values (like Body/Feathers colors to Pekin/Mallard breed names, and Eyes indexes)
  const getDisplayValue = (type, val) => {
    const tLower = String(type || "").toLowerCase();
    const valLower = String(val || "").toLowerCase();
    if (tLower === "body" || tLower === "skin" || tLower === "feathers" || tLower === "feather") {
      return BODY_FEATHER_MAP[valLower] || val;
    }
    if (tLower === "eyes" || tLower === "eyewear" || tLower === "glasses" || tLower === "shades") {
      const normalized = normalizeEyewearName(val);
      if (normalized) return normalized;
      return EYEWEAR_MAP[valLower] || EYE_TRAIT_MAP[valLower] || val;
    }
    if (tLower === "clothing" || tLower === "clothes" || tLower === "attire" || tLower === "shirt") {
      return ATTIRE_MAP[valLower] || val;
    }
    if (tLower === "hat" || tLower === "hats" || tLower === "headwear") {
      return HEADWEAR_MAP[valLower] || val;
    }
    return val;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
      {/* Left Column: Your Sanctuary Flock */}
      <div className="w-full lg:w-1/3 flex flex-col bg-amber-50/40 border border-stone-300 rounded-xl p-4 shadow-inner">
        <h3 className="font-serif text-2xl text-amber-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> Your Sanctuary Nest
        </h3>

        {/* Demo Mode Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`flex-grow px-3 py-2 text-sm rounded-lg font-medium border transition-all flex items-center justify-center gap-1.5 ${
              isDemoMode
                ? "bg-amber-800 text-stone-100 border-amber-900 shadow-md"
                : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isDemoMode ? "Demo Nest Active" : "Try Demo Nest"}
          </button>
          {connected && isDemoMode && (
            <button
              onClick={() => setIsDemoMode(false)}
              className="px-3 py-2 text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition-all"
            >
              Real Wallet
            </button>
          )}
        </div>

        {/* Wallet Status / Connection */}
        {!connected && !isDemoMode ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Wallet className="w-12 h-12 text-amber-800/40 mb-3" />
            <p className="text-stone-600 mb-4 text-sm font-medium">
              Connect your Solana wallet to load your Decent Ducks and read their stories.
            </p>
            <div className="scale-95 hover:scale-100 transition-transform">
              <WalletMultiButton className="!bg-amber-800 !hover:bg-amber-900 !rounded-lg !font-serif !shadow-md" />
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-amber-800/20 border-t-amber-800 rounded-full animate-spin mb-4"></div>
            <p className="text-amber-900 font-serif text-lg font-bold">Decoding Blockchain...</p>
            <p className="text-stone-500 text-xs mt-2 px-4 max-w-xs">{loadingStep}</p>
          </div>
        ) : error || ducks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldAlert className="w-12 h-12 text-amber-800/40 mb-3" />
            <p className="text-stone-850 font-serif font-bold text-lg mb-1">No Ducks Found</p>
            <p className="text-stone-700 text-sm max-w-xs leading-relaxed mb-4">
              We couldn't detect any Decent Ducks in this wallet. Make sure you hold tokens from the collection:
              <code className="block bg-stone-200/60 text-[10px] font-mono py-1 px-2 rounded mt-2 select-all overflow-x-auto text-stone-800">
                {CONFIG.collectionCreatorAddress.slice(0, 10)}...{CONFIG.collectionCreatorAddress.slice(-10)}
              </code>
            </p>
            {error && (
              <p className="text-red-800 text-xs font-mono mb-4 px-2 max-w-xs bg-red-50 py-1.5 rounded border border-red-200">
                Error: {error}
              </p>
            )}
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-6 py-2 bg-amber-800 text-stone-100 font-serif font-bold rounded-lg shadow-md hover:bg-amber-900 transition-all text-sm"
            >
              Reveal Demo Ducks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto max-h-[450px] pr-1">
            {ducks.map((duck) => {
              const isSelected = selectedDuck && selectedDuck.mint === duck.mint;
              return (
                <button
                  key={duck.mint}
                  onClick={(e) => {
                    setSelectedDuck(duck);
                    setSelectedTrait(null);
                    if (window.innerWidth < 768) {
                      setTimeout(() => {
                        const el = document.getElementById("duck-details-container");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }, 100);
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault(); // prevent click double-triggering
                    setSelectedDuck(duck);
                    setSelectedTrait(null);
                    if (window.innerWidth < 768) {
                      setTimeout(() => {
                        const el = document.getElementById("duck-details-container");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }, 100);
                    }
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-amber-105 border-amber-800 shadow-sm"
                      : "bg-white/60 border-stone-200 hover:bg-stone-50/80"
                  }`}
                >
                  <img
                    src={duck.image}
                    alt={duck.name}
                    className="w-12 h-12 rounded-md object-contain border border-stone-300 bg-stone-100 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "https://i.imgur.com/pcn60EC.png";
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-serif text-sm font-bold text-stone-850 truncate">
                      {duck.name}
                    </p>
                    <p className="text-xs text-stone-500 truncate">
                      {duck.attributes?.length || 0} Traits
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Lore Book details */}
      <div id="duck-details-container" className="flex-grow w-full lg:w-2/3 bg-stone-50 border border-stone-300 rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-900/30 rounded-tl-lg pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-900/30 rounded-tr-lg pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-900/30 rounded-bl-lg pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-900/30 rounded-br-lg pointer-events-none"></div>

        {selectedDuck ? (
          <div>
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start border-b border-stone-200 pb-5 mb-5">
              <img
                src={selectedDuck.image}
                alt={selectedDuck.name}
                className="w-32 h-32 rounded-xl object-contain border-2 border-amber-900/40 bg-amber-50 shadow-md"
                onError={(e) => {
                  e.target.src = "https://i.imgur.com/pcn60EC.png";
                }}
              />
              <div className="text-center sm:text-left min-w-0 flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="font-serif text-3xl font-bold text-amber-950 leading-tight">
                    {selectedDuck.name}
                  </h2>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-850 text-stone-100 font-serif font-bold text-xs rounded shadow hover:bg-amber-950 transition-all cursor-pointer w-fit self-center sm:self-auto"
                  >
                    <Camera className="w-3.5 h-3.5" /> 📸 Share Card
                  </button>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2.5">
                  {selectedDuck.attributes?.map((attr, idx) => {
                    const hasLore = getLoreForTrait(attr.trait_type, attr.value);
                    const isSelected = selectedTrait && 
                                       selectedTrait.trait_type === attr.trait_type && 
                                       selectedTrait.value === attr.value;
                    const displayCategory = DISPLAY_CATEGORIES[String(attr.trait_type || '').toLowerCase()] || attr.trait_type;
                    const displayValue = getDisplayValue(attr.trait_type, attr.value);
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTrait(isSelected ? null : attr)}
                        className={`px-2.5 py-0.5 text-xs rounded-full font-serif font-semibold border transition-all ${
                          isSelected
                            ? "bg-amber-900 text-stone-100 border-amber-950 shadow-sm"
                            : hasLore
                            ? "bg-amber-900/10 text-amber-950 border-amber-900/25 hover:bg-amber-900/20 cursor-pointer"
                            : "bg-stone-200/50 text-stone-600 border-stone-300/40 opacity-70 cursor-not-allowed"
                        }`}
                        title={hasLore ? "Click to view trait backstory" : "No lore written for this trait yet"}
                        disabled={!hasLore}
                      >
                        {displayCategory}: {displayValue} {!hasLore && " (No Lore)"}
                      </button>
                    );
                  })}
                </div>
                
                {/* Realm Environment Tone Badge */}
                {(() => {
                  const bgAttr = selectedDuck.attributes?.find(
                    (attr) => String(attr?.trait_type || '').toLowerCase() === "background"
                  );
                  const bgDetails = bgAttr ? getBackgroundDetails(bgAttr.value) : null;
                  if (!bgDetails) return null;
                  return (
                    <div className="mt-3.5 p-3 bg-amber-50/70 border border-amber-900/15 rounded-lg flex items-start gap-2.5 shadow-sm text-left">
                      <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-serif font-bold text-amber-950">
                          Environment Tone: <span className="underline decoration-amber-900/20">{bgDetails.title}</span> ({bgDetails.theme})
                        </p>
                        <p className="text-[11px] text-stone-600 mt-1 leading-relaxed italic font-serif">
                          "{bgDetails.lore}"
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Custom Lore Sections */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 font-serif text-stone-850">
              {/* Check for Legend First */}
              {getLegendLore(selectedDuck.name, selectedDuck.attributes) ? (
                <div className="p-4 bg-amber-100/50 border border-amber-800/30 rounded-lg">
                  <h4 className="font-bold text-amber-950 text-lg border-b border-amber-900/10 pb-1 mb-2 flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-800" /> Legendary Tale
                  </h4>
                  <p className="leading-relaxed italic">
                    {getLegendLore(selectedDuck.name, selectedDuck.attributes)}
                  </p>
                </div>
              ) : selectedTrait ? (
                // 1. Render single trait backstory details
                <div className="p-4 bg-amber-100/30 border border-amber-800/20 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-900/10 pb-2 mb-3 gap-2">
                    <h4 className="font-bold text-amber-950 text-base uppercase tracking-wider">
                      Trait Backstory: {DISPLAY_CATEGORIES[String(selectedTrait.trait_type || '').toLowerCase()] || selectedTrait.trait_type} ({getDisplayValue(selectedTrait.trait_type, selectedTrait.value)})
                    </h4>
                    <button
                      onClick={() => setSelectedTrait(null)}
                      className="text-xs px-2.5 py-1 bg-amber-800 text-stone-100 rounded hover:bg-amber-900 transition-all font-sans font-medium w-fit cursor-pointer"
                    >
                      ← Back to Duck View
                    </button>
                  </div>
                  <p className="mt-1.5 text-stone-850 leading-relaxed text-sm">
                    {renderSafeLore(getLoreForTrait(selectedTrait.trait_type, selectedTrait.value))}
                  </p>
                </div>
              ) : (
                // 2. Render Full Chronicle (combined paragraphs of matching traits)
                (() => {
                  const matchedLore = selectedDuck.attributes
                    ?.map((attr) => ({
                      attr,
                      lore: getLoreForTrait(attr.trait_type, attr.value),
                    }))
                    .filter((item) => item.lore) || [];

                  if (matchedLore.length === 0) {
                    return (
                      <div className="py-8 text-center text-stone-550 italic">
                        {getFallbackLore(selectedDuck)}
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="border-b border-stone-200 pb-2">
                        <h4 className="font-bold text-amber-950 text-xl font-serif">
                          {selectedDuck.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                          Matching traits: {matchedLore.length}. Click any highlighted trait pill above to isolate its backstory.
                        </p>
                      </div>
                      <div className="space-y-4 leading-relaxed text-stone-850">
                        {matchedLore.map((item, idx) => (
                          <div key={idx} className="p-3 bg-stone-100/50 border border-stone-200 rounded-lg hover:border-amber-900/15 transition-all">
                            <h5 className="font-bold text-amber-900 text-xs tracking-wider uppercase mb-1">
                              {DISPLAY_CATEGORIES[String(item.attr.trait_type || '').toLowerCase()] || item.attr.trait_type}: <span className="text-stone-850 capitalize font-sans">{getDisplayValue(item.attr.trait_type, item.attr.value)}</span>
                            </h5>
                            <p className="text-sm leading-relaxed">
                              {renderSafeLore(item.lore)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
            <BookOpen className="w-16 h-16 opacity-30 mb-4" />
            <p className="font-serif text-lg italic">Select a duck from the nest to load its details.</p>
          </div>
        )}

        {/* Footer of the Lore Book */}
        {selectedDuck && (
          <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            Sanctuary Scribe Registry • Mint: {selectedDuck.mint?.slice(0, 8)}...{selectedDuck.mint?.slice(-8)}
          </div>
        )}
      </div>

      {/* Share / Social Post Card Modal Overlay */}
      {isShareModalOpen && selectedDuck && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm animate-fade-in sanctuary-export-modal">
          <div className="bg-[#1c140e] border-2 border-amber-900/40 rounded-2xl max-w-sm w-full shadow-2xl relative p-5 flex flex-col items-center">
            
            {/* Close Button */}
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-100 transition-colors p-1 bg-stone-900/50 rounded-full border border-stone-800 cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-4">
              <h3 className="font-serif text-amber-100 text-lg font-bold">📸 Sanctuary Export</h3>
              <p className="text-[10px] text-stone-400 font-sans mt-0.5">
                Screenshot this card or download it directly to share on X / TikTok.
              </p>
            </div>

            {/* Trading Card content targeting html2canvas */}
            <div
              id="social-share-card-content"
              className="p-5 bg-[#16100b] border border-amber-950/40 rounded-xl w-full flex flex-col items-center text-stone-100 font-serif relative overflow-hidden"
              style={{ width: "320px" }}
            >
              {/* Outer Golden Accented Border */}
              <div className="absolute inset-2 border border-amber-900/15 rounded-lg pointer-events-none"></div>
                    {/* Header subtitle */}
              <div
                className="text-[9px] tracking-widest font-mono uppercase mb-2"
                style={{ color: '#FFC107', fontWeight: 600 }}
              >
                Decent Ducks Registry
              </div>
              
              {/* Artwork Frame */}
              <div className="w-44 h-44 bg-[#231b15] border-2 border-amber-900/30 rounded-xl overflow-hidden shadow-inner p-1.5 flex items-center justify-center relative mb-3">
                <img
                  src={selectedDuck.image}
                  alt={selectedDuck.name}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://i.imgur.com/pcn60EC.png";
                  }}
                />
                <div className="absolute bottom-1.5 right-1.5 bg-amber-950/85 border border-amber-500/30 px-1.5 py-0.5 rounded text-[8px] font-mono text-amber-400">
                  ID: #{selectedDuck.name.replace(/^\D+/g, "") || selectedDuck.mint.slice(0, 6)}
                </div>
              </div>
              
              {/* Name */}
              <h4
                className="text-lg font-bold mb-2.5 tracking-wide text-center"
                style={{ color: '#FFFFFF' }}
              >
                {selectedDuck.name}
              </h4>
              
              {/* Attributes Grid */}
              <div className="w-full space-y-1 mb-3 artistic-traits-container">
                <h5
                  className="text-[8px] font-mono uppercase tracking-wider text-left border-b border-amber-900/20 pb-0.5 mb-1"
                  style={{ color: '#FFC107' }}
                >
                  Artistic Traits
                </h5>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  {selectedDuck.attributes?.slice(0, 6).map((attr, idx) => {
                    const displayCategory = DISPLAY_CATEGORIES[String(attr.trait_type || '').toLowerCase()] || attr.trait_type;
                    const displayValue = getDisplayValue(attr.trait_type, attr.value);
                    return (
                      <div
                        key={idx}
                        className="p-1.5 rounded flex flex-col justify-between truncate"
                        style={{ backgroundColor: '#1E1B18', border: '1px solid #4A3E35' }}
                      >
                        <span
                          className="text-[7.5px] font-mono uppercase truncate trait-category-label"
                          style={{ color: '#FFC107', fontWeight: 600 }}
                        >
                          {displayCategory}
                        </span>
                        <span
                          className="font-sans truncate mt-0.5 export-card-trait-value trait-value"
                          title={displayValue}
                          style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}
                        >
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Chronicle Snippet / Environment */}
              <div
                className="w-full p-2.5 rounded-lg text-left text-[10px] mb-2.5 min-h-[50px] flex flex-col justify-center animate-none environmental-realm-container"
                style={{ backgroundColor: '#1E1B18', border: '1px solid #4A3E35' }}
              >
                {(() => {
                  const bgAttr = selectedDuck.attributes?.find(
                    (attr) => String(attr?.trait_type || '').toLowerCase() === "background"
                  );
                  const bgDetails = bgAttr ? getBackgroundDetails(bgAttr.value) : null;
                  
                  const firstTraitWithLore = selectedDuck.attributes?.find(
                    a => getLoreForTrait(a.trait_type, a.value)
                  );
                  const keyLore = firstTraitWithLore 
                    ? getLoreForTrait(firstTraitWithLore.trait_type, firstTraitWithLore.value) 
                    : getFallbackLore(selectedDuck);
                  const excerpt = keyLore ? (keyLore.slice(0, 110) + (keyLore.length > 110 ? "..." : "")) : "";
                  
                  return (
                    <div className="space-y-1">
                      {bgDetails && (
                        <div
                          className="text-[8.5px] font-mono environmental-realm-title"
                          style={{ color: '#FFC107', fontWeight: 700 }}
                        >
                          ✦ ENVIRONMENTAL REALM: {bgDetails.title}
                        </div>
                      )}
                      <p
                        className="leading-relaxed text-[10.5px] quote-text"
                        style={{ color: '#FFFFFF', fontStyle: 'italic', opacity: 1 }}
                      >
                        "{excerpt}"
                      </p>
                    </div>
                  );
                })()}
              </div>
              
              {/* Branding Footer */}
              <div
                className="text-[8px] font-mono uppercase tracking-widest mt-0.5 flex items-center gap-1 branding-footer"
                style={{ color: '#E0D0C0' }}
              >
                ✦ DECENTDUCKS.ME • LORE BOOK ✦
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex gap-2 w-full">
              <button
                onClick={exportAsPng}
                disabled={isExporting}
                className="flex-grow flex items-center justify-center gap-2 py-2 px-4 bg-amber-800 text-stone-100 font-serif font-bold text-xs rounded shadow hover:bg-amber-900 transition-all cursor-pointer disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-stone-100/20 border-t-stone-100 rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Download PNG
                  </>
                )}
              </button>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="py-2 px-4 border border-stone-700 text-stone-300 hover:text-stone-100 font-serif font-bold text-xs rounded hover:bg-stone-850 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
