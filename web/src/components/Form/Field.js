import React from 'react';
import { useField } from 'formik';
import './Field.css';

const FormField = ({ name, id, label, ...restProps }) => {
  const [field, meta] = useField({ name, ...restProps });

  return (
    // em input {...field} eh o mesmo que => <input name={name} id={id ?? name} onChange={field.onChange} value={field.value}/>
    // ja incluiu a label no componente para otimizar codigo
    <>
      {label && (
        <label htmlFor={id ?? name} className="form-fiel__label">
          {label}
        </label>
      )}
      <input
        {...field}
        name={name}
        id={id ?? name}
        className={`form-field__input ${
          meta.error && 'form-field__input--has-error'
        }`}
      />
      {meta.error && meta.touched && (
        <span className="form-field__error-message">{meta.error}</span>
      )}
    </>
  );
};

export default FormField;
