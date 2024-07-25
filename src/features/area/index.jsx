import areaApi from "@/api/areaApi";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Plus, Pencil, Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CreateAreaModal from "./modals/create-area-modal";
import UpdateAreaModal from "./modals/update-area-modal";
import { useNavigate } from "react-router-dom";

const AreaManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [selectedAreaForUpdate, setSelectedAreaForUpdate] = useState(undefined);

  const onGet = useCallback(async () => {
    const { ok, body } = await areaApi.getAllAreas();
    if (ok && body) {
      setAreas(body);
    }
  }, []);

  const [pendingGet, getAllAreas] = useHandleAsyncRequest(onGet);

  const onCloseModal = useCallback(
    (type, isReload = false) => {
      switch (type) {
        case "create":
          setShowCreateModal(false);
          break;
        case "update":
          setSelectedAreaForUpdate(undefined);
          break;
        default:
          break;
      }
      if (isReload) {
        getAllAreas();
      }
    },
    [getAllAreas]
  );

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
      </div>

      <div className="grid w-full grid-cols-4 gap-5">
        <button
          className="flex items-center justify-center h-40 col-span-1 gap-2 text-base font-medium duration-300 border-2 border-gray-600 border-dashed rounded-md shadow active:scale-90 hover:bg-gray-200"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Thêm bàn
        </button>
        {areas.map((area) => (
          <div
            key={`area-${area.id}`}
            className="relative flex flex-col items-center justify-center h-40 col-span-1 text-base font-medium duration-300 bg-white rounded-md shadow group"
          >
            <span className="text-base font-semibold">{area.name}</span>
            <span className="text-sm font-normal">{`Số bàn: ${area.tables.length}`}</span>
            <div className="absolute duration-300 top-0 left-0 items-center justify-center hidden w-full h-full gap-3 rounded-md group-hover:bg-[rgba(0,0,0,0.4)] group-hover:flex">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md"
                onClick={() => setSelectedAreaForUpdate(area)}
              >
                <Pencil size={20} color="#fff" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md"
                onClick={() => navigate(`/areas/${area.id}`)}
              >
                <Eye size={20} color="#fff" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateAreaModal isOpen={isShowCreateModal} onClose={onCloseModal} />
      <UpdateAreaModal
        isOpen={!!selectedAreaForUpdate}
        onClose={onCloseModal}
        area={selectedAreaForUpdate}
      />
    </div>
  );
};

export default AreaManagement;
