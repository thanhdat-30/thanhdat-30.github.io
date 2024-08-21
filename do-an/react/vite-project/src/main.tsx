import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import App from "./App.tsx";
import Login from "./components/Login.tsx";
import Giay from "./pages/Giay.tsx";
import Dep from "./pages/Dep.tsx";
import Order from "./pages/TrangThai.tsx";
import LichSuBanHang from "./pages/LichSuBanHang.tsx";
import KhachHang from "./pages/KhachHang.tsx";
import NhanVien from "./pages/NhanVien.tsx";
import BaoCao from "./pages/BaoCao.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login navigate={(path: string) => (path)}/>}/>
          <Route path="/pages" element={<App/>}>
            <Route path="giay" element={<Giay/>}/>
            <Route path="dep" element={<Dep/>}/>
            <Route path="trangthaidonhang" element={<Order/>}/>
            <Route path="lichsubanhang" element={<LichSuBanHang/>}/>
            <Route path="khachhang" element={<KhachHang/>} />
            <Route path="baocao-phantich" element={<BaoCao/>} />
            <Route path="nhanvien" element={<NhanVien/>} />
          </Route>  
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

