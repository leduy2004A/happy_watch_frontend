<template>
  <div class="specifications-container">
    <div class="header-section">
      <h2 class="section-title">
        <i class="pi pi-cog rotate-icon"></i>
        THÔNG SỐ KĨ THUẬT
      </h2>
    </div>

    <Divider />

    <div class="specs-content">
      <DataTable
        :value="filteredSpecifications"
        :rows="13"
        stripedRows
        showGridlines
        tableStyle="min-width: 50rem"
        class="custom-table"
      >
        <Column
          field="label"
          header="Thông số"
          style="width: 50%"
        >
          <template #body="slotProps">
            <div class="spec-label">
              <i :class="getIconForSpec(slotProps.data.label)"></i>
              <span>{{ slotProps.data.label }}</span>
            </div>
          </template>
        </Column>
        
        <Column
          field="value"
          header="Giá trị"
          style="width: 50%"
        >
          <template #body="slotProps">
            <div class="spec-value">
              <Chip
                :label="slotProps.data.value"
                :icon="getChipIcon(slotProps.data.label)"
                :class="getChipClass(slotProps.data.label)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <div class="specs-summary">
      <div class="summary-card" v-for="(summary, index) in specsSummary" :key="index">
        <i :class="summary.icon"></i>
        <div class="summary-content">
          <h3>{{ summary.title }}</h3>
          <p>{{ summary.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useChiTietSanPhamStore } from "@/store/chiTietSanPhamStore";

const useChiTietStore = useChiTietSanPhamStore();
const searchQuery = ref('');

const specifications = computed(() => [
  { label: "Mã sản phẩm", value: useChiTietStore.chiTietSanPham.ma },
  { label: "Kích thước", value: useChiTietStore.chiTietSanPham.kichThuoc + 'MM' },
  { label: "Độ chịu nước", value: useChiTietStore.chiTietSanPham.chongNuoc + 'ATM'},
  { label: "Xuất xứ", value: useChiTietStore.chiTietSanPham.xuatXu },
  { label: "Bảo hành", value: useChiTietStore.chiTietSanPham.baoHanh },
  { label: "Cân nặng", value: `${useChiTietStore.chiTietSanPham.canNang}g` },
  { label: "Màu sắc", value: useChiTietStore.chiTietSanPham.mauSac },
  { label: "Loại máy", value: useChiTietStore.chiTietSanPham.loaiMay },
  { label: "Chất liệu vỏ", value: useChiTietStore.chiTietSanPham.chatLieuVo },
  { label: "Chất liệu dây", value: useChiTietStore.chiTietSanPham.chatLieuDay },
  { label: "Loại kính", value: useChiTietStore.chiTietSanPham.loaiKinh },
  { label: "Hình dáng", value: useChiTietStore.chiTietSanPham.hinhDang },
  { label: "Giới tính", value: useChiTietStore.chiTietSanPham.gioiTinh },
]);

const filteredSpecifications = computed(() => {
  if (!searchQuery.value) return specifications.value;
  return specifications.value.filter(spec => 
    spec.label.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    spec.value.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const specsSummary = computed(() => [
  {
    icon: 'pi pi-cog',
    title: 'Loại máy',
    value: useChiTietStore.chiTietSanPham.loaiMay
  },
  {
    icon: 'pi pi-globe',
    title: 'Xuất xứ',
    value: useChiTietStore.chiTietSanPham.xuatXu
  },
  {
    icon: 'pi pi-star',
    title: 'Chất liệu',
    value: useChiTietStore.chiTietSanPham.chatLieuVo
  }
]);

function getIconForSpec(label) {
  const iconMap = {
    'Mã sản phẩm': 'pi pi-id-card',
    'Kích thước': 'pi pi-arrows-alt',
    'Độ chịu nước': 'pi pi-water',
    'Xuất xứ': 'pi pi-globe',
    'Bảo hành': 'pi pi-shield',
    'Cân nặng': 'pi pi-weight',
    'Màu sắc': 'pi pi-palette',
    'Loại máy': 'pi pi-cog',
    'Chất liệu vỏ': 'pi pi-box',
    'Chất liệu dây': 'pi pi-link',
    'Loại kính': 'pi pi-circle',
    'Hình dáng': 'pi pi-shape',
    'Giới tính': 'pi pi-user'
  };
  return iconMap[label] || 'pi pi-info-circle';
}

function getChipIcon(label) {
  if (label === 'Bảo hành') return 'pi pi-shield';
  if (label === 'Độ chịu nước') return 'pi pi-water';
  return '';
}

function getChipClass(label) {
  const classMap = {
    'Bảo hành': 'warranty-chip',
    'Độ chịu nước': 'water-resistance-chip',
    'Chất liệu vỏ': 'material-chip'
  };
  return classMap[label] || 'default-chip';
}
</script>

<style scoped>
.specifications-container {
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rotate-icon {
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-section {
  width: 300px;
}

.custom-table {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.spec-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.spec-label i {
  color: var(--primary-color);
}

.spec-value {
  display: flex;
  align-items: center;
}

.p-chip {
  background: var(--surface-200);
}

.warranty-chip {
  background: var(--green-100) !important;
  color: var(--green-700) !important;
}

.water-resistance-chip {
  background: var(--blue-100) !important;
  color: var(--blue-700) !important;
}

.material-chip {
  background: var(--purple-100) !important;
  color: var(--purple-700) !important;
}

.specs-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-100);
  border-radius: 8px;
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.summary-content h3 {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  margin: 0;
}

.summary-content p {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

:deep(.p-datatable-gridlines) {
  .p-datatable-thead > tr > th {
    background: var(--surface-100);
    color: var(--primary-color);
    font-weight: 600;
  }
}

:deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: var(--surface-50);
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>