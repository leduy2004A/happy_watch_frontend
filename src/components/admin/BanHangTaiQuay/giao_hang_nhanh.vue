<template>
  <div class="giaohangnhanh">
    <div class="text">
      <div>
        <b>Đơn vị vận chuyển: </b>
        <span style="color: #F26522;">
          Giao hàng nhanh
        </span>
        
      </div>
      <!-- <div>
        <b>Thời gian dự kiến: </b>
        <span style="color: #F26522;">
         {{ formatMillisecondsToDate( props.thoiGianDuKien.leadtime )}}
        </span>
        
      </div> -->
    </div>
    <div class="image">
      <img
        src="https://vieclamquangngai.com.vn/upload/icon/ghn-expresscong-ty-co-phan-dich-vu-giao-hang-nhanh1624848697.png?%3E"
        alt=""
        width="250px"
      />
    </div>
  </div>
</template>
<script setup>
// const props = defineProps({
//   thoiGianDuKien:Object
// })
// function formatMillisecondsToDate(ms) {
//   const date = new Date(ms);
  
//   const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 phía trước nếu cần
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (0-11) và thêm số 0 phía trước
//   const year = date.getFullYear(); // Lấy năm
  
//   return `${day}/${month}/${year}`; // Trả về chuỗi theo định dạng dd/MM/yyyy
// }

</script>
<style scoped>
.giaohangnhanh {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
