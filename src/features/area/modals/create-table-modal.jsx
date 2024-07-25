import areaApi from "@/api/areaApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const CreateTableModal = ({ isOpen, onClose, areaId }) => {
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [error, setError] = useState({ seat: false });

  const onCreate = useCallback(
    async (data) => {
      const { ok, errors } = await areaApi.createTable({ ...data, areaId });
      if (ok) {
        handleResponseSuccess("Tạo bàn thành công", () =>
          onClose("create", true)
        );
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [handleResponseError, onClose, handleResponseSuccess, areaId]
  );

  const [pendingCreate, createArea] = useHandleAsyncRequest(onCreate);

  const handleClose = () => {
    if (pendingCreate) return;
    onClose("create", false);
  };

  const onFieldsChange = useCallback(() => {
    setError({
      seat: form.getFieldError("seat").length > 0,
    });
  }, [form]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">Thêm bàn</span>
        </div>
      }
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        className="w-full m-0"
        onFinish={createArea}
        onFieldsChange={onFieldsChange}
      >
        <TextField
          name="name"
          label="Tên bàn"
          variant="filled"
          placeholder="Nhập tên bàn"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên bàn",
            },
          ]}
        />
        <NumberField
          name="seat"
          placeholder="Nhập số ghế"
          label="Số ghế"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số ghế",
            },
          ]}
          isError={error.unit}
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
      </Form>
    </Modal>
  );
};

CreateTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  areaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CreateTableModal;
