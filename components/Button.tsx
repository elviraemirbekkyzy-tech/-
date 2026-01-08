import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 border-b-4 border-indigo-800",
    secondary: "bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg hover:-translate-y-0.5 border-b-4 border-purple-700",
    success: "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 border-b-4 border-green-700",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 border-b-4 border-red-700",
    outline: "bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};