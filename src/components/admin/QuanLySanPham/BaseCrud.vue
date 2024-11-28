<!-- components/BaseCrudManagement.vue -->
<template>
  <div class="card">
    <div class="flex align-items-center justify-content-between p-4">
      <h2>{{ title }}</h2>
    </div>

    <div class="p-4">
      <!-- Search and Action Buttons -->
      <div class="flex align-items-center gap-4 mb-4">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="search"
            :placeholder="searchPlaceholder"
            class="p-inputtext-sm"
          />
        </span>

        <Button
          v-if="showExport"
          class="p-button-outlined"
          @click="handleExport"
        >
          <i class="pi pi-file-excel mr-2"></i>
          Export Excel
        </Button>

        <Button
          v-if="showAdd"
          @click="openDialog()"
        >
          <i class="pi pi-plus mr-2"></i>
          {{ addButtonText }}
        </Button>
      </div>

      <!-- Data Table -->
      <DataTable
        :value="items"
        :loading="loading"
        :rows="itemsPerPage"
        :filters="filters"
        stripedRows
        paginator
        table-style="min-width: 30rem"
        class="p-datatable-sm text-center"
      >
        <!-- STT Column -->
        <Column
          field="stt"
          header="STT"
          style="width: 80px"
                    alignHeader="center"
          class="text-center"
        >
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>

        <!-- Dynamic Columns -->
        <template v-for="header in tableHeaders" :key="header.key">
          <Column
            :field="header.key"
            :header="header.title || header.header"
            :sortable="header.sortable"
          >
            <template #body="slotProps" v-if="$slots[header.key]">
              <slot :name="header.key" v-bind="slotProps" />
            </template>
          </Column>
        </template>

        <!-- Actions Column -->
        <Column header="Actions" style="width: 80px">
          <template #body="{ data }">
            <div class="flex gap-2 justify-content-center">
              <Button
                v-if="showView"
                icon="pi pi-eye"
                class="p-button-text p-button-rounded"
                @click="handleView(data)"
              />
              <Button
                v-if="showEdit"
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded p-button-warning"
                @click="handleEdit(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- CRUD Dialog -->
    <Dialog
      v-model:visible="dialog"
      :style="{ width: dialogWidth }"
      :modal="true"
      :closable="false"
    >
      <template #header>
        <h3>{{ dialogTitle }}</h3>
      </template>

      <div class="p-fluid">
        <slot
          name="dialog-content"
          :edited-item="editedItem"
          :is-editing="isEditing"
          :show-adress="isEditing"
          @update:edited-item="handleUpdateEditedItem"
        ></slot>
      </div>

      <template #footer>
        <Button
          :label="saveButtonText"
          @click="handleSave"
          :loading="saving"
          class="mr-2"
        />
        <Button
          :label="cancelButtonText"
          @click="closeDialog"
          :disabled="saving"
          class="p-button-text"
        />
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '400px' }"
      :modal="true"
    >
      <template #header>
        <h3>Xác nhận xóa</h3>
      </template>

      <div>{{ deleteConfirmText }}</div>

      <template #footer>
        <Button
          label="Xóa"
          @click="handleDelete"
          :loading="deleting"
          class="p-button-danger mr-2"
        />
        <Button
          label="Hủy"
          @click="deleteDialog = false"
          :disabled="deleting"
          class="p-button-text"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useEmitter from '@/useEmitter'

const emitter = useEmitter()

const props = defineProps({
  // Basic props
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  tableHeaders: {
    type: Array,
    required: true
  },
  
  // Configuration props
  itemsPerPage: {
    type: Number,
    default: 5
  },
  dialogWidth: {
    type: String,
    default: '500px'
  },
  
  // Feature flags
  showExport: {
    type: Boolean,
    default: true
  },
  showAdd: {
    type: Boolean,
    default: true
  },
  showView: {
    type: Boolean,
    default: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  
  // Text customization
  searchPlaceholder: {
    type: String,
    default: 'Tìm kiếm...'
  },
  addButtonText: {
    type: String,
    default: 'Thêm mới'
  },
  saveButtonText: {
    type: String,
    default: 'Lưu'
  },
  cancelButtonText: {
    type: String,
    default: 'Hủy'
  },
  deleteConfirmText: {
    type: String,
    default: 'Bạn có chắc chắn muốn xóa mục này?'
  },
  
  // Default item structure
  defaultItem: {
    type: Object,
    required: true
  }
})

// State management
const search = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({ ...props.defaultItem })
const itemToDelete = ref(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Computed properties
const isEditing = computed(() => editedIndex.value > -1)
const dialogTitle = computed(() => isEditing.value ? 'Chỉnh sửa' : 'Thêm mới')

// Methods for handling item updates
function handleUpdateEditedItem(value) {
  editedItem.value = value
  console.log('Updated edited item:', editedItem.value)
}

function openDialog(item = null) {
  if (item) {
    editedIndex.value = props.items.findIndex(i => i.id === item.id)
    editedItem.value = { ...item }
    console.log('Opening edit dialog for item:', item)
    console.log('Edit index:', editedIndex.value)
  } else {
    editedIndex.value = -1
    editedItem.value = { ...props.defaultItem }
    console.log('Opening create dialog')
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  setTimeout(() => {
    editedItem.value = { ...props.defaultItem }
    editedIndex.value = -1
    console.log('Dialog closed and state reset')
  }, 300)
}

function handleView(item) {
  console.log('Viewing item:', item)
  emitter.emit('crud:view', item.raw)
}

function handleEdit(item) {
  const itemData = item.raw || item
  editedIndex.value = props.items.findIndex(i => i.id === itemData.id)
  editedItem.value = { ...itemData }
  emitter.emit('crud:edit', itemData)
  console.log('Editing item:', editedItem.value)
  console.log('Edit index:', editedIndex.value)
  dialog.value = true
}

async function handleSave() {
  try {
    saving.value = true
    console.log('Saving item. Is editing?', isEditing.value)
    console.log('Current editedIndex:', editedIndex.value)
    console.log('Current editedItem:', editedItem.value)

    if (editedIndex.value > -1) {
      console.log('Updating existing item')
      emitter.emit('crud:update', {
        item: editedItem.value,
        index: editedIndex.value
      })
    } else {
      console.log('Creating new item')
      emitter.emit('crud:create', editedItem.value)
    }
    
    closeDialog()
  } catch (error) {
    console.error('Error in handleSave:', error)
    emitter.emit('crud:error', error)
  } finally {
    saving.value = false
  }
}

function confirmDelete(item) {
  console.log('Confirming delete for item:', item)
  // Đảm bảo lấy đúng data từ item
  itemToDelete.value = item.raw || item
  deleteDialog.value = true
}

async function handleDelete() {
  try {
    deleting.value = true
    console.log('Deleting item:', itemToDelete.value)
    
    if (itemToDelete.value) {
      emitter.emit('crud:delete', itemToDelete.value)
      deleteDialog.value = false
      itemToDelete.value = null
    }
  } catch (error) {
    console.error('Error in handleDelete:', error)
    emitter.emit('crud:error', error)
  } finally {
    deleting.value = false
  }
}

function handleExport() {
  console.log('Exporting items')
  emitter.emit('crud:export', props.items)
}

</script>
<style scoped>
.table-container {
  padding: 1rem !important;
  margin: 0 !important;
  width: 100% !important;
}

:deep(.p-datatable) {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.p-datatable-wrapper) {
  text-align: center;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

</style>