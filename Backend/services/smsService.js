import axios from "axios";

const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_API_KEY;
const SENDER_ID = process.env.SENDER_ID;
const sendSMS = async (templateName, mobile, variables = {}) => {
  try {
    if (!mobile) return;
    const cleanMobile = mobile.replace(/^91/, "");

    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/ADDON_SERVICES/SEND/TSMS`;

    const payload = {
      TemplateName: templateName,
      From: SENDER_ID,
      To: "91" + cleanMobile,
      VAR1: variables.name || "Patient"
    };
    console.log("📨 FINAL SMS PAYLOAD:", payload);

    const response = await axios.post(url, payload);
    console.log("📩 2Factor RESPONSE:", response.data);

    if (response.data.Status !== "Success") {
      console.error("SMS rejected by 2Factor:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("SMS sending error:", error?.response?.data || error.message);
  }
}
export default sendSMS