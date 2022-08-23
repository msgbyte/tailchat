import React from 'react';
import problemSvg from '@assets/images/problem.svg';

interface ProblemProps {
  text?: React.ReactNode;
}

/**
 * 问题页面占位
 */
export const Problem: React.FC<ProblemProps> = React.memo((props) => {
  return (
    <div className="text-center w-full">
      <img className="w-32 h-32 m-auto mb-2" src={problemSvg} />

      <div>{props.text}</div>
    </div>
  );
});
Problem.displayName = 'Problem';
