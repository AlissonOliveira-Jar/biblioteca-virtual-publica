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
        <Form.Label className="text-gray-400">{label}</Form.Label>
        <div className="relative w-full">
          <Form.Control asChild> 
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full h-10 pl-3 pr-10 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              {...props}
              ref={ref}
            />
          </Form.Control>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>
      </Form.Field>
    );
  }
);

export default PasswordInput;
