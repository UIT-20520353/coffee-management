import areaApi from "@/api/areaApi";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";

const UpdateAreaModal = ({ isOpen, onClose, area }) => {
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const onUpdate = useCallback(
    async (data) => {
      const { ok, errors } = await areaApi.updateArea(area?.id ?? "", data);
      if (ok) {
        handleResponseSuccess("Cập nhật khu vực thành công", () =>
          onClose("update", true)
        );
      }
      if (errors) {
        handleResponseError(errors);
      }
    },
    [area, onClose, handleResponseError, handleResponseSuccess]
  );

  const [pendingUpdate, updateCategory] = useHandleAsyncRequest(onUpdate);

  const handleClose = () => {
    if (pendingUpdate) return;
    onClose("update", false);
  };

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
    } else {
      form.setFieldValue("name", area?.name ?? "");
    }
  }, [isOpen, form, area]);

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
        <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
      </Form>
    </Modal>
  );
};

UpdateAreaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  area: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
};

export default UpdateAreaModal;
