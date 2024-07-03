import coffee from "@/assets/images/coffee.avif";
import PasswordField from "@/components/form/password-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import { Form } from "antd";

const LoginPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-2/3 border border-gray-200 rounded-xl max-h-[550px] flex bg-white">
        <img
          className="w-1/2 rounded-l-lg object-cover object-center max-h-[548px]"
          src={coffee}
          alt="coffee"
        />
        <div className="w-1/2 min-h-full flex items-center justify-center flex-col gap-3">
          <div className="flex flex-col justify-center items-center gap-1">
            <h3 className="text-2xl font-bold text-brown-1 uppercase">
              Chào mừng
            </h3>
            <p className="text-base text-black">
              Vui lòng nhập thông tin đăng nhập
            </p>
          </div>

          <Form form={form} layout="vertical" className="w-4/5">
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
