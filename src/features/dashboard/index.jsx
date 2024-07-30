import dashboardApi from "@/api/dashboardApi";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Column } from "@ant-design/plots";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

const data = [
  {
    ingredientId: 3,
    ingredientName: "Coca cola",
    price: 12000,
    quantity: 18,
  },
  {
    ingredientId: 2,
    ingredientName: "Trân châu đường đen",
    price: 53000,
    quantity: 84,
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();

  const [pnc, setPnc] = useState([]);
  const [totalIngredient, setTotalIngredient] = useState([]);

  const config = {
    totalIngredient,
    xField: "ingredientName",
    yField: "quantity",
    label: {
      text: () => "",
      offset: 10,
    },
    legend: false,
    height: 300,
  };

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

  console.log(totalIngredient);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {totalIngredient.length !== 0 && (
        <div>
          <Column {...config} />
        </div>
      )}
      <p className="text-lg font-medium text-brown-1">Thống kê doanh thu</p>
    </div>
  );
};

export default Dashboard;
