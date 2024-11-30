<template>
  <div class="bg-black">
    <div class="container px-8 py-8">
      <div class="flex align-items-center justify-content-center">
        <h1 class="text-4xl font-bold text-white">GIẢM GIÁ</h1>
      </div>
      
      <div class="flex align-items-center justify-content-center mb-8 diamond-divider">
        <span v-for="n in 5" :key="n" class="diamond">♦</span>
      </div>

      <Carousel 
        :value="chunkedProducts" 
        :numVisible="1" 
        :numScroll="1"
        :showNavigators="false"
      >
        <template #item="slotProps">
          <div class="grid">
            <div v-for="product in slotProps.data" 
                :key="product.id"
                class="col-12 sm:col-6 md:col-3"
            >
              <Card>
                <template #header>
                  <div class="relative">
                    <Tag v-if="product.isNew" 
                        severity="danger"
                        class="absolute m-2"
                        value="NEW!"
                    />
                    <Tag v-if="product.discount"
                        severity="warning"
                        class="absolute m-2 ml-8"
                        :value="`-${product.discount}%`"
                    />
                    <Image 
                      :src="product.image"
                      :alt="product.name"
                      height="250"
                      imageClass="w-full h-full object-cover"
                      class="card-image"
                    >
                      <template #indicator>
                        <ProgressSpinner />
                      </template>
                    </Image>
                  </div>
                </template>

                <template #title>
                  <div class="text-lg truncate pt-4">{{ product.name }}</div>
                </template>

                <template #content>
                  <div class="flex flex-column">
                    <span class="text-sm line-through text-500 mb-1">
                      {{ formatPrice(product.originalPrice) }}
                    </span>
                    <span class="text-xl text-red-500">
                      {{ formatPrice(product.salePrice) }}
                    </span>
                  </div>
                  <div class="flex justify-content-center mt-4 mb-2">
                    <Button v-for="icon in ['pi pi-heart', 'pi pi-shopping-cart', 'pi pi-search']"
                            :key="icon"
                            :icon="icon"
                            text
                            class="mx-1"
                    />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'Dịch Vụ In Logo Mẫu Lên Mặt Số',
    image: 'https://lh5.googleusercontent.com/proxy/D2R0iAXSS6a04m0Pw5qpPO7sWnkiUYrHMydLZbi9sj5cKY-2vtLGNOUsse7f59opPuvlALVBGq6l9hSn',
    originalPrice: 2990000,
    salePrice: 2590000,
    discount: 15,
    isNew: true
  },
  {
    id: 2,
    name: 'DÂY DA ZRC 654 TASMAN',
    image: 'https://donghoduyanh.com/upload_images/images/2023/12/08/25-nam-may-co-9s-31.jpg',
    originalPrice: 710000,
    salePrice: 639000,
    discount: 10,
    isNew: true
  },
  {
    id: 3,
    name: 'ĐỒNG HỒ ĐÔI SUNRISE SG',
    image: 'https://cdn.tgdd.vn/Files/2021/11/13/1397804/co1_1280x628-800-resize.jpg',
    originalPrice: 4700000,
    salePrice: 4230000,
    discount: 10,
    isNew: true
  },
  {
    id: 4,
    name: 'ĐỒNG HỒ ĐÔI OLYMPIA STAR',
    image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_3_8_638454875983791681_harabo-nen.jpg',
    originalPrice: 7728000,
    salePrice: 6955000,
    discount: 10,
    isNew: true
  },
  {
    id: 5,
    name: 'ĐỒNG HỒ ĐÔI OLYMPIA STAR',
    image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_3_8_638454875983791681_harabo-nen.jpg',
    originalPrice: 7728000,
    salePrice: 6955000,
    discount: 10,
    isNew: true
  }
])

const chunkedProducts = computed(() => {
  const chunks = []
  for (let i = 0; i < products.value.length; i += 4) {
    chunks.push(products.value.slice(i, i + 4))
  }
  return chunks
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
  z-index: 1;
}

.diamond-divider {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.diamond {
  color: white;
  font-size: 12px;
  margin: 0 2px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #888;
}

:deep(.p-image-preview-indicator) {
  background: rgba(0, 0, 0, 0.5);
}

:deep(.p-image) {
  display: block;
}
.relative {
  position: relative;
}

.absolute {
  position: absolute;
  z-index: 1;
}

.diamond-divider {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.diamond {
  color: white;
  font-size: 12px;
  margin: 0 2px;
}

/* Hình ảnh hiển thị đều nhau */
.card-image {
  position: relative;
  width: 100%;
 /* Duy trì tỷ lệ 1:1 */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Grid */
.grid .col-12 {
  display: flex;
  justify-content: center;
}

.grid .col-12 .p-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>