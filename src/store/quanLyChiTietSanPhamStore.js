// stores/productStore.js
import { defineStore } from "pinia";
import {
  addSanPham,
  addThuongHieu,
  layTatCaGioiTinh,
  layTatCaThuongHieu,
  addGioiTinh,
  layTatCaMauSac,
  addMauSac,
  layTatCaHinhDang,
  addHinhDang,
  layTatCaLoaiMay,
  addLoaiMay,
  layTatCaChatLieuVo,
  addChatLieuVo,
  layTatCaChatLieuDay,
  addChatLieuDay,
  layTatCaLoaiKinh,
  addLoaiKinh,
  themChiTietSanPham,
  layChiTietSanPham,
  updateChiTietSanPham
} from "@/axios/sanpham";

export const useCTSPStore = defineStore("CTSPStore ", {
  state: () => ({
    productName: "",
    product: {
      category: "Giày cao cổ",
      brand: "Converse",
      mauSac: "",
      hinhDang: "",
      loaiMay: "",
      chatLieuVo: "",
      chatLieuDay: "",
      loaiKinh: "",
      description: "",
      ma:"",
      kichThuoc:"",
      chongNuoc:"",
      xuatXu:"",
      gia:0,
      soLuong:0,
      canNang:0
    },
    categories: [],
    brands: [],
    mauSac: [],
    hinhDang: [],
    loaiMay: [],
    chatLieuVo: [],
    chatLieuDay: [],
    loaiKinh: [],
    listHinhAnh: [],
    productSuggestions: [
      "Puma 2023",
      "Converse Venom",
      "Rebound Puma V6",
      "Nike Dunk 2022",
      "Balen Grey 2023",
      "Sneakers unisex cổ cao",
    ],
    searchTexts: {
      category: "",
      brand: "",
      mauSac: "",
      hinhDang: "",
      loaiMay: "",
      chatLieuVo: "",
      chatLieuDay: "",
      loaiKinh: "",
    },
    filteredProducts: [],
    showSuggestions: false,
    selectedProduct:null,
    idCTSP:0
  }),

  getters: {
    showAddButton: (state) => ({
      category:
        state.searchTexts.category &&
        !state.categories.some(
          (cat) =>
            cat.ten.toLowerCase() === state.searchTexts.category.toLowerCase()
        ),
      brand:
        state.searchTexts.brand &&
        !state.brands.some(
          (brand) =>
            brand.ten.toLowerCase() === state.searchTexts.brand.toLowerCase()
        ),
      chatLieuVo:
        state.searchTexts.chatLieuVo &&
        !state.chatLieuVo.some(
          (chatLieuVo) =>
            chatLieuVo.ten.toLowerCase() ===
            state.searchTexts.chatLieuVo.toLowerCase()
        ),
      hinhDang:
        state.searchTexts.hinhDang &&
        !state.hinhDang.some(
          (hinhDang) =>
            hinhDang.ten.toLowerCase() ===
            state.searchTexts.hinhDang.toLowerCase()
        ),
      loaiMay:
        state.searchTexts.loaiMay &&
        !state.loaiMay.some(
          (loaiMay) =>
            loaiMay.ten.toLowerCase() ===
            state.searchTexts.loaiMay.toLowerCase()
        ),
      chatLieuDay:
        state.searchTexts.chatLieuDay &&
        !state.chatLieuDay.some(
          (chatLieuDay) =>
            chatLieuDay.ten.toLowerCase() ===
            state.searchTexts.chatLieuDay.toLowerCase()
        ),
      loaiKinh:
        state.searchTexts.loaiKinh &&
        !state.loaiKinh.some(
          (loaiKinh) =>
            loaiKinh.ten.toLowerCase() ===
            state.searchTexts.loaiKinh.toLowerCase()
        ),
    }),
  },

  actions: {
    async fetchInitialData() {
      const [
        gioiTinhRes,
        thuongHieuRes,
        mauSacRes,
        hinhDangRes,
        loaiMayRes,
        chatLieuVoRes,
        chatLieuDayRes,
        loaiKinhRes,
      ] = await Promise.all([
        layTatCaGioiTinh(),
        layTatCaThuongHieu(),
        layTatCaMauSac(),
        layTatCaHinhDang(),
        layTatCaLoaiMay(),
        layTatCaChatLieuVo(),
        layTatCaChatLieuDay(),
        layTatCaLoaiKinh(),
      ]);

      if (gioiTinhRes.status === 200) {
        this.categories = gioiTinhRes.data;
        if (this.categories.length > 0) {
          this.product.category = this.categories[0];
        }
      }

      if (thuongHieuRes.status === 200) {
        this.brands = thuongHieuRes.data;
        if (this.brands.length > 0) {
          this.product.brand = this.brands[0];
        }
      }

      if (mauSacRes.status === 200) {
        this.mauSac = mauSacRes.data;
        if (this.mauSac.length > 0) {
          this.product.mauSac = this.mauSac[0];
        }
      }

      if (hinhDangRes.status === 200) {
        this.hinhDang = hinhDangRes.data;
        if (this.hinhDang.length > 0) {
          this.product.hinhDang = this.hinhDang[0];
        }
      }
      if (loaiMayRes.status === 200) {
        this.loaiMay = loaiMayRes.data;
        if (this.loaiMay.length > 0) {
          this.product.loaiMay = this.loaiMay[0];
        }
      }

      if (chatLieuVoRes.status === 200) {
        this.chatLieuVo = chatLieuVoRes.data;
        if (this.chatLieuVo.length > 0) {
          this.product.chatLieuVo = this.chatLieuVo[0];
        }
      }
      if (chatLieuDayRes.status === 200) {
        this.chatLieuDay = chatLieuDayRes.data;
        if (this.chatLieuDay.length > 0) {
          this.product.chatLieuDay = this.chatLieuDay[0];
        }
      }
      if (loaiKinhRes.status === 200) {
        this.loaiKinh = loaiKinhRes.data;
        if (this.loaiKinh.length > 0) {
          this.product.loaiKinh = this.loaiKinh[0];
        }
      }
    },

    async addNewItem(field) {
      const newValue = this.searchTexts[field];

      if (!newValue) return;

      if (field === "category") {
        const result = await addGioiTinh({ ten: newValue });
        if (result.status === 200) {
          this.categories.push(result.data);
          this.product.category = result.data;
          this.searchTexts.category = "";
          return result;
        }
      }

      if (field === "brand") {
        const result = await addThuongHieu({ ten: newValue });
        if (result.status === 200) {
          this.brands.push(result.data);
          this.product.brand = result.data;
          this.searchTexts.brand = "";
          return result;
        }
      }

      if (field === "mauSac") {
        const result = await addMauSac({ ten: newValue });
        if (result.status === 200) {
          this.mauSac.push(result.data);
          this.product.mauSac = result.data;
          this.searchTexts.mauSac = "";
          return result;
        }
      }

      if (field === "hinhDang") {
        const result = await addHinhDang({ ten: newValue });
        if (result.status === 200) {
          this.hinhDang.push(result.data);
          this.product.hinhDang = result.data;
          this.searchTexts.hinhDang = "";
          return result;
        }
      }

      if (field === "loaiMay") {
        const result = await addLoaiMay({ ten: newValue });
        if (result.status === 200) {
          this.loaiMay.push(result.data);
          this.product.loaiMay = result.data;
          this.searchTexts.loaiMay = "";
          return result;
        }
      }
      if (field === "chatLieuVo") {
        const result = await addChatLieuVo({ ten: newValue });
        if (result.status === 200) {
          this.chatLieuVo.push(result.data);
          this.product.chatLieuVo = result.data;
          this.searchTexts.chatLieuVo = "";
          return result;
        }
      }
      if (field === "chatLieuDay") {
        const result = await addChatLieuDay({ ten: newValue });
        if (result.status === 200) {
          this.chatLieuDay.push(result.data);
          this.product.chatLieuDay = result.data;
          this.searchTexts.chatLieuDay = "";
          return result;
        }
      }
      if (field === "loaiKinh") {
        const result = await addLoaiKinh({ ten: newValue });
        console.log(result);
        if (result.status === 200) {
          this.loaiKinh.push(result.data);
          this.product.loaiKinh = result.data;
          this.searchTexts.loaiKinh = "";
          return result;
        }
      }
    },
    async fetchProductDetails(id) {
      try {
        const response = await layChiTietSanPham(id);
        if (response.status === 200) {
          const data = response.data;
          this.idCTSP = data.id;
          
          // Update product data
          this.product = {
            ...this.product,
            ma: data.ma,
            gia: data.gia,
            soLuong: data.soLuong,
            chongNuoc: data.chongNuoc,
            xuatXu: data.xuatXu,
            canNang: data.canNang,
            description: data.moTa,
            kichThuoc: data.kichThuoc
          };
  
          // Set selected values from dropdown lists
          this.product.mauSac = this.mauSac.find(item => item.ten === data.mauSac) || this.mauSac[0];
          this.product.loaiMay = this.loaiMay.find(item => item.ten === data.loaiMay) || this.loaiMay[0];
          this.product.chatLieuVo = this.chatLieuVo.find(item => item.ten === data.chatLieuVo) || this.chatLieuVo[0];
          this.product.chatLieuDay = this.chatLieuDay.find(item => item.ten === data.chatLieuDay) || this.chatLieuDay[0];
          this.product.loaiKinh = this.loaiKinh.find(item => item.ten === data.loaiKinh) || this.loaiKinh[0];
          this.product.hinhDang = this.hinhDang.find(item => item.ten === data.hinhDang) || this.hinhDang[0];
  
          // Set images
          this.listHinhAnh = data.hinhAnhChiTiet.map(url => ({ url }));
  
          return response;
        }
      } catch (error) {
        console.error('Error fetching CTSP:', error);
        throw error;
      }
    },

    async updateCTSP(idSanPham) {
      if (!this.idCTSP) {
        throw new Error('No CTSP ID provided for update');
      }
  
      const updateData = {
        id: this.idCTSP,
        ma: this.product.ma,
        gia: this.product.gia,
        idSanPham: Number.parseInt(idSanPham),
        idMauSac: this.product.mauSac.id,
        idLoaiMay: this.product.loaiMay.id,
        idChatLieuVo: this.product.chatLieuVo.id,
        idChatLieuDay: this.product.chatLieuDay.id,
        kichThuoc: this.product.kichThuoc,
        chongNuoc: this.product.chongNuoc,
        idLoaiKinh: this.product.loaiKinh.id,
        xuatXu: this.product.xuatXu,
        idHinhDang: this.product.hinhDang.id,
        soLuong: this.product.soLuong,
        canNang: this.product.canNang,
        moTa: this.product.description,
        hinhAnhUrls: this.listHinhAnh.map(item => item.url)
      };
      console.log(updateData)
      try {
        const response = await updateChiTietSanPham(updateData);
        return response;
      } catch (error) {
        console.error('Error updating CTSP:', error);
        throw error;
      }
    },
    async saveProduct(idSanPham) {
      if(this.idCTSP === 0)
        {
             const hinhAnhUrls = this.listHinhAnh.map(item => item.url);
      const dataSanPham = {
        ma: this.product.ma,
        gia: this.product.gia,
        // giaSauGiam: 1200000,
        idSanPham:Number.parseInt(idSanPham) ,
        idMauSac: this.product.mauSac.id,
        idLoaiMay: this.product.loaiMay.id,
        idChatLieuVo: this.product.chatLieuVo.id,
        idChatLieuDay: this.product.chatLieuDay.id,
        kichThuoc: this.product.kichThuoc,
        chongNuoc: this.product.chongNuoc,
        idLoaiKinh: this.product.loaiKinh.id,
        xuatXu: this.product.xuatXu,
        idHinhDang: this.product.hinhDang.id,
        soLuong: this.product.soLuong,
        canNang: this.product.canNang,
        moTa: this.product.description,
        hinhAnhUrls: hinhAnhUrls
      };
     
      return await themChiTietSanPham(dataSanPham);
        }
   else{
   return await this.updateCTSP(idSanPham)
   }
    },

    filterSuggestions() {
      if (!this.productName) {
        this.showSuggestions = false;
        return;
      }

      this.filteredProducts = this.productSuggestions.filter((product) =>
        product.toLowerCase().includes(this.productName.toLowerCase())
      );
      this.showSuggestions = true;
    },

    selectProduct(product) {
      this.productName = product;
      this.showSuggestions = false;
    },
  },
});
