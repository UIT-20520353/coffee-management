import dashboardApi from "@/api/dashboardApi";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Empty, Table } from "antd";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

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

  const [pendingGetOrderPnc, getAllIngredients] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await dashboardApi.getOrderPnc();
      if (ok && body) {
        setPnc(body);
      }
    }, [])
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
      labels: totalIngredient.map((i) => i.ingredientName),
    }),
    [totalIngredient]
  );

  useEffect(() => {
    getAllIngredients();
    getTotalIngredient();
  }, [getAllIngredients, getTotalIngredient]);

  useEffect(() => {
    dispatch(pendingGetOrderPnc ? incrementLoading() : decrementLoading());
    dispatch(
      pendingGetTotalIngredient ? incrementLoading() : decrementLoading()
    );
  }, [dispatch, pendingGetTotalIngredient, pendingGetOrderPnc]);

  return (
    <div className="w-full flex flex-col items-start min-h-[80vh] p-5">
      <div className="flex flex-col items-center justify-center w-full gap-3 p-5 bg-white rounded-md shadow h-fit">
        <div className="w-full">
          <p className="text-2xl font-bold text-brown-1">
            Thống kê nguyên liệu nhập
          </p>
        </div>
        <Chart
          options={{
            labels: donutConfig.labels,
            dataLabels: {
              formatter: (value) => `${BigNumber(value).toFixed(2)}%`,
            },
          }}
          series={donutConfig.series}
          type="donut"
          width={500}
        />
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
