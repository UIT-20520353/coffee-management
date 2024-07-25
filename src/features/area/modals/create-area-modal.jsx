import areaApi from "@/api/areaApi";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";

const CreateAreaModal = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const onCreate = useCallback(
    async (data) => {
      const { ok, errors } = await areaApi.createArea(data);
      if (ok) {
        handleResponseSuccess("Tạo khu vực thành công", () =>
          onClose("create", true)
        );
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [handleResponseError, onClose, handleResponseSuccess]
  );

  const [pendingCreate, createArea] = useHandleAsyncRequest(onCreate);

  const handleClose = () => {
    if (pendingCreate) return;
    onClose("create", false);
  };

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
          <span className="text-base font-medium font-exo-2">Thêm khu vực</span>
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
      >
        <TextField
          name="name"
          label="Tên khu vực"
          variant="filled"
          placeholder="Nhập tên khu vực"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khu vực",
            },
          ]}
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
      </Form>
    </Modal>
  );
};

CreateAreaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateAreaModal;
