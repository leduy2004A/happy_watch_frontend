import { createWebHistory, createRouter } from "vue-router";

import page_admin from "../components/admin/page_admin.vue";
import main_content from "@/components/admin/BanHangTaiQuay/main_content.vue";
import AppFooter from "@/components/AppFooter.vue";
import user from "../components/user/user.vue";
import hoa_don_pdf from "@/components/admin/BanHangTaiQuay/hoa_don_pdf.vue";
import mainContent from "@/components/admin/QuanLyHoaDon/mainContent.vue";
import chiTietHoaDon from "@/components/admin/QuanLyHoaDon/chiTietHoaDon.vue";
import mainContentUser from "@/components/user/mainContentUser.vue";
import trangChu from "@/components/user/trangChu.vue";
import mainCuaHang from "@/components/user/mainCuaHang.vue";
import mainSanPhamDetail from "@/components/user/mainSanPhamDetail.vue";
import mainCart from "@/components/user/mainCart.vue";
import mainThanhToan from "@/components/user/mainThanhToan.vue";
import datHangThanhCong from "@/components/user/datHangThanhCong.vue";
import mainProfile from "@/components/user/profile/mainProfile.vue";
import mainDonHangKhachHang from "@/components/user/profile/mainDonHangKhachHang.vue";
import hoaDonKhachHang from "@/components/user/profile/hoaDonKhachHang.vue";
import mainQuanLySanPham from "@/components/admin/QuanLySanPham/mainQuanLySanPham.vue";
import ThemSanPham from "@/components/admin/QuanLySanPham/ThemSanPham.vue";
import DanhSachChiTietSanPham from "@/components/admin/QuanLySanPham/danhSachChiTietSanPham.vue";
import thuongHieu from "@/components/admin/QuanLySanPham/thuongHieu.vue";
import traHang from "@/components/admin/QuanLyHoaDon/traHang.vue";
import mauSac from "@/components/admin/QuanLySanPham/mauSac.vue";
import hinhDang from "@/components/admin/QuanLySanPham/hinhDang.vue";
import loaiMay from "@/components/admin/QuanLySanPham/loaiMay.vue";
import chatLieuVo from "@/components/admin/QuanLySanPham/chatLieuVo.vue";
import chatLieuDay from "@/components/admin/QuanLySanPham/chatLieuDay.vue";
import loaiKinh from "@/components/admin/QuanLySanPham/loaiKinh.vue";
import khachHang from "@/components/admin/QuanLySanPham/khachHang.vue";
import phieuGiamGia from "@/components/admin/QuanLySanPham/phieuGiamGia.vue";
import giamGiaSanPham from "@/components/admin/QuanLySanPham/giamGiaSanPham.vue";
import nhanVien from "@/components/admin/QuanLySanPham/nhanVien.vue";
import address from "@/components/user/profile/address.vue";
import maGiamGia from "@/components/user/profile/maGiamGia.vue";
import profile from "@/components/user/profile/profile.vue";
import dangNhapDangKi from "@/components/dangNhapDangKi.vue";
import thongke from "@/components/admin/ThongKe/thongke.vue";
import thongTinCaNhan from "@/components/admin/QuanLySanPham/thongTinCaNhan.vue";

