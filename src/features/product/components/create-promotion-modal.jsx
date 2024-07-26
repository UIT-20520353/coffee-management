import categoryApi from "@/api/categoryApi";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import { DatePicker, Form, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";

const { RangePicker } = DatePicker;

const CreatePromotionModal = ({ isOpen, onClose }) => {
  const handleResponseError = useHandleResponseError();
  const [form] = Form.useForm();
  const [pendingCreate, createCategory] = useHandleAsyncRequest(
    async (data) => {
      const { ok, errors } = await categoryApi.createCategory(data);
      if (ok) {
        onClose("create", true);
      }
      if (errors) {
        handleResponseError(errors);
      }
    }
  );

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
        onFinish={createCategory}
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
          name="startdate"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên mã giảm giá",
            },
          ]}
        >
          <RangePicker
            variant="filled"
            id={{ start: "Ngày bắt đầu", end: "Ngày kết thúc" }}
          />
        </Form.Item>
        <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
      </Form>
    </Modal>
  );
};

CreatePromotionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreatePromotionModal;
