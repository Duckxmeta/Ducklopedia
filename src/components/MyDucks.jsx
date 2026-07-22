import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useUserDucks from "../hooks/useUserDucks";
import { getLoreForTrait, DEFAULT_LORE } from "../data/lore";
import { CONFIG } from "../config";
import { BookOpen, ShieldAlert, Sparkles, Wallet, Award } from "lucide-react";

export default function MyDucks() {
  const { publicKey, connected } = useWallet();
  const [selectedDuck, setSelectedDuck] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Derive wallet address string
  const walletAddress = publicKey ? publicKey.toString() : null;

  // Consume the custom hook
  const { ducks, loading, loadingStep, error } = useUserDucks(walletAddress, isDemoMode);

  // Automatically select the first duck in the list when data loads
  useEffect(() => {
    if (ducks.length > 0) {
      setSelectedDuck(ducks[0]);
    } else {
      setSelectedDuck(null);
    }
  }, [ducks]);

  // Reset demo mode when wallet is connected/disconnected
  useEffect(() => {
    if (connected) {
      setIsDemoMode(false);
    }
  }, [connected]);

  // Helper to check if a duck has a Legend trait
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
                  onClick={() => setSelectedDuck(duck)}
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
      <div className="flex-grow w-full lg:w-2/3 bg-stone-50 border border-stone-300 rounded-xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
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
              <div className="text-center sm:text-left min-w-0">
                <h2 className="font-serif text-3xl font-bold text-amber-950 leading-tight">
                  {selectedDuck.name}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-3">
                  {selectedDuck.attributes?.map((attr, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-amber-900/15 text-amber-950 border border-amber-900/20 text-xs rounded-full font-serif font-semibold"
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
                  <h4 className="font-bold text-amber-950 text-lg border-b border-amber-900/10 pb-1 mb-2 flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-800" /> Legendary Tale
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
                          {attr.trait_type}: <span className="text-stone-850 capitalize">{attr.value}</span>
                        </h4>
                        <p 
                          className="mt-1.5 text-stone-700 leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{
                            __html: lore.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </div>
                    );
                  })}
                  {/* Fallback if no matching trait lore exists */}
                  {(!selectedDuck.attributes ||
                    selectedDuck.attributes.filter((attr) =>
                      getLoreForTrait(attr.trait_type, attr.value)
                    ).length === 0) && (
                    <div className="py-8 text-center text-stone-500 italic">
                      {DEFAULT_LORE}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-stone-400">
            <BookOpen className="w-16 h-16 opacity-30 mb-4" />
            <p className="font-serif text-lg italic">Select a duck from the nest to load its chronicles.</p>
          </div>
        )}

        {/* Footer of the Lore Book */}
        {selectedDuck && (
          <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            Sanctuary Scribe Registry • Mint: {selectedDuck.mint?.slice(0, 8)}...{selectedDuck.mint?.slice(-8)}
          </div>
        )}
      </div>
    </div>
  );
}
