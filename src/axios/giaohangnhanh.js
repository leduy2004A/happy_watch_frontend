import axios from "axios";
export const getPhiShip = async (data) => {
  return await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
    {
      service_type_id: 2,
      from_district_id: 1482,
      to_district_id: data.district,
      to_ward_code: data.ward,
      weight: data.weight,
      name: data.name,
    },
    {
      headers: {
        token: "371dc38e-8dcb-11ef-b71a-5e14478acdc2",
        ShopId: "5399319 - 0384737401",
        "Content-Type": "application/json",
      },
    }
  );
};
export const getThoiGianDuKien = async (data) => {
  return await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
    {
      from_district_id: 1482,
      from_ward_code: "11009",
      to_district_id: data.district,
      to_ward_code: data.ward,
      service_id: 53320,
    },
    {
      headers: {
        token: "371dc38e-8dcb-11ef-b71a-5e14478acdc2",
        ShopId: "5399319 - 0384737401",
        "Content-Type": "application/json",
      },
    }
  );
};
