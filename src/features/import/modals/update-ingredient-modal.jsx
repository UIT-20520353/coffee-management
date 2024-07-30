import importApi from "@/api/importApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { Form, Modal, Select } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateIngredientModal = ({ onClose, detail, ingredientOptions }) => {
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const [form] = Form.useForm();

  const [error, setError] = useState({ quantity: false });

  const onFieldsChange = useCallback(() => {
    setError({
      quantity: form.getFieldError("quantity").length > 0,
    });
  }, [form]);

  const conertToBody = useCallback(
    (data) => ({
      importDetailId: detail.id,
      quantity: replaceCommaWithEmptyString(data.quantity),
    }),
    [detail]
  );

  const [pendingUpdate, updateImportDetail] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, error } = await importApi.updateImportDetail(data);
        if (ok) {
          handleResponseSuccess("Cập nhật nguyên liệu nhập thành công", () =>
            onClose("update", true)
          );
        }
        if (error) {
          handleResponseError(error);
        }
      },
      [onClose, handleResponseError, handleResponseSuccess]
    )
  );

  const handleClose = () => {
    if (pendingUpdate) return;
    onClose("update", false);
  };

  const onSubmit = (data) => {
    updateImportDetail(conertToBody(data));
  };

  useEffect(() => {
    if (!detail) {
      form.resetFields();
      setError({});
    } else {
      form.setFieldsValue({
        ingredientId: detail.ingredient.id,
        quantity: detail.quantity,
      });
    }
  }, [form, detail]);

  return (
    <Modal
      open={!!detail}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">
            Thêm nguyên liệu nhập
          </span>
        </div>
      }
      footer={null}
      centered
    >
      <Form
        onFieldsChange={onFieldsChange}
        form={form}
        layout="vertical"
        className="w-full m-0"
        onFinish={onSubmit}
      >
        <Form.Item
          label={<span className="text-base font-exo-2">Nguyên liệu</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn nguyên liệu",
            },
          ]}
          name="ingredientId"
          className="w-full"
        >
          <Select
            options={ingredientOptions}
            placeholder="Chọn nguyên liệu"
            className="h-10"
            variant="filled"
            disabled
          />
        </Form.Item>
        <NumberField
          name="quantity"
          placeholder="Nhập số lượng"
          label="Số lượng"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng",
            },
          ]}
          isError={error.quantity}
          thousandSeparator=","
          className="col-span-5"
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
      </Form>
    </Modal>
  );
};

UpdateIngredientModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
  ingredientOptions: PropTypes.array.isRequired,
};

export default UpdateIngredientModal;
