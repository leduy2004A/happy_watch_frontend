<template>
 
    <v-dialog max-width="500" v-model="modal" persistent :scrollable="true">
<template v-slot:default>
  <v-card title="Dialog" height="200">
    <v-card-text>
      <div style="border: 2px solid black">
  		<qrcode-stream :track="paintBoundingBox" @detect="onDetect" @error="onError"></qrcode-stream>
    </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn
        text="Close Dialog"
        @click="closeDialog"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>
</v-dialog>

</template>
<script setup>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { addSanPhamVaoHoaDon } from '@/axios/hoadon';
import { ref,watch } from 'vue';
import useEmitter from '@/useEmitter';
const emitter = useEmitter()
const props = defineProps({
dialog:Boolean
})
const modal = ref(false)
const closeDialog = ()=>{
    modal.value = false
    emitter.emit("closeQr",false)
}

watch(() => props.dialog, (newValue) => {
  modal.value = newValue
});

const result = ref('')
  const error = ref('')

  function paintBoundingBox(detectedCodes, ctx) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: { x, y, width, height }
      } = detectedCode

      ctx.lineWidth = 2
      ctx.strokeStyle = '#007bff'
      ctx.strokeRect(x, y, width, height)
    }
  }

  function onError(err) {
    error.value = `[${err.name}]: `

    if (err.name === 'NotAllowedError') {
      error.value += 'you need to grant camera access permission'
    } else if (err.name === 'NotFoundError') {
      error.value += 'no camera on this device'
    } else if (err.name === 'NotSupportedError') {
      error.value += 'secure context required (HTTPS, localhost)'
    } else if (err.name === 'NotReadableError') {
      error.value += 'is the camera already in use?'
    } else if (err.name === 'OverconstrainedError') {
      error.value += 'installed cameras are not suitable'
    } else if (err.name === 'StreamApiNotSupportedError') {
      error.value += 'Stream API is not supported in this browser'
    } else if (err.name === 'InsecureContextError') {
      error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
    } else {
      error.value += err.message
    }
  }

  function onDetect(detectedCodes) {
    result.value = JSON.stringify(
      detectedCodes.map(code => code.rawValue)
    )
    console.log(result.value)
  }

</script>
<style scoped>

</style>