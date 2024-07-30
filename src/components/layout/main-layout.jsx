import authApi from "@/api/authApi";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  decrementLoading,
  incrementLoading,
  setProfile,
} from "@/redux/globalSlice";
import { Loader } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { ERole } from "@/enums/staff";
import useHandleResponseError from "@/hooks/useHandleResponseError";

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getLocalStorage, removeLocalStorage } = useLocalStorage();
  const handleResponseError = useHandleResponseError();
  const { loading } = useSelector((state) => state.global);

  const [pendingGetProfile, getProfile] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body, error } = await authApi.getProfile();
      if (ok && body) {
        if (body.role !== ERole.ADMIN) {
          handleResponseError({ detail: "error.access-denied" }, () => {
            removeLocalStorage();
            navigate("/login");
          });
        } else dispatch(setProfile(body));
      }

      if (error) {
        removeLocalStorage();
        navigate("/login");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeLocalStorage, dispatch, handleResponseError])
  );

  useEffect(() => {
    const accessToken = getLocalStorage();
    if (!accessToken) {
      navigate("/login");
    } else {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocalStorage, getProfile]);

  useEffect(() => {
    dispatch(pendingGetProfile ? incrementLoading() : decrementLoading());
  }, [pendingGetProfile, dispatch]);

  return (
    <div className="relative w-full">
      <Header />
      <div className="flex items-start w-full">
        <Sidebar />
        <div className="w-full min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] main-content bg-[#e9ecef]">
          <Outlet />
        </div>
      </div>

      {!!loading && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-screen bg-black z-1000 opacity-60">
          <Loader className="text-white animate-spin" size={52} />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
