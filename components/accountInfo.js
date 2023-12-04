import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ERC20TokenAddress, getBalance, convertERCBalanceToDecimal, minABI } from "./utils";

const AccountInfo = () => {
  const [connectedAccount, setConnectedAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    async function fetchAccountInfo() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const connectedAccount = accounts[0];

        if (connectedAccount) {
          setConnectedAccount(connectedAccount);
          let contract = new web3.eth.Contract(minABI, ERC20TokenAddress);
          let balanceAx = await getBalance(contract, connectedAccount);
          const balanceERC = convertERCBalanceToDecimal(web3, balanceAx)
          setBalance(balanceERC);
        }
      } else {
        alert("metamask is not installed. please install metamask extension")
      }
    }
    fetchAccountInfo();
  }, []);

  // Function to truncate the address with ellipsis
  const truncateAddress = (address) => {
    if (address.length > 10) {
      const prefix = address.substring(0, 5);
      const suffix = address.substring(address.length - 5, address.length);
      return `${prefix}...${suffix}`;
    }
    return address;
  };

  return (
    <div className="rounded-md p-4 border border-gray-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Connected Account</h2>
          <p className="text-gray-600">
            Account Address: {truncateAddress(connectedAccount)}
          </p>
          <p className="text-gray-600">
            Balance: {(balance)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
