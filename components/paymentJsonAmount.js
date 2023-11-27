import React, { useState, useEffect } from 'react';

const PaymentJsonShowBox = ({ data }) => {
  if (data == null) {
    return <div>Error generating rewards distribution</div>
  }

  // Initialize the editableData state when the component mounts
  const [editableData, setEditableData] = useState(JSON.stringify(data, null, 2));

  // Update the editableData state when the data prop changes
  useEffect(() => {
    setEditableData(JSON.stringify(data, null, 2));
  }, [data]);

  const containerWidth = '600px';
  const containerPadding = '8px';

  const handleDataChange = (event) => {
    // Update the editableData state when the user makes changes
    const newData = event.target.value;
    setEditableData(newData);
  };

  return (
    <div className="border border-gray-300 rounded-md" style={{ width: containerWidth, padding: containerPadding }}>
      <h2>Reward Distribution:</h2>
      {isValidJSON(editableData) ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {JSON.parse(editableData).map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>Wallet:</strong> {item.name} <br />
              <strong>Value:</strong> {item.value}
            </li>
          ))}
        </ul>
      ) : <h2>Failed to Parse</h2>}
    </div>
  );
};


function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

export default PaymentJsonShowBox;
