import { Button } from "antd";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import areaApi from "@/api/areaApi";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { useDispatch } from "react-redux";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";

const AreaManagement = () => {
  const dispatch = useDispatch();

  const [areas, setAreas] = useState([]);

  const onGet = useCallback(async () => {
    const { ok, body } = await areaApi.getAllAreas();
    if (ok && body) {
      setAreas(body);
    }
  }, []);

  const [pendingGet, getAllAreas] = useHandleAsyncRequest(onGet);

  useEffect(() => {
    getAllAreas();
  }, [getAllAreas]);

  useEffect(() => {
    dispatch(pendingGet ? incrementLoading() : decrementLoading());
  }, [pendingGet, dispatch]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách khu vực</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
          >
            Thêm khu vực
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-4 gap-5">
        {areas.map((area) => (
          <button
            key={`area-${area.id}`}
            className="flex items-center justify-center h-40 col-span-1 text-base font-medium bg-white rounded-md shadow"
          >
            {area.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AreaManagement;
