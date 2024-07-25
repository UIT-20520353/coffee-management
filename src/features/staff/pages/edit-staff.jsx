import staffApi from "@/api/staffApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import { ERole } from "@/enums/staff";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import { RoleMapper } from "@/mappers/staff";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Form, Select } from "antd";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";

const EditStaff = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [error, setError] = useState({ salary: false, phone: false });
  const [staff, setStaff] = useState(undefined);

  const onFieldsChange = useCallback(() => {
    setError({
      salary: form.getFieldError("salary").length > 0,
      phone: form.getFieldError("phone").length > 0,
    });
  }, [form]);

  const convertToBody = useCallback(
    (data) => ({
      ...data,
      salary: Number(data.salary.replace(/,/g, "")),
      username: undefined,
    }),
    []
  );

  const onGet = useCallback(async () => {
    const { ok, errors, body } = await staffApi.getStaffDetail(id);

    if (ok && body) {
      setStaff(body);
    }

    if (errors) {
      handleResponseError(errors, () => navigate("/staffs"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handleResponseError]);
  const [pendingGetDetail, getUserDetail] = useHandleAsyncRequest(onGet);

  const onUpdate = useCallback(
    async (data) => {
      const { ok, errors } = await staffApi.updateStaff(
        id,
        convertToBody(data)
      );

      if (ok) {
        handleResponseSuccess("Cập nhật thông tin tài khoản thành công");
      }

      if (errors) {
        handleResponseError(errors);
      }
    },
    [id, handleResponseError, handleResponseSuccess, convertToBody]
  );
  const [pendingUpdate, updateStaff] = useHandleAsyncRequest(onUpdate);

  useEffect(() => {
    if (pendingGetDetail) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
    if (pendingUpdate) {
      dispatch(incrementLoading());
    } else {
      dispatch(decrementLoading());
    }
  }, [pendingGetDetail, dispatch, pendingUpdate]);

  useEffect(() => {
    if (!id) {
      navigate("/staffs");
    } else {
      getUserDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getUserDetail]);

  useEffect(() => {
    if (staff) {
      form.setFieldsValue({
        username: staff.email,
        lastName: staff.lastName,
        firstName: staff.firstName,
        phone: staff.phone,
        salary: staff.salary,
        role: staff.role,
      });
    }
  }, [staff, form]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Thông tin tài khoản</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/staffs")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <Form
        className="grid w-full grid-cols-2 gap-3 p-5 bg-white rounded-md"
        layout="vertical"
        onFieldsChange={onFieldsChange}
        form={form}
        onFinish={updateStaff}
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
          disabled
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
            <SubmitButton text="Lưu" className="mt-2" />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EditStaff;
