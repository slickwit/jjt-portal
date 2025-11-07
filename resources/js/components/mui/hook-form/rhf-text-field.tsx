import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFTextFieldProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name'> {
    name: FieldPath<TFieldValues>;
    helperText?: string;
    type?: string;
}

export default function RHFTextField<TFieldValues extends FieldValues>({ name, helperText, type, ...other }: RHFTextFieldProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    fullWidth
                    type={type}
                    onChange={(event) => {
                        if (type === 'number') {
                            field.onChange(+event.target.value);
                        } else {
                            field.onChange(event);
                        }
                        // const value = event.target.value;
                        // if (type === 'number' && !Number(event.target.value)) return;
                        // field.onChange(type === 'number' ? +value : value);
                    }}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    {...other}
                />
            )}
        />
    );
}
