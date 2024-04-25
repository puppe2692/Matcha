import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useUserContext } from "../../context/UserContext";

interface Props {
  hasError?: boolean;
  id: string;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  onChange?: (event: SelectChangeEvent<string[]>) => void;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const names = [
//   "Oliver Hansen",
//   "Van Henry",
//   "April Tucker",
//   "Ralph Hubbard",
//   "Omar Alexander",
//   "Carlos Abbott",
//   "Miriam Wagner",
//   "Bradley Wilkerson",
//   "Virginia Andrews",
//   "Kelly Snyder",
// ];

const MultipleSelectCheckmarks: React.FC<Props> = React.forwardRef<
  HTMLInputElement,
  Props
>(
  (
    {
      hasError = false,
      id,
      options,
      placeholder, // ptetre a delete
      required = false,
      onChange,
      onBlur,
    },
    ref
  ) => {
    const { user } = useUserContext();
    const [personName, setPersonName] = React.useState<string[]>([]);

    React.useEffect(() => {
      if (user) {
        setPersonName(
          options
            .filter((option) => user?.hashtags.includes(option.value))
            .map((option) => option.value)
        );
      }
    }, [user]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
      const {
        target: { value },
      } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
      // Execute onChange callback if provided
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <div>
        <FormControl
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderColor: "#4b5563", // Change outline color
              borderRadius: 2, // Rounder corners
              borderWidth: 1, // Add border width
            },
            "&:hover": {
              backgroundColor: "transparent", // Suppress hover effect
            },
          }}
        >
          <InputLabel id={`${id}-label`}></InputLabel>
          <Select
            ref={ref as React.RefObject<HTMLSelectElement>} //ici
            className={`bg-gray-50 border ${
              hasError ? "border-red-500" : "border-gray-300"
            } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600`}
            labelId={`${id}-label`} //ici
            id={id} //ici
            required={required} //ici
            multiple
            value={personName}
            onChange={handleChange}
            renderValue={(selected) => (
              <div style={{ color: "white" }}>
                {selected
                  .map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return option ? option.label : null;
                  })
                  .join(", ")}
              </div>
            )}
            MenuProps={MenuProps}
          >
            <MenuItem
              disabled
              value=""
              style={{ color: "white", backgroundColor: "#374151" }}
            >
              {placeholder}
            </MenuItem>
            {options.map((options) => (
              <MenuItem
                key={options.value}
                value={options.value}
                style={{ color: "white", backgroundColor: "#374151" }}
              >
                <Checkbox checked={personName.indexOf(options.value) > -1} />
                <ListItemText
                  primary={options.value}
                  style={{ backgroundColor: "#374151" }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
);

export default MultipleSelectCheckmarks;
