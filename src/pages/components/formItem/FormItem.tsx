import React, { useState } from 'react';
import CustomSelect from '../dropDown/DropDown';
import classes from './styles.module.scss';

const idWithExtraFields: any = {
  '4': [21],
  '8': [20],
  '13': [23],
  '14': [22],
  '15': [26],
  '16': [25],
  '20': [27]
}
const CustomForm = ({ handleFormSubmit, proceduresType, DropDownLabelText, extraFieldsRes, formData, isPopup } : any) => {
  let keys, thirdKey: string, thirdValue;
  if(formData){
    keys = Object.keys(formData);
    thirdKey = keys[2];
    thirdValue = formData[thirdKey]; 
  }
  const [dropDownValue, setDropDownValue] = useState(formData ? formData.taken_procedures : '');
  const [secondaryDropDownValue, setSecondaryDropDownValue] = useState(formData ? thirdValue : '');
  const [extraFieldItem, setExtraFieldItem] = useState<{ [key: string]: any[] } | null>(null);
  const transformData = (data: any) => {
    return data.map((obj: any) => ({
      value: `${obj.NameAr}`,
      label: obj.NameAr,
      id: `${obj.Id}`,
    }));
  }
  
  const handleExtraFields = (LookupId: number) => {
    setExtraFieldItem((prevExtraFieldItem) => {
      let updatedExtraFieldItem = { ...prevExtraFieldItem } || {};

      // Get the associated id for the current LookupId
      const associatedId = Object.keys(idWithExtraFields).find((key) =>
        idWithExtraFields[key].includes(LookupId)
      ) as string;

      // Initialize an array for the associatedId if it doesn't exist
      if (!updatedExtraFieldItem[associatedId]) {
        updatedExtraFieldItem[associatedId] = [];
      }

      // Switch case to filter objects based on LookupCategoryId
      switch (LookupId) {
        case 21:
          updatedExtraFieldItem[associatedId] = [
            ...updatedExtraFieldItem[associatedId],
            ...extraFieldsRes.RescheduleReasonsList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 22:
          updatedExtraFieldItem[associatedId] = [
            ...updatedExtraFieldItem[associatedId],
            ...extraFieldsRes.SecurityCheckResultsList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 23:
          updatedExtraFieldItem[`${associatedId}_23`] = [
            ...updatedExtraFieldItem[`${associatedId}_23`] || [],
            ...extraFieldsRes.MediationIsAcceptedList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 24:
          updatedExtraFieldItem[`${associatedId}_24`] = [
            ...updatedExtraFieldItem[`${associatedId}_24`] || [],
            ...extraFieldsRes.MediationSettlementsList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 25:
          updatedExtraFieldItem[associatedId] = [
            ...updatedExtraFieldItem[associatedId],
            ...extraFieldsRes.HumanTraffickingActionsList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 26:
          updatedExtraFieldItem[associatedId] = [
            ...updatedExtraFieldItem[associatedId],
            ...extraFieldsRes.SheltersList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        case 27:
          updatedExtraFieldItem[associatedId] = [
            ...updatedExtraFieldItem[associatedId],
            ...extraFieldsRes.OfficialAuthoritiesList.filter((item: any) => {
              return item.LookupCategoryId === LookupId;
            }),
          ];
          break;
        default:
          return prevExtraFieldItem; // No changes
      }

      return updatedExtraFieldItem;
    });
  };
  const handleDropDown = async (value: string, id: string) => {
    setDropDownValue(value);
    // setChosenProcedureId(id);
    setExtraFieldItem(null)
    if (id in idWithExtraFields) {
      const extraFields = idWithExtraFields[id];
      // Call handleExtraFields for each value in the associated array
      extraFields.forEach((extraId: any) => {
        handleExtraFields(+extraId);
      });
    } else {
      setExtraFieldItem(null)
    }
  }
  return (
        <form className={`${classes.form_item} ${isPopup === 'show' ? classes.popup_form_read : ''}`} onSubmit={(e) => handleFormSubmit(e, isPopup ? '/UpdateCaseProcedure' : '/CreateCaseProcedure')}>
              <div className={`${classes.input_wrapper}`}>
                <label htmlFor="taken_procedures">الاجراء المتخذ</label>
                <div className={`flex-start ${classes.flex_wrapper}`}>
                  <CustomSelect
                    options={transformData(proceduresType)}
                    onChange={handleDropDown}
                    name="ProcedureNameAr"
                    selectValue={formData?.ProcedureNameAr}
                    isPopup={isPopup}
                  />
                  <input
                    type="hidden"
                    name="ProcedureNameAr"
                    value={dropDownValue}
                  />
                  <div className={`flex-center ${classes.checkbox_wrapper}`}>
                    <label htmlFor="customCheckbox" className={`${classes.customCheckbox}`}></label>
                    <div className={`${classes.custom_checkbox}`}>
                      <input name='IsBefore' type="checkbox" 
                      defaultChecked={formData ? formData.IsBefore : false}
                      disabled={isPopup && isPopup === 'show' ? true : false}
                      />
                      <span className={`${classes.checkmark}`}></span>
                    </div>
                    <span>اجراء سابق</span>
                  </div>
                </div>
              </div>
              <div className={`flex-start ${classes.flex_wrapper}`}>
                {extraFieldItem &&
                  Object.keys(extraFieldItem).map((key) => {
                    const associatedData = extraFieldItem[key];
                    if (Array.isArray(associatedData) && associatedData.length > 0) {
                      const labels = DropDownLabelText[key] || [];
                      return (
                        <React.Fragment key={key}>
                          {labels.map((label: string, index: number) => {
                            return (
                              <div key={index} className={classes.input_wrapper}>
                                <label htmlFor={`ExtraFieldValue_${key}_${index}`}>{label}</label>
                                <CustomSelect
                                  options={transformData(associatedData)}
                                  onChange={(value) => setSecondaryDropDownValue(value)}
                                  name={`${label}`}
                                  isPopup={isPopup}
                                  selectValue={false}
                                />
                                <input
                                  type="hidden"
                                  name={`${label}`}
                                  value={secondaryDropDownValue}
                                />
                              </div>
                            );
                          })}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                <div className={`${classes.input_wrapper}`}>
                  <label htmlFor="ProcedureDateString">تاريخ أخذ الإجراء</label>
                  <input className={`bordered-box`} name="ProcedureDateString" id='date' type="date" placeholder='18-12-2021' required 
                  readOnly={isPopup && isPopup === 'show' ? true : false}
                  defaultValue={formData ? formData.ProcedureDateString.replaceAll('/', '-') : ''}
                  />
                </div>
              </div>
              <div className={`${classes.input_wrapper}`}>
                <label htmlFor="Note"> تفاصيل الإجراء </label>
                <textarea className={`bordered-box`} name="Note" id="procedure-details" cols={96} rows={5} 
                defaultValue={formData ? formData.Note : ''}
                readOnly={isPopup && isPopup === 'show' ? true : false}
                ></textarea>
              </div>
              {isPopup !== 'show' ? (
              <div className={`flex-space-between ${classes.form_footer}`}>
                <input type="submit" value="حفظ الإجراء" className={`primary-btn`} />
                {!isPopup && (
                <div className={`${classes.prev_procedures}`}>
                  <p>الإجراءات السابقة</p>
                </div>
                )}
              </div>
              ) : ''}
        </form>
  );
};

export default CustomForm;
