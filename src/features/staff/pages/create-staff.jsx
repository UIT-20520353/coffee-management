import staffApi from "@/api/staffApi";
import NumberField from "@/components/form/number-field";
import PasswordField from "@/components/form/password-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import { ERole } from "@/enums/staff";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { RoleMapper } from "@/mappers/staff";
import { Button, Form, Select } from "antd";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const CreateStaff = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [error, setError] = useState({ salary: false, phone: false });

  const onFieldsChange = useCallback(() => {
    setError({
      salary: form.getFieldError("salary").length > 0,
      phone: form.getFieldError("phone").length > 0,
    });
  }, [form]);

  const onCreate = useCallback(
    async (data) => {
      const { ok, errors } = await staffApi.createStaff({
        ...data,
        salary: replaceCommaWithEmptyString(data.salary),
      });

      if (ok) {
        handleResponseSuccess("Tạo tài khoản thành công", () => {
          navigate("/staffs");
        });
      }

      if (errors) {
        handleResponseError(errors);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleResponseError, handleResponseSuccess]
  );
  const [pendingCreate, createCategory] = useHandleAsyncRequest(onCreate);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Thêm tài khoản mới</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <Form
        className="grid w-full grid-cols-2 gap-3 p-5 bg-white rounded-md"
        layout="vertical"
        onFieldsChange={onFieldsChange}
        onFinish={createCategory}
        form={form}
      >
        <TextField
          name="username"
          label="Username"
          variant="filled"
          placeholder="Nhập username"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập username",
            },
          ]}
        />
        <PasswordField
          name="password"
          label="Mật khẩu"
          variant="filled"
          placeholder="Nhập mật khẩu"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu",
            },
          ]}
        />
        <TextField
          name="lastName"
          label="Họ"
          variant="filled"
          placeholder="Nhập họ"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập họ",
            },
          ]}
        />
        <TextField
          name="firstName"
          label="Tên"
          variant="filled"
          placeholder="Nhập tên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên",
            },
          ]}
        />
        <NumberField
          name="phone"
          placeholder="Nhập số điện thoại"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số điện thoại",
            },
          ]}
          isError={error.phone}
          thousandSeparator=""
          maxLength={11}
        />
        <NumberField
          name="salary"
          placeholder="Nhập số lương"
          label="Lương"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lương",
            },
          ]}
          isError={error.salary}
        />
        <Form.Item
          label={<span className="text-base font-exo-2">Chức vụ</span>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn chức vụ",
            },
          ]}
          name="role"
        >
          <Select
            options={Object.values(ERole).map((role) => ({
              label: RoleMapper[role],
              value: role,
            }))}
            placeholder="Chọn chức vụ"
            className="h-10"
            variant="filled"
          />
        </Form.Item>
        <div className="flex items-center justify-center col-span-2">
          <div className="w-1/3">
            <SubmitButton text="Lưu" className="mt-2" loading={pendingCreate} />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateStaff;
