import { Outlet, useNavigate } from "react-router-dom";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect } from "react";

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
      <Outlet />
    </div>
  );
};

export default MainLayout;
