import { Spinner } from '@/components/Spinner';
import clsx from 'clsx';
import React, { ButtonHTMLAttributes } from 'react';

export const PrimaryBtn: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean;
  }
> = React.memo((props) => {
  return (
    <button
      disabled={props.loading}
      {...props}
      className={clsx(
        'w-full py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50',
        props.className
      )}
    >
      {props.loading && <Spinner />}
      {props.children}
    </button>
  );
});
PrimaryBtn.displayName = 'PrimaryBtn';
