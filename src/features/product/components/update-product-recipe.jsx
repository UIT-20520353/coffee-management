import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import { Button, Form, Select } from "antd";
import { Minus, Plus } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

const UpdateProductRecipe = ({ product, ingredientOptions, onUpdate }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState({});

  const onFieldsChange = useCallback(() => {
    const length = form.getFieldValue("recipes")?.length ?? -1;
    const errorStates = {};
    for (let i = 0; i < length; i++) {
      errorStates[`recipes${i}quantity`] =
        form.getFieldError(["recipes", i, "quantity"]).length > 0;
    }

    setError({
      ...errorStates,
    });
  }, [form]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        recipes: product.recipes.map((recipe) => ({
          quantity: recipe.quantity,
          ingredientId: recipe.ingredient.id,
        })),
      });
    }
  }, [product, form]);

  return (
    <Form
      className="flex flex-col items-start w-full p-5 mt-5 bg-white rounded-md"
      layout="vertical"
      onFieldsChange={onFieldsChange}
      form={form}
      onFinish={onUpdate}
      name="update-product-recipes"
    >
      <div className="grid w-full grid-cols-2 gap-3">
        <Form.List name="recipes">
          {(fields, { add, remove }, { errors }) => (
            <div className="grid grid-cols-2 col-span-2 gap-3">
              <div className="flex items-center justify-between col-span-2">
                <h3 className="text-lg font-medium underline">Công thức</h3>
                <Button
                  type="primary"
                  icon={<Plus size={24} />}
                  className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
                  onClick={() => add()}
                >
                  Thêm nguyên liệu
                </Button>
              </div>

              {fields.map((field, i) => (
                <div
                  key={field.key}
                  className="grid w-full grid-cols-12 col-span-2 gap-3"
                >
                  <Form.Item
                    label={
                      <span className="text-base font-exo-2">Nguyên liệu</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn nguyên liệu",
                      },
                    ]}
                    name={[field.name, "ingredientId"]}
                    className="col-span-5"
                  >
                    <Select
                      options={ingredientOptions}
                      placeholder="Chọn nguyên liệu"
                      className="h-10"
                      variant="filled"
                    />
                  </Form.Item>
                  <NumberField
                    name={[field.name, "quantity"]}
                    placeholder="Nhập số lượng"
                    label="Số lượng"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số lượng",
                      },
                    ]}
                    isError={error[`recipes${i}quantity`]}
                    thousandSeparator=","
                    className="col-span-5"
                  />
                  <div className="flex items-center justify-center col-span-2">
                    <button
                      onClick={() => remove(field.name)}
                      className="flex items-center justify-center w-8 h-8 duration-300 rounded-full bg-red-1 hover:bg-red-2"
                    >
                      <Minus size={20} color="#fff" />
                    </button>
                  </div>
                </div>
              ))}

              <Form.ErrorList errors={errors} />
            </div>
          )}
        </Form.List>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="w-1/3">
          <SubmitButton text="Lưu" className="mt-2" />
        </div>
      </div>
    </Form>
  );
};

UpdateProductRecipe.propTypes = {
  product: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.oneOf([undefined, null]),
  ]),
  ingredientOptions: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UpdateProductRecipe;
