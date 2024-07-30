import orderApi from "@/api/orderApi";
import { EStatus } from "@/enums/table";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import { StatusMapper } from "@/mappers/table";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleResponseError = useHandleResponseError();

  const [order, setOrder] = useState(undefined);

  const [pendingGet, getOrderDetail] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body, errors } = await orderApi.getOrderDetail(id);
      if (ok && body) {
        setOrder(body);
      }
      if (errors) {
        handleResponseError(errors, () => navigate("/orders"));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, handleResponseError])
  );

  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail]);

  useEffect(() => {
    dispatch(pendingGet ? incrementLoading() : decrementLoading());
  }, [pendingGet, dispatch]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Chi tiết đơn hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/orders")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-2 p-5 bg-white rounded-md">
        <h3 className="text-lg font-medium underline">Thông tin khu vực</h3>
        <div className="grid w-full grid-cols-3 gap-3">
          <p className="text-base">
            <span className="font-semibold">ID: </span>
            {order?.table?.area?.id || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Tên khu vực: </span>
            {order?.table?.area?.name || "--"}
          </p>
        </div>
        <h3 className="text-lg font-medium underline">Thông tin bàn</h3>
        <div className="grid w-full grid-cols-3 gap-3">
          <p className="text-base">
            <span className="font-semibold">ID: </span>
            {order?.table?.id || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Tên bàn: </span>
            {order?.table?.name || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Số ghế: </span>
            {order?.table?.seat || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Tình trạng: </span>
            {StatusMapper[order?.table?.status || EStatus.ACTIVE]}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start w-full gap-2 p-5 mt-5 bg-white rounded-md">
        <h3 className="text-lg font-medium underline">Nhân viên nhận đơn</h3>
        <div className="grid w-full grid-cols-3 gap-3">
          <p className="text-base">
            <span className="font-semibold">ID: </span>
            {order?.userIn?.id || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Họ tên: </span>
            {order?.userIn
              ? `${order.userIn.firstName} ${order.userIn.lastName}`
              : "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Thời gian nhận đơn: </span>
            {order?.timeIn
              ? dayjs(order.timeIn).format("DD/MM/YYYY HH:MM")
              : "--"}
          </p>
        </div>

        <h3 className="text-lg font-medium underline">Nhân viên thanh toán</h3>
        <div className="grid w-full grid-cols-3 gap-3">
          <p className="text-base">
            <span className="font-semibold">ID: </span>
            {order?.userOut?.id || "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Họ tên: </span>
            {order?.userOut
              ? `${order.userOut.firstName} ${order.userOut.lastName}`
              : "--"}
          </p>
          <p className="text-base">
            <span className="font-semibold">Thời gian thanh toán: </span>
            {order?.timeOut
              ? dayjs(order.timeOut).format("DD/MM/YYYY HH:MM")
              : "--"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-start w-full gap-2 p-5 mt-5 bg-white rounded-md">
        <h3 className="text-lg font-medium underline">Thông tin đơn hàng</h3>
        {order?.orderDetails?.map((orderDetail, index) => (
          <div
            className={clsx("grid w-full grid-cols-3 gap-3", {
              "border-t pt-3 mt-3 border-gray-300": !!index,
            })}
            key={`order-detail-${index}`}
          >
            <p className="text-base">
              <span className="font-semibold">Tên món: </span>
              {orderDetail.productDto.name}
            </p>
            <p className="text-base">
              <span className="font-semibold">Số lượng: </span>
              {orderDetail.quantity}
            </p>
            <p className="text-base">
              <span className="font-semibold">Danh mục: </span>
              {orderDetail.productDto.category.name}
            </p>
            <p className="text-base">
              <span className="font-semibold">Giá vốn: </span>
              <NumericFormat
                displayType="text"
                value={orderDetail.cost}
                suffix="₫"
                thousandSeparator=","
              />
            </p>
            <p className="text-base">
              <span className="font-semibold">Tổng tiền: </span>
              <NumericFormat
                displayType="text"
                value={orderDetail.totalPrice}
                suffix="₫"
                thousandSeparator=","
              />
            </p>
            <p className="text-base">
              <span className="font-semibold">Giảm giá: </span>
              <NumericFormat
                displayType="text"
                value={orderDetail.discount}
                suffix="₫"
                thousandSeparator=","
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
