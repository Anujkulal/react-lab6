import React, { useCallback, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid Email format.';
      isValid = false;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$#!%&?:)])[A-Za-z\d@$#!%&?:)]{6,}$/;

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordPattern.test(formData.password)) {
        newErrors.password =
        'Password must be at least 6 characters long and include at least one letter, one number, and one special character (@ $ # ! % & ? : )';
      
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const sanitizedData = {
        name: DOMPurify.sanitize(formData.name.trim()),
        email: DOMPurify.sanitize(formData.email.trim()),
        password: formData.password, // Do not sanitize password (can interfere)
      };

      console.log('Form submitted successfully', sanitizedData);
      setShowForm(true);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registration Form</h2>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your name"
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && <span id="name-error" className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            minLength={6}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
          />
          {errors.password && <span id="password-error" className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group password-toggle">
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />{' '}
            Show Password
          </label>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="form-submit"
            disabled={!isFormValid}
          >
            Submit
          </button>
        </div>
      </form>

      {showForm && (
        <div className="result">
          <h3>Name: {formData.name}</h3>
          <h3>Email: {formData.email}</h3>
        </div>
      )}
    </div>
  );
}

export default Form;
