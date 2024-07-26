import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import { Button } from "antd";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import CreatePromotionModal from "./create-promotion-modal";

const PromotionTable = ({ promotions }) => {
  const [isShowCreateModal, setShowCreateModal] = useState(false);

  const onCloseModal = useCallback((type) => {
    switch (type) {
      case "create":
        setShowCreateModal(false);
        break;
      default:
        break;
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên sản phẩm" />,
        render: (name) => <TableDataColumn label={name} />,
      },
    ],
    []
  );

  return (
    <div className="w-full p-5 mt-5 bg-white rounded-md">
      <div className="flex items-center justify-between w-full mb-3">
        <h3 className="text-lg font-medium underline">Danh sách mã giảm giá</h3>
        <Button
          type="primary"
          icon={<Plus size={24} />}
          className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
          onClick={() => setShowCreateModal(true)}
        >
          Thêm mã giảm giá
        </Button>
      </div>

      <Table
        columns={columns}
        // loading={pendingGetAllProducts}
        data={promotions}
        total={promotions.length}
        onPageChange={() => {}}
        page={1}
        isShowPagination={false}
      />

      <CreatePromotionModal isOpen={isShowCreateModal} onClose={onCloseModal} />
    </div>
  );
};

PromotionTable.propTypes = {
  promotions: PropTypes.array.isRequired,
};

export default PromotionTable;
