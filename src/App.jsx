import MainLayout from "@/components/layout/main-layout";
import AreaManagement from "@/features/area";
import AreaDetail from "@/features/area/pages/area-detail";
import CategoryManagement from "@/features/category";
import Dashboard from "@/features/dashboard";
import IngredientManagement from "@/features/ingredient";
import InventoryManagement from "@/features/inventory";
import Login from "@/features/login";
import ProductManagement from "@/features/product";
import CreateProduct from "@/features/product/pages/create-product";
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
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="staffs/create" element={<CreateStaff />} />
        <Route path="staffs/:id" element={<EditStaff />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="areas/:id" element={<AreaDetail />} />
        <Route path="areas" element={<AreaManagement />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products" element={<ProductManagement />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
