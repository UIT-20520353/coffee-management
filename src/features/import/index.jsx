import importApi from "@/api/importApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { Button } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const ImportManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [importList, setImportList] = useState({ total: 0, items: [] });

  const onGet = useCallback(async (page) => {
    const { ok, body, total } = await importApi.getAllImports({
      size: 10,
      page: page - 1,
      sort: "id,asc",
    });
    if (ok && body) {
      setImportList({ items: body, total: total ?? 0 });
    }
  }, []);
  const [pendingImportList, getAllImportList] = useHandleAsyncRequest(onGet);

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
        dataIndex: "user",
        title: <TableHeaderColumn label="Nhân viên nhập" />,
        render: (user) => (
          <TableDataColumn label={`${user.firstName} ${user.lastName}`} />
        ),
      },
      {
        dataIndex: "importDetails",
        title: <TableHeaderColumn label="Nguyên liệu" />,
        render: (importDetails) => (
          <TableDataColumn
            label={
              importDetails.length
                ? importDetails.map((item) => item.ingredient.name).join(", ")
                : "--"
            }
          />
        ),
        width: "50%",
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
              onClick={() => navigate(`/import/${record.id}`)}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getAllImportList(pagination.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllImportList]);

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

      <Table
        columns={columns}
        loading={pendingImportList}
        data={importList.items}
        total={importList.total}
        onPageChange={onPageChange}
        page={pagination.page}
        rowClassName={(record) => {
          if (record.quantity === 0) return "row-danger";
          if (record.quantity < record.warningLimits) return "row-warning";
        }}
      />
    </div>
  );
};

export default ImportManagement;
