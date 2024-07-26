import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import { Form } from "antd";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

const UpdateProductInfo = ({ onSubmit, product = undefined }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState({ price: false });

  const onFieldsChange = useCallback(() => {
    setError({
      price: form.getFieldError("price").length > 0,
    });
  }, [form]);

  useEffect(() => {
    form.setFieldsValue({
      name: product?.name || "",
      price: product?.price || 0,
    });
  }, [product, form]);

  return (
    <Form
      className="flex flex-col items-start w-full p-5 bg-white rounded-md "
      layout="vertical"
      onFieldsChange={onFieldsChange}
      form={form}
      onFinish={onSubmit}
      name="update-product-info"
    >
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="col-span-2">
          <h3 className="text-lg font-medium underline">Thông tin sản phẩm</h3>
        </div>
        <TextField
          name="name"
          label="Tên sản phẩm"
          variant="filled"
          placeholder="Nhập tên sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên sản phẩm",
            },
          ]}
        />
        <NumberField
          name="price"
          placeholder="Nhập giá sản phẩm"
          label="Giá sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập giá sản phẩm",
            },
          ]}
          isError={error.price}
          thousandSeparator=","
        />
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-1/3">
          <SubmitButton text="Lưu" className="mt-2" />
        </div>
      </div>
    </Form>
  );
};

UpdateProductInfo.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  product: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([undefined, null]),
  ]),
};

export default UpdateProductInfo;
