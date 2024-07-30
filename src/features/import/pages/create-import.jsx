import ingredientApi from "@/api/ingredientApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Form, Select } from "antd";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const CreateImport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();
  const [form] = Form.useForm();

  const [error, setError] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const onFieldsChange = useCallback(() => {
    const length = form.getFieldValue("importDetailRequest")?.length ?? -1;
    const errorStates = {};
    for (let i = 0; i < length; i++) {
      errorStates[`importDetailRequest${i}quantity`] =
        form.getFieldError(["importDetailRequest", i, "quantity"]).length > 0;
    }
    const importDetailRequest = form.getFieldValue("importDetailRequest") ?? [];
    setSelectedIngredients(
      importDetailRequest.filter((i) => !!i).map((i) => i.ingredientId)
    );
    setError({
      ...errorStates,
      price: form.getFieldError("price").length > 0,
    });
  }, [form]);

  const ingredientOptions = useMemo(
    () =>
      ingredients.map((i) => ({
        label: i.name,
        value: i.id,
        disabled: selectedIngredients.includes(i.id),
      })),
    [ingredients, selectedIngredients]
  );

  const conertToBody = useCallback(
    (data) => ({
      importDetailRequest: data.importDetailRequest.map((recipe) => ({
        ...recipe,
        quantity: replaceCommaWithEmptyString(recipe.quantity),
      })),
    }),
    []
  );

  const [pendingGetIngredient, getAllIngredients] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await ingredientApi.getAllIngredients({
        page: 0,
        size: 9999,
      });
      if (ok && body) {
        setIngredients(body);
      }
    }, [])
  );

  const [pendingCreateProduct, createProduct] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, errors } = await ingredientApi.importIngredient(data);
        if (ok) {
          handleResponseSuccess("Nhập hàng thành công", () =>
            navigate("/import")
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleResponseSuccess, handleResponseError]
    )
  );

  const onSubmit = (data) => {
    if (!data.importDetailRequest || data.importDetailRequest.length === 0) {
      handleResponseError({
        detail: "error.validate.form.ingredient-required",
      });
    } else {
      createProduct(conertToBody(data));
    }
  };

  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

  useEffect(() => {
    dispatch(pendingGetIngredient ? incrementLoading() : decrementLoading());
    dispatch(pendingCreateProduct ? incrementLoading() : decrementLoading());
  }, [dispatch, pendingGetIngredient, pendingCreateProduct]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Nhập hàng</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/import")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <Form
        className="flex flex-col items-start w-full p-5 bg-white rounded-md "
        layout="vertical"
        onFieldsChange={onFieldsChange}
        form={form}
        onFinish={onSubmit}
      >
        <Form.List name="importDetailRequest">
          {(fields, { add, remove }, { errors }) => (
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex items-center justify-between col-span-2">
                <h3 className="text-lg font-medium underline">
                  Danh sách nguyên liệu nhập
                </h3>
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
                    isError={error[`importDetailRequest${i}quantity`]}
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

        <div className="flex items-center justify-center w-full">
          <div className="w-1/3">
            <SubmitButton text="Lưu" className="mt-2" />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateImport;
