import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classes from './styles.module.scss'

const Popup = ({ children, closePopup } : any) => {
 return ReactDOM.createPortal(
   <div className={`${classes.popup_fall_back}`}  dir="rtl">
    <div className={`${classes.popup_wrapper}`}>
     <div className="popup-content">
      <div className={`flex-space-between ${classes.popup_header}`}>
      <h4>الإجراءات</h4>
       <button onClick={closePopup} className="close-button">
       </button>
      </div>
       {children}
     </div>
   </div>
    </div>,
   document.body
 );
}

export default Popup;