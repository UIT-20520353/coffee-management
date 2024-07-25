import { Button } from "antd";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import categoryApi from "@/api/categoryApi";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { useDispatch } from "react-redux";
import { decrementLoading, incrementLoading } from "@/redux/globalSlice";

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);

  const [pendingGetCategory, getAllCategories] = useHandleAsyncRequest(
    useCallback(async () => {
      const { ok, body } = await categoryApi.getAllCategories({
        page: 0,
        size: 9999,
      });
      if (ok && body) {
        setCategories(body);
      }
    }, [])
  );

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  useEffect(() => {
    const loading = pendingGetCategory;
    dispatch(loading ? incrementLoading() : decrementLoading());
  }, [pendingGetCategory, dispatch]);

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
    </div>
  );
};

export default CreateProduct;
