const AxelarTestnetContract = "0x2b102B5FCdADDB4B9F4bf86e29E42F2D46624c10"
const AxelarMainnetContract = "-"
const AxelarTestnetChainID = 421613
const AxelarMainnetChainID = 0
const AxelarTestnetChainName = "Arbitrum Goerli"
const AxelarMainnetChainName = "Arbitrum One"
const AxelarTestnetChainRPC = "https://endpoints.omniatech.io/v1/arbitrum/goerli/public"
const AxelarMainnetChainRPC = "-"
const AxelarTestnetChainSymbol = "AXL"
const AxelarMainnetChainSymbol = "-"
const AxelarTestnetChainExplorer = "https://goerli.arbiscan.io/"
const AxelarMainnetChainExplorer = "-"
const AxelarTokenAddress = "0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f";
const TokenDecimal = 6;
// 
// Replace with mainnet/testnet
export const ContractAddress = AxelarTestnetContract;
export const ChainId = AxelarTestnetChainID;
export const ChainName = AxelarTestnetChainName;
export const ChainRPC = AxelarTestnetChainRPC;
export const ChainSymbol = AxelarTestnetChainSymbol;
export const ChainExplorer = AxelarTestnetChainExplorer;
export const ERC20TokenAddress = AxelarTokenAddress;
export const ERC20TokenDecimal = TokenDecimal;

export async function getBalance(contract, walletAddress) {
    let balance = await contract.methods.balanceOf(walletAddress).call();
    return balance;
  }
  
export function convertERCBalanceToDecimal(web3, balanceIn) {
    if (balanceIn == "trying to fetch contract balance") { 
        return 0
    }
    const tokenAmountInWei = web3.utils.toBN(balanceIn);
    if (tokenAmountInWei.bitLength() > 53) {
        const tokenAmountInDecimal = web3.utils.toBN(10).pow(web3.utils.toBN(ERC20TokenDecimal));
        console.log("tokenAmountInDecimal", tokenAmountInDecimal)
        const tokenBalanceFormatted = tokenAmountInWei.div(tokenAmountInDecimal);
        return tokenBalanceFormatted.toString();
    }
    return tokenAmountInWei.toNumber() / (10**ERC20TokenDecimal);
}

export const minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];