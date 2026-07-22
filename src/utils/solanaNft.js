import { Connection, PublicKey } from "@solana/web3.js";
import { CONFIG } from "../config";

const METAPLEX_PROGRAM_ID = new PublicKey("metaqbxxSkz4wpzBLWcttkecK3c726rHzQVWJDk56qp");
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

/**
 * Derives the Metaplex Metadata PDA for a given mint address.
 */
export function getMetadataPda(mint) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METAPLEX_PROGRAM_ID
  );
  return pda;
}

/**
 * Parses Metaplex Metadata account data buffer.
 * Extracts: name, symbol, uri.
 */
export function decodeMetadata(buffer) {
  try {
    if (!buffer || buffer.length < 119) return null;

    // Check key byte (4 = MetadataV1)
    const key = buffer[0];
    if (key !== 4) return null;

    // Read lengths (Borsh format: 4 bytes length, then characters)
    // Name is at offset 65 (1 key + 32 updateAuth + 32 mint)
    const nameLen = buffer.readUInt32LE(65);
    const name = new TextDecoder()
      .decode(buffer.slice(69, 69 + nameLen))
      .replace(/\0/g, "")
      .trim();

    // Symbol is at offset 101 (65 + 4 len + 32 name)
    const symbolLen = buffer.readUInt32LE(101);
    const symbol = new TextDecoder()
      .decode(buffer.slice(105, 105 + symbolLen))
      .replace(/\0/g, "")
      .trim();

    // Uri is at offset 115 (101 + 4 len + 10 symbol)
    const uriLen = buffer.readUInt32LE(115);
    const uri = new TextDecoder()
      .decode(buffer.slice(119, 119 + uriLen))
      .replace(/\0/g, "")
      .trim();

    return { name, symbol, uri };
  } catch (error) {
    console.error("Failed to decode Metaplex metadata:", error);
    return null;
  }
}

/**
 * Fetches all NFTs owned by a public key, resolves their metadata and filters by collection.
 */
export async function fetchWalletNfts(walletAddress, onProgress) {
  const connection = new Connection(CONFIG.rpcUrl, "confirmed");
  const ownerPublicKey = new PublicKey(walletAddress);

  if (onProgress) onProgress("Fetching token accounts...");

  // 1. Get all Token Accounts owned by the wallet
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    ownerPublicKey,
    { programId: TOKEN_PROGRAM_ID },
    "confirmed"
  );

  // 2. Filter for potential NFT accounts (balance = 1)
  const nftMints = [];
  for (const account of tokenAccounts.value) {
    const data = account.account.data;
    if (data.length < 72) continue;

    // Read amount (8 bytes u64 starting at offset 64)
    const amount = data.readBigUInt64LE(64);
    if (amount === 1n) {
      // Read mint public key (32 bytes starting at offset 0)
      const mintBuffer = data.slice(0, 32);
      const mint = new PublicKey(mintBuffer);
      nftMints.push(mint);
    }
  }

  if (nftMints.length === 0) {
    return [];
  }

  if (onProgress) onProgress(`Found ${nftMints.length} tokens. Deriving metadata...`);

  // 3. Derive Metadata PDAs for all mints
  const metadataPdas = nftMints.map((mint) => getMetadataPda(mint));

  // 4. Batch query Metadata PDAs (in chunks of 100 to avoid RPC limitations)
  const chunkSize = 100;
  const metadataAccounts = [];
  
  for (let i = 0; i < metadataPdas.length; i += chunkSize) {
    const chunk = metadataPdas.slice(i, i + chunkSize);
    if (onProgress) onProgress(`Fetching metadata info (chunk ${Math.floor(i / chunkSize) + 1})...`);
    const accountsInfo = await connection.getMultipleAccountsInfo(chunk);
    metadataAccounts.push(...accountsInfo);
  }

  // 5. Decode Metaplex metadata accounts
  const candidates = [];
  for (let i = 0; i < metadataAccounts.length; i++) {
    const accountInfo = metadataAccounts[i];
    if (!accountInfo) continue;

    const decoded = decodeMetadata(accountInfo.data);
    if (decoded && decoded.uri) {
      candidates.push({
        mint: nftMints[i].toString(),
        name: decoded.name,
        uri: decoded.uri,
      });
    }
  }

  if (onProgress) onProgress(`Processing ${candidates.length} NFTs...`);

  // 6. Fetch external JSON metadata and filter for Decent Ducks
  const verifiedNfts = [];
  const fetchPromises = candidates.map(async (candidate) => {
    try {
      // Fetch the JSON metadata
      const res = await fetch(candidate.uri);
      if (!res.ok) return;
      const json = await res.json();

      // Check if it belongs to the collection
      // We can verify:
      // A. By checking if the creator address matches CONFIG.collectionCreatorAddress
      // B. By checking the name (fallback)
      const creators = json.properties?.creators || json.creators || [];
      const hasVerifiedCreator = creators.some(
        (creator) => creator.address === CONFIG.collectionCreatorAddress
      );
      
      const nameMatch = candidate.name.toLowerCase().includes("decent duck");

      if (hasVerifiedCreator || nameMatch) {
        verifiedNfts.push({
          mint: candidate.mint,
          name: candidate.name,
          image: json.image,
          attributes: json.attributes || [],
        });
      }
    } catch (e) {
      console.warn(`Failed to fetch metadata for ${candidate.name} from ${candidate.uri}`, e);
    }
  });

  await Promise.all(fetchPromises);
  return verifiedNfts;
}

/**
 * Attempts to fetch NFTs using the Metaplex DAS API (getAssetsByOwner).
 * Extremely fast and works on DAS-supported RPCs like Helius or QuickNode.
 */
export async function fetchWalletNftsDas(walletAddress) {
  try {
    const response = await fetch(CONFIG.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ducklopedia-query",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: walletAddress,
          page: 1,
          limit: 1000,
          displayOptions: {
            showCollectionMetadata: true,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const { result } = await response.json();
    if (!result || !result.items) {
      throw new Error("No items returned from DAS API");
    }

    // Filter and map to our standard format
    return result.items
      .filter((item) => {
        // Filter by collection address if defined
        const isCorrectCollection = item.grouping?.some(
          (group) => group.group_value === CONFIG.collectionCreatorAddress
        );
        const isDuckName = item.content?.metadata?.name?.toLowerCase().includes("decent duck");
        
        return isCorrectCollection || isDuckName;
      })
      .map((item) => ({
        mint: item.id,
        name: item.content?.metadata?.name || "Decent Duck",
        image: item.content?.files?.[0]?.uri || item.content?.links?.image,
        attributes: item.content?.metadata?.attributes?.map((attr) => ({
          trait_type: attr.trait_type || attr.name,
          value: attr.value,
        })) || [],
      }));
  } catch (error) {
    console.error("DAS API Fetch failed, falling back to Web3.js:", error);
    // Return null to signify that we should try the fallback Web3.js method
    return null;
  }
}
