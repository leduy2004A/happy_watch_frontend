<!-- views/UserManagement.vue -->
<template>
  <BaseCrud title="Quản lý thương hiệu" :items="data" :table-headers="headers">
    <!-- :default-item="defaultItem" -->
    <!-- Custom dialog content -->
    <template #dialog-content="{ editedItem }">
      <v-row>
        <v-col cols="12" sm="12">
          <v-text-field
            v-model="editedItem.ten"
            label="Tên thương hiệu"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <!-- Custom status column -->
    <!-- <template #item.status="{ item }">
      <v-chip
        :color="item.status === 'Hoạt động' ? 'success' : 'error'"
        size="small"
      >
        {{ item.status }}
      </v-chip>
    </template> -->
  </BaseCrud>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BaseCrud from "./BaseCrud.vue";
import { useToast } from "vue-toastification";
const toast = useToast();
import useEmitter from "@/useEmitter";
import { layTatCaThuongHieu,addThuongHieu,updateThuongHieu } from "@/axios/sanpham";
// import { addThuongHieu } from "@/axios/sanpham";
const emitter = useEmitter();
// Table headers
const headers = [
  // { title: "STT", key: "stt", align: "center" },
  { title: "Tên Thương Hiệu", key: "ten", align: "center" },
  // { title: 'Ngày Thêm', key: 'ngaythem', align: 'center' },
  // { title: 'Số điện thoại', key: 'phone', align: 'start' },
  // { title: 'Trạng thái', key: 'status', align: 'center' },
  // { title: "Thao tác", key: "actions", align: "center" },
];

// Default item structure
// const defaultItem = {
//   fullName: '',
//   email: '',
//   phone: '',
//   status: 'Hoạt động'
// }

// Mock data
const data = ref([
  {
    id: 3,
    ma: "TH03",
    ten: "Seiko",
    logo: "logo3.png",
  },
]);

// CRUD handlers
const handleCreate = async (newItem) => {
  console.log(newItem);
  try {
    console.log("Creating:", newItem);
    const result = await addThuongHieu(newItem);
    if (result.status === 200) {
      toast.success("Thêm thương hiệu thành công");
      // const dataAdd = { ...newItem, id: data.value.length + 1 };
      console.log(result);
      data.value.push(result.data);
    } else {
      toast.error("Có lỗi xảy ra");
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
};

const handleUpdate = async ({ item, index }) => {
  try {
    console.log("Updating:", item);
    
    const result = await updateThuongHieu(item)
    if(result.status === 200)
    {
      data.value[index] = { ...item, id: data.value[index].id };
      toast.success("Sửa thương hiệu thành công")
    }else {
      toast.error("Có lỗi xảy ra");
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
};

const handleDelete = async (item) => {
  try {
    console.log("Deleting item:", item);

    // Kiểm tra item có tồn tại không
    if (!item || !item.id) {
      console.error("Invalid item to delete:", item);
      return;
    }

    const index = users.value.findIndex((user) => user.id === item.id);
    console.log("Found index:", index, "for id:", item.id);

    if (index > -1) {
      users.value.splice(index, 1);
      console.log("Successfully deleted user at index:", index);
    } else {
      console.warn("User not found with id:", item.id);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    emitter.emit("crud:error", error);
  }
};

const handleExport = (items) => {
  console.log("Exporting:", items);
};

const handleError = (error) => {
  console.error("Error:", error);
};

// Đăng ký listeners khi component được mount
onMounted(async () => {
  emitter.on("crud:create", handleCreate);
  emitter.on("crud:update", handleUpdate);
  emitter.on("crud:delete", handleDelete);
  emitter.on("crud:export", handleExport);
  emitter.on("crud:error", handleError);
  try {
    const result = await layTatCaThuongHieu();
    data.value = result.data;
  } catch (e) {
    toast.error("Có lỗi xảy ra");
  }
});

// Hủy đăng ký listeners khi component bị destroy
onUnmounted(() => {
  emitter.off("crud:create", handleCreate);
  emitter.off("crud:update", handleUpdate);
  emitter.off("crud:delete", handleDelete);
  emitter.off("crud:export", handleExport);
  emitter.off("crud:error", handleError);
});
</script>
