import Login from "./page/Login";
import Signup from "./page/Signup";
import Home from "./page/Home";
import Notfound from "./component/Notfound";
import {
  Routes,
  Route,
  BrowseRouter as Router,
} from "react-router-dom";
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
import RedirectRoute from "./component/RedirectRoute";
import RequestHistory from "./page/RequestHistory";
import Setting from "./page/Setting";
import Notification from "./page/Notification";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route element={<RedirectRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/notify" element={<Notification />} />
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
