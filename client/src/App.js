import { Route, Routes } from "react-router-dom";
import AdminRoute from "./component/AdminRoute";
import Layout from "./component/Layout";
import Notfound from "./component/Notfound";
import ProtectedRoute from "./component/ProtectedRoute";
import RedirectRoute from "./component/RedirectRoute";
import Unauthorized from "./component/Unauthorized";
import CreateNewItem from "./page/CreateNewItem";
import CreatePassword from "./page/CreatePassword";
import Dashboard from "./page/Dashboard";
import Home from "./page/Home";
import ItemDetails from "./page/ItemDetails";
import ItemEditPage from "./page/ItemEditPage";
import ItemsRequestPage from "./page/ItemsRequestPage";
import Login from "./page/Login";
import Profile from "./page/Profile";
import RequestHistory from "./page/RequestHistory";
import RequestItem from "./page/RequestItem";
import Setting from "./page/Setting";
import Signup from "./page/Signup";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route element={<RedirectRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/requestPage/:id" element={<RequestItem />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/createPassword" element={<CreatePassword />} />
            <Route path="/itemDetails/:id" element={<ItemDetails />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/createItem" element={<CreateNewItem />} />
              <Route path="/itemRequests" element={<ItemsRequestPage />} />
              <Route path="/edit/:name" element={<ItemEditPage />} />

              <Route path="/RequestHistory" element={<RequestHistory />} />
            </Route>
          </Route>
        </Route>

        {/* Missing routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
