import React, { useEffect } from 'react';

export const SupportOurMissionPage = () => {
  useEffect(() => {
    document.title = 'Support Our Mission | Chinmaya Mission';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-[60vh] bg-white">
      {/* Blank page - content to be added later */}
    </div>
  );
};

export default SupportOurMissionPage;
