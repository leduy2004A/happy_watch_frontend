<template>
  <div class="timeline-container">
    <div
      v-if="store.loading"
      class="d-flex justify-center align-center"
      style="height: 200px"
    >
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
        </v-card>
      </v-timeline-item>
    </v-timeline>

  </div>
  <v-btn class="mb-4" color="red" flat @click="huyHoaDonNe()" v-if="openHuy"
      >Huỷ hoá đơn</v-btn
    >
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTimelineStore } from "@/store/timelineStore";
import { huyHoaDonTheoMaHoaDon } from "@/axios/sanpham";
import { useToast } from "vue-toastification";
import Sweetalert2 from "sweetalert2";
const toast = useToast();
const openHuy = ref(true);
const route = useRoute();
const store = useTimelineStore();

onMounted(async () => {
  await store.fetchTimeline(route.params.ma);
  console.log(store.timelineItems);
  const result = store.timelineItems.some(
    (item) => item.title.toLowerCase() === "Đã thanh toán".toLowerCase()
    ||  item.title.toLowerCase() === "Đã Hủy".toLowerCase()
  );
  console.log(result)
  openHuy.value = !result;
});
const huyHoaDonNe = async () => {
  Sweetalert2.fire({
    title: "Bạn có xác nhận huỷ không?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Xác nhận",
    denyButtonText: `Không !`,
  }).then(async (resultNhe) => {
    if(resultNhe.isConfirmed)
    {
    const result = await huyHoaDonTheoMaHoaDon(route.params.ma);
    if (result.status === 200) {
      await store.fetchTimeline(route.params.ma);
      openHuy.value = false
      toast.success("Đã huỷ hoá đơn!");

    }
    }

  });
};
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
