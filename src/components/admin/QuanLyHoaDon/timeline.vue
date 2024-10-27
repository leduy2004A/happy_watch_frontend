<template>
  
    <div class="timeline-container">
      <v-timeline align="start">
        <v-timeline-item
          v-for="(item, index) in timelineItems"
          :key="index"
          :dot-color="item.color"
          size="small"
          :line-color="getLineColor(index)"
        >
          <template v-slot:opposite>
            <div class="text-caption">
              {{ formatDate(item.timestamp) }}
            </div>
          </template>
          <v-card variant="flat" :color="item.color" class="pa-2 rounded-lg">
            <div class="d-flex align-center mb-2">
              <v-icon :color="item.iconColor" size="24" class="mr-2">
                {{ item.icon }}
              </v-icon>
              <div class="text-body-1 font-weight-medium">{{ item.title }}</div>
            </div>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
  
</template>

<script>
export default {
  name: 'OrderTimeline',
  data() {
    return {
      timelineItems: [
        {
          title: 'Tạo đơn hàng',
          timestamp: '2023-12-21 13:48:17',
          color: 'green-lighten-4',
          icon: 'mdi-file-document-outline',
          iconColor: 'green'
        },
        {
          title: 'Chờ xác nhận',
          timestamp: '2023-12-21 13:52:38',
          color: 'green-lighten-4',
          icon: 'mdi-file-document-outline',
          iconColor: 'green'
        },
        {
          title: 'Chờ giao hàng',
          timestamp: '2023-12-21 13:52:56',
          color: 'amber-lighten-4',
          icon: 'mdi-check-circle',
          iconColor: 'amber'
        },
         {
          title: 'Chờ giao hàng',
          timestamp: '2023-12-21 13:52:56',
          color: 'amber-lighten-4',
          icon: 'mdi-check-circle',
          iconColor: 'amber'
        },
        {
          title: 'Chờ xác nhận',
          timestamp: '2023-12-21 13:53:23',
          color: 'green-lighten-4',
          icon: 'mdi-file-document-outline',
          iconColor: 'green'
        },
        {
          title: 'Chờ xác nhận',
          timestamp: '2023-12-21 13:53:23',
          color: 'green-lighten-4',
          icon: 'mdi-file-document-outline',
          iconColor: 'green'
        },
        {
          title: 'Chờ xác nhận',
          timestamp: '2023-12-21 13:53:23',
          color: 'green-lighten-4',
          icon: 'mdi-file-document-outline',
          iconColor: 'green'
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    getLineColor(index) {
      if (index < this.timelineItems.length - 1) {
        return this.timelineItems[index + 1].iconColor
      }
      return 'grey'
    }
  }
}
</script>

<style scoped>
.timeline-container {
  max-height: 200px; /* Đặt chiều cao tối đa */
  overflow-y: auto;  /* Cho phép cuộn dọc khi nội dung vượt quá */
  padding-right: 10px; /* Khoảng cách để không che mất phần nội dung khi cuộn */
}
.v-timeline {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
