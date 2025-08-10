function FormError({ children }: { children: any }) {
  return (
    <div className="font-light text-red-500 text-xs">
      <p>* {children} *</p>
    </div>
  );
}

export default FormError;
