import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();
  const { getLocalStorage } = useLocalStorage();

  useEffect(() => {
    const accessToken = getLocalStorage();
    if (!accessToken) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocalStorage]);

  return (
    <div className="w-full">
      <Header />
      <div className="flex items-start w-full">
        <Sidebar />
        <div className="w-full min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] main-content bg-[#e9ecef]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
