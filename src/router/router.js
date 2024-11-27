import { createWebHistory, createRouter } from 'vue-router'

import page_admin from '../components/admin/page_admin.vue';
import main_content from '@/components/admin/BanHangTaiQuay/main_content.vue';
import AppFooter from '@/components/AppFooter.vue';
import user from '../components/user/user.vue'
import hoa_don_pdf from '@/components/admin/BanHangTaiQuay/hoa_don_pdf.vue';
import mainContent from '@/components/admin/QuanLyHoaDon/mainContent.vue';
import chiTietHoaDon from '@/components/admin/QuanLyHoaDon/chiTietHoaDon.vue';
import mainContentUser from '@/components/user/mainContentUser.vue';
import trangChu from '@/components/user/trangChu.vue';
import mainCuaHang from '@/components/user/mainCuaHang.vue';
import mainSanPhamDetail from '@/components/user/mainSanPhamDetail.vue';
import mainCart from '@/components/user/mainCart.vue';
import mainThanhToan from '@/components/user/mainThanhToan.vue';
import datHangThanhCong from '@/components/user/datHangThanhCong.vue';
import mainProfile from '@/components/user/profile/mainProfile.vue';
import mainDonHangKhachHang from '@/components/user/profile/mainDonHangKhachHang.vue';
import hoaDonKhachHang from '@/components/user/profile/hoaDonKhachHang.vue';
import mainQuanLySanPham from '@/components/admin/QuanLySanPham/mainQuanLySanPham.vue';
import ThemSanPham from '@/components/admin/QuanLySanPham/ThemSanPham.vue';
import DanhSachChiTietSanPham from '@/components/admin/QuanLySanPham/danhSachChiTietSanPham.vue';
import thuongHieu from '@/components/admin/QuanLySanPham/thuongHieu.vue';
import traHang from '@/components/admin/QuanLyHoaDon/traHang.vue';
import mauSac from '@/components/admin/QuanLySanPham/mauSac.vue';
import hinhDang from '@/components/admin/QuanLySanPham/hinhDang.vue';
import loaiMay from '@/components/admin/QuanLySanPham/loaiMay.vue';
import chatLieuVo from '@/components/admin/QuanLySanPham/chatLieuVo.vue';
import chatLieuDay from '@/components/admin/QuanLySanPham/chatLieuDay.vue';
import loaiKinh from '@/components/admin/QuanLySanPham/loaiKinh.vue';
import khachHang from '@/components/admin/QuanLySanPham/khachHang.vue';
import phieuGiamGia from '@/components/admin/QuanLySanPham/phieuGiamGia.vue';
import giamGiaSanPham from '@/components/admin/QuanLySanPham/giamGiaSanPham.vue';
import nhanVien from '@/components/admin/QuanLySanPham/nhanVien.vue';
const routes = [
  { 
    path: '/admin', 
    component: page_admin,
    children: [
      {
        path: 'sell',
        component: main_content,
        meta: { keepAlive: true } // Thêm meta
      },
      {
        path: 'thongke',
        component: user,
        meta: { keepAlive: true }
      },
      {
        path: 'pdf_check',
        component: hoa_don_pdf,
        meta: { keepAlive: false } // PDF không cần cache
      },
      {
        path: 'bill',
        component: mainContent,
        meta: { keepAlive: true }
      },
      {
        path: 'bill-return',
        component: traHang,
        meta: { keepAlive: true }
      },
      {
        path: 'bill-detail/:ma',
        component: chiTietHoaDon,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'product-list',
        component: mainQuanLySanPham,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'product-add/:id',
        component: ThemSanPham,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'product-danhsach/:id',
        component: DanhSachChiTietSanPham,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'thuong-hieu',
        component: thuongHieu,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'mau-sac',
        component: mauSac,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'hinh-dang',
        component: hinhDang,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'loai-may',
        component: loaiMay,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'chat-lieu-vo',
        component: chatLieuVo,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'chat-lieu-day',
        component: chatLieuDay,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'loai-kinh',
        component: loaiKinh,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'khach-hang',
        component: khachHang,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'voucher',
        component: phieuGiamGia,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'voucher-sanpham',
        component: giamGiaSanPham,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      },
      {
        path: 'nhan-vien',
        component: nhanVien,
        meta: { keepAlive: false } // Chi tiết thường cần load lại
      }
    ]
  },
   { path: '/product', component: trangChu,
    children:[
      {
        path:'',
        component:mainContentUser
      },
      {
        path:'cua-hang',
        component:mainCuaHang
      },
      {
        path:'detail/:id',
        component:mainSanPhamDetail
      },
      {
        path:'checkout',
        component:mainThanhToan
      },
      {
        path:'cart',
        component:mainCart
      },
      {
        path:'success/:ma',
        component:datHangThanhCong
      }
    ]
   },
   {
    path: '/profile', component: mainProfile,
    children:[
      {
        path:'don-hang/:ma',
        component:mainDonHangKhachHang
      },
      {
        
          path:'hoa-don',
          component:hoaDonKhachHang
      
      }
    ]

    
   }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router