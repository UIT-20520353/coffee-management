import promotionApi from "@/api/promotionApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import { EStatus } from "@/enums/promotion";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { StatusMapper } from "@/mappers/promotion";
import { DatePicker, Form, Modal, Select } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdatePromotionModal = ({ promotion, onClose, productId }) => {
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const [form] = Form.useForm();

  const [error, setError] = useState({ percent: false });

  const [pendingUpdate, updatePromotion] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, errors } = await promotionApi.updatePromotion(
          promotion?.id,
          {
            ...data,
            percent: replaceCommaWithEmptyString(data.percent),
            productId,
          }
        );
        if (ok) {
          handleResponseSuccess(
            "Cập nhật thông tin mã giảm giá thành công",
            () => onClose("update", true)
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      [
        productId,
        handleResponseError,
        onClose,
        handleResponseSuccess,
        promotion,
      ]
    )
  );

  const handleClose = () => {
    if (pendingUpdate) return;
    onClose("update", false);
  };

  useEffect(() => {
    if (!promotion) {
      form.resetFields();
      setError({ percent: false });
    } else {
      form.setFieldsValue({
        name: promotion.name,
        percent: promotion.percent,
        status: promotion.status,
        startDate: dayjs(promotion.startDate),
        endDate: dayjs(promotion.endDate),
      });
    }
  }, [promotion, form]);

  return (
    <Modal
      open={!!promotion}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">
            Thêm mã giảm giá mới
          </span>
        </div>
      }
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full m-0"
        onFinish={updatePromotion}
      >
        <TextField
          name="name"
          label="Tên mã giảm giá"
          variant="filled"
          placeholder="Nhập tên mã giảm giá"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên mã giảm giá",
            },
          ]}
        />
        <Form.Item
          name="startDate"
          rules={[
            {
              required: true,
              message: "",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(
                    new Error("Vui lòng chọn ngày bắt đầu")
                  );
                }
                if (getFieldValue("endDate") <= value) {
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu")
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
          label={<span className="text-base">Ngày bắt đầu</span>}
          className="w-full"
        >
          <DatePicker
            className="w-full h-10 text-base"
            minDate={dayjs()}
            variant="filled"
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày bắt đầu"
            showTime
          />
        </Form.Item>
        <Form.Item
          name="endDate"
          rules={[
            {
              required: true,
              message: "",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value) {
                  return Promise.reject(
                    new Error("Vui lòng chọn ngày kết thúc")
                  );
                }
                if (getFieldValue("startDate") >= value) {
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu")
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
          label={<span className="text-base">Ngày kết thúc</span>}
          className="w-full"
        >
          <DatePicker
            className="w-full h-10 text-base"
            minDate={dayjs()}
            variant="filled"
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn ngày kết thúc"
            showTime
          />
        </Form.Item>
        <NumberField
          name="percent"
          placeholder="Nhập phần trăm giảm giá"
          label="Phần trăm giảm"
          rules={[
            { required: true, message: "" },
            () => ({
              validator(_, value) {
                if (!value) {
                  setError({ percent: true });
                  return Promise.reject(
                    new Error("Vui lòng nhập phần trăm giảm giá")
                  );
                }
                if (Number(value) >= 0 && Number(value) <= 100) {
                  setError({ percent: false });
                  return Promise.resolve();
                } else {
                  setError({ percent: true });
                  return Promise.reject(new Error("Giá trị phải từ 0 đến 100"));
                }
              },
            }),
          ]}
          isError={error.percent}
          thousandSeparator=""
          maxLength={3}
        />
        <Form.Item
          label={<span className="text-base font-exo-2">Trạng thái</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trạng thái",
            },
          ]}
          name="status"
        >
          <Select
            options={Object.values(EStatus).map((status) => ({
              label: StatusMapper[status],
              value: status,
            }))}
            placeholder="Chọn trạng thái"
            className="h-10"
            variant="filled"
          />
        </Form.Item>
        <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
      </Form>
    </Modal>
  );
};

UpdatePromotionModal.propTypes = {
  promotion: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UpdatePromotionModal;
