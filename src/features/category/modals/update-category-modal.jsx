import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { Form, Modal } from "antd";
import PropTypes from "prop-types";
import categoryApi from "@/api/categoryApi";
import { useCallback, useEffect } from "react";

const UpdateCategoryModal = ({ isOpen, onClose, category }) => {
  const [form] = Form.useForm();

  const onUpdate = useCallback(
    async (data) => {
      const { ok } = await categoryApi.updateCategory(category?.id ?? "", data);
      if (ok) {
        onClose("update", true);
      }
    },
    [category, onClose]
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
      form.setFieldValue("name", category?.name ?? "");
    }
  }, [isOpen, form, category]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      title={
        <div className="flex items-center justify-center w-full">
          <span className="text-base font-medium font-exo-2">
            Cập nhật thông tin danh mục
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
          placeholder="Nhập tên danh mục"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên danh mục",
            },
          ]}
        />
        <SubmitButton text="Lưu" className="mt-2" loading={pendingUpdate} />
      </Form>
    </Modal>
  );
};

UpdateCategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([null, undefined]),
  ]),
};

export default UpdateCategoryModal;
