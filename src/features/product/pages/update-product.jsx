import ingredientApi from "@/api/ingredientApi";
import productApi from "@/api/productApi";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import useHandleResponseError from "@/hooks/useHandleResponseError";
import useHandleResponseSuccess from "@/hooks/useHandleResponseSuccess";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";
import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UpdateProductInfo from "../components/update-product-info";
import UpdateProductRecipe from "../components/update-product-recipe";
import PromotionTable from "../components/promotion-table";

const replaceCommaWithEmptyString = (inputString) => {
  return Number(inputString.toString().replace(/,/g, ""));
};

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResponseError = useHandleResponseError();
  const handleResponseSuccess = useHandleResponseSuccess();

  const [ingredients, setIngredients] = useState([]);
  const [product, setProduct] = useState(undefined);

  const ingredientOptions = useMemo(
    () =>
      ingredients.map((i) => ({
        label: i.name,
        value: i.id,
      })),
    [ingredients]
  );

  const conertToBody = useCallback((data, type) => {
    switch (type) {
      case "recipe":
        return {
          recipes: data.recipes.map((recipe) => ({
            ...recipe,
            quantity: replaceCommaWithEmptyString(recipe.quantity),
          })),
        };
      case "info":
        break;
      default:
        break;
    }
  }, []);

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

  const [pendingUpdateProductRecipe, updateProductRecipe] =
    useHandleAsyncRequest(
      useCallback(
        async (data) => {
          const { ok, errors } = await productApi.updateProductRecipe(id, data);
          if (ok) {
            handleResponseSuccess("Cập nhật công thức thành công", () =>
              getProductDetail()
            );
          }
          if (errors) {
            handleResponseError(errors);
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [handleResponseSuccess, handleResponseError, id]
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

  const onUpdateProductRecipe = (data) => {
    if (!data.recipes || data.recipes.length === 0) {
      handleResponseError({
        detail: "error.validate.form.ingredient-required",
      });
    } else {
      updateProductRecipe(conertToBody(data, "recipe"));
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
    dispatch(pendingGetIngredient ? incrementLoading() : decrementLoading());
    dispatch(
      pendingUpdateProductRecipe ? incrementLoading() : decrementLoading()
    );
    dispatch(pendingGetProductDetail ? incrementLoading() : decrementLoading());
    dispatch(
      pendingUpdateProductInfo ? incrementLoading() : decrementLoading()
    );
  }, [
    dispatch,
    pendingGetIngredient,
    pendingUpdateProductRecipe,
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

      <UpdateProductInfo product={product} onSubmit={onUpdateProductInfo} />
      <UpdateProductRecipe
        product={product}
        ingredientOptions={ingredientOptions}
        onUpdate={onUpdateProductRecipe}
      />
      <PromotionTable promotions={product?.promotions ?? []} />
    </div>
  );
};

export default UpdateProduct;
