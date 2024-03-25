import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blogs from "./Pages/Blogs";
import Authenticate from "./Pages/Authenticate";
import CreateBlog from "./Pages/CreateBlog";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from "./Components/privateRoutes";

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/authentication" element={<Authenticate />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
