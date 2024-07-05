import MainLayout from "@/components/layout/main-layout";
import Dashboard from "@/features/dashboard";
import IngredientManagement from "@/features/ingredient";
import InventoryManagement from "@/features/inventory";
import Login from "@/features/login";
import RecipeManagement from "@/features/recipe";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="ingredients" element={<IngredientManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="recipes" element={<RecipeManagement />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
