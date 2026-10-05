import React from 'react';
import Link from 'next/link';

export default function Logo({ height = 40, dark = false, href = '/' }: { height?: number; dark?: boolean; href?: string | null }) {
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={dark ? '/logo/logo-dark.png' : '/logo/logo-light.png'} alt="Permanence IA" style={{ height, width: 'auto' }} />;
  return href ? <Link href={href} className="inline-flex shrink-0 items-center rounded-md">{img}</Link> : img;
}
