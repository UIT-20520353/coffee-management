import coffee from "@/assets/images/coffee.avif";
import PasswordField from "@/components/form/password-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Form } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { getLocalStorage, setLocalStorage } = useLocalStorage();

  const onLogin = ({ email, password }) => {
    console.log(email, password);
    setLocalStorage({ value: email });
    navigate("/");
  };

  useEffect(() => {
    const accessToken = getLocalStorage();
    if (accessToken) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLocalStorage]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-200">
      <div className="w-2/3 border border-gray-200 rounded-xl max-h-[550px] flex bg-white">
        <img
          className="w-1/2 rounded-l-lg object-cover object-center max-h-[548px]"
          src={coffee}
          alt="coffee"
        />
        <div className="flex flex-col items-center justify-center w-1/2 min-h-full gap-3">
          <div className="flex flex-col items-center justify-center gap-1">
            <h3 className="text-2xl font-bold uppercase text-brown-1">
              Chào mừng
            </h3>
            <p className="text-base text-black">
              Vui lòng nhập thông tin đăng nhập
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            className="w-4/5"
            onFinish={onLogin}
          >
            <TextField
              name="email"
              label="Email"
              variant="filled"
              placeholder="Nhập email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập đúng định dạng email",
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
            <SubmitButton text="Đăng nhập" className="mt-2" />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
