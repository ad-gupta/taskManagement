import React from 'react';

const Header = () => {
  return (
    <nav className="bg-slate-400 h-12 flex items-center rounded-t-md mt-1">
      {/* Circle Section */}
      <div className="flex items-center space-x-2 pl-4">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
      </div>
    </nav>
  );
};

export default Header;
