import { useState } from "react";

// 1. Added 'name' to the props
const Textbox = ({ label,formdata, setformData }) => {
  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let errorMsg = '';

    switch (fieldName) {
      case 'Email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) errorMsg = 'Email is required';
        else if (!emailRegex.test(value)) errorMsg = 'Invalid email format';
        break;
     case 'Phone':
        const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
        if(!value) errorMsg="Phone Number is requires"
        else if (!phoneRegex.test(value)) errorMsg='Invalid Phone Number'
      default:
        break;
    case 'Name':
        if (!value) return "Name is required";
        const nameRegex = /^[A-Za-z ]{2,}$/;

        if (!nameRegex.test(value)) {
            return "Name must contain only letters and be at least 2 characters";
        }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { value } = e.target;

    setformData({ ...formdata, [label]: value });

    const errorMsg = validateField(label, value);
    setErrors({ ...errors, [label]: errorMsg });
  };

  return (
    <div className="date-input-wrapper">
      <label>{label}</label>
      <input
        name={label}
        value={formdata[label] || ""} 
        onChange={handleChange}
      />
      
      {errors[label] && <small style={{ color: 'red' }}>{errors[label]}</small>}
    </div>
  );
};

export default Textbox;