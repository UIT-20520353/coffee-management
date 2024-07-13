import MainLayout from "@/components/layout/main-layout";
import CategoryManagement from "@/features/category";
import Dashboard from "@/features/dashboard";
import IngredientManagement from "@/features/ingredient";
import InventoryManagement from "@/features/inventory";
import Login from "@/features/login";
import RecipeManagement from "@/features/recipe";
import StaffManagement from "@/features/staff";
import CreateStaff from "@/features/staff/pages/create-staff";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="ingredients" element={<IngredientManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="recipes" element={<RecipeManagement />} />
        <Route path="staffs/create" element={<CreateStaff />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
