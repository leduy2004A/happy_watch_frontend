<template>

      <v-card class="pa-4">
        <!-- Action Buttons -->
        <v-row>
          <v-col cols="6" class="d-flex justify-start">
            <v-btn color="orange" class="mr-2" @click="confirmDelivery">
              Xác nhận giao hàng
            </v-btn>
            <v-btn color="red" @click="cancelOrder">
              Hủy đơn
            </v-btn>
          </v-col>
          <v-col cols="6" class="d-flex justify-end">
            <v-btn outlined color="orange" @click="viewDetails">
              Chi tiết
            </v-btn>
            <v-btn outlined color="orange" class="ml-2" @click="updateOrder">
              Cập nhật
            </v-btn>
          </v-col>
        </v-row>
  
        <!-- Order Information -->
        <v-divider class="my-4"></v-divider>
        <h5 class="mb-4">Thông tin đơn hàng - Đơn tại quầy</h5>
        <v-row>
          <v-col cols="4" >
            <p><strong>Mã:</strong> HD13</p>
            <p><strong>Số điện thoại người nhận:</strong> 0473029182</p>
          </v-col>
          <v-col cols="4" >
            <p><strong>Tên khách hàng:</strong> Nguyễn Thị Thùy Dương</p>
            <p>
              <strong>Trạng thái:</strong>
              <v-chip color="orange lighten-4" text-color="orange" outlined>
                Chờ giao hàng
              </v-chip>
            </p>
        </v-col>
        <v-col cols="4">
             <p>
              <strong>Loại:</strong>
              <v-chip color="blue lighten-4" text-color="blue" outlined>
                Giao hàng
              </v-chip>
            </p>
            <p><strong>Tên người nhận:</strong> Địa chỉ 12</p>
        </v-col>
           
          
        </v-row>
      </v-card>

  </template>
  
  <script>
  export default {
    name: "OrderInfo",
    methods: {
      confirmDelivery() {
        // Xử lý xác nhận giao hàng
        console.log("Xác nhận giao hàng");
      },
      cancelOrder() {
        // Xử lý hủy đơn hàng
        console.log("Hủy đơn hàng");
      },
      viewDetails() {
        // Xem chi tiết đơn hàng
        console.log("Xem chi tiết đơn hàng");
      },
      updateOrder() {
        // Cập nhật đơn hàng
        console.log("Cập nhật đơn hàng");
      }
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    max-width: 100%;
    margin: auto;
  }
  </style>
  