const routes = [
  {
    path: "/admin",
    component: page_admin,
    meta: { requiresAuth: true, roles: ["Admin"] },
    children: [
      {
        path: "sell",
        component: main_content,
        meta: { keepAlive: true }, 
      },
      {
        path: "thongke",
        component: user,
        meta: { keepAlive: true },
      },
      {
        path: "pdf_check",
        component: hoa_don_pdf,
        meta: { keepAlive: true }, 
      },
      {
        path: "bill",
        component: mainContent,
        meta: { keepAlive: true },
      },
      {
        path: "bill-return",
        component: traHang,
        meta: { keepAlive: true },
      },
      {
        path: "bill-detail/:ma",
        component: chiTietHoaDon,
        meta: { keepAlive: true }, 
      },
      {
        path: "product-list",
        component: mainQuanLySanPham,
        meta: { keepAlive: true }, 
      },
      {
        path: "product-add/:id",
        component: ThemSanPham,
        meta: { keepAlive: true }, 
      },
      {
        path: "product-danhsach/:id",
        component: DanhSachChiTietSanPham,
        meta: { keepAlive: true }, 
      },
      {
        path: "thuong-hieu",
        component: thuongHieu,
        meta: { keepAlive: true }, 
      },
      {
        path: "mau-sac",
        component: mauSac,
        meta: { keepAlive: true }, 
      },
      {
        path: "hinh-dang",
        component: hinhDang,
        meta: { keepAlive: true }, 
      },
      {
        path: "loai-may",
        component: loaiMay,
        meta: { keepAlive: true }, 
      },
      {
        path: "chat-lieu-vo",
        component: chatLieuVo,
        meta: { keepAlive: true },
      },
      {
        path: "chat-lieu-day",
        component: chatLieuDay,
        meta: { keepAlive: true },
      },
      {
        path: "loai-kinh",
        component: loaiKinh,
        meta: { keepAlive: true },
      },
      {
        path: "khach-hang",
        component: khachHang,
        meta: { keepAlive: true },
      },
      {
        path: "voucher",
        component: phieuGiamGia,
        meta: { keepAlive: true },
      },
      {
        path: "voucher-sanpham",
        component: giamGiaSanPham,
        meta: { keepAlive: true },
      },
      {
        path: "nhan-vien",
        component: nhanVien,
        meta: { keepAlive: true },
      },
      {
        path: "thong-ke",
        component: thongke,
        meta: { keepAlive: true },
      },
      {
        path: "thong-tin-ca-nhan",
        component: thongTinCaNhan,
        meta: { keepAlive: true },
      },
    ],
  },
  {
    path: "/product",
    component: trangChu,
    meta: { requiresAuth: false, roles: ["Khách hàng"] },
    children: [
      {
        path: "",
        component: mainContentUser,
      },
      {
        path: "cua-hang",
        component: mainCuaHang,
      },
      {
        path: "detail/:id",
        component: mainSanPhamDetail,
      },
      {
        path: "checkout",
        component: mainThanhToan,
      },
      {
        path: "cart",
        component: mainCart,
      },
      {
        path: "success/:ma",
        component: datHangThanhCong,
      },
    ],
  },
  {
    path: "/profile",
    meta: { keepAlive: true, requiresAuth: false, roles: ["Khách hàng"] },
    component: mainProfile,
    children: [
      {
        path: "don-hang/:ma",
        component: mainDonHangKhachHang,
      },
      {
        path: "hoa-don",
        component: hoaDonKhachHang,
      },
      {
        path: "address",
        component: address,
      },
      {
        path: "voucher",
        component: maGiamGia,
      },
      {
        path: "ho-so",
        component: profile,
      },
    ],
  },
  {
    path: "/",
    component: dangNhapDangKi,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Nếu đang truy cập trang đăng nhập và đã có token
  if (to.path === '/' && token) {
    // Chuyển hướng theo vai trò
    if (user?.vaiTro?.tenVaiTro === 'Admin') {
      next('/admin/sell');
    } else {
      next('/product');
    }
    return;
  }

  // Kiểm tra route Admin
  if (to.path.startsWith('/admin')) {
    if (!token) {
      next('/');
      return;
    }
    if (!user?.vaiTro?.tenVaiTro || user.vaiTro.tenVaiTro !== 'Admin') {
      next('/product');
      return;
    }
  }

  // Kiểm tra route Profile cần đăng nhập
  if (to.path.startsWith('/profile')) {
    if (!token) {
      next('/');
      return;
    }
    if (user?.vaiTro?.tenVaiTro === 'Admin') {
      next('/admin/sell');
      return;
    }
  }

  // Kiểm tra route Product
  if (to.path.startsWith('/product')) {
    if (token && user?.vaiTro?.tenVaiTro === 'Admin') {
      next('/admin/sell');
      return;
    }
  }

  next();
});
export default router;
