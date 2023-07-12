import Login from "./page/Login";
import Signup from "./page/Signup";
import Home from "./page/Home";
import Notfound from "./component/Notfound";
import { Routes, Route, BrowseRouter as Router } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import Layout from "./component/Layout";
import CreateNewItem from "./page/CreateNewItem";
import AdminRoute from "./component/AdminRoute";
import Unauthorized from "./component/Unauthorized";
import ItemDetails from "./page/ItemDetails";
import RequestItem from "./page/RequestItem";
import CreatePassword from "./page/CreatePassword";
import ItemsRequestPage from "./page/ItemsRequestPage";
import Profile from "./page/Profile";

function App() {
  return (
    <div>
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/requestPage/:id" element={<RequestItem />} />

            <Route path="/createPassword" element={<CreatePassword />} />
            <Route path="/itemDetails/:id" element={<ItemDetails />} />
            <Route path="/profile" element={<Profile />} />

          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/createItem" element={<CreateNewItem />} />
              <Route path="/itemRequests" element={<ItemsRequestPage />} />
            </Route>
          </Route>
        </Route>

        {/* Missing routes */}
        <Route path="/*" element={<Notfound />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
