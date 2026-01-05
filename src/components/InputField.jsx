function InputField({ label, value, onChange, type = "number", step }) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        step={step}
      />
    </label>
  );
}

export default InputField;
