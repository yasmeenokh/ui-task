import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const TelephoneInput = ({ onCountryCodeChange } : any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const handleOnChange = (value : any, country: any) => {
    setPhoneNumber(value);
    onCountryCodeChange(country.dialCode, value);
  };

  return (
    <PhoneInput
      country={'auto'} // Allow automatic country detection
      value={'+962'}
      placeholder="Phone Number"
      onChange={handleOnChange}
    />
  );
};

export default TelephoneInput;
