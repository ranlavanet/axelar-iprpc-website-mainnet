const AxelarTestnetContract = ""
const AxelarMainnetContract = "0xF754B8fa3ecd46757BC9962DcDCEd24C4008e68d"
const AxelarTestnetChainID = 0
const AxelarMainnetChainID = 42161
const AxelarTestnetChainName = "Arbitrum Goerli"
const AxelarMainnetChainName = "Arbitrum One"
const AxelarTestnetChainRPC = "https://endpoints.omniatech.io/v1/arbitrum/goerli/public"
const AxelarMainnetChainRPC = "https://g.w.lavanet.xyz:443/gateway/arb1/rpc-http/9dbe4f2c6a0baba4cd27acb8ef3d7499"
const AxelarTestnetChainSymbol = "AXL"
const AxelarMainnetChainSymbol = "AXL"
const AxelarTestnetChainExplorer = "https://goerli.arbiscan.io/"
const AxelarMainnetChainExplorer = "https://arbiscan.io/"
const AxelarTokenAddress = "0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f";
const TokenDecimal = 6;
// 
// Replace with mainnet/testnet
export const ContractAddress = AxelarMainnetContract;
export const ChainId = AxelarMainnetChainID;
export const ChainName = AxelarMainnetChainName;
export const ChainRPC = AxelarMainnetChainRPC;
export const ChainSymbol = AxelarMainnetChainSymbol;
export const ChainExplorer = AxelarMainnetChainExplorer;
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
    try {
        const tokenAmountInWei = web3.utils.toBN(balanceIn);
        if (tokenAmountInWei.bitLength() > 53) {
            const tokenAmountInDecimal = web3.utils.toBN(10).pow(web3.utils.toBN(ERC20TokenDecimal));
            console.log("tokenAmountInDecimal", tokenAmountInDecimal)
            const tokenBalanceFormatted = tokenAmountInWei.div(tokenAmountInDecimal);
            return tokenBalanceFormatted.toString();
        }
        return tokenAmountInWei.toNumber() / (10**ERC20TokenDecimal);
    } catch(e) {
        console.log("failed convertERCBalanceToDecimal", balanceIn)
        return 0;
    }
}

export const minABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];