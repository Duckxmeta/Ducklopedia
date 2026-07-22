import React, { useState, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { CONFIG } from "./config";
import MyDucks from "./components/MyDucks";
import loreData from "./data/lore.json";

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
            {/* Left Side: Tabs */}
            <div className="tabs-container flex-shrink-0 w-full md:w-56 bg-amber-50 p-2 md:p-4 overflow-y-auto flex flex-col justify-between">
              <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "home"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("home")}
                >
                  Home
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "my-ducks"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("my-ducks")}
                >
                  My Ducks 📜
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "feathers"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("feathers")}
                >
                  Feathers
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "clothes"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("clothes")}
                >
                  Attire
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "hats"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("hats")}
                >
                  Headwear
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "accessories"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("accessories")}
                >
                  Accessories
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "eyewear"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("eyewear")}
                >
                  Eyewear
                </button>
                <button
                  className={`tab-button w-full text-left p-3 md:p-4 rounded-md text-lg font-serif transition-all ${
                    activeTab === "legends"
                      ? "bg-[#ece3cf] text-[#a0522d] border-l-4 border-[#a0522d] translate-x-0.5"
                      : "text-[#5a3d36] hover:bg-[#ece3cf] hover:text-[#a0522d] border-l-4 border-transparent"
                  }`}
                  onClick={() => setActiveTab("legends")}
                >
                  The Legends
                </button>
              </nav>

              {/* Connected Wallet Indicator */}
              <div className="hidden md:block mt-6 pt-4 border-t border-[#d3c8b2] text-center">
                <WalletMultiButton className="!bg-[#a0522d] !hover:bg-[#8b4513] !text-white !rounded-lg !py-2 !px-4 !text-sm !font-serif" />
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="content-container flex-grow p-4 md:p-8 overflow-y-auto">
              
              {/* Home Tab */}
              {activeTab === "home" && (
                <div className="flex flex-col items-center justify-center min-h-[450px] text-center">
                  <img src="https://i.imgur.com/pcn60EC.png" alt="The OG Duck Icon" className="w-32 h-32 mb-6 opacity-80" />
                  <h2 className="book-title text-5xl sm:text-6xl font-serif font-bold text-amber-900">The Ducklopedia</h2>
                  <p className="text-stone-700 mt-4 text-lg">A living collection of lore from the Decent Ducks Sanctuary.</p>
                  <p className="text-stone-850 mt-10 text-lg max-w-xl mx-auto leading-loose font-serif font-semibold">
                    Every duck has a story told through its traits. What does your duck say about you? Connect your Solana wallet, scan your flock, and read their ancient histories.
                  </p>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <button 
                      onClick={() => setActiveTab("my-ducks")} 
                      className="px-8 py-3 bg-[#a0522d] text-stone-100 font-serif font-semibold rounded-lg shadow-md hover:bg-amber-900 transition-all transform hover:scale-105"
                    >
                      Connect & View My Ducks
                    </button>
                    <a href="https://discord.gg/SBRMV7Yq6D" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-amber-800/10 border-2 border-amber-800 text-amber-950 font-serif font-semibold rounded-lg shadow-md hover:bg-amber-800/20 transition-all transform hover:scale-105">
                      Join the Discord
                    </a>
                  </div>
                </div>
              )}

              {/* My Ducks (Web3) Tab */}
              {activeTab === "my-ducks" && <MyDucks />}

              {/* Feathers Tab */}
              {activeTab === "feathers" && (
                <div>
                  <h2 className="book-title text-4xl mb-6 text-amber-900 border-b-2 border-amber-800 pb-2 font-serif">Chapter 1: Feathers of the Flock</h2>
                  <div className="trait-grid">
                    {Object.entries(loreData.attributes.Feather).map(([name, desc]) => (
                      <div key={name} className="trait-card">
                        <img 
                          src={name === "White (Pekin)" ? "https://i.imgur.com/ykpIueW.png" :
                               name === "Black (Runner)" ? "https://i.imgur.com/Udxju5b.png" :
                               name === "Gold (Buff)" ? "https://i.imgur.com/JR0MRco.png" :
                               name === "Grey (Ugly Duck)" ? "https://i.imgur.com/CFq3KSK.png" :
                               "https://i.imgur.com/k8fedpu.png"} 
                          alt={name} 
                        />
                        <h3 className="text-xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attire Tab */}
              {activeTab === "clothes" && (
                <div>
                  <h2 className="book-title text-4xl mb-6 text-amber-900 border-b-2 border-amber-800 pb-2 font-serif">Chapter 2: Attire of the Ancients</h2>
                  <div className="trait-grid">
                    {Object.entries(loreData.attributes.Attire).map(([name, desc]) => (
                      <div key={name} className="trait-card">
                        <img 
                          src={name === "Blue Hoodie" ? "https://i.imgur.com/rvd6atN.png" :
                               name === "Green Hoodie" ? "https://i.imgur.com/1cLnmGf.png" :
                               name === "Beige Shirt" ? "https://i.imgur.com/HeQLAo3.png" :
                               name === "Black Tux" ? "https://i.imgur.com/kop8UVE.png" :
                               name === "Blue Tux" ? "https://i.imgur.com/zdblK9W.png" :
                               name === "Apprentice Wizard" ? "https://i.imgur.com/1aVvs6Z.png" :
                               name === "Camo Jacket" ? "https://i.imgur.com/ll7VU9i.png" :
                               name === "Apprentice Chef" ? "https://i.imgur.com/M7pjNVR.png" :
                               name === "Head Chef" ? "https://i.imgur.com/8KrhIrN.png" :
                               name === "Bath Robe" ? "https://i.imgur.com/vAjMuBy.png" :
                               name === "Blue Jacket" ? "https://i.imgur.com/H71O3Ow.png" :
                               "https://i.imgur.com/pR9x7uI.png"} 
                          alt={name} 
                        />
                        <h3 className="text-xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headwear Tab */}
              {activeTab === "hats" && (
                <div>
                  <h2 className="book-title text-4xl mb-6 text-amber-900 border-b-2 border-amber-800 pb-2 font-serif">Chapter 3: Headwear of the Flock</h2>
                  <div className="trait-grid">
                    {Object.entries(loreData.attributes.Headwear).map(([name, desc]) => (
                      <div key={name} className="trait-card">
                        <img 
                          src={name === "Wizard Hat" ? "https://i.imgur.com/bwrkVZW.png" :
                               name === "Flower" ? "https://i.imgur.com/f2Qp1qW.png" :
                               name === "Pretty Flower" ? "https://i.imgur.com/2ubp86T.png" :
                               name === "Beige Beanie" ? "https://i.imgur.com/62mEMmj.png" :
                               name === "Orange Beanie" ? "https://i.imgur.com/CkQIh0h.png" :
                               name === "Maroon Beanie" ? "https://i.imgur.com/nsm3vrI.png" :
                               name === "Chef Hat" ? "https://i.imgur.com/e9sUXv4.png" :
                               name === "Crown" ? "https://i.imgur.com/GDeppff.png" :
                               name === "Forward Blue Cap" ? "https://i.imgur.com/O9AczWQ.png" :
                               name === "Backward Blue Cap" ? "https://i.imgur.com/24jIJli.png" :
                               name === "Forward Green Cap" ? "https://i.imgur.com/358JHgb.png" :
                               name === "Backward Green Cap" ? "https://i.imgur.com/0oxrXp5.png" :
                               name === "Forward Purple Cap" ? "https://i.imgur.com/BApG54k.png" :
                               name === "Backward Purple Cap" ? "https://i.imgur.com/b5eWQX2.png" :
                               name === "Cowboy Hat 1" ? "https://i.imgur.com/VNNATuZ.png" :
                               name === "Cowboy Hat 2" ? "https://i.imgur.com/52JgAxU.png" :
                               name === "Bucket Hat" ? "https://i.imgur.com/LAFdMne.png" :
                               name === "Fancy Top Hat" ? "https://i.imgur.com/B9R3Gei.png" :
                               name === "Brown Top Hat" ? "https://i.imgur.com/AIcdDzu.png" :
                               name === "Grey Bowler Hat" ? "https://i.imgur.com/XI3QBAF.png" :
                               "https://i.imgur.com/LdKXmRZ.png"} 
                          alt={name} 
                        />
                        <h3 className="text-xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessories Tab */}
              {activeTab === "accessories" && (
                <div>
                  <h2 className="book-title text-4xl mb-6 text-amber-900 border-b-2 border-amber-800 pb-2 font-serif">Chapter 4: Legendary Armaments & Companions</h2>
                  <div className="trait-grid">
                    {Object.entries(loreData.attributes.Accessories).map(([name, desc]) => (
                      <div key={name} className="trait-card">
                        <img 
                          src={name === "Red Sword (Rock)" ? "https://i.imgur.com/2UnxvdK.png" :
                               name === "Blue Sword (Scissors)" ? "https://i.imgur.com/xsFA9Mg.png" :
                               name === "Green Sword (Paper)" ? "https://i.imgur.com/DQ3kjfI.png" :
                               name === "Wings" ? "https://i.imgur.com/Bpxiqfc.png" :
                               "https://i.imgur.com/hHs5OUb.png"} 
                          alt={name} 
                        />
                        <h3 className="text-xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eyewear Tab */}
              {activeTab === "eyewear" && (
                <div>
                  <h2 className="book-title text-4xl mb-6 text-amber-900 border-b-2 border-amber-800 pb-2 font-serif">Chapter 5: Eyes of the Sanctuary</h2>
                  <div className="trait-grid">
                    {Object.entries(loreData.attributes.Eyewear).map(([name, desc]) => (
                      <div key={name} className="trait-card">
                        <img 
                          src={name === "Eyes 1 (Standard)" ? "https://i.imgur.com/rOOti6Q.png" :
                               name === "Eyes 2 (Determined)" ? "https://i.imgur.com/MR175T2.png" :
                               name === "Eyes 3 (Wise)" ? "https://i.imgur.com/7poQkMh.png" :
                               name === "Eyes 4 (Curious)" ? "https://i.imgur.com/j2DcMVn.png" :
                               name === "Black Goggles" ? "https://i.imgur.com/gTGkcN6.png" :
                               name === "Yellow Goggles" ? "https://i.imgur.com/SOPVYLK.png" :
                               name === "Blue Goggles" ? "https://i.imgur.com/qYm5w6J.png" :
                               name === "Black Shades" ? "https://i.imgur.com/h3K0Dvv.png" :
                               name === "Blue Shades" ? "https://i.imgur.com/QPTbKMs.png" :
                               name === "Green Shades" ? "https://i.imgur.com/3RIQ7rC.png" :
                               name === "Laser Eyes" ? "https://i.imgur.com/yMt6YLJ.png" :
                               name === "MLG Shades" ? "https://i.imgur.com/dVDdj9l.png" :
                               name === "Green Visor" ? "https://i.imgur.com/5gcAoNh.png" :
                               name === "Yellow Visor" ? "https://i.imgur.com/SWg2WqM.png" :
                               name === "Blue Visor" ? "https://i.imgur.com/mSDeZ7E.png" :
                               name === "Purple Visor" ? "https://i.imgur.com/txsBbs4.png" :
                               "https://i.imgur.com/A1kCNKS.png"} 
                          alt={name} 
                        />
                        <h3 className="text-xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Legends Tab */}
              {activeTab === "legends" && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="book-title text-4xl mb-2 text-amber-900 font-serif">Final Chapter: The Legends of the Sanctuary</h2>
                    <p className="text-stone-700 italic max-w-2xl mx-auto font-serif">
                      There are some ducks whose stories transcend the blockchain. They are not merely members of the flock; they are its pillars, its myths, its unwritten rules. They are the 1-of-1s, the true Legends.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(loreData.attributes.Legend).map(([name, desc]) => (
                      <div key={name} className="trait-card text-center p-6 flex flex-col items-center">
                        <img 
                          src={name === "The OG Duck" ? "https://i.imgur.com/pcn60EC.png" :
                               name === "The Mandarin" ? "https://i.imgur.com/wrP5ymE.png" :
                               name === "The BullDuck" ? "https://i.imgur.com/FqUe7KS.png" :
                               "https://i.imgur.com/OdtiPGK.png"} 
                          alt={name}
                          className="w-24 h-24 mb-4 object-contain"
                        />
                        <h3 className="text-2xl font-bold font-serif mb-2">{name}</h3>
                        <p className="text-stone-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
