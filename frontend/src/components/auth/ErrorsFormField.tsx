import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import InputField from "./InputField";
import SelectField from "./SelectField";
import MultipleSelectCheckmarks from "./MultipleSelectField";
import { ErrorMessage } from "@hookform/error-message";

interface Props {
  control: Control<any>;
  controllerName: string;
  errors: FieldErrors<FieldValues>;
  hasError?: boolean;
  input?: string;
  label: string;
  placeholder: string;
  rules?: object;
  type?: string;
  options?: { value: string; label: string }[];
}

const ErrorsFormField: React.FC<Props> = ({
  control,
  errors,
  hasError = false,
  controllerName,
  label,
  placeholder,
  rules,
  type = "text",
  input, // Add input prop
  options, // Add options prop
}) => (
  <Controller
    name={controllerName}
    control={control}
    rules={rules}
    render={({ field }) => (
      <div>
        <label
          htmlFor={controllerName}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        {input === "select" ? (
          <SelectField
            {...field}
            id={controllerName}
            options={options || []} // Pass options to SelectField
            placeholder={placeholder}
            hasError={hasError}
            onBlur={field.onBlur}
          />
        ) : input === "multiple" ? (
          <MultipleSelectCheckmarks
            {...field}
            id={controllerName}
            options={options || []} // Pass options to SelectField
            placeholder={placeholder}
            hasError={hasError}
            onBlur={field.onBlur}
          />
        ) : (
          <InputField
            {...field}
            id={controllerName}
            placeholder={placeholder}
            type={type}
            hasError={hasError}
            onBlur={field.onBlur}
          />
        )}
        <ErrorMessage
          errors={errors}
          name={controllerName}
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <p
                className="error mt-1 text-sm text-red-600 dark:text-red-500"
                style={{
                  fontSize: "12px",
                }}
                key={type}
              >
                {message}
              </p>
            ))
          }
        />
      </div>
    )}
  />
);

export default ErrorsFormField;
