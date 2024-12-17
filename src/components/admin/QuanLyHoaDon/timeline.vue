<template>
  <div class="timeline-container">
    <div v-if="store.loading" class="d-flex justify-center align-center" style="height: 200px">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <v-timeline v-else align="start">
      <v-timeline-item
        v-for="(item, index) in store.timelineItems"
        :key="item.id"
        :dot-color="item.color"
        size="small"
        :line-color="store.getLineColor(index)"
      >
        <template v-slot:opposite>
          <div class="text-caption">
            {{ store.formatDate(item.timestamp) }}
          </div>
        </template>
        <v-card variant="flat" :color="item.color" class="pa-2 rounded-lg">
          <div class="d-flex align-center mb-2">
            <v-icon :color="item.iconColor" size="24" class="mr-2">
              {{ item.icon }}
            </v-icon>
            <div class="text-body-1 font-weight-medium">{{ item.title }}</div>
          </div>
          <div v-if="item.note" class="text-caption mt-1">
            {{ item.note }}
          </div>
          <div  class="text-caption mt-1">
           Người thao tác: {{ item.nguoiChinhSua }}
          </div>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTimelineStore } from '@/store/timelineStore';

const route = useRoute();
const store = useTimelineStore();

onMounted(async () => {
  await store.fetchTimeline(route.params.ma);
});
</script>

<style scoped>
.timeline-container {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
}

.v-timeline {
  padding-top: 0;
  padding-bottom: 0;
}
</style>