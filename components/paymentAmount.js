import React, { useState, useEffect } from 'react';
import Web3 from "web3"

const EditableInputComponent = ({ getDefaultAsyncValue, onUpdate }) => {
  // Create state variables for the editable value and default value
  const [editableValue, setEditableValue] = useState('trying to fetch contract balance');

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
          Amount in Wei: {toMicroEth(editableValue)}
        </text>
    </div>
  );
};

function toMicroEth(editableValue) {
  if (editableValue && Number(editableValue) > 0) {
    return Web3.utils.toWei(String(editableValue), 'ether')
  }
  else return "0"
}

export default EditableInputComponent;
