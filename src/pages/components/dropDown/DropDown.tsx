// components/CustomSelect.tsx
import React, { useState } from 'react';
import styles from './styles.module.scss';

interface Option {
  value: string;
  label: string;
  id: string
}

interface CustomSelectProps {
  options: Option[];
  onChange: (selectedValue: string, id: string) => void;
  name: string; 
  readOnly?: boolean;
  isPopup: boolean | string
  selectValue: boolean | string
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange, readOnly = false, isPopup = false, selectValue = false  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(typeof selectValue === 'string'  ? selectValue : options[0].value);

  const toggleDropdown = () => {
    if(isPopup === 'show'){
      return false;
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string, id: string) => {
    setSelectedValue(value);
    onChange(value, id);
    setIsOpen(false);
  };
  return (
    <div className={`${styles.selectContainer} ${isPopup ? styles.isPopup : ''} ${isPopup === 'show' ? styles.isReadOnly : ''}`}>
      <div className={`bordered-box selected-dropdown ${styles.select} ${isOpen ? styles.expanded : ''}`} onClick={toggleDropdown}>
        {selectedValue}
      </div>
      {isOpen && (
        <div className={`bordered-box ${styles.dropdown} ${isOpen ? styles.expanded : ''}`}>
          {options.map((option) => (
            <div key={option.value} onClick={() => {
              handleOptionClick(option.value, option.id)
              }} className={`${styles.option_item}`}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
