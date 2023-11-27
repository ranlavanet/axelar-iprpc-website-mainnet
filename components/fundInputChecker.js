import React, { useState, useEffect } from 'react';

function InputChecker({ onButtonPress, label1, text1, buttonText, disableIsNumberValidation }) {
  const [inputValue, setInputValue] = useState('');
  const [isNumber, setIsNumber] = useState(false);
  const label = label1;
  const text = text1;
  const disableIsNumber = disableIsNumberValidation;

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Check if the input is a number or empty
    const isInputNumber = !isNaN(newValue) || newValue === "";
    setIsNumber(isInputNumber);
  };

  const handleButtonPress = () => {
    if (isNumber) {
      onButtonPress(inputValue); // Pass the input value to the callback
    }
  };

  // Use useEffect to log the updated inputValue
  useEffect(() => {
    console.log("inputValue:", inputValue);
  }, [inputValue]);

  return (
    <div>
      <label htmlFor="inputField">{text} </label>
      <input
        type="text"
        id="inputField"
        name="inputField"
        placeholder={label}
        onChange={handleInputChange}
        value={inputValue}
      />
      {isNumber || (disableIsNumber && inputValue !== "") ? (
        <button
          className="px-6 py-2 text-white bg-green-600 rounded-md md:ml-5"
          onClick={handleButtonPress}
        >
          {buttonText}
        </button>
      ) : (
        <button
          className="px-6 py-2 text-white bg-gray-600 rounded-md md:ml-5"
          disabled
        >
          Invalid Input
        </button>
      )}
    </div>
  );
}

export default InputChecker;
