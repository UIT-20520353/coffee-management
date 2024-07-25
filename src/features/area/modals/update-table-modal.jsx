import areaApi from "@/api/areaApi";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import NumberField from "@/components/form/number-field";

const UpdateTableModal = ({ isOpen, onClose, table, areaId }) => {
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [error, setError] = useState({ seat: false });

  const onUpdate = useCallback(
    async (data) => {
      const { ok, errors } = await areaApi.updateTable(table?.id ?? "", {
        ...data,
        areaId,
      });
      if (ok) {
        handleResponseSuccess("Cập nhật thông tin bàn thành công", () =>
          onClose("update-table", true)
        );
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [table, onClose, handleResponseError, handleResponseSuccess, areaId]
  );

  const [pendingUpdate, updateCategory] = useHandleAsyncRequest(onUpdate);

  const handleClose = () => {
    if (pendingUpdate) return;
    onClose("update-table", false);
  };

  const onFieldsChange = useCallback(() => {
    setError({
      seat: form.getFieldError("seat").length > 0,
    });
  }, [form]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    } else {
      form.setFieldValue("name", table?.name ?? "");
      form.setFieldValue("seat", table?.seat ?? 0);
    }
  }, [isOpen, form, table]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">
            Cập nhật thông tin khu vực
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
        onFinish={updateCategory}
        onFieldsChange={onFieldsChange}
      >
        <TextField
          name="name"
          label="Tên danh mục"
          variant="filled"
          placeholder="Nhập tên khu vực"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khu vực",
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
        <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
      </Form>
    </Modal>
  );
};

UpdateTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  table: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
  areaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default UpdateTableModal;
