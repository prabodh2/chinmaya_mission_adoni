import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * AboutPage has been reorganized into "About Us -> Chinmaya Mission Adoni"
 * This component safely redirects legacy /about traffic to /chinmaya-mission-adoni.
 */
export const AboutPage = () => {
  return <Navigate to="/chinmaya-mission-adoni" replace />;
};

export default AboutPage;
