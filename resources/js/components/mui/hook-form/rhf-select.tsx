import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { type SxProps, type Theme } from '@mui/material/styles';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFSelectProps<TFieldValues extends FieldValues> extends Omit<TextFieldProps, 'name' | 'select' | 'defaultValue'> {
    name: FieldPath<TFieldValues>;
    native?: boolean;
    maxHeight?: number;
    helperText?: string;
    PaperPropsSx?: SxProps<Theme>;
}

export function RHFSelect<TFieldValues extends FieldValues>({
    name,
    native,
    maxHeight = 220,
    helperText,
    children,
    PaperPropsSx,
    ...other
}: RHFSelectProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    select
                    fullWidth
                    slotProps={{
                        select: {
                            value: field.value ?? '',
                            native,
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        ...(!native && {
                                            maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                                        }),
                                        ...PaperPropsSx,
                                    },
                                },
                            },
                            sx: { textTransform: 'capitalize' },
                        },
                    }}
                    error={!!error}
                    helperText={error ? error?.message : helperText}
                    {...other}
                >
                    {children}
                </TextField>
            )}
        />
    );
}

// ----------------------------------------------------------------------

interface Option<T = string | number> {
    value: T;
    label: string;
}

interface RHFMultiSelectProps<TFieldValues extends FieldValues, TOptionValue = string | number> extends Omit<FormControlProps, 'name' | 'error'> {
    name: FieldPath<TFieldValues>;
    chip?: boolean;
    label?: string;
    options: Option<TOptionValue>[];
    checkbox?: boolean;
    placeholder?: string;
    helperText?: string;
}

export function RHFMultiSelect<TFieldValues extends FieldValues, TOptionValue = string | number>({
    name,
    chip,
    label,
    options,
    checkbox,
    placeholder,
    helperText,
    ...other
}: RHFMultiSelectProps<TFieldValues, TOptionValue>) {
    const { control } = useFormContext<TFieldValues>();

    const renderValues = (selectedIds: TOptionValue[]) => {
        const selectedItems = options.filter((item) => selectedIds.includes(item.value));

        if (!selectedItems.length && placeholder) {
            return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
        }

        if (chip) {
            return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedItems.map((item) => (
                        <Chip key={String(item.value)} size="small" label={item.label} />
                    ))}
                </Box>
            );
        }

        return selectedItems.map((item) => item.label).join(', ');
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                // Ensure field.value is always treated as an array of TOptionValue
                const fieldValue: TOptionValue[] = Array.isArray(field.value) ? field.value : [];

                return (
                    <FormControl error={!!error} {...other}>
                        {label && <InputLabel id={name}> {label} </InputLabel>}

                        <Select
                            {...field}
                            multiple
                            value={fieldValue}
                            displayEmpty={!!placeholder}
                            id={`multiple-${name}`}
                            labelId={name}
                            label={label}
                            renderValue={renderValues}
                        >
                            {options.map((option) => {
                                const selected = fieldValue.includes(option.value);

                                return (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    <MenuItem key={String(option.value)} value={option.value as any}>
                                        {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                                        {option.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>

                        {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
                    </FormControl>
                );
            }}
        />
    );
}
