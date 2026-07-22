import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { fetchWalletNfts, fetchWalletNftsDas } from "../utils/solanaNft";
import { MOCK_DUCKS, CONFIG } from "../config";
import loreData from "../data/lore.json";
import { BookOpen, ShieldAlert, Sparkles, User, Wallet } from "lucide-react";

export default function MyDucks() {
  const { publicKey, connected } = useWallet();
  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch ducks when wallet connects or changes
  useEffect(() => {
    if (connected && publicKey && !isDemoMode) {
      loadWalletDucks(publicKey.toString());
    } else if (isDemoMode) {
      setDucks(MOCK_DUCKS);
      setSelectedDuck(MOCK_DUCKS[0]);
    } else {
      setDucks([]);
      setSelectedDuck(null);
    }
  }, [connected, publicKey, isDemoMode]);

  const loadWalletDucks = async (address) => {
    setLoading(true);
    setLoadingStep("Connecting to Solana...");
    try {
      // 1. Try DAS API first (extremely fast, requires DAS-enabled RPC)
      let nftList = await fetchWalletNftsDas(address);

      // 2. Fallback to standard Web3.js (slower, parses metadata accounts directly)
      if (nftList === null) {
        setLoadingStep("Fetching token accounts (standard RPC)...");
        nftList = await fetchWalletNfts(address, (progress) => {
          setLoadingStep(progress);
        });
      }

      setDucks(nftList);
      if (nftList.length > 0) {
        setSelectedDuck(nftList[0]);
      } else {
        setSelectedDuck(null);
      }
    } catch (error) {
      console.error("Error loading wallet ducks:", error);
      setLoadingStep("Failed to load. Standard RPC rate-limit hit. Try Demo Mode!");
    } finally {
      setLoading(false);
    }
  };

  // Helper to cross-reference traits with lore.json
  const getLoreForTrait = (traitType, traitValue) => {
    // Normalise casing
    const typeKey = Object.keys(loreData.attributes).find(
      (k) => k.toLowerCase() === traitType.toLowerCase()
    );
    if (!typeKey) return null;

    const traitMap = loreData.attributes[typeKey];
    const matchedValueKey = Object.keys(traitMap).find(
      (v) => v.toLowerCase() === traitValue.toLowerCase()
    );

    return matchedValueKey ? traitMap[matchedValueKey] : null;
  };

  // Check if a duck has a Legend trait
  const getLegendLore = (duck) => {
    const legendAttr = duck.attributes?.find(
      (attr) => attr.trait_type?.toLowerCase() === "legend"
    );
    if (legendAttr) {
      return getLoreForTrait("Legend", legendAttr.value);
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
      {/* Left side: List of Ducks */}
      <div className="w-full lg:w-1/3 flex flex-col bg-amber-50/40 border border-stone-300 rounded-xl p-4 shadow-inner">
        <h3 className="font-serif text-2xl text-amber-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" /> Your Sanctuary Flock
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
            {isDemoMode ? "Demo Mode Active" : "Try Demo Mode"}
          </button>
          {connected && isDemoMode && (
            <button
              onClick={() => setIsDemoMode(false)}
              className="px-3 py-2 text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-medium transition-all"
            >
              Use Real Wallet
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
        ) : ducks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldAlert className="w-12 h-12 text-amber-800/40 mb-3" />
            <p className="text-stone-700 font-bold mb-2">No Decent Ducks Found</p>
            <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
              We couldn't detect any ducks from creator:
              <code className="block bg-stone-100 text-[10px] p-1.5 rounded mt-1.5 select-all overflow-x-auto">
                {CONFIG.collectionCreatorAddress}
              </code>
            </p>
            <button
              onClick={() => setIsDemoMode(true)}
              className="mt-6 px-5 py-2 bg-amber-800 text-stone-100 font-serif rounded-lg shadow-md hover:bg-amber-900 transition-all text-sm"
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
                  onClick={() => setSelectedDuck(duck)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-amber-100/80 border-amber-800 shadow-sm"
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
                    <p className="font-serif text-sm font-bold text-stone-800 truncate">
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

      {/* Right side: Lore Book for selected Duck */}
      <div className="flex-grow w-full lg:w-2/3 bg-stone-50 border border-stone-300 rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
        {/* Decorative corner borders */}
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
              <div className="text-center sm:text-left min-w-0">
                <h2 className="font-serif text-3xl font-bold text-amber-950 leading-tight">
                  {selectedDuck.name}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                  {selectedDuck.attributes?.map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-amber-900/10 text-amber-900 border border-amber-900/20 text-xs rounded-full font-serif font-semibold"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Lore Sections */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 font-serif text-stone-850">
              {/* Check for Legend First */}
              {getLegendLore(selectedDuck) ? (
                <div className="p-4 bg-amber-100/50 border border-amber-800/30 rounded-lg">
                  <h4 className="font-bold text-amber-950 text-lg border-b border-amber-900/10 pb-1 mb-2">
                    Legendary Tale
                  </h4>
                  <p className="leading-relaxed italic">
                    {getLegendLore(selectedDuck)}
                  </p>
                </div>
              ) : (
                <>
                  {selectedDuck.attributes?.map((attr, idx) => {
                    const lore = getLoreForTrait(attr.trait_type, attr.value);
                    if (!lore) return null;
                    return (
                      <div key={idx} className="p-3 bg-stone-100/80 border border-stone-200 rounded-lg hover:border-amber-900/20 transition-all">
                        <h4 className="font-bold text-amber-900 text-sm tracking-wider uppercase">
                          {attr.trait_type}: <span className="text-stone-800 capitalize">{attr.value}</span>
                        </h4>
                        <p className="mt-1.5 text-stone-700 leading-relaxed text-sm">
                          {lore}
                        </p>
                      </div>
                    );
                  })}
                  {/* Fallback if no matching trait lore exists */}
                  {(!selectedDuck.attributes ||
                    selectedDuck.attributes.filter((attr) =>
                      getLoreForTrait(attr.trait_type, attr.value)
                    ).length === 0) && (
                    <div className="py-8 text-center text-stone-500 italic">
                      {loreData.defaultLore}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
            <BookOpen className="w-16 h-16 opacity-30 mb-4" />
            <p className="font-serif text-lg italic">Open the book to read the history of your ducks.</p>
          </div>
        )}

        {/* Footer of the Lore Book */}
        {selectedDuck && (
          <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            Decent Ducks Scribe Registry • Mint: {selectedDuck.mint?.slice(0, 8)}...{selectedDuck.mint?.slice(-8)}
          </div>
        )}
      </div>
    </div>
  );
}
