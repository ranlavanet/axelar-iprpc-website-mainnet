import React, { useState } from 'react';
import csv from 'csv-parser'; 

const FileInputComponent = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.ms-excel' || selectedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const results = [];
            const parseStream = csv();
            parseStream.on('data', (data) => results.push(data));
            parseStream.on('end', () => {
              setFile(selectedFile);
              onFileUpload(results); // Pass the parsed data to the parent component
            });
            parseStream.write(e.target.result);
            parseStream.end();
          } catch (error) {
            console.error('Error parsing CSV:', error);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        alert('Please select a .csv file.');
      }
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};

export default FileInputComponent;
