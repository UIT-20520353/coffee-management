import orderApi from "@/api/orderApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { StatusColorMapper, StatusMapper } from "@/mappers/order";
import { Button, DatePicker, Tag } from "antd";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [filter, setFilter] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [orderList, setOrderList] = useState({ total: 0, items: [] });

  const onGet = useCallback(async (page, filter) => {
    const { ok, body, total } = await orderApi.getAllOrders({
      size: 10,
      page: page - 1,
      sort: "id,asc",
      "startDate.greaterThanOrEqual": filter.startDate
        ? filter.startDate.toISOString()
        : null,
      "endDate.lessThanOrEqual": filter.endDate
        ? filter.endDate.toISOString()
        : null,
    });
    if (ok && body) {
      setOrderList({ items: body, total: total ?? 0 });
    }
  }, []);
  const [pendingOrders, getAllOrders] = useHandleAsyncRequest(onGet);

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
        dataIndex: "table",
        title: <TableHeaderColumn label="Bàn" />,
        render: (table) => (
          <TableDataColumn
            label={table ? `${table.name} - ${table.area.name}` : "--"}
          />
        ),
      },
      {
        dataIndex: "userIn",
        title: <TableHeaderColumn label="Nhân viên nhận đơn" />,
        render: (userIn) => (
          <TableDataColumn
            label={userIn ? `${userIn.firstName} ${userIn.lastName}` : "--"}
          />
        ),
      },
      {
        dataIndex: "userOut",
        title: <TableHeaderColumn label="Nhân viên thanh toán" />,
        render: (userOut) => (
          <TableDataColumn
            label={userOut ? `${userOut.firstName} ${userOut.lastName}` : "--"}
          />
        ),
      },
      {
        dataIndex: "timeIn",
        title: <TableHeaderColumn label="Thời gian gọi" />,
        render: (timeIn) => (
          <TableDataColumn
            label={timeIn ? dayjs(timeIn).format("DD/MM/YYYY HH:MM") : "--"}
          />
        ),
      },
      {
        dataIndex: "timeOut",
        title: <TableHeaderColumn label="Thời gian thanh toán" />,
        render: (timeOut) => (
          <TableDataColumn
            label={timeOut ? dayjs(timeOut).format("DD/MM/YYYY HH:MM") : "--"}
          />
        ),
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
        title: <TableHeaderColumn label="Thao tác" />,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Eye size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => navigate(`/orders/${record.id}`)}
            />
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    getAllOrders(pagination.page, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, getAllOrders]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Đơn hàng</h3>
      </div>

      <div className="grid w-full grid-cols-3 gap-5 mb-5">
        <div className="flex flex-col items-start col-span-1 gap-2">
          <span>Ngày bắt đầu</span>
          <DatePicker
            className="w-full h-10 text-base"
            minDate={dayjs()}
            maxDate={filter.endDate || undefined}
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày bắt đầu"
            value={filter.startDate}
            onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e }))}
            showTime
          />
        </div>
        <div className="flex flex-col items-start col-span-1 gap-2">
          <span>Ngày kết thúc</span>
          <DatePicker
            className="w-full h-10 text-base"
            minDate={filter.startDate || dayjs()}
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày kết thúc"
            value={filter.endDate}
            onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e }))}
            showTime
          />
        </div>
        <div className="flex items-end col-span-1 gap-3">
          <Button
            type="primary"
            className="w-1/3 h-10 text-base font-exo-2"
            onClick={() => setPagination({ page: 1 })}
          >
            Tìm kiếm
          </Button>
          <Button
            className="w-1/3 h-10 text-base font-exo-2"
            onClick={() => {
              setFilter({ name: "" });
              setPagination({ page: 1 });
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingOrders}
        data={orderList.items}
        total={orderList.total}
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

export default OrderManagement;
