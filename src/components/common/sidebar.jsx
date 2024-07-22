import useLocalStorage from "@/hooks/useLocalStorage";
import clsx from "clsx";
import {
  Blocks,
  CookingPot,
  House,
  LogOut,
  Menu,
  Users,
  LandPlot,
} from "lucide-react";
import { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const { removeLocalStorage } = useLocalStorage();

  const menus = useMemo(
    () => [
      {
        label: "Trang chủ",
        icon: <House width={24} height={24} />,
        link: "/",
      },
      {
        label: "Danh mục",
        icon: <Menu width={24} height={24} />,
        link: "/categories",
      },
      {
        label: "Nguyên liệu",
        icon: <Blocks width={24} height={24} />,
        link: "/ingredients",
      },
      {
        label: "Nhân viên",
        icon: <Users width={24} height={24} />,
        link: "/staffs",
      },
      {
        label: "Khu vực",
        icon: <LandPlot width={24} height={24} />,
        link: "/areas",
      },
      {
        label: "Công thức",
        icon: <CookingPot width={24} height={24} />,
        link: "/recipes",
      },
    ],
    []
  );

  const onLogout = () => {
    removeLocalStorage();
    navigate("/login");
  };

  return (
    <div className="bg-gray-1 border-r border-gray-200 w-64 min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-5 flex flex-col items-start justify-between">
      <div className="flex flex-col items-start w-full gap-3">
        {menus.map((item, index) => (
          <NavLink
            key={`menu-item-${index}`}
            className={({ isActive }) =>
              clsx(
                "flex items-center w-full h-12 gap-3 px-4 duration-300 rounded-md shadow outline-none",
                {
                  "bg-white text-brown-1 hover:bg-[#e9ecef]": !isActive,
                  "bg-brown-1 text-white": isActive,
                }
              )
            }
            to={item.link}
          >
            {item.icon}
            <span className="text-base font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <button
        onClick={onLogout}
        type="button"
        className="flex items-center w-full h-12 gap-3 px-4 bg-white rounded-md shadow text-brown-1 hover:bg-[#e9ecef] outline-none duration-300"
      >
        <LogOut width={24} height={24} />
        <span className="text-base font-medium">Đăng xuất</span>
      </button>
    </div>
  );
};

export default Sidebar;
