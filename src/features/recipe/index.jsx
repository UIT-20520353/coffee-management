import { Button } from "antd";
import { Pencil, Plus, Trash2 } from "lucide-react";
import coffee_cup from "@/assets/images/coffee-cup.avif";
import { NumericFormat } from "react-number-format";

const RecipeManagement = () => {
  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Công thức pha chế</h3>
        <Button
          type="primary"
          icon={<Plus size={24} />}
          className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
        >
          Thêm công thức
        </Button>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="flex items-start justify-between w-full p-4 bg-white rounded-lg shadow">
          <div className="flex items-start gap-3">
            <img
              src={coffee_cup}
              alt="product"
              className="object-cover object-center rounded-md w-28 h-28"
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold">Đen đá</span>
              <NumericFormat
                value="24000"
                thousandSeparator=","
                displayType="text"
                className="text-sm font-exo-2"
                suffix="₫"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash2 size={20} />}
              className="min-w-[44px] min-h-[44px]"
              danger
            />
          </div>
        </div>

        <div className="flex items-start justify-between w-full p-4 bg-white rounded-lg shadow">
          <div className="flex items-start gap-3">
            <img
              src={coffee_cup}
              alt="product"
              className="object-cover object-center rounded-md w-28 h-28"
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold">Đen đá</span>
              <NumericFormat
                value="24000"
                thousandSeparator=","
                displayType="text"
                className="text-sm font-exo-2"
                suffix="₫"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
            />
            <Button
              type="primary"
              htmlType="button"
              icon={<Trash2 size={20} />}
              className="min-w-[44px] min-h-[44px]"
              danger
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeManagement;
