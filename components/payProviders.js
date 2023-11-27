import React, { useState, useEffect } from 'react';
import ParsedDataComponent from "./parsedJsonData"
import PaymentJsonShowBox from "./paymentJsonAmount"
import Web3 from "web3"
import { LavaEvmosProviderPaymentContract__factory } from "../contract/typechain-types"
import { ContractAddress } from "./utils"
import FileInputComponent from "./fileInput";
import EditableInputComponent from "./paymentAmount"
import { ethers } from "ethers";

const PayProvidersComponent = () => {
    const [uploadedData, setUploadedData] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);

    const handleFileUpload = (data) => {
        setUploadedData(data);
    };
    const handleLaunchTransaction = async () => {
        await payProviders(uploadedData, paymentAmount);
    };

    const setData = (data) => {
        console.log("changing data", data.slice(0, 20))
        try {
            const parsedData = JSON.parse(data);
            console.log('Data is valid JSON:', parsedData);
            setUploadedData(parsedData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error, e.g., display an error message to the user
        }
    }

    useEffect(() => {
        // This useEffect will run when uploadedData changes
        console.log('Uploaded data has changed PayProvidersComponent:', uploadedData);
        setUploadedData(uploadedData);
    }, [uploadedData]);

    useEffect(() => {
        // This useEffect will run when uploadedData changes
        console.log('paymentAmount data has changed', paymentAmount);
        setPaymentAmount(paymentAmount)
    }, [paymentAmount]);

    return (
        <div className="max-w-2xl mb-8">
            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row" style={{ margin: '20px' }}>
                <div className="rounded-lg p-4 border border-gray-300">
                    <FileInputComponent onFileUpload={handleFileUpload} />
                </div>
                {uploadedData ? (
                    <button
                        className="px-6 py-2 text-white bg-green-600 rounded-md md:ml-5"
                        data={uploadedData}
                        onClick={handleLaunchTransaction}
                    >
                        Launch Transaction
                    </button>
                ) : (
                    <div
                        className="px-6 py-2 text-white bg-gray-600 rounded-md md:ml-5"
                        style={{ cursor: 'not-allowed', pointerEvents: 'none', opacity: '0.6' }}
                    >
                        <button disabled>
                            Upload File
                        </button>
                    </div>
                )}
            </div>
            {uploadedData ? (
                <EditableInputComponent getDefaultAsyncValue={getCurrentContractFunds} onUpdate={(res) => { setPaymentAmount(res) }} />
            ) : (
                ""
            )}
            {uploadedData ? (
                <ParsedDataComponent data={uploadedData} setEditedData={setData} />
            ) : (
                ""
            )}
            {uploadedData && paymentAmount != 0 ? (
                <PaymentJsonShowBox data={parseCsvFields(uploadedData, paymentAmount)} />
            ) : (
                ""
            )}

        </div>
    );
};

export default PayProvidersComponent;

function parseCsvFields(uploadedData, amountToPay) {
    const paymentListOfProviders = [];
    const gatherInfo = [];

    //
    // Extract data from csv
    let totalCu = 0;
    for (let i of uploadedData) {
        let address = i['Wallet Address']
        let totalCUs = i['Percentage']
        if (!address || !totalCUs) {
            alert("couldn't find one of the fields 'Wallet Address' and 'Percentage'");
            return
        }
        if (totalCUs == "") {
            continue;
        }
        if (Number(totalCUs) == 0) {
            continue;
        }
        try {
            totalCu += Number(totalCUs)
        } catch (e) {
            console.log("failed converting one of the elements", e)
            continue;
        }
        gatherInfo.push({ address: address, totalCUs: totalCUs })
    }
    totalCu = totalCu.toFixed(2)
 
    //
    // Calc payment per provider
    let totalPayWei = BigInt(Web3.utils.toWei(String(amountToPay), 'ether'))
    let totalCoinsSending = 0n
    for (let i of gatherInfo) {
        const value = (totalPayWei * 10000n) / BigInt(Math.round((totalCu / i.totalCUs) * 10000));
        if (value == 0) {
            continue
        }
        console.log(
            "i.totalCus", i.totalCUs,
            "totalCu", totalCu,
            "totalPayWei", totalPayWei,
            "value", value,
        )

        totalCoinsSending += value;
        paymentListOfProviders.push({
            name: i.address,
            value: String(value),
        })
    }

    if (totalCoinsSending > totalPayWei) {
        console.log("totalCoinsSending", totalCoinsSending, "totalPayWei", totalPayWei)
        alert("totalCoinsSending > totalPayWei")
        return null;
    }

    return paymentListOfProviders
}

async function getCurrentContractFunds() {
    try {
        const requestParams = {
            method: 'eth_getBalance',
            params: [ContractAddress, 'latest'], // 'latest' means to get the latest block
        };
        const balance = await window.ethereum.request(requestParams);
        // The balance is returned in Wei. 
        const balanceInEther = Web3.utils.fromWei(balance, 'ether');
        console.log(`Balance of the contract at address ${ContractAddress}: ${balanceInEther} ETH, ${balance} Wei}`);
        return balanceInEther;
    } catch (error) {
        console.error('Error getting contract balance:', error);
        return "failed fetching balance";
    }
}
async function payProviders(uploadedData, amountToPay) {
    if (window.ethereum) {
        if (window.ethereum.isConnected()) {
            const wallet = new Web3(window.ethereum);
            const myContract = new wallet.eth.Contract(LavaEvmosProviderPaymentContract__factory.abi, ContractAddress);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const fromAccount = accounts[0];

            const paymentListOfProviders = parseCsvFields(uploadedData, amountToPay)
            if (paymentListOfProviders == null) {
                return
            }

            const functionCallData = myContract.methods.payProviders(paymentListOfProviders).encodeABI();
            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: fromAccount,
                    to: ContractAddress,
                    data: functionCallData,
                }],
            }).then((result) => {
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