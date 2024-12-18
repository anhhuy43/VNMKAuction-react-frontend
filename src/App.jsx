import "./App.css";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Info from "./User/Info.jsx";
import ProductList from "./ProductList.jsx";
import Home from "./Home.jsx";
import Login from "./User/Login.jsx";
import CreateUser from "./User/CreateUser.jsx";
import EditUser from "./User/EditUser.jsx";
import ChangePassword from "./User/ChangePassword.jsx";
import Layout from "./Layout.jsx";
import CreatePost from "./Posts/Create.jsx"
import PostDetailPage from "./Posts/PostDetail.jsx";
import MyPosts from "./Posts/MyPosts.jsx"
import EditPost from "./Posts/EditPost.jsx";
import SearchResult from "./Posts/SearchResult.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/info" element={<Info />}></Route>
          <Route path="/products" element={<ProductList />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/user/create" element={<CreateUser />}></Route>
          <Route path="/user/edit" element={<EditUser />}></Route>
          <Route path="/my-posts" element={<MyPosts />}></Route>
          <Route path="/posts/edit/:id" element={<EditPost />}></Route>
          <Route path="/search" element={<SearchResult />} />
          <Route
            path="/user/change-password"
            element={<ChangePassword />}
          ></Route>
          <Route path="/create-post" element={<CreatePost />}></Route>
          <Route path="/posts/:id" element={<PostDetailPage />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
