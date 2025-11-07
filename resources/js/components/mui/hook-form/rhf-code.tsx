import FormHelperText from '@mui/material/FormHelperText';
import { MuiOtpInput, type MuiOtpInputProps } from 'mui-one-time-password-input';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFCodeProps<TFieldValues extends FieldValues> extends Omit<MuiOtpInputProps, 'value' | 'onChange' | 'name'> {
    name: FieldPath<TFieldValues>;
}

export default function RHFCode<TFieldValues extends FieldValues>({ name, ...other }: RHFCodeProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <MuiOtpInput
                        {...field}
                        autoFocus
                        gap={1.5}
                        length={6}
                        TextFieldsProps={{
                            error: !!error,
                            placeholder: '-',
                        }}
                        {...other}
                    />

                    {error && (
                        <FormHelperText sx={{ px: 2 }} error>
                            {error.message}
                        </FormHelperText>
                    )}
                </div>
            )}
        />
    );
}
