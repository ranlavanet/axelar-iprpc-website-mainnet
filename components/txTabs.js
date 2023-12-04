import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Import the default CSS styles for tabs
import React from 'react';
import InputChecker from "./fundInputChecker"
import Web3 from "web3"
import { LavaAxelarIpRPCDistribution__factory } from "../contract/typechain-types"
import { ContractAddress } from "./utils"
import PayProvidersComponent from "./payProviders"

const tabStyle = { minHeight: '650px', minWidth: '500px'}

const TxTabs = () => {
    return (
    <div className="max-w-2xl mb-8">
        <Tabs>
        <TabList>
            <Tab>Pay Providers</Tab>
            <Tab>Change Backup Owner</Tab>
        </TabList>
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

// async function payProviders(uploadedData) {
//     if (window.ethereum) {
//         if (window.ethereum.isConnected()) {
//             const wallet = new Web3(window.ethereum);
//             const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, ContractAddress);
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
//             const fromAccount = accounts[0];
//             const paymentListOfProviders = [];
//             console.log(uploadedData)
            
//             for (let item of  Object.getOwnPropertyNames(uploadedData)) {
//                 const evmosAmount = Web3.utils.toWei(uploadedData[item], 'ether');
//                 console.log("adding payee element", item, uploadedData[item], "eth amount", evmosAmount)
//                 paymentListOfProviders.push({name: item, value: evmosAmount})
//             }
//             const functionCallData = myContract.methods.payProviders(paymentListOfProviders).encodeABI();
//             await window.ethereum.request({ 
//                 method: "eth_sendTransaction",
//                 params: [{
//                     from: fromAccount,
//                     to: ContractAddress,
//                     data: functionCallData,
//                 }],}).then((result) => {
//                     alert("tx sent Hash: " + String(result));
//                     console.log(result);
//             })
//             .catch((error) => {
//             console.error('MetaMask account access denied:', error);
//             });
//         } else {
//         alert("Metamask is not connected. Please connect and try again")
//         }
//     } else {
//         alert("metamask is not installed. please install metamask extension")
//     }
// }

export default TxTabs;
