import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image, type = 'website' }) => {
  const siteTitle = 'MOTOMate';
  const fullTitle = title ? `${title} | MOTOMate` : siteTitle;
  
  const siteDescription = description || 'Book convenient car wash and car care services with MOTOMate. Choose your service, vehicle, location and preferred time.';
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Safe canonical fallback if window exists */}
      <link rel="canonical" href={url || (typeof window !== 'undefined' ? window.location.href : '')} />
    </Helmet>
  );
};

export default SEO;
