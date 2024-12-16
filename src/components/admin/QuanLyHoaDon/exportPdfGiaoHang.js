export const useExportPdf = () => {
    const exportToPdf = async (data) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
  
      const getBase64Image = async (imgUrl) => {
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error loading image:', error);
          return '';
        }
      };
  
      const logoBase64 = await getBase64Image('https://png.pngtree.com/png-vector/20220915/ourmid/pngtree-clock-icon-logo-design-stopwatch-design-hour-vector-png-image_48688546.jpg');
      const ghnLogoBase64 = await getBase64Image('https://file.hstatic.net/200000472237/file/1200-01_66f85e686b2b4cf09b5324143a2fb3ea.png');
  
      const content = `
        <div class="invoice-container" style="
          padding: 40px;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        ">
          <!-- Header with both logos -->
          <div class="header" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border: 2px solid #000;
            margin-bottom: 0;
          ">
            <img src="${logoBase64}" alt="F-Shoes Logo" style="height: 120px;">
            <img src="${ghnLogoBase64}" alt="GHN Logo" style="height: 120px;">
          </div>
  
          <!-- Shipping Information -->
          <div class="shipping-info" style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            border: 2px solid #000;
            border-top: none;
            padding: 20px;
            font-size: 14px;
            line-height: 1.5;
          ">
            <div class="sender">
              <h3 style="margin: 0 0 10px 0; font-size: 16px;">Từ:</h3>
              <p style="margin: 5px 0; font-weight: bold;">Happy Watch Shop</p>
              <p style="margin: 5px 0;">Đ/c: FPT PolyTechnic cơ sở Kiều Mai,</p>
              <p style="margin: 5px 0;">P.Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội</p>
              <p style="margin: 5px 0;">Sđt: ${data.senderPhone || ''}</p>
            </div>
            <div class="receiver">
              <h3 style="margin: 0 0 10px 0; font-size: 16px;">Đến:</h3>
              <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${data.deliveryAddress || ''}</p>
              <p style="margin: 5px 0;"><strong>Sđt:</strong> ${data.receiverPhone || ''}</p>
            </div>
          </div>
  
          <!-- QR Code and Order Details -->
          <div style="
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 30px;
            border: 2px solid #000;
            border-top: none;
            padding: 20px;
          ">
            <div class="qr-code" style="
              width: 150px;
              height: 150px;
              border: 1px solid #ddd;
              padding: 10px;
            ">
              <img src="${data.qrCode || ''}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="order-details" style="font-size: 14px;">
              <h3 style="margin: 0 0 15px 0; font-size: 16px;">Nội dung hàng (Tổng SL sản phẩm: ${data.products?.length || 0}):</h3>
              ${data.products?.map(item => `
                <div style="
                  margin: 10px 0;
                  padding: 10px;
                  background-color: #f9f9f9;
                  border-radius: 5px;
                ">
                  <p style="margin: 5px 0;">
                    <strong>Sản phẩm:</strong> ${item.tenSanPham +'–'+ item.gioiTinh +'–'+  item.loaiKinhSanPham +'–'+  item.chatLieuVoSanPham  +'–'+  item.loaiMaySanPham  +'–'+  item.chatLieuDaySanPham }<br>
                    <strong>Mã:</strong> ${item.maSanPhamChiTiet}<br>
                    <strong>Số lượng:</strong> ${item.soLuong}
                  </p>
                </div>
              `).join('') || ''}
            </div>
          </div>
  
          <!-- Payment Information -->
          <div class="payment-info" style="
            border: 2px solid #000;
            border-top: none;
            padding: 20px;
          ">
            <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px;">Tiền thu người nhận:</h3>
              <p style="
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
                color: #e63946;
              ">${formatCurrency(data.tongTien || 0)}</p>
            </div>
            
            <div style="
              border: 2px solid #000;
              padding: 20px;
              margin-top: 20px;
            ">
              <h4 style="margin: 0 0 10px 0;">Chữ ký người nhận</h4>
              <p style="margin: 5px 0; font-style: italic; color: #666;">(Xác nhận hàng nguyên vẹn, không móp/méo)</p>
              <div style="height: 100px; border-bottom: 1px dashed #ccc; margin-top: 20px;"></div>
            </div>
          </div>
        </div>
      `;
  
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>Phiếu Giao Hàng</title>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                @page {
                  size: A4;
                  margin: 0;
                }
                .invoice-container {
                  page-break-after: always;
                }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      iframeDoc.close();
  
      setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    };
  
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    };
  
    return {
      exportToPdf,
    };
  };