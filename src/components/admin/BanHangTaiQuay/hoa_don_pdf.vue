<template>
    <div class="invoice-container" id="invoice">
      <!-- Header -->
      <div class="header">
        <div class="left">
      
      <!-- Logo triangle màu cam -->
       <img src="/src/jpg/cheerful_clock_logo.jpg" alt="" width="100px">
      <!-- <svg width="200" height="200" viewBox="0 0 200 200">
        <path d="M100 0 L200 200 L0 200 Z" fill="#FF6B35" opacity="0.2"/>
      </svg> -->

        </div>
        <div class="center">
          <h1>Happy Watch</h1>
          <p>Số điện thoại: 0355512589</p>
          <p>Email: leduy4520@gmail.com</p>
          <p>Địa chỉ: FPT POLYTECHNIC Cơ Sở Kiều Mai, P. Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội</p>
        </div>
      </div>
  
      <h2 class="invoice-title">HÓA ĐƠN BÁN HÀNG</h2>
  
      <!-- Customer Info -->
      <div class="customer-info">
        <p>Tên khách hàng: {{ customerName }}</p>
        <p>Địa chỉ nhận hàng: {{ deliveryAddress }}</p>
        <p>Nhân viên: {{ staffName }}</p>
        <div class="invoice-details">
          <p>Mã Hóa Đơn: {{ invoiceCode }}</p>
          <p>Ngày tạo: {{ createdDate }}</p>
          <p>Trạng thái: {{ status }}</p>
        </div>
      </div>
  
      <!-- Products Table -->
      <h3>DANH SÁCH SẢN PHẨM</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in products" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency(item.total) }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Total Section -->
      <div class="total-section">
        <p>Tổng tiền hàng: {{ formatCurrency(subtotal) }}</p>
        <p>Giảm giá: {{ formatCurrency(discount) }}</p>
        <p>Phí giao hàng: {{ formatCurrency(shippingFee) }}</p>
        <p class="grand-total">Tổng tiền cần thanh toán: {{ formatCurrency(total) }}</p>
      </div>
    </div>
  
   
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import html2pdf from 'html2pdf.js'
  import useEmitter from '@/useEmitter';
  const emitter = useEmitter()
  // Khai báo các biến sử dụng ref để lưu dữ liệu động
  const customerName = ref('Khách lẻ')
  const deliveryAddress = ref('Tại cửa hàng')
  const staffName = ref('NV6 - Nguyễn Văn Nhật')
  const invoiceCode = ref('HD10')
  const createdDate = ref('21-12-2023 13:48:14')
  const status = ref('Hoàn thành')
  
  // Danh sách sản phẩm
  const products = ref([
    {
      name: 'Kkkk St st "Xanh đen"',
      quantity: 3,
      price: 80000,
      total: 240000,
      status: ''
    },
    {
      name: 'Converse Venom Da nhám "Tím"',
      quantity: 3,
      price: 712500,
      total: 2137500,
      status: ''
    }
  ])
  
  // Các giá trị tính toán khác
  const subtotal = ref(2377500)
  const discount = ref(250000)
  const shippingFee = ref(0)
  const total = ref(2127500)
  
    onMounted(()=>{
        emitter.on("dataExportPdf",data=>{
            console.log("Duyyy")
            generatePDF()
        })
    })

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }
  
  // Hàm xuất file PDF
  const generatePDF = () => {
    const element = document.getElementById('invoice')
    const opt = {
      margin: 1,
      filename: 'hoa-don.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }
  </script>
  
  
  <style scoped>
.invoice-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
/* Để định vị watermark */
  background: white;
}

/* Style cho watermark */
/* .watermark {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none; 
} */
img{
    
}
/* Đảm bảo nội dung hiển thị trên watermark */
.header,
.invoice-title,
.customer-info,
.products-table,
.total-section {
  position: relative;
  z-index: 1;
}
  .header {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .qr-code {
    width: 100px;
    height: 100px;
  }
  
  .invoice-title {
    text-align: center;
    margin: 20px 0;
  }
  
  .products-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  .products-table th,
  .products-table td {
    border: 1px solid #000;
    padding: 8px;
    text-align: left;
  }
  
  .total-section {
    margin-top: 20px;
    text-align: right;
  }
  
  .grand-total {
    font-weight: bold;
    font-size: 1.2em;
  }
  </style>