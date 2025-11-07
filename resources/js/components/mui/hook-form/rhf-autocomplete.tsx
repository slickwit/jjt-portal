import Autocomplete, { type AutocompleteProps } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext, type FieldPath, type FieldValues, type PathValue } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFAutocompleteProps<
    TFieldValues extends FieldValues,
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'name' | 'value' | 'onChange' | 'renderInput'> {
    name: FieldPath<TFieldValues>;
    label?: string;
    placeholder?: string;
    helperText?: string;
}

export default function RHFAutocomplete<
    TFieldValues extends FieldValues,
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined,
>({ name, label, placeholder, helperText, ...other }: RHFAutocompleteProps<TFieldValues, T, Multiple, DisableClearable, FreeSolo>) {
    const { control, setValue } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    onChange={(event, newValue) => setValue(name, newValue as PathValue<TFieldValues, typeof name>, { shouldValidate: true })}
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
