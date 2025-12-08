import React from 'react';

const CleanBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#F8F9FB]">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/60 blur-[100px]" />
    </div>
);

export default CleanBackground;
