import { PRODUCTS } from "../constants/mockData";
import { SHOP_INFO } from "../constants/shopInfo";

export interface Message {
  role: "user" | "model";
  text: string;
}

export const sendMessageToGemini = async (
  messages: Message[],
): Promise<string> => {

  if (true) {
    return "Maaf, untuk sekarang pertanyaan lebih lanjut silahkan hubungi CS kami di WhatsApp untuk bantuan langsung!";
  }

  // System prompt yang diinjeksi dengan data produk agar AI relevan
  //   const systemInstruction = `Kamu adalah asisten AI toko bunga ${SHOP_INFO.name}. Jawab dengan ramah, elegan, hangat, dan ringkas. 
  // Tugasmu membantu pelanggan mencari atau merekomendasikan bunga yang tepat.
  // Daftar produk ${SHOP_INFO.name} saat ini:
  // ${PRODUCTS.map((p) => `- ID: ${p.id} | Nama: ${p.name} | Kategori: ${p.categoryId} | Harga: Rp${p.price} | Deskripsi: ${p.description}`).join("\n")}

  // ATURAN PENTING:
  // Jika kamu merekomendasikan produk, kamu WAJIB menyertakan ID produk dengan format persis [PRODUCT:id] di dalam kalimatmu. 
  // Contoh: "Saya sangat merekomendasikan [PRODUCT:p1] untuk acara pernikahan Anda."
  // Jangan gunakan format markdown link lain untuk produk. Cukup gunakan format [PRODUCT:id].`;

  //   const payload = {
  //     contents: messages.map((m) => ({
  //       role: m.role,
  //       parts: [{ text: m.text }],
  //     })),
  //     systemInstruction: { parts: [{ text: systemInstruction }] },
  //   };

  //   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Gemini API error: ${response.statusText}`);
  //   }

  //   const result = await response.json();
  //   const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

  //   if (!aiText) {
  //     throw new Error("Invalid response format from Gemini API");
  //   }

  //   return aiText;
};
