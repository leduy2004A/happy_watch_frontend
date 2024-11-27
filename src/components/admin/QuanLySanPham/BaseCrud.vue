<!-- components/BaseCrudManagement.vue -->
<template>
  <v-container>
    <v-card flat>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div>{{ title }}</div>
      </v-card-title>

      <v-card-text>
        <!-- Search and Action Buttons -->
        <div class="d-flex align-center gap-4 mb-4">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            :label="searchPlaceholder"
            single-line
            hide-details
            variant="outlined"
            density="compact"
          ></v-text-field>

          <v-btn
            v-if="showExport"
            color="primary"
            prepend-icon="mdi-microsoft-excel"
            variant="outlined"
            @click="handleExport"
          >
            Export Excel
          </v-btn>

          <v-btn
            v-if="showAdd"
            color="primary"
            prepend-icon="mdi-plus"
            @click="openDialog()"
          >
            {{ addButtonText }}
          </v-btn>
        </div>

        <!-- Data Table -->
        <v-data-table
          :headers="tableHeaders"
          :items="items"
          :search="search"
          :items-per-page="itemsPerPage"
          :loading="loading"
          class="elevation-1"
        
        >
          <!-- Custom column for STT -->
          <template v-slot:item.stt="{ index }">
            {{ index + 1 }}
          </template>

          <!-- Custom columns -->
          <template
            v-for="slotName in Object.keys($slots)"
            :key="slotName"
            v-slot:[slotName]="slotData"
          >
            <slot :name="slotName" v-bind="slotData"></slot>
          </template>

          <!-- Default actions column -->
          <template v-slot:item.actions="{ item }">
  <div class="d-flex gap-2 justify-center">
    <v-icon
      v-if="showView"
      color="primary"
      size="small"
      class="mr-3"
      @click="handleView(item)"
    >
      mdi-eye
    </v-icon>
    <v-icon
      v-if="showEdit"
      color="warning"
      size="small"
      @click="handleEdit(item)"
    >
      mdi-pencil
    </v-icon>
    <!-- <v-icon
      v-if="showDelete"
      color="error"
      size="small"
      @click="confirmDelete(item)"
    >
      mdi-delete
    </v-icon> -->
  </div>
</template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- CRUD Dialog -->
    <v-dialog v-model="dialog" :max-width="dialogWidth" persistent>
      <v-card>
        <v-card-title>
          <span>{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <slot
              name="dialog-content"
              :edited-item="editedItem"
              :is-editing="isEditing"
              :show-adress="isEditing"
              @update:edited-item="handleUpdateEditedItem"
            ></slot>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="handleSave"
            :loading="saving"
          >
            {{ saveButtonText }}
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="closeDialog"
            :disabled="saving"
          >
            {{ cancelButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Xác nhận xóa</v-card-title>
        <v-card-text>
          {{ deleteConfirmText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete"
            :loading="deleting"
          >
            Xóa
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            @click="deleteDialog = false"
            :disabled="deleting"
          >
            Hủy
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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