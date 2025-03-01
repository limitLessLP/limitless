export const Button = ({ children, className, variant = "default", ...props }) => {
  return (
    <button
      className={`${className} ${
        variant === "ghost" ? "bg-transparent hover:bg-transparent" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}; 