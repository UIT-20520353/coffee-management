import categoryApi from "@/api/categoryApi";
import Table from "@/components/table/table";
import TableDataColumn from "@/components/table/table-data-column";
import TableHeaderColumn from "@/components/table/table-header-column";
import useHandleAsyncRequest from "@/hooks/useHandleAsyncRequest";
import { Button } from "antd";
import { Pencil, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreateCategoryModal from "./modals/create-category-modal";
import UpdateCategoryModal from "./modals/update-category-modal";

const CategoryManagement = () => {
  const [pagination, setPagination] = useState({
    page: 1,
  });
  const [categoryList, setCategoryList] = useState({ total: 0, items: [] });
  const [isShowCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        dataIndex: "id",
        title: <TableHeaderColumn label="ID" />,
        render: (id) => <TableDataColumn label={id} />,
      },
      {
        dataIndex: "name",
        title: <TableHeaderColumn label="Tên danh mục" />,
        render: (name) => <TableDataColumn label={name} />,
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
              onClick={() => setSelectedCategory(record)}
            />
            {/* <Button
              type="primary"
              htmlType="button"
              icon={<Trash2 size={20} />}
              className="min-w-[44px] min-h-[44px]"
              danger
            /> */}
          </div>
        ),
      },
    ],
    []
  );

  const onPageChange = useCallback((page) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const onCloseModal = useCallback((type, isReload = false) => {
    switch (type) {
      case "create":
        setShowCreateModal(false);
        break;
      case "update":
        setSelectedCategory(undefined);
        break;
      default:
        break;
    }
    if (isReload) {
      setPagination((prev) => ({ ...prev, page: 0 }));
    }
  }, []);

  const onGet = useCallback(async (page) => {
    const { ok, body, total } = await categoryApi.getAllCategories({
      size: 10,
      page: page - 1,
      sort: "id,asc",
    });
    if (ok && body) {
      setCategoryList({ items: body, total: total ?? 0 });
    }
  }, []);

  const [pendingCategories, getAllCategories] = useHandleAsyncRequest(onGet);

  useEffect(() => {
    getAllCategories(pagination.page);
  }, [pagination, getAllCategories]);

  return (
    <div className="w-full p-5">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-xl font-semibold">Danh sách nguyên liệu</h3>
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<Plus size={24} />}
            className="h-9 bg-brown-1 hover:!bg-brown-3 duration-300 text-sm font-medium"
            onClick={() => setShowCreateModal(true)}
          >
            Thêm danh mục
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        loading={pendingCategories}
        data={categoryList.items}
        total={categoryList.total}
        onPageChange={onPageChange}
        page={pagination.page}
      />

      <CreateCategoryModal isOpen={isShowCreateModal} onClose={onCloseModal} />
      <UpdateCategoryModal
        isOpen={!!selectedCategory}
        category={selectedCategory}
        onClose={onCloseModal}
      />
    </div>
  );
};

export default CategoryManagement;
