import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup, { type RadioGroupProps } from '@mui/material/RadioGroup';
import { type SxProps, type Theme } from '@mui/material/styles';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface Option {
    value: string | number;
    label: string;
}

interface RHFRadioGroupProps<TFieldValues extends FieldValues> extends Omit<RadioGroupProps, 'name' | 'value' | 'onChange'> {
    name: FieldPath<TFieldValues>;
    label?: string;
    options: Option[];
    row?: boolean;
    spacing?: number;
    helperText?: string;
    formControlLabelSx?: SxProps<Theme>;
}

export default function RHFRadioGroup<TFieldValues extends FieldValues>({
    row,
    name,
    label,
    options,
    spacing,
    helperText,
    formControlLabelSx,
    ...other
}: RHFRadioGroupProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    const labelledby = label ? `${name}-${label}` : '';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset" error={!!error}>
                    {label && (
                        <FormLabel component="legend" id={labelledby} sx={{ typography: 'body2' }}>
                            {label}
                        </FormLabel>
                    )}

                    <RadioGroup {...field} aria-labelledby={labelledby} row={row} {...other}>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                                sx={{
                                    '&:not(:last-of-type)': {
                                        mb: spacing || 0,
                                    },
                                    ...(row && {
                                        mr: 0,
                                        '&:not(:last-of-type)': {
                                            mr: spacing || 2,
                                        },
                                    }),
                                    ...formControlLabelSx,
                                }}
                            />
                        ))}
                    </RadioGroup>

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error} sx={{ mx: 0 }}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}
