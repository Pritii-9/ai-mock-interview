/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField as UIFormField, // Renamed to avoid conflict with our component name
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control, FieldValues, Path } from 'react-hook-form'; // Corrected imports

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file';
  description?: string; // Added description prop
}

const FormField = <T extends FieldValues>({ // Corrected generic type definition for functional component
  control,
  name,
  label,
  placeholder,
  type = 'text',
  description,
}: FormFieldProps<T>) => (
  <UIFormField // Use UIFormField directly
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className='label'>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type={type}
            className='input'
          />
        </FormControl>
       
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField;