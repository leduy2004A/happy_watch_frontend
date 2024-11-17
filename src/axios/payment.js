import axios from 'axios';
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function stringToBuffer(str) {
  return new TextEncoder().encode(str);
}

export const taoLinkThanhToan = async (data) => {
  const orderData = {
    orderCode: generateRandomInt(10),
    amount: data.amount,
    description: "Test thử", 
    cancelUrl: "http://localhost:3000/product/cart",
    returnUrl: `http://localhost:3000/product/success/${data.ma}?soTien=${data.amount}`
  };

  const checksumKey = "25361ec01b25ea3e433a9a1d4a313a4c9419cf4858a466ef822be8c76c36b362";
  const dataStr = `amount=${orderData.amount}&cancelUrl=${orderData.cancelUrl}&description=${orderData.description}&orderCode=${orderData.orderCode}&returnUrl=${orderData.returnUrl}`;

  const keyBuffer = await stringToBuffer(checksumKey);
  const dataBuffer = await stringToBuffer(dataStr);

  const key = await window.crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    dataBuffer
  );

  const signatureHex = bufferToHex(signature);

  return await axios.post(
    "https://api-merchant.payos.vn/v2/payment-requests",
    {
      ...orderData,
      signature: signatureHex
    },
    {
      headers: {
        "x-client-id": "8c448ecd-05a3-40c1-8b2d-d3f569c3e565",
        "x-api-key": "35701812-b251-4b90-83ca-ef0d4dd0862c",
        "Content-Type": "application/json"
      },
    }
  );
};
function generateRandomInt(length) {
    if (length <= 0) return 0;

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Tạo số ngẫu nhiên từ 0 đến 9
        result += randomDigit;
    }

    return parseInt(result, 10); // Chuyển chuỗi thành số nguyên
}
