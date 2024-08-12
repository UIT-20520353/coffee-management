import dashboardApi from "@/api/dashboardApi";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { DatePicker, Empty, Table } from "antd";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    startDate: undefined,
    endDate: undefined,
  });
  const [pnc, setPnc] = useState([]);
  const [totalIngredient, setTotalIngredient] = useState([]);

  const columns = useMemo(
    () => [
      {
        dataIndex: "ingredientId",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "ingredientName",
        title: <TableHeaderColumn label="Tên nguyên liệu" />,
        render: (name) => <TableDataColumn label={name} />,
      },
      {
        dataIndex: "price",
        title: <TableHeaderColumn label="Giá nhập" />,
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
    ],
    []
  );

  const [pendingGetOrderPnc, getOrderPnc] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await dashboardApi.getOrderPnc({
        startDate: filter.startDate ? filter.startDate.toISOString() : null,
        endDate: filter.endDate ? filter.endDate.toISOString() : null,
      });
      if (ok && body) {
        setPnc(body);
      }
    }, [filter])
  );
  const [pendingGetTotalIngredient, getTotalIngredient] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await dashboardApi.getTotalIngredient();
      if (ok && body) {
        setTotalIngredient(body);
      }
    }, [])
  );

  const donutConfig = useMemo(
    () => ({
      series: totalIngredient.map((i) => i.quantity),
      options: {
        labels: totalIngredient.map((i) => i.ingredientName),
        dataLabels: {
          formatter: (value) => `${BigNumber(value).toFixed(2)}%`,
        },
      },
    }),
    [totalIngredient]
  );

  const lineConfig = useMemo(
    () => ({
      options: {
        xaxis: {
          categories: pnc.map((record) =>
            dayjs(record.date).format("DD/MM/YYYY")
          ),
        },
      },
      series: [
        {
          name: "Thu nhập",
          data: pnc.map((record) => record.profit),
        },
        {
          name: "Chi phí",
          data: pnc.map((record) => record.cost),
        },
      ],
    }),
    [pnc]
  );

  useEffect(() => {
    getTotalIngredient();
  }, [getTotalIngredient]);

  useEffect(() => {
    getOrderPnc();
  }, [getOrderPnc]);

  useEffect(() => {
    dispatch(pendingGetOrderPnc ? incrementLoading() : decrementLoading());
    dispatch(
      pendingGetTotalIngredient ? incrementLoading() : decrementLoading()
    );
  }, [dispatch, pendingGetTotalIngredient, pendingGetOrderPnc]);

  return (
    <div className="w-full flex flex-col items-start min-h-[80vh] p-5 gap-y-5">
      <div className="flex flex-col items-center justify-center w-full gap-3 p-5 bg-white rounded-md shadow h-fit">
        <div className="w-full">
          <p className="text-2xl font-bold text-brown-1">Thống kê thu nhập</p>
        </div>
        <div className="grid w-full grid-cols-3 gap-5 mb-5">
          <div className="flex flex-col items-start col-span-1 gap-2">
            <span>Ngày bắt đầu</span>
            <DatePicker
              maxDate={filter.endDate || undefined}
              className="w-full h-10 text-base"
              format="DD/MM/YYYY"
              placeholder="Chọn ngày bắt đầu"
              value={filter.startDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, startDate: e }))}
            />
          </div>
          <div className="flex flex-col items-start col-span-1 gap-2">
            <span>Ngày kết thúc</span>
            <DatePicker
              className="w-full h-10 text-base"
              minDate={filter.startDate}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày kết thúc"
              value={filter.endDate}
              onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e }))}
            />
          </div>
        </div>
        <Chart
          options={lineConfig.options}
          series={lineConfig.series}
          type="line"
          width={850}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-3 p-5 bg-white rounded-md shadow h-fit">
        <div className="w-full">
          <p className="text-2xl font-bold text-brown-1">
            Thống kê nguyên liệu nhập
          </p>
        </div>
        {totalIngredient.length !== 0 && (
          <Chart
            options={donutConfig.options}
            series={donutConfig.series}
            type="donut"
            width={500}
          />
        )}
        <div className="flex flex-col items-start w-full">
          <Table
            className="w-full custom-table"
            columns={columns}
            dataSource={totalIngredient}
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  description={
                    <span className="text-base font-exo-2">
                      Không có dữ liệu
                    </span>
                  }
                />
              ),
            }}
            scroll={{ y: totalIngredient.length > 7 ? 400 : undefined }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
