import React, { useState, useEffect } from 'react';
import CustomSelect from '../dropDown/DropDown';
import classes from './styles.module.scss';
import { postRequest, getRequest } from '@/services/http.service';
import TelephoneInput from '../telephoneInput/TelephoneInput';
import CustomForm from '../formItem/FormItem';
import Popup from '../popup/Popup'
export default function Accordion({ proceduresType, extraFieldsRes, allProceduresRes }: any) {
  const idWithExtraFields: any = {
    '4': [21],
    '8': [20],
    '13': [23],
    '14': [22],
    '15': [26],
    '16': [25],
    '20': [27]
  }
  const DropDownLabelText: any = {
    '4': ['سبب تأجيل الجلسة'],
    '8': [' قرار الحكم'],
    '13_23': ['هل أبدي الطرف الاخر استعداد لقبول الوساطة', 'هل نجحت الوساطة وتم التواصل لتسوية'],
    '14': ['نتيجة التدقيق ألأمني'],
    '15': ['اسم المأوى'],
    '16': ['الأجراء المتخد من وحدة مكافحة جريمة الاتجار بالبشر'],
    '20': ['اسم الجهه الرسمية التي تم الأحالة اليها']
  }
  const [expandedItem, setExpandedItem] = useState<number[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [witnessForms, setWitnessForms] = useState([{ id: 1 }]);
  const [allProcedures, setAllProcedures] = useState<any[]>(allProceduresRes);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode | null>(null);
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allProcedures.length / itemsPerPage);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const visibleItems = allProcedures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const addWitnessForm = () => {
    const newId = Math.max(...witnessForms.map((form) => form.id), 0) + 1;
    setWitnessForms([...witnessForms, { id: newId }]);
  };
  const removeWitnessForm = (id: any) => {
    const updatedForms = witnessForms.filter((form) => form.id !== id);
    setWitnessForms(updatedForms);
  };
  const closePopup = () => {
    setShowPopup(false)
  }
  const handleAccordionItemClick = (index: number) => {
    setExpandedItem((prevExpandedItems) => {
      if (prevExpandedItems?.includes(index)) {
        // Item is already expanded, so remove it from the array
        return prevExpandedItems?.filter((item) => item !== index);
      } else {
        // Item is not expanded, so add it to the array
        return [...prevExpandedItems!, index];
      }
    });
  };
  const showForm = async (id: number, actionType: string) => {
    let formData = await getRequest(`/GetCaseProcedureById?Id=${id}`)
    setShowPopup(true);
    setPopupContent(<CustomForm
      formData={formData.Data}
      isPopup={actionType}
      proceduresType={proceduresType}
      DropDownLabelText={DropDownLabelText}
      extraFieldsRes={extraFieldsRes}
      handleFormSubmit={handleFormSubmit}
    />)
  }
  const handleFormSubmit = async (e: any, url: string) => {
    e.preventDefault();
    let formData = getFormData(e.target);
    try {
      await postRequest(url, formData)
      const allProceduresItems = await getRequest('/GetAllCaseProcedures?skip=20&take=10');
      setAllProcedures(allProceduresItems.Data);
    } catch (error) {
      console.error(error);
    }
    e.target.reset();
  }
  function getFormData(form: HTMLFormElement) {
    const formData = new FormData(form);
    const data: Record<string, string | string[]> = {};

    formData.forEach((value, key) => {
      // If a field with the same name already exists in the data object, create an array
      if (data.hasOwnProperty(key)) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key] as string];
        }
        (data[key] as string[]).push(value as string);
      } else {
        data[key] = value as string;
      }
    });
    return data;
  }
  const handleTelephoneChange = (code: string, value: string) => {
    let phoneNumber = code + value
    setPhoneNumber(phoneNumber);
  };
  return (
    <div
      className={classes.accordion_wrapper}
    >
      <div className={classes.accordion_container}>
        <div className={`${classes.accordion_item} ${expandedItem?.includes(1) ? classes.expanded : ''}`}
          onClick={() => handleAccordionItemClick(1)}

        >
          <h2>الإجراءات المتخذة من قبل المحامين العاملين لدى المركز</h2>
          <div className={classes.item_content} onClick={(e) => e.stopPropagation()}>
            <CustomForm
              handleFormSubmit={handleFormSubmit}
              proceduresType={proceduresType}
              DropDownLabelText={DropDownLabelText}
              extraFieldsRes={extraFieldsRes}

            />
            <div className={`${classes.search_result_wrapper}`}>
              <div className={`${classes.search_result_container}`}>
                <table className={classes.results_table}>
                  <thead className={`${classes.table_header}`}>
                    <tr>
                      <th>الإجراء المتخذ</th>
                      <th>إجراء سابق</th>
                      <th>تاريخ الإجراء</th>
                      <th>تفاصيل الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProcedures.length > 0 ? (
                      <>
                        {visibleItems.map((procedure: any, index: number) =>
                          <tr key={index}>
                            <td>{procedure.ProcedureNameAr}</td>
                            <td>{procedure.IsBefore ? 'نعم' : ''}</td>
                            <td>{procedure.ProcedureDateString}</td>
                            <td>{procedure.Note}</td>
                            <td className={`flex-start ${classes.icons_wrapper}`}>
                              <div className={`show_item_icon`} onClick={() => showForm(procedure.Id, 'show')}></div>
                              <div className={`edit_item_icon`} onClick={() => showForm(procedure.Id, 'edit')} ></div>
                            </td>
                          </tr>
                        )}
                        <tr className={`${classes.prev_next_wrapper}`}>
                          <td className={`flex-start ${classes.btn_container}`}> 
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            السابق
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            التالي
                          </button>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4} className={`${classes.no_results}`}>
                          لم يعثر على أي سجلات
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
        <div className={`${classes.accordion_item} ${expandedItem?.includes(2) ? classes.expanded : ''}`} onClick={() => handleAccordionItemClick(2)}>
          <h2 >بيانات خاصة بالشهود على الانتهاك (إن وجدوا)</h2>
          <div className={classes.item_content} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={(e) => handleFormSubmit(e, '/')}>
              {witnessForms.map((form) => (
                <fieldset key={form.id} className={`${classes.form_item} ${classes.witness_form}`}>
                  <div className={`flex-space-between`}>
                    <h4>الشاهد ال{form.id}</h4>
                    <div className={`${classes.delete_icon}`} onClick={() => removeWitnessForm(form.id)}></div>
                  </div>
                  <div className={`${classes.input_wrapper}`}>
                    <label htmlFor={`name${form.id}`}>الاسم</label>
                    <input className={`bordered-box`} name={`name-${form.id}`} id={`name${form.id}`} type="text" placeholder='الاسم' required />
                  </div>
                  <div className={`flex-start ${classes.flex_wrapper}`}>
                    <div className={`${classes.input_wrapper}`}>
                      <label htmlFor={`address${form.id}`}>العنوان</label>
                      <input className={`bordered-box`} name={`address-${form.id}`} id={`name${form.id}`} type="text" placeholder='العنوان' required />
                    </div>
                    <div className={`${classes.input_wrapper}`}>
                      <label htmlFor={`phone-number-${form.id}`}>رقم الهاتف</label>
                      <div className={`bordered-box ${classes.phone_wrapper}`}>
                        <TelephoneInput name={`phone-number-${form.id}`} onCountryCodeChange={handleTelephoneChange} />
                        <input
                          type="hidden"
                          name={`phone-number-${form.id}`}
                          id={`phone-number-${form.id}`} // Make sure the ID matches the name
                          value={phoneNumber}
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              ))}
              <button className={`primary-btn add`} onClick={addWitnessForm}>
                أضف شاهد
              </button>
              <input type="submit" value="حفظ الإجراء" className={`primary-btn ${classes.witness_form_submit}`} />
            </form>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup closePopup={closePopup}>{popupContent}</Popup>
      )}
    </div>
  )
}
