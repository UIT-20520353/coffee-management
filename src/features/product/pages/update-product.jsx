import ingredientApi from "@/api/ingredientApi";
import productApi from "@/api/productApi";
import NumberField from "@/components/form/number-field";
import SubmitButton from "@/components/form/submit-button";
import TextField from "@/components/form/text-field";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button, Form, Select } from "antd";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UpdateProductInfo from "../components/update-product-info";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState({ price: false });
  const [product, setProduct] = useState(undefined);

  const ingredientOptions = useMemo(
    () =>
      ingredients.map((i) => ({
        label: i.name,
        value: i.id,
      })),
    [ingredients]
  );

  const conertToBody = useCallback(
    (data) => ({
      ...data,
      price: replaceCommaWithEmptyString(data.price),
      recipes: data.recipes.map((recipe) => ({
        ...recipe,
        quantity: replaceCommaWithEmptyString(recipe.quantity),
      })),
    }),
    []
  );

  const onFieldsChange = useCallback(() => {
    const length = form.getFieldValue("recipes")?.length ?? -1;
    const errorStates = {};
    for (let i = 0; i < length; i++) {
      errorStates[`recipes${i}quantity`] =
        form.getFieldError(["recipes", i, "quantity"]).length > 0;
    }

    setError({
      ...errorStates,
      price: form.getFieldError("price").length > 0,
    });
  }, [form]);

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

  const [pendingGetProductDetail, getProductDetail] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await productApi.getProductDetail(id);
      if (ok && body) {
        setProduct(body);
      }
    }, [id])
  );

  const [pendingCreate, UpdateProduct] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, errors } = await productApi.UpdateProduct(data);
        if (ok) {
          handleResponseSuccess("Tạo sản phẩm thành công", () =>
            navigate("/products")
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

  const [pendingUpdateProductInfo, updateProductInfo] = useHandleAsyncRequest(
    useCallback(
      async (data) => {
        const { ok, errors } = await productApi.updateProductInfo(id, data);
        if (ok) {
          handleResponseSuccess("Cập nhật thông tin sản phẩm thành công", () =>
            getProductDetail()
          );
        }
        if (errors) {
          handleResponseError(errors);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleResponseSuccess, handleResponseError, getProductDetail, id]
    )
  );

  const onSubmit = (data) => {
    if (!data.recipes || data.recipes.length === 0) {
      handleResponseError({
        detail: "error.validate.form.ingredient-required",
      });
    } else {
      UpdateProduct(conertToBody(data));
    }
  };

  const onUpdateProductInfo = useCallback(
    (data) => {
      updateProductInfo({
        name: data.name,
        price: replaceCommaWithEmptyString(data.price),
        categoryId: product.id,
      });
    },
    [updateProductInfo, product]
  );

  useEffect(() => {
    getAllIngredients();
  }, [getAllIngredients]);

  useEffect(() => {
    if (!id) {
      navigate("/products");
    } else {
      getProductDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getProductDetail]);

  useEffect(() => {
    if (product) {
      product.recipes.forEach((recipe, index) => {
        form.setFieldValue(["recipes", index, "quantity"], recipe.quantity);
        form.setFieldValue(
          ["recipes", index, "ingredientId"],
          recipe.ingredient.id
        );
      });

      form.setFieldsValue({
        name: product.name,
        price: product.price,
      });
    }
  }, [product, form]);

  useEffect(() => {
    dispatch(pendingGetIngredient ? incrementLoading() : decrementLoading());
    dispatch(pendingCreate ? incrementLoading() : decrementLoading());
    dispatch(pendingGetProductDetail ? incrementLoading() : decrementLoading());
    dispatch(
      pendingUpdateProductInfo ? incrementLoading() : decrementLoading()
    );
  }, [
    dispatch,
    pendingGetIngredient,
    pendingCreate,
    pendingGetProductDetail,
    pendingUpdateProductInfo,
  ]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Thêm sản phẩm mới</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<ArrowLeft size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => navigate("/products")}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <UpdateProductInfo />

      {/* <Form
        className="flex flex-col items-start w-full p-5 bg-white rounded-md "
        layout="vertical"
        onFieldsChange={onFieldsChange}
        form={form}
        onFinish={onSubmit}
      >
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="col-span-2">
            <h3 className="text-lg font-medium underline">
              Thông tin sản phẩm
            </h3>
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
        <Form.List name="recipes">
          {(fields, { add, remove }, { errors }) => (
            <div className="grid w-full grid-cols-2 gap-3">
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

        <div className="flex items-center justify-center w-full">
          <div className="w-1/3">
            <SubmitButton text="Lưu" className="mt-2" />
          </div>
        </div>
      </Form> */}
    </div>
  );
};

export default UpdateProduct;
