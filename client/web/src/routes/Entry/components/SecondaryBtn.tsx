import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

export const SecondaryBtn: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> =
  React.memo((props) => {
    return (
      <button
        {...props}
        className={clsx(
          'w-full py-2 px-4 border border-transparent text-sm font-medium text-white focus:outline-none disabled:opacity-50',
          props.className
        )}
      >
        {props.children}
      </button>
    );
  });
SecondaryBtn.displayName = 'SecondaryBtn';
