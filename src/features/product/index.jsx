import productApi from "@/api/productApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useConfirmModal from "@/hooks/useConfirmModal";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Input } from "antd";
import { Pencil, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showConfirmModal = useConfirmModal();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [productList, setProductList] = useState({ items: [], total: 0 });
  const [filter, setFilter] = useState({ name: "" });

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const [pendingGetAllProducts, getAllCategories] = useHandleAsyncRequest(
    useCallback(
      async (filter) => {
        const { ok, body, total } = await productApi.getAllProducts({
          page: pagination.page - 1,
          size: 10,
          "name.contains": filter.name || null,
        });
        if (ok && body) {
          setProductList({ items: body, total });
        }
      },
      [pagination]
    )
  );

  const [pendingDelete, deleteProduct] = useHandleAsyncRequest(
    useCallback(
      async (id) => {
        const { ok, errors } = await productApi.deleteProduct(id);
        if (ok) {
          handleResponseSuccess("Xóa sản phẩm thành công", () =>
            setPagination({
              page: 1,
            })
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      [handleResponseSuccess, handleResponseError]
    )
  );

  const onDeleteProduct = useCallback(
    (record) => {
      showConfirmModal({
        message: `Bạn có chắc chắn muốn sản phẩm ${record.name} không?`,
        onOk: () => deleteProduct(record.id),
      });
    },
    [showConfirmModal, deleteProduct]
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên sản phẩm" />,
        render: (name) => <TableDataColumn label={name} />,
      },
      {
        dataIndex: "price",
        title: <TableHeaderColumn label="Giá sản phẩm" />,
        render: (price) => (
          <NumericFormat
            value={price}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
            suffix="đ"
          />
        ),
      },
      {
        dataIndex: "promotions",
        title: <TableHeaderColumn label="Số lượng mã giảm giá" />,
        render: (promotions) => (
          <NumericFormat
            value={promotions.length}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
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
              onClick={() => navigate(`/products/${record.id}`)}
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => onDeleteProduct(record)}
              danger
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteProduct]
  );

  useEffect(() => {
    getAllCategories(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllCategories]);

  useEffect(() => {
    dispatch(pendingGetAllProducts ? incrementLoading() : decrementLoading());
    dispatch(pendingDelete ? incrementLoading() : decrementLoading());
  }, [pendingGetAllProducts, dispatch, pendingDelete]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách sản phẩm</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/products/create")}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-5 mb-5">
        <div className="flex flex-col items-start col-span-1 gap-2">
          <span>Tên sản phẩm</span>
          <Input
            className="h-10 text-base font-exo-2"
            placeholder="Nhập tên sản phẩm"
            value={filter.name}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="flex items-end col-span-1 gap-3">
          <Button
            type="primary"
            className="w-1/3 h-10 text-base font-exo-2"
            onClick={() => setPagination({ page: 0 })}
          >
            Tìm kiếm
          </Button>
          <Button
            className="w-1/3 h-10 text-base font-exo-2"
            onClick={() => {
              setFilter({ name: "" });
              setPagination({ page: 0 });
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingGetAllProducts}
        data={productList.items}
        total={productList.total}
        onPageChange={onPageChange}
        page={pagination.page}
      />
    </div>
  );
};

export default ProductManagement;
