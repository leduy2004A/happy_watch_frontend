export const useExportPdf = () => {
    const exportToPdf = async (data) => {
      // Tạo một iframe ẩn thay vì mở tab mới
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
  
      // Chuyển đổi ảnh thành base64
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
          return ''; // Trả về chuỗi rỗng nếu không load được ảnh
        }
      };
  
      // Đợi ảnh được chuyển đổi thành base64
      const logoBase64 = await getBase64Image('/src/jpg/cheerful_clock_logo.jpg');
  
      const content = `
        <div class="invoice-container" id="temp-invoice" style="
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        ">
          <div class="header" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          ">
            <div class="left">
              <img src="${logoBase64}" alt="Logo" width="150px">
            </div>
            <div class="center" style="margin-left:20px">
              <h1 style="
                color: #333;
                margin: 0 0 10px 0;
                font-size: 24px;
              ">Happy Watch</h1>
              <p style="margin: 5px 0;">Số điện thoại: 0355512589</p>
              <p style="margin: 5px 0;">Email: leduy4520@gmail.com</p>
              <p style="margin: 5px 0;">Địa chỉ: FPT POLYTECHNIC Cơ Sở Kiều Mai, P. Kiều Mai, Phúc Diễn, Từ Liêm, Hà Nội</p>
            </div>
          </div>
  
          <h2 class="invoice-title" style="
            text-align: center;
            color: #333;
            margin: 20px 0;
            font-size: 20px;
          ">HÓA ĐƠN BÁN HÀNG</h2>
  
          <div class="customer-info" style="
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
          ">
            <p style="margin: 5px 0;">Tên khách hàng: ${data.tenKhachHang || 'Khách lẻ'}</p>
            <p style="margin: 5px 0;">Địa chỉ nhận hàng: ${data.deliveryAddress || 'Tại cửa hàng'}</p>
            <p style="margin: 5px 0;">Nhân viên: ${data.staffName || ''}</p>
            <div class="invoice-details" style="
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #eee;
            ">
              <p style="margin: 5px 0;">Mã Hóa Đơn: ${data.maHoaDon || ''}</p>
              <p style="margin: 5px 0;">Ngày tạo: ${data.ngayTao || ''}</p>
            </div>
          </div>
  
          <h3 style="
            color: #333;
            margin: 20px 0;
            font-size: 16px;
          ">DANH SÁCH SẢN PHẨM</h3>
          
          <table style="
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          ">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: left;
                ">STT</th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: left;
                ">Tên sản phẩm</th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: right;
                ">Số lượng</th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: right;
                ">Đơn giá</th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: right;
                ">Thành tiền</th>
                <th style="
                  padding: 10px;
                  border: 1px solid #ddd;
                  text-align: center;
                ">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${data.products?.map((item, index) => `
                <tr>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                  ">${index + 1}</td>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: left;
                  ">${item.tenSanPham + ' '+item.maSanPham}</td>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: right;
                  ">${item.soLuong}</td>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: right;
                  ">${formatCurrency(item.giaTungSanPham)}</td>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: right;
                  ">${formatCurrency(item.giaTungSanPham * item.soLuong)}</td>
                  <td style="
                    padding: 10px;
                    border: 1px solid #ddd;
                    text-align: center;
                  ">${item.status || ''}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>
  
          <div class="total-section" style="
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
          ">
            <p style="
              margin: 5px 0;
              text-align: right;
            ">Tổng tiền hàng: ${data.tienHang}</p>
            <p style="
              margin: 5px 0;
              text-align: right;
            ">Giảm giá: ${data.giamGia}</p>
            <p style="
              margin: 5px 0;
              text-align: right;
            ">Phí giao hàng: ${data.phiGiaoHang}</p>
            <p style="
              margin: 15px 0 5px 0;
              text-align: right;
              font-weight: bold;
              font-size: 16px;
              color: #333;
            ">Tổng tiền cần thanh toán: ${data.tongTien}</p>
          </div>
        </div>
      `;
  
      // Ghi nội dung vào iframe
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <html>
          <head>
            <title>Hóa đơn</title>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  margin: 0;
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
  
      // Đợi ảnh và tài nguyên được tải xong
      setTimeout(() => {
        iframe.contentWindow.print();
        // Xóa iframe sau khi in xong
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