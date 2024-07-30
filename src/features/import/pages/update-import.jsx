import importApi from "@/api/importApi";
import ingredientApi from "@/api/ingredientApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useConfirmModal from "@/hooks/useConfirmModal";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import { ArrowLeft, Pencil, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddIngredientModal from "../modals/add-ingredient-modal";
import UpdateIngredientModal from "../modals/update-ingredient-modal";

const UpdateImport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const { id } = useParams();
  const showConfirmModal = useConfirmModal();

  const [ingredients, setIngredients] = useState([]);
  const [importDetail, setImportDetail] = useState(undefined);
  const [isShowAddIngredientModal, setIsShowAddIngredientModal] =
    useState(false);
  const [selectedRecordForUpdate, setSelectedRecordForUpdate] = useState(null);

  const ingredientOptions = useMemo(
    () =>
      ingredients.map((i) => ({
        label: i.name,
        value: i.id,
      })),
    [ingredients]
  );

  const selectedIngredients = useMemo(
    () => importDetail?.importDetails?.map((item) => item.ingredient.id) ?? [],
    [importDetail]
  );

  const [pendingGetIngredient, getAllIngredients] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await ingredientApi.getAllIngredients({
        page: 0,
        size: 9999,
      });
      if (ok && body) {
        setIngredients(body);
      }
    }, [])
  );

  const [pendingGetImportById, getImportById] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body, error } = await importApi.getImportById(id);
      if (ok && body) {
        setImportDetail(body);
      }
      if (error) {
        handleResponseError(error, () => navigate("/import"));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, handleResponseError])
  );

  const [pendingUpdate, updateImportDetail] = useHandleAsyncRequest(
    useCallback(
      async (importDetailId) => {
        const { ok, errors } = await importApi.updateImportDetail({
          importDetailId,
          quantity: 0,
        });
        if (ok) {
          handleResponseSuccess("Cập nhật thôgn tin nhập hàng thành công", () =>
            getImportById()
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleResponseSuccess, handleResponseError, id, getImportById]
    )
  );

  const onConfirmDelete = useCallback(
    (record) => {
      showConfirmModal({
        message: `Bạn có chắc chắn muốn xóa ${record.ingredient.name} không?`,
        onOk: () => updateImportDetail(record.id),
      });
    },
    [showConfirmModal, updateImportDetail]
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "ingredient",
        title: <TableHeaderColumn label="Tên nguyên liệu" />,
        render: (ingredient) => <TableDataColumn label={ingredient.name} />,
      },
      {
        dataIndex: "ingredient",
        title: <TableHeaderColumn label="Giá" />,
        render: (ingredient) => (
          <NumericFormat
            value={ingredient.price}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
            suffix="₫"
          />
        ),
      },
      {
        dataIndex: "quantity",
        title: <TableHeaderColumn label="Số lượng" />,
        render: (quantity, record) => (
          <NumericFormat
            value={quantity}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
            suffix={` ${record.ingredient.unit}`}
          />
        ),
      },
      {
        dataIndex: "totalPrice",
        title: <TableHeaderColumn label="Tổng tiền" />,
        render: (totalPrice) => (
          <NumericFormat
            value={totalPrice}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
            suffix="₫"
          />
        ),
      },
      {
        title: <TableHeaderColumn label="Thao tác" />,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => setSelectedRecordForUpdate(record)}
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => onConfirmDelete(record)}
              danger
            />
          </div>
        ),
      },
    ],
    [onConfirmDelete]
  );

  const onCloseModal = useCallback(
    (type, reload = false) => {
      switch (type) {
        case "add":
          setIsShowAddIngredientModal(false);
          break;
        case "update":
          setSelectedRecordForUpdate(null);
          break;
        default:
          break;
      }

      if (reload) {
        getImportById();
      }
    },
    [getImportById]
  );

  useEffect(() => {
    getImportById();
  }, [getImportById]);

  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

  useEffect(() => {
    dispatch(pendingGetIngredient ? incrementLoading() : decrementLoading());
    dispatch(pendingUpdate ? incrementLoading() : decrementLoading());
    dispatch(pendingGetImportById ? incrementLoading() : decrementLoading());
  }, [dispatch, pendingGetIngredient, pendingUpdate, pendingGetImportById]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Cập nhật phiếu nhập hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/import")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start w-full p-5 bg-white rounded-md ">
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex items-center justify-between col-span-2">
            <h3 className="text-lg font-medium underline">
              Thông tin nhập hàng
            </h3>
          </div>
          <div className="grid grid-cols-3 col-span-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">ID:</span>
              <span className="text-base">{importDetail?.id ?? "--"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Tổng tiền:</span>
              <NumericFormat
                value={importDetail?.totalPrice ?? 0}
                thousandSeparator=","
                displayType="text"
                className="text-base font-exo-2"
                suffix="₫"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Nhân viên:</span>
              <span className="text-base">{`${
                importDetail?.user?.firstName ?? ""
              } ${importDetail?.user?.lastName ?? ""}`}</span>
            </div>
          </div>

          <div className="flex items-center justify-between col-span-2">
            <h3 className="text-lg font-medium underline">
              Danh sách nguyên liệu nhập
            </h3>
            <Button
              type="primary"
              icon={<Plus size={24} />}
              className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
              onClick={() => setIsShowAddIngredientModal(true)}
            >
              Thêm nguyên liệu
            </Button>
          </div>
          <div className="col-span-2 mt-2">
            <Table
              columns={columns}
              data={importDetail?.importDetails ?? []}
              total={importDetail?.importDetails?.length ?? 0}
              isShowPagination={false}
              onPageChange={() => {}}
              page={1}
            />
          </div>
        </div>
      </div>

      <AddIngredientModal
        isOpen={isShowAddIngredientModal}
        onClose={onCloseModal}
        ingredientOptions={ingredientOptions}
        importId={id ?? -1}
        selectedIngredients={selectedIngredients}
      />
      <UpdateIngredientModal
        detail={selectedRecordForUpdate}
        onClose={onCloseModal}
        ingredientOptions={ingredientOptions}
      />
    </div>
  );
};

export default UpdateImport;
