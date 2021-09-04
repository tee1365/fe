import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  ComponentWithAs,
  TextareaProps,
  InputProps,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  textarea?: boolean;
}

const InputField = ({
  label,
  textarea,
  size: _,
  ...props
}: InputFieldProps): JSX.Element => {
  let C = Input;
  if (textarea) {
    C = Textarea as any;
  }
  const [field, { error, touched }] = useField(props);
  return (
    <FormControl isInvalid={!!error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <C {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
