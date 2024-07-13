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
  return Number(inputString.replace(/,/g, ""));
};

const ImportIngredientModal = ({ isOpen, onClose, ingredient }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState({ quantity: false });
  const handleResponseError = useHandleResponseError();

  const onCreate = useCallback(
    async (data) => {
      const { id, ...rest } = ingredient;

      const { ok, errors } = await ingredientApi.updateIngredient(id, {
        ...rest,
        quantity:
          replaceCommaWithEmptyString(data.quantity) + ingredient.quantity,
      });
      if (ok) {
        onClose("import", true);
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
    onClose("import", false);
  };

  const onFieldsChange = useCallback(() => {
    setError({
      quantity: form.getFieldError("quantity").length > 0,
    });
  }, [form]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setError({ quantity: false });
    } else {
      form.setFieldsValue({
        name: ingredient.name,
        unit: ingredient.unit,
        price: ingredient.price,
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
            Nhập nguyên liệu
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
          placeholder="Tên nguyên liệu"
          readOnly
        />
        <TextField
          name="unit"
          label="Đơn vị"
          placeholder="Đơn vị"
          variant="filled"
          readOnly
        />
        <NumberField
          name="price"
          placeholder="Giá nguyên liệu"
          label="Giá nguyên liệu"
          isError={false}
          readOnly
        />
        <NumberField
          name="quantity"
          placeholder="Số lượng nguyên liệu"
          label="Số lượng nhập"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng nguyên liệu",
            },
          ]}
          isError={error.quantity}
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
      </Form>
    </Modal>
  );
};

ImportIngredientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ingredient: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
};

export default ImportIngredientModal;
