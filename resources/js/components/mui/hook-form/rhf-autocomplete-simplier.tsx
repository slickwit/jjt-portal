import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext, type FieldPath, type FieldValues, type PathValue } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFAutocompleteProps<TFieldValues extends FieldValues, T = unknown>
    extends Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, 'name' | 'value' | 'onChange' | 'renderInput'> {
    name: FieldPath<TFieldValues>;
    label?: string;
    placeholder?: string;
    helperText?: string;
}

export default function RHFAutocompleteSimplier<TFieldValues extends FieldValues, T = unknown>({
    name,
    label,
    placeholder,
    helperText,
    ...other
}: RHFAutocompleteProps<TFieldValues, T>) {
    const { control, setValue } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    onChange={(_event, newValue) => setValue(name, newValue as PathValue<TFieldValues, typeof name>, { shouldValidate: true })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            error={!!error}
                            helperText={error ? error?.message : helperText}
                        />
                    )}
                    {...other}
                />
            )}
        />
    );
}
