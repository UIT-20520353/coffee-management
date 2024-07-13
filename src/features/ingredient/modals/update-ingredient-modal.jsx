import ingredientApi from "@/api/ingredientApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateIngredientModal = ({ isOpen, onClose, ingredient }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState({ unit: false, warningLimits: false });
  const handleResponseError = useHandleResponseError();

  const onCreate = useCallback(
    async (data) => {
      const { ok, errors } = await ingredientApi.updateIngredient(
        ingredient.id,
        {
          ...data,
          price: replaceCommaWithEmptyString(data.price),
          warningLimits: replaceCommaWithEmptyString(data.warningLimits),
          quantity: ingredient.quantity,
        }
      );
      if (ok) {
        onClose("update", true);
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [onClose, handleResponseError, ingredient]
  );

  const [pendingCreate, createCategory] = useHandleAsyncRequest(onCreate);

  const handleClose = () => {
    if (pendingCreate) return;
    onClose("update", false);
  };

  const onFieldsChange = useCallback(() => {
    setError({
      warningLimits: form.getFieldError("warningLimits").length > 0,
      unit: form.getFieldError("price").length > 0,
    });
  }, [form]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setError({ unit: false, warningLimits: false });
    } else {
      form.setFieldsValue({
        name: ingredient.name,
        unit: ingredient.unit,
        price: ingredient.price,
        warningLimits: ingredient.warningLimits,
      });
    }
  }, [isOpen, form, ingredient]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">
            Cập nhật thông tin nguyên liệu
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
        onFinish={createCategory}
        onFieldsChange={onFieldsChange}
      >
        <TextField
          name="name"
          label="Tên nguyên liệu"
          variant="filled"
          placeholder="Nhập tên nguyên liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên nguyên liệu",
            },
          ]}
        />
        <TextField
          name="unit"
          label="Đơn vị"
          variant="filled"
          placeholder="Nhập đơn vị"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập đơn vị",
            },
          ]}
        />
        <NumberField
          name="price"
          placeholder="Nhập giá"
          label="Giá nguyên liệu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập đơn vị",
            },
          ]}
          isError={error.unit}
        />
        <NumberField
          name="warningLimits"
          placeholder="Nhập số lượng cảnh báo"
          label="Số lượng cảnh báo"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng cảnh báo",
            },
          ]}
          isError={error.warningLimits}
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
      </Form>
    </Modal>
  );
};

UpdateIngredientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ingredient: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
};

export default UpdateIngredientModal;
