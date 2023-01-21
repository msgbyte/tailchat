import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export const EntryInput: React.FC<InputHTMLAttributes<HTMLInputElement>> =
  React.memo((props) => {
    return (
      <input
        {...props}
        className={clsx(
          'appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base mobile:text-sm',
          props.className
        )}
      >
        {props.children}
      </input>
    );
  });
EntryInput.displayName = 'EntryInput';
