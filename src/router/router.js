import { createWebHistory, createRouter } from 'vue-router'

import page_admin from '../components/admin/page_admin.vue';
import main_content from '@/components/admin/BanHangTaiQuay/main_content.vue';
import AppFooter from '@/components/AppFooter.vue';
import user from '../components/user/user.vue'
import hoa_don_pdf from '@/components/admin/BanHangTaiQuay/hoa_don_pdf.vue';
const routes = [
  { path: '/admin', component: page_admin,
    children:[
      {
        path:'sell',
        component:main_content
      },
      {
        path:'thongke',
        component:user
      },
      {
        path:'pdf_check',
        component:hoa_don_pdf
      }
    ]
   },
   { path: '/product', component: user,
    children:[
      {
        path:'sell',
        component:main_content
      },
      {
        path:'hoadon',
        component:AppFooter
      }
    ]
   },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router