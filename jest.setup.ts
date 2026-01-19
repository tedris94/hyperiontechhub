import React from 'react';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src?: string | { src?: string }; alt?: string }) => {
    const resolvedSrc =
      typeof props.src === 'string' ? props.src : props.src?.src ?? '';

    return React.createElement('img', {
      ...props,
      src: resolvedSrc,
      alt: props.alt,
    });
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => React.createElement('a', { href, ...rest }, children),
}));

