import MainLayout from "@/components/layout/main-layout";
import AreaManagement from "@/features/area";
import AreaDetail from "@/features/area/pages/area-detail";
import CategoryManagement from "@/features/category";
import ImportManagement from "@/features/import";
import CreateImport from "@/features/import/pages/create-import";
import UpdateImport from "@/features/import/pages/update-import";
import IngredientManagement from "@/features/ingredient";
import InventoryManagement from "@/features/inventory";
import Login from "@/features/login";
import OrderManagement from "@/features/order";
import OrderDetail from "@/features/order/pages/order-detail";
import ProductManagement from "@/features/product";
import CreateProduct from "@/features/product/pages/create-product";
import UpdateProduct from "@/features/product/pages/update-product";
import StaffManagement from "@/features/staff";
import CreateStaff from "@/features/staff/pages/create-staff";
import EditStaff from "@/features/staff/pages/edit-staff";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="ingredients" element={<IngredientManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route index element={<CategoryManagement />} />
        <Route path="staffs/create" element={<CreateStaff />} />
        <Route path="staffs/:id" element={<EditStaff />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="areas/:id" element={<AreaDetail />} />
        <Route path="areas" element={<AreaManagement />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/:id" element={<UpdateProduct />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="import/create" element={<CreateImport />} />
        <Route path="import/:id" element={<UpdateImport />} />
        <Route path="import" element={<ImportManagement />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
