import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  height?: number;
  href?: string;
}

export default function Logo({ className = '', variant = 'full', height = 36, href = '/' }: LogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {variant === 'icon' ? (
        <img
          src="/logo/permanence-ia-icon-80.svg"
          alt="Permanence IA"
          width={height}
          height={height}
          className="h-auto object-contain"
        />
      ) : (
        <>
          {/* Light mode logo */}
          <img
            src="/logo/permanence-ia-dark.svg"
            alt="Permanence IA"
            style={{ height: `${height}px`, width: 'auto' }}
            className="block dark:hidden object-contain"
          />
          {/* Dark mode logo */}
          <img
            src="/logo/permanence-ia-light.svg"
            alt="Permanence IA"
            style={{ height: `${height}px`, width: 'auto' }}
            className="hidden dark:block object-contain"
          />
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
