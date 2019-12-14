import React from 'react';

import './form-input.styles.scss';

const FormInput = ({ descriptionHandler, label, ...otherProps }) => (
  <div className='group'>
    <input className='form-input' onChange={descriptionHandler} />
    {/* {label ? (
      <label className='shrink form-input-label'>
        {label}
      </label>
    ) : null} */}
  </div>
);

export default FormInput;