import staffApi from "@/api/staffApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { RoleMapper, StatusColorMapper, StatusMapper } from "@/mappers/staff";
import { Button, Input, Tag } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const ImportManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [ingredientList, setIngredientList] = useState({ total: 0, items: [] });

  const onGet = useCallback(async (page) => {
    const { ok, body, total } = await staffApi.getAllStaffs({
      size: 10,
      page: page - 1,
      sort: "id,asc",
    });
    if (ok && body) {
      setIngredientList({ items: body, total: total ?? 0 });
    }
  }, []);
  const [pendingIngredients, getAllIngredients] = useHandleAsyncRequest(onGet);

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
        dataIndex: "email",
        title: <TableHeaderColumn label="Email" />,
        render: (email) => <TableDataColumn label={email} />,
      },
      {
        title: <TableHeaderColumn label="Họ tên" />,
        render: (_, record) => (
          <TableDataColumn label={`${record.firstName} ${record.lastName}`} />
        ),
      },
      {
        dataIndex: "phone",
        title: <TableHeaderColumn label="Số điện thoại" />,
        render: (phone) => <TableDataColumn label={phone} />,
      },
      {
        dataIndex: "status",
        title: <TableHeaderColumn label="Trạng thái" />,
        render: (status) => (
          <Tag
            bordered={false}
            color={StatusColorMapper[status]}
            className="text-sm font-exo-2"
          >
            {StatusMapper[status]}
          </Tag>
        ),
      },
      {
        dataIndex: "salary",
        title: <TableHeaderColumn label="Lương" />,
        render: (salary) => (
          <NumericFormat
            value={salary}
            thousandSeparator=","
            displayType="text"
            className="font-exo-2"
          />
        ),
      },
      {
        dataIndex: "role",
        title: <TableHeaderColumn label="Chức vụ" />,
        render: (role) => <TableDataColumn label={RoleMapper[role]} />,
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
              onClick={() => navigate(`/staffs/${record.id}`)}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getAllIngredients(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllIngredients]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách nhập hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/import/create")}
          >
            Nhập hàng
          </Button>
        </div>
      </div>

      {/* <Table
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
      /> */}
    </div>
  );
};

export default ImportManagement;
