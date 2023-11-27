import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChainId, ChainExplorer, ChainName, ChainRPC, ChainSymbol } from './utils';
import Web3 from 'web3';

const MetaMaskConnectButton = () => {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  const connectToMetaMask = async () => {
    setConnecting(true);
    if (window.ethereum) {
      try {
        // console.log(window.ethereum.isConnected())
        // Request user accounts using the new 'eth_requestAccounts' method
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== ChainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x' + ChainId.toString(16) }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              console.log("This network is not available in your metamask, please add it")

              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x' + ChainId.toString(16),
                      chainName: ChainName,
                      rpcUrls: [
                        ChainRPC
                      ],
                      blockExplorerUrls: [
                        ChainExplorer
                      ],
                      nativeCurrency: {
                        name: ChainSymbol,
                        symbol: ChainSymbol,
                        decimals: 18
                      },
                    }
                  ]
                })
              } catch (addError) {
                console.log(addError);
                setConnecting(false);
                return;
              }
            }
            console.log("Failed to switch to the network")
            setConnecting(false);
            return;
          }
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts && accounts.length > 0) {
          // Create a Web3 instance using the MetaMask provider
          const web3Instance = new Web3(window.ethereum);

          router.push('/sendTxPage'); // Redirect to the sendTxPage upon successful connection
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      } finally {
        setConnecting(false);
      }
    } else {
      alert("metamask is not installed. please install metamask extension")
      console.error('MetaMask is not installed or not detected.');
      setConnecting(false);
    }
  };

  return (
    <button
      onClick={connectToMetaMask}
      disabled={connecting}
      className={`px-8 py-4 text-lg font-medium text-center text-white bg-orange-700 rounded-md ${connecting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default MetaMaskConnectButton;
