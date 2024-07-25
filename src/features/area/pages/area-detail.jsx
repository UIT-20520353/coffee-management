import areaApi from "@/api/areaApi";
import useConfirmModal from "@/hooks/useConfirmModal";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import { StatusColorMapper, StatusMapper } from "@/mappers/table";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import clsx from "clsx";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CreateTableModal from "../modals/create-table-modal";
import UpdateAreaModal from "../modals/update-area-modal";
import UpdateTableModal from "../modals/update-table-modal";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";

const AreaDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const showConfirmModal = useConfirmModal();

  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [isShowUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTableForUpdate, setSelectedTableForUpdate] =
    useState(undefined);
  const [area, setArea] = useState({
    id: 0,
    name: "",
    tables: [],
  });

  const onGet = useCallback(async () => {
    const { ok, body, errors } = await areaApi.getAreaById(id);
    if (ok && body) {
      setArea(body);
    }
    if (errors) {
      handleResponseError(errors);
    }
  }, [handleResponseError, id]);
  const [pendingGet, getAreaById] = useHandleAsyncRequest(onGet);

  const onDelete = useCallback(
    async (tableId) => {
      const { ok, errors } = await areaApi.deleteTable(tableId);
      if (ok) {
        handleResponseSuccess("Xóa bàn thành công", () => getAreaById());
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [handleResponseError, getAreaById, handleResponseSuccess]
  );
  const [pendingDelete, deleteTableById] = useHandleAsyncRequest(onDelete);

  const onCloseModal = useCallback(
    (type, isReload = false) => {
      switch (type) {
        case "create":
          setShowCreateModal(false);
          break;
        case "update":
          setShowUpdateModal(false);
          break;
        case "update-table":
          setSelectedTableForUpdate(false);
          break;
        default:
          break;
      }
      if (isReload) {
        getAreaById();
      }
    },
    [getAreaById]
  );

  const onConfirmDelete = useCallback(
    (table) => {
      showConfirmModal({
        message: `Bạn có chắc chắn muốn xóa bàn ${table.name} không?`,
        onOk: () => deleteTableById(table.id),
      });
    },
    [showConfirmModal, deleteTableById]
  );

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      handleResponseError({ detail: "Khu vực không tồn tại" }, () =>
        navigate("/areas")
      );
    } else {
      getAreaById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handleResponseError]);

  useEffect(() => {
    const isLoading = pendingGet || pendingDelete;
    dispatch(isLoading ? incrementLoading() : decrementLoading());
  }, [pendingGet, dispatch, pendingDelete]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-1">
          <h3 className="text-xl font-semibold">{area.name}</h3>
          <Button
            icon={<Pencil size={14} />}
            type="text"
            onClick={() => setShowUpdateModal(true)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/areas")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-4 gap-5">
        <button
          className="flex items-center justify-center h-40 col-span-1 gap-2 text-base font-medium duration-300 border-2 border-gray-600 border-dashed rounded-md shadow active:scale-90 hover:bg-gray-200"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Thêm bàn
        </button>
        {area.tables.map((table) => (
          <div
            key={`table-${table.id}`}
            className={clsx(
              "relative flex flex-col items-center justify-center h-40 col-span-1 text-base font-medium text-white duration-300 rounded-md shadow group",
              StatusColorMapper[table.status]
            )}
          >
            <span className="text-base font-semibold">{table.name}</span>
            <span className="text-sm font-normal">{`Số ghế: ${table.seat}`}</span>
            <span className="text-sm font-normal">{`Trạng thái: ${
              StatusMapper[table.status]
            }`}</span>
            <div className="absolute duration-300 top-0 left-0 items-center justify-center hidden w-full h-full gap-3 rounded-md group-hover:bg-[rgba(0,0,0,0.4)] group-hover:flex">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-md"
                onClick={() => setSelectedTableForUpdate(table)}
              >
                <Pencil size={20} color="#fff" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-md"
                onClick={() => onConfirmDelete(table)}
              >
                <Trash2 size={20} color="#fff" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <UpdateAreaModal
        isOpen={isShowUpdateModal}
        onClose={onCloseModal}
        area={area}
      />
      <CreateTableModal
        isOpen={isShowCreateModal}
        onClose={onCloseModal}
        areaId={area.id}
      />
      <UpdateTableModal
        table={selectedTableForUpdate}
        isOpen={!!selectedTableForUpdate}
        onClose={onCloseModal}
        areaId={area.id}
      />
    </div>
  );
};

export default AreaDetail;
