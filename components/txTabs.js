import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the default CSS styles for tabs
import React from 'react';
import InputChecker from "./fundInputChecker"
import Web3 from "web3"
import { LavaAxelarIpRPCDistribution__factory } from "../contract/typechain-types"
import { ContractAddress } from "./utils"
import PayProvidersComponent from "./payProviders"
import { ERC20TokenAddress, minABI} from "./utils";

const tabStyle = { minHeight: '650px', minWidth: '500px'}

const TxTabs = () => {
    return (
    <div className="max-w-2xl mb-8">
        <Tabs>
        <TabList>
            <Tab>Fund Account</Tab>
            <Tab>Pay Providers</Tab>
            <Tab>Change Backup Owner</Tab>
        </TabList>
        {/* Content for Tab 1 */}
        <TabPanel style={tabStyle}>
        <div>
            <InputChecker buttonText={"Launch Transaction"} label1={" Enter Amount"} text1={"Amount:"} onButtonPress={fundSmartContract}></InputChecker>
        </div>
        </TabPanel>
        {/* Content for Tab 2 (leave it empty) */}
        <TabPanel style={tabStyle}>
            <PayProvidersComponent/> {/* Pass the uploaded data as a prop */}
        </TabPanel>
        {/* Content for Tab 3 (leave it empty) */}
        <TabPanel style={tabStyle}>
            <div style={{ marginBottom: '20px' }}>
            <InputChecker buttonText={"Launch Transaction"} label1={"Enter address"} text1={"Set Backup Owner:"} disableIsNumberValidation={true} onButtonPress={sendSetBackupOwnerTx}></InputChecker>
            </div>
            <div style={{ marginBottom: '20px' }}>
            <InputChecker buttonText={"Launch Transaction"} label1={"Enter address"} text1={"Set Different Owner:"} disableIsNumberValidation={true} onButtonPress={sendSetOwnerTx}></InputChecker>
            </div>
        </TabPanel>
        </Tabs>
    </div>
    );
};

async function runFundAccount(myContract, amount, options) {
    return myContract.methods.deposit(amount).send(options)
    .then((receipt) => {
        alert("Transaction sent. Transaction hash: " + receipt.transactionHash);
        console.log(receipt);
    })
    .catch((error) => {
        console.error('Error executing payProviders:', error);
    });
}

async function fundSmartContract(inputValue) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            inputValue = wallet.utils.toWei(inputValue, "mwei")
            const myContract = new wallet.eth.Contract(LavaAxelarIpRPCDistribution__factory.abi, ContractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const fromAccount = accounts[0];

            const tokenContract = new wallet.eth.Contract(minABI, ERC20TokenAddress);
            const spender = ContractAddress; // The address that will spend the tokens
            const options = { from: fromAccount };
            // Approve ContractAddress to spend amountToPay tokens on behalf of the user
            const allowance = await tokenContract.methods.allowance(fromAccount,spender).call();
            console.log("@@@@@@@@ ",allowance, inputValue)
            if (BigInt(allowance) < BigInt(inputValue)) {
                console.log("allowance is smaller than amount to pay need to charge funds")
                await tokenContract.methods.approve(spender, String(inputValue)).send(options)
                    .then(async (receipt) => {
                        await runFundAccount(myContract, inputValue, options);
                    })
                    .catch((error) => {
                        console.error('Error approving spender:', error);
                    });
            } else {
                // we have enough funds to spend tokens.
                await runFundAccount(myContract, inputValue, options)
            }
        } else {
            alert("Metamask is not connected. Please connect and try again")
        }
    } else {
        alert("metamask is not installed. please install metamask extension")
    }
}


async function sendSetBackupOwnerTx(inputValue) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            const myContract = new wallet.eth.Contract(LavaAxelarIpRPCDistribution__factory.abi, ContractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const fromAccount = accounts[0];
            const functionCallData = myContract.methods.setBackUpOwner(inputValue).encodeABI();
            await window.ethereum.request({ 
                method: "eth_sendTransaction",
                params: [{
                    from: fromAccount,
                    to: ContractAddress,
                    data: functionCallData,
                }],}).then((result) => {
                    alert("tx sent Hash: " + String(result));
                    console.log(result);
            })
            .catch((error) => {
            console.error('MetaMask account access denied:', error);
            });
        } else {
        alert("Metamask is not connected. Please connect and try again")
        }
    } else {
        alert("metamask is not installed. please install metamask extension")
    }
}

async function sendSetOwnerTx(inputValue) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, ContractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const fromAccount = accounts[0];
            const functionCallData = myContract.methods.setOwner(inputValue).encodeABI();
            await window.ethereum.request({ 
                method: "eth_sendTransaction",
                params: [{
                    from: fromAccount,
                    to: ContractAddress,
                    data: functionCallData,
                }],}).then((result) => {
                    alert("tx sent Hash: " + String(result));
                    console.log(result);
            })
            .catch((error) => {
            console.error('MetaMask account access denied:', error);
            });
        } else {
        alert("Metamask is not connected. Please connect and try again")
        }
    } else {
        alert("metamask is not installed. please install metamask extension")
    }
}

export default TxTabs;
