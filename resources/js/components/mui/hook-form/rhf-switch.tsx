import FormControlLabel, { type FormControlLabelProps } from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import React from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFSwitchProps<TFieldValues extends FieldValues> extends Omit<FormControlLabelProps, 'control' | 'name' | 'label'> {
    name: FieldPath<TFieldValues>;
    helperText?: string;
    label?: React.ReactNode;
}

export default function RHFSwitch<TFieldValues extends FieldValues>({ name, helperText, label, ...other }: RHFSwitchProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <FormControlLabel control={<Switch {...field} checked={field.value} />} label={label} {...other} />

                    {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
                </div>
            )}
        />
    );
}
