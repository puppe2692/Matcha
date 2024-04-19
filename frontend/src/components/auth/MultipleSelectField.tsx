import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

interface Props {
  hasError?: boolean;
  id: string;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
      const {
        target: { value },
      } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    };

    return (
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
          <Select
            ref={ref as React.RefObject<HTMLSelectElement>} //ici
            className={`bg-gray-50 border ${
              hasError ? "border-red-500" : "border-gray-300"
            } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600`}
            labelId="demo-multiple-checkbox-label" //ici
            id={id} //ici
            required={required} //ici
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((options) => (
              <MenuItem key={options.value} value={options.value}>
                <Checkbox checked={personName.indexOf(options.value) > -1} />
                <ListItemText primary={options.value} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
);

export default MultipleSelectCheckmarks;
