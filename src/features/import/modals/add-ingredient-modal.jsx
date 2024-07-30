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

const AddIngredientModal = ({
  isOpen,
  onClose,
  importId,
  ingredientOptions,
  selectedIngredients,
}) => {
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
      importDetailRequest: [
        {
          ingredientId: data.ingredientId,
          quantity: replaceCommaWithEmptyString(data.quantity),
        },
      ],
    }),
    []
  );

  const [pendingAdd, addIngredient] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, error } = await importApi.addIngredient(importId, data);
        if (ok) {
          handleResponseSuccess("Thêm nguyên liệu nhập thành công", () =>
            onClose("add", true)
          );
        }
        if (error) {
          handleResponseError(error);
        }
      },
      [onClose, importId, handleResponseError, handleResponseSuccess]
    )
  );

  const handleClose = () => {
    if (pendingAdd) return;
    onClose("add", false);
  };

  const onSubmit = (data) => {
    addIngredient(conertToBody(data));
  };

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setError({});
    }
  }, [form, isOpen]);

  return (
    <Modal
      open={isOpen}
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
            options={ingredientOptions.map((option) => ({
              ...option,
              disabled: selectedIngredients.includes(option.value),
            }))}
            placeholder="Chọn nguyên liệu"
            className="h-10"
            variant="filled"
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
        <SubmitButton text="Lưu" className="mt-2" loading={pendingAdd} />
      </Form>
    </Modal>
  );
};

AddIngredientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  importId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  ingredientOptions: PropTypes.array.isRequired,
  selectedIngredients: PropTypes.array.isRequired,
};

export default AddIngredientModal;
