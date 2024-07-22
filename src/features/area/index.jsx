import { Button } from "antd";
import { Plus } from "lucide-react";
import { useCallback } from "react";
import areaApi from "@/api/areaApi";

const AreaManagement = () => {
  const onGet = useCallback(async () => {
    const { ok, body } = await areaApi.getAllAreas();
  }, []);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách khu vực</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
          >
            Thêm khu vực
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
