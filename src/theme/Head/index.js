import React from 'react';
import Head from '@docusaurus/Head';

export default function CustomHead() {
  return (
    <Head>
      {/* Preconnect to external domains for faster loading */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />

      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="dns-prefetch" href="https://github.com" />

      {/* Theme color */}
      <meta name="theme-color" content="#E74C3C" />
      <meta name="msapplication-TileColor" content="#E74C3C" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#E74C3C" />
    </Head>
  );
}
