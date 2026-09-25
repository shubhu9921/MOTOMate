export const VALIDATION_RULES = {
  NAME: {
    pattern: /^[a-zA-Z\s]+$/,
    message: "Name can only contain alphabetic characters and spaces.",
    minLength: 2,
    maxLength: 100
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address.",
    maxLength: 150
  },
  PHONE: {
    pattern: /^(?:\+91|91)?[6-9]\d{9}$/,
    message: "Enter a valid Indian mobile number.",
    maxLength: 15
  },
  PASSWORD: {
    minLength: 8,
    maxLength: 72,
    message: "Password must be 8–72 characters long."
  },
  PINCODE: {
    pattern: /^[1-9][0-9]{5}$/,
    message: "Pincode must contain exactly 6 digits."
  },
  VEHICLE_REGISTRATION: {
    pattern: /^[A-Z0-9]{4,20}$/,
    message: "Enter a valid vehicle registration number.",
    maxLength: 20
  },
  OTP: {
    pattern: /^\d{6}$/,
    message: "OTP must be exactly 6 digits."
  },
  ADDRESS: {
    minLength: 5,
    maxLength: 200,
    message: "Address must be between 5 and 200 characters."
  },
  CITY: {
    pattern: /^[a-zA-Z\s]+$/,
    message: "City can only contain letters.",
    maxLength: 100
  },
  STATE: {
    pattern: /^[a-zA-Z\s]+$/,
    message: "State can only contain letters.",
    maxLength: 100
  }
};

export const validateField = (value, rules, fieldName = "Field") => {
  if (!value && rules.required) {
    return `${fieldName} is required.`;
  }
  
  if (!value) return null; // If not required and empty, valid.

  const valStr = String(value).trim();
  
  if (rules.minLength && valStr.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters.`;
  }

  if (rules.maxLength && valStr.length > rules.maxLength) {
    return `${fieldName} must be at most ${rules.maxLength} characters.`;
  }

  if (rules.pattern && !rules.pattern.test(valStr)) {
    return rules.message || `Invalid ${fieldName} format.`;
  }

  return null;
};
