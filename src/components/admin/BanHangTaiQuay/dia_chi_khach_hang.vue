<template>
  <div class="diachi2">
    <v-btn variant="outlined" class="mb-5 diachi" @click="openDiaChi()">
        thêm địa chỉ
      </v-btn>
    <v-form ref="formRef" v-model="store.valid">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="store.formData.ten"
            label="Tên người nhận"
            outlined
            dense
            placeholder="Tên người nhận"
            :rules="[(v) => !!v || 'Tên người nhận là bắt buộc']"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="store.formData.phone"
            label="Số điện thoại"
            outlined
            dense
            placeholder="0473029182"
            :rules="[(v) => !!v || 'Số điện thoại']"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="store.formData.province"
            :items="store.provinces"
            label="Tỉnh/thành phố"
            item-title="text"
            item-value="value"
            outlined
            dense
            :rules="[(v) => !!v || 'Tỉnh/thành phố là bắt buộc']"
            @update:modelValue="store.handleProvinceChange"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="store.formData.district"
            :items="store.districts"
            label="Quận/huyện"
            item-title="text"
            item-value="value"
            outlined
            dense
             :rules="[(v) => !!v || 'Quận/huyện là bắt buộc']"
            @update:modelValue="store.handleDistrictChange"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="store.formData.ward"
            :items="store.wards"
            label="Xã/phường/thị trấn"
            item-title="text"
            item-value="value"
            outlined
             :rules="[(v) => !!v || 'Xã/phường/thị trấn là bắt buộc']"
            dense
          ></v-select>
        </v-col>

        <v-col cols="12" md="12">
          <v-text-field
            v-model="store.formData.detailAddress"
            label="Địa chỉ cụ thể"
            outlined
            dense
             :rules="[(v) => !!v || 'Địa chỉ cụ thể là bắt buộc']"
            placeholder="aaaaa"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="6">
          <v-text-field
            v-model="store.formData.note"
            label="Ghi chú"
            outlined
            dense
          ></v-text-field>
        </v-col> -->
      </v-row>
      <giao_hang_nhanh></giao_hang_nhanh>
    </v-form>
  </div>

  <dia_log_dia_chi :dialog="dialog"></dia_log_dia_chi>
</template>

<script setup>
import Sweetalert2 from "sweetalert2";
import dia_log_dia_chi from "./dia_log_dia_chi.vue";
import { useToast } from "vue-toastification";
import { ref, onMounted, watch } from "vue";
import { useAddressStore } from "@/store/diaChiStore";
import { useOrderStore } from "@/store/tienStore";
import giao_hang_nhanh from "./giao_hang_nhanh.vue";
import useEmitter from "@/useEmitter";

import { useInvoiceStore } from "@/store/invoiceStore";
import { useSanPhamTrongHoaDonStore } from "@/store/sanPhamTrongHoaDonStore";
import { useExportPdf } from "./exportPdf";
const { exportToPdf } = useExportPdf()
const sanPhamHoaDonStore = useSanPhamTrongHoaDonStore();
const invoiceStore = useInvoiceStore();
const emitter = useEmitter();
const store = useAddressStore();
const formRef = ref(null);
const tienStore = useOrderStore();
const toast = useToast();
import { useLoading } from "vue-loading-overlay";
const $loading = useLoading({
  loader: "bars",
  lockScroll: false,
  color: "orange",
  isFullPage: true,
  container: null,
});
const props = defineProps({
  diachi: {
    type: Object,
    default: () => ({}),
  },
});


const dialog = ref(false);
// Watch for changes in address data to emit shipping info
watch(
  () => store.getFormData,
  async (newFormData) => {
    if (newFormData.province && newFormData.district && newFormData.ward) {
      emitter.emit("dataShip", store.getShippingData);
    }
  },
  { deep: true }
);

// Watch for changes in props.diachi
watch(
  () => props.diachi,
  async (newDiachi) => {
    await store.updateAddressFromProps(newDiachi);
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await store.fetchProvinces();

  emitter.on("addTab", (data) => {
    store.setHoaDonId(data);
  });

  emitter.on("orderClick", async () => {
    
    Sweetalert2.fire({
        title: "Bạn có muốn xác nhận đơn hàng không?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        denyButtonText: `Không !`,
      }).then(async (result) => {
        if (result.isConfirmed) {
         let loader = null;
         if(tienStore.isDelivery)
      {
         try {
      // Show loading
      loader = $loading.show();
      const result = await store.xacNhanDonHang();
      if (result.result.status == 200) {
        toast.success("Đã xác nhận đơn hàng");
        // Thêm delay trước khi reload

        const dataExportPdf = {
          tenKhachHang: tienStore.customerInfo,
          diaChiNhanHang:
            store.formData.detailAddress +
            ", " +
            tienStore.diachi.xaPhuongThiTran +
            ", " +
            tienStore.diachi.quanHuyen +
            ", " +
            tienStore.diachi.tinhThanhPho,
          nhanVien: "",
          hoaDonId: invoiceStore.hoaDonId,
          maHoaDon: invoiceStore.maHoaDon,
          ngayTao: invoiceStore.ngayTao,
          products: sanPhamHoaDonStore.products,
          tienHang: tienStore.orderAmountFormatted,
          giamGia: tienStore.discountAmountFormatted,
          phiGiaoHang: tienStore.shippingFeeFormatted,
          tongTien: tienStore.formatCurrency(tienStore.totalAmountValue),
        };
        exportToPdf(dataExportPdf);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = window.location.href;
      }
    } catch (error) {
      toast.error(error.response.data || error.response);
    } finally {
      // Hide loading nếu không có reload
      if (loader) {
        loader.hide();
      }
    }
      }else{
        try {
      // Show loading
      loader = $loading.show();
      const result = await store.xacNhanDonHangTaiQuay();
      if (result.result.status == 200) {
        toast.success("Đã xác nhận đơn hàng");
        // Thêm delay trước khi reload

        const dataExportPdf = {
          tenKhachHang: tienStore.customerInfo,
          diaChiNhanHang:
            store.formData.detailAddress +
            ", " +
            tienStore.diachi.xaPhuongThiTran +
            ", " +
            tienStore.diachi.quanHuyen +
            ", " +
            tienStore.diachi.tinhThanhPho,
          nhanVien: "",
          hoaDonId: invoiceStore.hoaDonId,
          maHoaDon: invoiceStore.maHoaDon,
          ngayTao: invoiceStore.ngayTao,
          products: sanPhamHoaDonStore.products,
          tienHang: tienStore.orderAmountFormatted,
          giamGia: tienStore.discountAmountFormatted,
          phiGiaoHang: tienStore.shippingFeeFormatted,
          tongTien: tienStore.formatCurrency(tienStore.totalAmountValue),
        };
        exportToPdf(dataExportPdf);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = window.location.href;
      }
    } catch (error) {
      toast.error(error.response.data || error.response);
    } finally {
      // Hide loading nếu không có reload
      if (loader) {
        loader.hide();
      }
    }
      }
   

        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });

    
  });
  emitter.on("closeDialogDiaChi", (data) => {
    dialog.value = data;
  });
});
const openDiaChi = () => {
  dialog.value = true;
};
</script>

<style scoped>
.v-card {
  margin-top: 20px;
}
.diachi {
  width: 100%;
  display: flex;
  align-self: flex-end;
}
.diachi2 {
  width: 600px;
}
</style>
