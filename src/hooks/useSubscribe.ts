import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as ROUTES from 'constants/routes';

export const useSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email: string | null;
    api: string | null;
    tosChecked: string | null;
  }>({
    email: null,
    api: null,
    tosChecked: null,
  });
  const [email, setEmail] = useState('');
  const [tosChecked, setTosChecked] = useState(false);

  const validate = () => {
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !email.match(regExp)) {
      return {
        email: true,
      };
    }

    if (!tosChecked) {
      return {
        tosChecked: true,
      };
    }

    return {
      email: false,
      tosChecked: false,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate().email)
      return setErrors({
        email:
          'There is an error in the email address you entered. Please try again.',
        api: null,
        tosChecked: null,
      });

    if (validate().tosChecked) {
      return setErrors({
        tosChecked: 'Please read and accept our Terms of Service',
        api: null,
        email: null,
      });
    }

    setLoading(true);

    try {
      // TODO: CHANGE API URL
      await axios.post(
        `https://luart-landing-mq2nqcr7t-luart-io.vercel.app/api/subscribe`,
        { email }
      );
      setLoading(false);
      setErrors({ email: null, api: null, tosChecked: null });
      setSuccess(
        'Thanks for signing up. We will keep you up to date with our project.'
      );
    } catch (error: any) {
      if (error?.response) {
        const apiError = error?.response?.data.error;
        setErrors({
          email: null,
          tosChecked: null,
          api:
            apiError && apiError === 'email-exists'
              ? "Looks like you've already subscribed, try a different email address."
              : 'Something went wrong. Please try again later.',
        });
        setSuccess(null);
      }
    }

    setEmail('');
    setTosChecked(false);

    setLoading(false);
  };

  return {
    loading,
    success,
    setSuccess,
    setErrors,
    email,
    errors,
    handleChange,
    handleSubmit,
    tosChecked,
    setTosChecked,
  };
};
