import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import { StatusColorMapper, StatusMapper } from "@/mappers/promotion";
import { Button, Tag } from "antd";
import dayjs from "dayjs";
import { Pencil, Plus } from "lucide-react";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import CreatePromotionModal from "./create-promotion-modal";
import UpdatePromotionModal from "./update-promotion-modal";

const PromotionTable = ({ promotions, productId, getProductDetail }) => {
  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [selectedPromotionForUpdate, setSelectedPromotionForUpdate] =
    useState(undefined);

  const onCloseModal = useCallback(
    (type, reload) => {
      switch (type) {
        case "create":
          setShowCreateModal(false);
          break;
        case "update":
          setSelectedPromotionForUpdate(undefined);
          break;
        default:
          break;
      }

      if (reload) {
        getProductDetail(productId);
      }
    },
    [getProductDetail, productId]
  );

  const columns = useMemo(
    () => [
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên sản phẩm" />,
        render: (name) => <TableDataColumn label={name} />,
      },
      {
        dataIndex: "startDate",
        title: <TableHeaderColumn label="Ngày bắt đầu" />,
        render: (startDate) => (
          <TableDataColumn
            label={dayjs(startDate).format("DD/MM/YYYY HH:MM")}
          />
        ),
      },
      {
        dataIndex: "endDate",
        title: <TableHeaderColumn label="Ngày kết thúc" />,
        render: (endDate) => (
          <TableDataColumn label={dayjs(endDate).format("DD/MM/YYYY HH:MM")} />
        ),
      },
      {
        dataIndex: "percent",
        title: <TableHeaderColumn label="Giảm giá" />,
        render: (percent) => <TableDataColumn label={`${percent}%`} />,
      },
      {
        dataIndex: "status",
        title: <TableHeaderColumn label="Ngày kết thúc" />,
        render: (status) => (
          <Tag
            bordered={false}
            color={StatusColorMapper[status]}
            className="text-sm font-exo-2"
          >
            {StatusMapper[status]}
          </Tag>
        ),
      },
      {
        title: <TableHeaderColumn label="Thao tác" />,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
              type="primary"
              htmlType="button"
              icon={<Pencil size={20} />}
              className="min-w-[44px] min-h-[44px]"
              onClick={() => setSelectedPromotionForUpdate(record)}
            />
          </div>
        ),
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

      <CreatePromotionModal
        isOpen={isShowCreateModal}
        onClose={onCloseModal}
        productId={productId}
      />
      <UpdatePromotionModal
        onClose={onCloseModal}
        productId={productId}
        promotion={selectedPromotionForUpdate}
      />
    </div>
  );
};

PromotionTable.propTypes = {
  promotions: PropTypes.array.isRequired,
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getProductDetail: PropTypes.func,
};

export default PromotionTable;
