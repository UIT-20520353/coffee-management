import { useMemo } from "react";
import { House, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menus = useMemo(
    () => [
      {
        label: "Trang chủ",
        icon: <House width={24} height={24} />,
        link: "/",
      },
    ],
    []
  );

  return (
    <div className="bg-gray-1 border-r border-gray-200 w-60 min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-5 flex flex-col items-start justify-between">
      <div className="flex flex-col items-start w-full gap-1">
        {menus.map((item, index) => (
          <NavLink
            key={`menu-item-${index}`}
            className="flex items-center gap-3"
          >
            {item.icon}
            <span className="text-base font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <NavLink className="flex items-center gap-3">
        <LogOut width={24} height={24} />
        <span className="text-base font-medium">Đăng xuất</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
