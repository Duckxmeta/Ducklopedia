import React, { useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { CONFIG } from "./config";
import LoreExplorer from "./components/LoreExplorer";
import MyDucks from "./components/MyDucks";
import { Home, Compass, User, Feather } from "lucide-react";

// Default styles for the Solana Wallet Adapter UI
import "@solana/wallet-adapter-react-ui/styles.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  // Set up standard Solana wallets
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={CONFIG.rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="book-container w-full flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Side Navigation Spine */}
            <div className="tabs-container flex-shrink-0 w-full md:w-60 bg-amber-50 p-3 md:p-5 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 px-2">
                  <Feather className="w-8 h-8 text-amber-900 drop-shadow-sm" />
                  <div>
                    <h1 className="font-serif text-xl font-bold text-amber-950 tracking-tight leading-none">
                      Ducklopedia
                    </h1>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-800">
                      Decent Ducks v2.0
                    </span>
                  </div>
                </div>

                <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible">
                  <button
                    className={`tab-button w-full text-left p-3.5 rounded-lg text-base font-serif transition-all flex items-center gap-2.5 border-l-4 cursor-pointer ${
                      activeTab === "home"
                        ? "bg-[#ece3cf] text-[#a0522d] border-[#a0522d] translate-x-0.5"
                        : "text-[#5a3d36] hover:bg-[#ece3cf]/60 hover:text-[#a0522d] border-transparent"
                    }`}
                    onClick={() => setActiveTab("home")}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home Registry</span>
                  </button>

                  <button
                    className={`tab-button w-full text-left p-3.5 rounded-lg text-base font-serif transition-all flex items-center gap-2.5 border-l-4 cursor-pointer ${
                      activeTab === "explorer"
                        ? "bg-[#ece3cf] text-[#a0522d] border-[#a0522d] translate-x-0.5"
                        : "text-[#5a3d36] hover:bg-[#ece3cf]/60 hover:text-[#a0522d] border-transparent"
                    }`}
                    onClick={() => setActiveTab("explorer")}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Lore Explorer</span>
                  </button>

                  <button
                    className={`tab-button w-full text-left p-3.5 rounded-lg text-base font-serif transition-all flex items-center gap-2.5 border-l-4 cursor-pointer ${
                      activeTab === "my-ducks"
                        ? "bg-[#ece3cf] text-[#a0522d] border-[#a0522d] translate-x-0.5"
                        : "text-[#5a3d36] hover:bg-[#ece3cf]/60 hover:text-[#a0522d] border-transparent"
                    }`}
                    onClick={() => setActiveTab("my-ducks")}
                  >
                    <User className="w-4 h-4" />
                    <span>My Sanctuary</span>
                  </button>
                </nav>
              </div>

              {/* Connected Wallet Control (Desktop) */}
              <div className="hidden md:block mt-6 pt-4 border-t border-[#d3c8b2] text-center">
                <WalletMultiButton className="!bg-[#a0522d] !hover:bg-[#8b4513] !text-white !rounded-lg !py-2 !px-4 !text-sm !font-serif !w-full !justify-center" />
              </div>
            </div>

            {/* Right Side Content Pages */}
            <div className="content-container flex-grow p-4 md:p-8 overflow-y-auto">
              
              {/* Home Page */}
              <div className={activeTab === "home" ? "block" : "hidden"}>
                <div className="flex flex-col items-center justify-center min-h-[450px] text-center">
                  <img
                    src="https://i.imgur.com/pcn60EC.png"
                    alt="The OG Duck Icon"
                    className="w-36 h-36 mb-6 opacity-85 hover:scale-105 transition-transform duration-300"
                  />
                  <h2 className="book-title text-5xl sm:text-6xl font-serif font-bold text-amber-950">
                    The Ducklopedia
                  </h2>
                  <p className="text-stone-700 mt-3 text-lg font-serif italic">
                    A living record of lore from the Decent Ducks Sanctuary.
                  </p>
                  <p className="text-stone-850 mt-8 text-lg max-w-xl mx-auto leading-relaxed font-serif font-semibold">
                    Every duck carries a history woven from its traits. Explore the database of backstories or connect your Solana wallet to unlock the details of your own flock.
                  </p>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button
                      onClick={() => setActiveTab("explorer")}
                      className="px-8 py-3 bg-[#a0522d] text-stone-100 font-serif font-bold rounded-lg shadow-md hover:bg-amber-900 transition-all transform hover:scale-105 cursor-pointer"
                    >
                      Browse Lore Explorer
                    </button>
                    <button
                      onClick={() => setActiveTab("my-ducks")}
                      className="px-8 py-3 bg-white border border-stone-300 text-[#a0522d] font-serif font-bold rounded-lg shadow-md hover:bg-stone-50 transition-all transform hover:scale-105 cursor-pointer"
                    >
                      Enter My Sanctuary
                    </button>
                  </div>
                </div>
              </div>

              {/* Lore Explorer Page */}
              <div className={activeTab === "explorer" ? "block" : "hidden"}>
                <LoreExplorer />
              </div>

              {/* My Ducks Page */}
              <div className={activeTab === "my-ducks" ? "block" : "hidden"}>
                <MyDucks />
              </div>

            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
