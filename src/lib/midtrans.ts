import Midtrans from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

// Sandbox keys strictly start with "SB-"
const isProduction = !serverKey.includes("SB-");

export const snap = new Midtrans.Snap({
  isProduction,
  serverKey,
  clientKey,
});

export const coreApi = new Midtrans.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});
