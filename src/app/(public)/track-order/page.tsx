import { Metadata } from "next";
import { TrackOrderClient } from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Lacak Pesanan | L'Fleur",
  description: "Lacak status pesanan bunga Anda di Magnolia Florist",
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
