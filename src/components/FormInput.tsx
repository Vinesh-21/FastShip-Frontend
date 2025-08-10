// components/FormInputField.tsx

import {
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import FormError from "./FormError";

interface FormInputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

  className?: string;
}

const FormInputField = ({
  id,
  label,
  placeholder = "",
  type = "text",
  registration,
  error,
  className = "",
}: FormInputFieldProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      {type === "number" ? (
        <Input
          id={id}
          type={type}
          step="any"
          placeholder={placeholder}
          defaultValue={0}
          {...registration}
        />
      ) : (
        <Input
          id={id}
          type={type}
          defaultValue={""}
          placeholder={placeholder}
          {...registration}
        />
      )}
      {error?.message && <FormError>{error.message}</FormError>}
    </div>
  );
};

export default FormInputField;
