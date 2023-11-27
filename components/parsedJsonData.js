import React, { useState, useEffect } from 'react';

const ParsedDataComponent = ({ data, setEditedData }) => {
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

    // Pass the edited data to the parent component
    setEditedData(newData);
  };

  return (
    <div className="border border-gray-300 rounded-md" style={{ width: containerWidth, padding: containerPadding }}>
      <h2>Loaded Data</h2>
      <textarea
        value={editableData}
        onChange={handleDataChange}
        rows="20"
        style={{ width: '100%', padding: '8px' }}
      />
    </div>
  );
};

export default ParsedDataComponent;
