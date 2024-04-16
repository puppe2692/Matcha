import React from 'react';

interface Props {
    hasError?: boolean;
    id: string;
    options: { value: string; label: string }[];
    placeholder: string;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

const SelectField: React.FC<Props> = React.forwardRef<HTMLInputElement, Props> (
    (
        {
            hasError = false,
            id,
            options,
            placeholder,
            required = false,
            onChange,
            onBlur,
        },
        ref,
) => (
    <select
        ref={ref as React.RefObject<HTMLSelectElement>}
        className={`bg-gray-50 border ${
            hasError ? 'border-red-500' : 'border-gray-300'
        } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600`}
        id={id}
        required={required}
        defaultValue=""
        onChange={onChange}
        onBlur={onBlur}
    >
        <option value="" disabled >
            {placeholder}
        </option>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
));

export default SelectField;