import FormHelperText from '@mui/material/FormHelperText';
import Slider, { type SliderProps } from '@mui/material/Slider';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFSliderProps<TFieldValues extends FieldValues> extends Omit<SliderProps, 'name' | 'value' | 'onChange'> {
    name: FieldPath<TFieldValues>;
    helperText?: string;
}

export default function RHFSlider<TFieldValues extends FieldValues>({ name, helperText, ...other }: RHFSliderProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Slider {...field} valueLabelDisplay="auto" {...other} />

                    {(!!error || helperText) && <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>}
                </>
            )}
        />
    );
}
