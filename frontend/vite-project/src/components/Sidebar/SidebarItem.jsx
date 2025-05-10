import React from "react";

const SidebarItem = ({ icon, onClick, tooltip }) => (
  <button
    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-900 hover:text-white cursor-pointer"
    onClick={onClick}
    title={tooltip}
  >
    {icon}
  </button>
);

export default SidebarItem;
