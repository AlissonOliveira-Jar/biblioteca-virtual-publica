import { useState, forwardRef } from 'react';
import * as Form from '@radix-ui/react-form';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

type PasswordInputProps = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <Form.Field name={name || ''} className="flex flex-col gap-2 mb-2">
        <Form.Label>{label}</Form.Label>
        <div className="relative w-full">
          <Form.Control asChild> 
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full h-10 pl-2 pr-10 rounded-md border border-slate-300"
              {...props}
              ref={ref}
            />
          </Form.Control>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-600"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>
        <Form.Message className="text-red-500 italic" />
      </Form.Field>
    );
  }
);

export default PasswordInput;
