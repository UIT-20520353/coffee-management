import ingredientApi from "@/api/ingredientApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { Button, Input, Tooltip } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import CreateIngredientModal from "./modals/create-ingredient-modal";
import ImportIngredientModal from "./modals/import-ingredient-modal";
import UpdateIngredientModal from "./modals/update-ingredient-modal";

const IngredientManagement = () => {
  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [filter, setFilter] = useState({ name: "" });
  const [ingredientList, setIngredientList] = useState({ total: 0, items: [] });
  const [selectedIngredientForImport, setSelectedIngredientForImport] =
    useState(undefined);
  const [selectedIngredientForUpdate, setSelectedIngredientForUpdate] =
    useState(undefined);

  const onGet = useCallback(async (page, filter) => {
    const { ok, body, total } = await ingredientApi.getAllIngredients({
      size: 10,
      page: page - 1,
      sort: "id,asc",
      "name.contains": filter.name || null,
    });
    if (ok && body) {
      setIngredientList({ items: body, total: total ?? 0 });
    }
  }, []);
  const [pendingIngredients, getAllIngredients] = useHandleAsyncRequest(onGet);

  const onCloseModal = useCallback((type, isReload = false) => {
    switch (type) {
      case "create":
        setShowCreateModal(false);
        break;
      case "import":
        setSelectedIngredientForImport(undefined);
        break;
      case "update":
        setSelectedIngredientForUpdate(undefined);
        break;
      default:
        break;
    }
    if (isReload) {
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, []);

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên nguyên liệu" />,
        render: (name) => <TableDataColumn label={name} />,
      },
      {
        dataIndex: "unit",
        title: <TableHeaderColumn label="Đơn vị" />,
        render: (unit) => <TableDataColumn label={unit} />,
      },
      {
        dataIndex: "price",
        title: <TableHeaderColumn label="Đơn giá" />,
        render: (price) => (
          <NumericFormat
            value={price}
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
        render: (quantity) => (
          <NumericFormat
            value={quantity}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
          />
        ),
      },
      {
        dataIndex: "warningLimits",
        title: <TableHeaderColumn label="Số lượng cảnh báo" />,
        render: (warningLimits) => (
          <NumericFormat
            value={warningLimits}
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
            <Tooltip title="Cập nhật nguyên liệu" placement="left">
              <Button
                type="primary"
                htmlType="button"
                icon={<Pencil size={20} />}
                className="min-w-[44px] min-h-[44px]"
                onClick={() => setSelectedIngredientForUpdate(record)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    getAllIngredients(pagination.page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllIngredients]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách nguyên liệu</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => setShowCreateModal(true)}
          >
            Thêm nguyên liệu
          </Button>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-5 mb-5">
        <div className="flex flex-col items-start col-span-1 gap-2">
          <span>Tên nguyên liệu</span>
          <Input
            className="h-10 text-base font-exo-2"
            placeholder="Nhập tên nguyên liệu"
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
        loading={pendingIngredients}
        data={ingredientList.items}
        total={ingredientList.total}
        onPageChange={onPageChange}
        page={pagination.page}
        rowClassName={(record) => {
          if (record.quantity === 0) return "row-danger";
          if (record.quantity < record.warningLimits) return "row-warning";
        }}
      />

      <CreateIngredientModal
        isOpen={isShowCreateModal}
        onClose={onCloseModal}
      />
      <ImportIngredientModal
        isOpen={!!selectedIngredientForImport}
        onClose={onCloseModal}
        ingredient={selectedIngredientForImport}
      />
      <UpdateIngredientModal
        isOpen={!!selectedIngredientForUpdate}
        onClose={onCloseModal}
        ingredient={selectedIngredientForUpdate}
      />
    </div>
  );
};

export default IngredientManagement;
