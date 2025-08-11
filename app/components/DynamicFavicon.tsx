'use client';

import { useEffect } from 'react';

interface DynamicFaviconProps {
  logoUrl?: string;
}

export default function DynamicFavicon({ logoUrl }: DynamicFaviconProps) {
  useEffect(() => {
    if (logoUrl) {
      // Criar um link para o favicon
      const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      const link = existingLink || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = logoUrl;
      
      if (!existingLink) {
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  }, [logoUrl]);

  return null;
}
