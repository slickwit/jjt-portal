import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel, { formControlLabelClasses, type FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { type SxProps, type Theme } from '@mui/material/styles';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFCheckboxProps<TFieldValues extends FieldValues> extends Omit<FormControlLabelProps, 'control' | 'name'> {
    name: FieldPath<TFieldValues>;
    helperText?: string;
}

export function RHFCheckbox<TFieldValues extends FieldValues>({ name, helperText, ...other }: RHFCheckboxProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <FormControlLabel control={<Checkbox {...field} checked={field.value} />} {...other} />

                    {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
                </div>
            )}
        />
    );
}

// ----------------------------------------------------------------------

interface Option {
    value: string | number;
    label: string;
}

interface RHFMultiCheckboxProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    label?: string;
    options: Option[];
    row?: boolean;
    spacing?: number;
    helperText?: string;
    sx?: SxProps<Theme>;
    /** Additional props for FormControlLabel */
    formControlLabelProps?: Omit<FormControlLabelProps, 'control' | 'label' | 'value'>;
}

export function RHFMultiCheckbox<TFieldValues extends FieldValues>({
    row,
    name,
    label,
    options,
    spacing,
    helperText,
    sx,
    formControlLabelProps,
}: RHFMultiCheckboxProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    const getSelected = (selectedItems: Array<string | number>, item: string | number) =>
        selectedItems.includes(item) ? selectedItems.filter((value) => value !== item) : [...selectedItems, item];

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset" error={!!error}>
                    {label && (
                        <FormLabel component="legend" sx={{ typography: 'body2' }}>
                            {label}
                        </FormLabel>
                    )}

                    <FormGroup
                        sx={{
                            ...(row && {
                                flexDirection: 'row',
                            }),
                            [`& .${formControlLabelClasses.root}`]: {
                                '&:not(:last-of-type)': {
                                    mb: spacing || 0,
                                },
                                ...(row && {
                                    mr: 0,
                                    '&:not(:last-of-type)': {
                                        mr: spacing || 2,
                                    },
                                }),
                            },
                            ...sx,
                        }}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        checked={Array.isArray(field.value) && field.value.includes(option.value)}
                                        onChange={() => {
                                            if (Array.isArray(field.value)) {
                                                field.onChange(getSelected(field.value, option.value));
                                            } else {
                                                // Initialize as array if not already
                                                field.onChange([option.value]);
                                            }
                                        }}
                                    />
                                }
                                label={option.label}
                                {...formControlLabelProps}
                            />
                        ))}
                    </FormGroup>

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
