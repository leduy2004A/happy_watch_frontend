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
        path: 'bill-detail/:ma',
        component: chiTietHoaDon,
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
        path:'success',
        component:datHangThanhCong
      }
    ]
   },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router