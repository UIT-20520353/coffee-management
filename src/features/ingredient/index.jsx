import TableHeaderColumn from "@/components/common/table-header-column";
import { Button, Empty, Table } from "antd";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { NumericFormat } from "react-number-format";

const IngredientManagement = () => {
  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
      },
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên nguyên liệu" />,
      },
      {
        dataIndex: "unit",
        title: <TableHeaderColumn label="Đơn vị" />,
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
        title: <TableHeaderColumn label="Thao tác" />,
        render: () => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash2 size={20} />}
              className="min-w-[44px] min-h-[44px]"
              danger
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách nguyên liệu</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
          >
            Nhập nguyên liệu
          </Button>
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
          >
            Thêm nguyên liệu
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={[
          { id: 1, name: "Chanh dây", unit: "Quả", quantity: 10, price: 10000 },
          {
            id: 2,
            name: "Coca cola",
            unit: "Chai",
            quantity: 100,
            price: 14000,
          },
        ]}
        locale={{
          emptyText: (
            <Empty
              description={
                <span className="text-base font-exo-2">Không có dữ liệu</span>
              }
            />
          ),
        }}
      />
    </div>
  );
};

export default IngredientManagement;
