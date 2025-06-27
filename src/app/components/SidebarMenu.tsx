import React from "react";

interface SidebarMenuProps {
  activeMenu: "home" | "favourites";
  setActiveMenu: (menu: "home" | "favourites") => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeMenu, setActiveMenu }) => (
  <nav className="w-48 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
    <h1
      className="text-2xl font-bold mb-10 text-center"
      style={{ fontFamily: "'Pacifico', cursive" }}
    >
      Movie Finder 🍿
    </h1>
    <button
      className={`mb-4 px-4 py-2 rounded transition text-left ${
        activeMenu === "home"
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setActiveMenu("home")}
    >
      Search
    </button>
    <button
      className={`px-4 py-2 rounded transition text-left ${
        activeMenu === "favourites"
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={() => setActiveMenu("favourites")}
    >
      My Collection
    </button>
  </nav>
);

export default SidebarMenu;