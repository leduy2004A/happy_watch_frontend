<template>
  <div class="card">
    <div class="p-fluid mb-4 mx-4 my-4">
      <h4 class="mb-4">Trả hàng</h4>
      <div class="p-inputgroup" style="max-width: 400px">
        <InputText
          v-model="store.searchQuery"
          placeholder="Tìm kiếm hoá đơn"
          class="mr-3"
        />
        <Button icon="pi pi-search" @click="findHoaDon()" label="Tìm kiếm" />
      </div>
    </div>

    <DataTable :value="store.products" class="mb-4">
      <Column style="width: 50px">
        <template #header>
          <Checkbox
            :modelValue="store.selectAll"
            @update:modelValue="store.toggleSelectAll"
            :binary="true"
          />
        </template>
        <template #body="slotProps">
          <Checkbox
            :modelValue="slotProps.data.selected"
            @update:modelValue="
              (value) =>
                store.toggleProductSelection(
                  slotProps.data.chiTietSanPhamId,
                  value
                )
            "
            :binary="true"
          />
        </template>
      </Column>

      <Column field="tenSanPham" header="Sản phẩm">
        <template #body="slotProps">
          <div class="flex align-items-center">
            <Image
              :src="slotProps.data.hinhAnh"
              width="50"
              height="50"
              class="mr-2"
            />
            <span
              >{{ slotProps.data.tenSanPham }}– {{ slotProps.data.gioiTinh }} –
              {{ slotProps.data.loaiKinhSanPham }} –
              {{ slotProps.data.chatLieuVoSanPham }} –
              {{ slotProps.data.loaiMaySanPham }} –
              {{ slotProps.data.chatLieuDaySanPham }}</span
            >
          </div>
        </template>
      </Column>

      <Column header="Số lượng" class="text-center">
        <template #body="slotProps">
          <div class="flex align-items-center">
            <Button
              icon="pi pi-minus"
              @click="store.decreaseQuantity(slotProps.data.chiTietSanPhamId)"
              severity="secondary"
              text
            />
            <span class="mx-2"
              >{{ slotProps.data.quantity }}/{{ slotProps.data.soLuong }}</span
            >
            <Button
              icon="pi pi-plus"
              @click="store.increaseQuantity(slotProps.data.chiTietSanPhamId)"
              severity="secondary"
              text
            />
          </div>
        </template>
      </Column>

      <Column field="giaTungSanPham" header="Đơn giá">
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.giaTungSanPham) }}
        </template>
      </Column>
    </DataTable>

    <div class="grid">
      <div class="col-12 md:col-8">
        <Panel header="Danh sách sản phẩm trả">
          <template #icons>
            <i class="pi pi-list mr-2"></i>
          </template>

          <DataTable
            v-if="store.selectedProducts.length"
            :value="store.selectedProducts"
          >
            <Column field="tenSanPham" header="Sản phẩm">
              <template #body="slotProps">
                <div class="flex align-items-center">
                  <Image
                    :src="slotProps.data.hinhAnh"
                    width="50"
                    height="50"
                    class="mr-2"
                  />
                  <span
                    >{{ slotProps.data.tenSanPham }}–
                    {{ slotProps.data.gioiTinh }} –
                    {{ slotProps.data.loaiKinhSanPham }} –
                    {{ slotProps.data.chatLieuVoSanPham }} –
                    {{ slotProps.data.loaiMaySanPham }} –
                    {{ slotProps.data.chatLieuDaySanPham }}</span
                  >
                </div>
              </template>
            </Column>
            <Column field="quantity" header="Số lượng" class="text-center" />
            <Column field="giaTungSanPham" header="Đơn giá" class="text-right">
              <template #body="slotProps">
                {{ formatPrice(slotProps.data.giaTungSanPham) }}
              </template>
            </Column>
            <Column header="Tổng" class="text-right">
              <template #body="slotProps">
                {{
                  formatPrice(
                    slotProps.data.giaTungSanPham * slotProps.data.soLuong
                  )
                }}
              </template>
            </Column>
            <Column header="Ghi chú">
              <template #body="slotProps">
                <InputText
                  v-model="slotProps.data.note"
                  @input="
                    (e) =>
                      store.updateNote(
                        slotProps.data.chiTietSanPhamId,
                        e.target.value
                      )
                  "
                />
              </template>
            </Column>
          </DataTable>
          <div v-else class="text-center p-6">
            <i
              class="pi pi-folder-open"
              style="font-size: 3rem; color: var(--text-color-secondary)"
            ></i>
            <div class="mt-2">No Data Found</div>
          </div>
        </Panel>
      </div>

      <div class="col-12 md:col-4">
        <Panel header="Thông tin hoàn trả">
          <div class="mb-4">
            <div class="flex align-items-center mb-2">
              <i class="pi pi-user mr-2"></i>
              <div>
                <div class="font-bold">Người nhận</div>
                <div>{{ store.diaChi.tenNguoiNhan }}</div>
              </div>
            </div>

            <div
              class="flex align-items-start"
              v-if="
                store.diaChi.diaChiCuThe &&
                store.diaChi.xaPhuongThiTran &&
                store.diaChi.quanHuyen &&
                store.diaChi.tinhThanhPho != ''
              "
            >
              <i class="pi pi-map-marker mr-2 mt-1"></i>
              <div>
                <div class="font-bold">Địa chỉ</div>
                <div>
                  {{ store.diaChi.diaChiCuThe }},
                  {{ store.diaChi.xaPhuongThiTran }},
                  {{ store.diaChi.quanHuyen }}, {{ store.diaChi.tinhThanhPho }}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div class="flex justify-content-between mb-2">
            <span>Tổng tiền hoá đơn</span>
            <span>{{ formatPrice(store.tongTienSauKhuyenMai) }}</span>
          </div>
          <div class="flex justify-content-between mb-2">
            <span>Tổng giá sau trả hàng</span>
            <span>{{ formatPrice(store.tongGiaSauTraHang) }}</span>
          </div>
          <div class="flex justify-content-between mb-2">
            <span>Khuyến mãi</span>
            <span>{{ store.khuyenMai }}</span>
          </div>

          <div class="flex justify-content-between mb-2">
            <span>Giá trị hoàn trả</span>
            <span>{{
              store.giaTriHoanTraMoi === 'Tiền hoàn trả vượt quá số tiền đã mua' ? store.giaTriHoanTraMoi: formatPrice(store.giaTriHoanTraMoi)
            }}</span>
          </div>
          <Button
            label="TRẢ HÀNG"
            severity="warning"
            @click="store.submitReturn"
            :disabled="!store.selectedProducts.length || store.giaTriHoanTraMoi === 'Tiền hoàn trả vượt quá số tiền đã mua' ? true:false"
            class="w-full mt-4"
          />
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useReturnProductStore } from "@/store/returnProductStore";
import { watch } from "vue";
const store = useReturnProductStore();

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
watch(
  () => store.selectedProducts,
  (newVal) => {
    store.fetchThongTinTraHang();
  }
);
const findHoaDon = async () => {
  await store.fetchDataStoreByMa(store.searchQuery);
  await store.fetchthongTinGiaoHang(store.searchQuery);
};
</script>

<style scoped>
.p-datatable-wrapper {
  background: transparent;
}
</style>
