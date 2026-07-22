// Solana Web3 configuration and Mock Data

export const V1_COLLECTION_ADDRESS = "4GnPjn35vjYWeBAQ1N9TYPgkRhueXEXf1diS6EzTMkMN";
export const V2_COLLECTION_ADDRESS = import.meta.env.VITE_COLLECTION_ADDRESS || "DeENhPTFgyQrvkpRyBCe4KBei2diFMDn19fVLJPZqS2";

export const TARGET_COLLECTIONS = [
  V1_COLLECTION_ADDRESS,
  V2_COLLECTION_ADDRESS
].filter(Boolean);

export const CONFIG = {
  // If you use Helius or Quicknode, put your custom RPC URL here.
  // Using public RPC endpoints might be rate-limited.
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com",

  // Collection Mint or Creator Address to filter NFTs.
  // Set this to your Solana NFT Collection Creator or Update Authority address.
  collectionCreatorAddress: V2_COLLECTION_ADDRESS,

  // Set to true to bypass RPC fetching and always use Mock Data (great for testing/dev)
  useMockDataAlways: false,
};

// 5 sample ducks for demonstration/mock mode
export const MOCK_DUCKS = [
  {
    mint: "Duck111111111111111111111111111111111111111",
    name: "Decent Duck #101 (Paladin Mage)",
    image: "https://i.imgur.com/ykpIueW.png", // White Pekin Feather image
    attributes: [
      { trait_type: "Feather", value: "White (Pekin)" },
      { trait_type: "Attire", value: "Apprentice Wizard" },
      { trait_type: "Headwear", value: "Wizard Hat" },
      { trait_type: "Eyewear", value: "Eyes 3 (Wise)" }
    ]
  },
  {
    mint: "Duck222222222222222222222222222222222222222",
    name: "Decent Duck #402 (Stealth Scout)",
    image: "https://i.imgur.com/Udxju5b.png", // Black Runner Feather image
    attributes: [
      { trait_type: "Feather", value: "Black (Runner)" },
      { trait_type: "Attire", value: "Camo Jacket" },
      { trait_type: "Headwear", value: "Backward Blue Cap" },
      { trait_type: "Eyewear", value: "Laser Eyes" }
    ]
  },
  {
    mint: "Duck333333333333333333333333333333333333333",
    name: "Decent Duck #777 (Royal Golden)",
    image: "https://i.imgur.com/JR0MRco.png", // Gold Buff Feather image
    attributes: [
      { trait_type: "Feather", value: "Gold (Buff)" },
      { trait_type: "Attire", value: "Black Tux" },
      { trait_type: "Headwear", value: "Crown" },
      { trait_type: "Eyewear", value: "MLG Shades" },
      { trait_type: "Accessories", value: "Wings" }
    ]
  },
  {
    mint: "Duck444444444444444444444444444444444444444",
    name: "Decent Duck #1004 (Master Chef)",
    image: "https://i.imgur.com/e9sUXv4.png", // Chef Hat image
    attributes: [
      { trait_type: "Feather", value: "Green (Mallard)" },
      { trait_type: "Attire", value: "Head Chef" },
      { trait_type: "Headwear", value: "Chef Hat" },
      { trait_type: "Eyewear", value: "Eyes 2 (Determined)" }
    ]
  },
  {
    mint: "Duck555555555555555555555555555555555555555",
    name: "The Mandarin (1-of-1 Legend)",
    image: "https://i.imgur.com/wrP5ymE.png", // Mandarin Legend image
    attributes: [
      { trait_type: "Legend", value: "The Mandarin" },
      { trait_type: "Eyewear", value: "Eyes 3 (Wise)" }
    ]
  }
];
