import React, { useState, useEffect } from 'react';
import Web3 from "web3"
import {convertERCBalanceToDecimal} from "./utils"

const EditableInputComponent = ({ getDefaultAsyncValue, onUpdate }) => {
  // Create state variables for the editable value and default value
  const [editableValue, setEditableValue] = useState('trying to fetch contract balance');
  const web3 = new Web3(window.ethereum)
  // Use useEffect to update the editable value when the defaultValue prop changes
  useEffect(() => {
    async function fetchDefaultValue() {
      try {
        const value = await getDefaultAsyncValue();
        onUpdate(value)
        setEditableValue(value);
      } catch (error) {
        console.log("failed fetching balance", error)
      }
    }

    fetchDefaultValue();
  }, [getDefaultAsyncValue]);

  // Handle changes to the editable value
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setEditableValue(newValue);
    onUpdate(newValue);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div>
      </div>
      <div>
        <label>Payment Amount: </label>
        <input
          type="text"
          value={editableValue}
          onChange={handleInputChange}
        />
      </div>
      <text>
          Amount (decimals): {(parseEditableValue(web3,editableValue))}
        </text>
    </div>
  );
};

function parseEditableValue(web3, input) {
  if (input == 0) {
    return 0;
  } 
  return convertERCBalanceToDecimal(web3,input);
}

export default EditableInputComponent;
