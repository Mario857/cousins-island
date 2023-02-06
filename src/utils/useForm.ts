import { ChangeEvent, FormEvent, useState } from 'react';

interface Validation {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: string;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  custom?:
    | {
        isValid: (value: string, values: any) => boolean;
        message: string;
      }
    | ((
        value: string,
        values: any
      ) => {
        isValid: boolean;
        message: string;
      });
}

type ErrorRecord<T> = Partial<Record<keyof T, string>>;

type Validations<T extends {}> = Partial<Record<keyof T, Validation>>;

export const useForm = <T extends Record<keyof T, any> = {}>(options?: {
  validations?: Validations<T>;
  initialValues?: Partial<T>;
}) => {
  const [values, setValues] = useState<T>((options?.initialValues || {}) as T);
  const [errors, setErrors] = useState<ErrorRecord<T>>({});

  const validate = (key: string, value: string) => {
    const validations = options?.validations;

    if (value) {
      if (validations) {
        let valid = true;
        const newErrors: ErrorRecord<T> = {};
        for (const key in validations) {
          const validation = validations[key];

          // Custom
          const custom = validation?.custom;

          if (custom) {
            if (typeof custom === 'function') {
              const { isValid, message } = custom(value, values);

              if (!isValid) {
                valid = isValid;
                newErrors[key] = message;
              }
            } else {
              if (custom?.isValid && !custom.isValid(value, values)) {
                valid = false;
                newErrors[key] = custom.message;
              }
            }
          }

          // Required
          if (validation?.required?.value && !value) {
            valid = false;
            newErrors[key] = validation?.required?.message;
          }

          // Pattern
          const pattern = validation?.pattern;

          if (pattern?.value && RegExp(pattern.value).test(value)) {
            valid = false;
            newErrors[key] = pattern.message;
          }

          // Max
          const max = validation?.max;

          if (
            (max?.value || max?.value === 0) &&
            max?.value < parseFloat(value)
          ) {
            valid = false;
            newErrors[key] = max?.message;
          }

          // Min
          const min = validation?.min;

          if (
            (min?.value || min?.value === 0) &&
            value &&
            min?.value > parseFloat(value)
          ) {
            valid = false;
            newErrors[key] = min?.message;
          }
        }

        setValues({
          ...values,
          [key]: value,
        });

        if (!valid) {
          setErrors(newErrors);
        } else {
          setErrors({});
        }

        return;
      }
    } else {
      setErrors((errors) => ({ ...errors, [key]: value }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const key = e.target.name;

    validate(key, value);

    setValues({
      ...values,
      [key]: value,
    });
  };

  const handleSelectChange = (key: string) => (e: any) => {
    const value = e.target.value;

    validate(key, value);

    setValues({
      ...values,
      [key]: value,
    });
  };

  const handleSubmit =
    (onSubmit: () => void) => (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setErrors({});

      if (onSubmit) {
        onSubmit();
      }
    };

  const setValue = (key: string, value: any) => {
    setValues((values) => ({ ...values, [key]: value }));
  };

  const resetValues = () => {
    if (options?.initialValues) {
      setValues(options.initialValues as T);
    }
  };

  return {
    values,
    handleChange,
    handleSubmit,
    handleSelectChange,
    errors,
    setValue,
    resetValues,
  };
};
