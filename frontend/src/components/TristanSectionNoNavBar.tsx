import React from "react";

const TristanSectionNoNavBar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 max-w-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">{children}</div>
    </div>
  </div>
);

export default TristanSectionNoNavBar;
