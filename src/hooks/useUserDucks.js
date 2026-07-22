import { useState, useEffect } from "react";
import { fetchWalletNfts, fetchWalletNftsDas } from "../utils/solanaNft";
import { CONFIG, MOCK_DUCKS } from "../config";

/**
 * Custom React hook to fetch and parse Decent Ducks NFTs owned by a wallet address.
 * Supports Helius/QuickNode DAS API with automatic fallback to standard RPC Metaplex decoding.
 * 
 * @param {string|null} walletAddress - The connected user's wallet public key string
 * @param {boolean} isDemoMode - If true, returns mock/demo ducks immediately
 * @returns {object} { ducks, loading, loadingStep, error, refetch }
 */
export default function useUserDucks(walletAddress, isDemoMode = false) {
  const [ducks, setDucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);

  const fetchDucks = async () => {
    if (isDemoMode) {
      setDucks(MOCK_DUCKS);
      setLoading(false);
      setError(null);
      return;
    }

    if (!walletAddress) {
      setDucks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep("Connecting to Solana network...");

    try {
      // 1. Try high-performance DAS API getAssetsByOwner first
      let nftList = await fetchWalletNftsDas(walletAddress);

      // 2. Fallback to parsing Metaplex metadata accounts manually
      if (nftList === null) {
        setLoadingStep("Fetching token accounts (Web3.js)...");
        nftList = await fetchWalletNfts(walletAddress, (progressStep) => {
          setLoadingStep(progressStep);
        });
      }

      setDucks(nftList);
    } catch (err) {
      console.error("useUserDucks Hook Failure:", err);
      setError(err.message || "Failed to retrieve ducks");
      setLoadingStep("Error encountered. Try demo mode!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDucks();
  }, [walletAddress, isDemoMode]);

  return {
    ducks,
    loading,
    loadingStep,
    error,
    refetch: fetchDucks,
  };
}
