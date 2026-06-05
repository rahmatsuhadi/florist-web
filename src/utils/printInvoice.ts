import { PaymentWithCustomer } from "@/services/admin/paymentService";
import { formatIdr } from "@/utils/format";
import { getPaymentDetailsText } from "@/utils/paymentFormatters";

export const printInvoice = (payment: PaymentWithCustomer) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Pop-up diblokir. Harap izinkan pop-up untuk mencetak invoice.");
    return;
  }

  const invoiceHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Invoice PAY-${payment.id}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
          line-height: 1.5;
          margin: 0;
          padding: 40px;
          background: #fff;
        }
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          font-size: 14px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #eee;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #2D3748;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #718096;
        }
        .brand {
          text-align: right;
        }
        .brand h2 {
          margin: 0;
          color: #B76E79; /* Brand Color */
          font-size: 24px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .info-box {
          background: #FDFBF7;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #eee;
        }
        .info-box h4 {
          margin: 0 0 10px 0;
          color: #4A5568;
          text-transform: uppercase;
          font-size: 12px;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .info-item span:first-child {
          color: #718096;
        }
        .info-item span:last-child {
          font-weight: bold;
          color: #2D3748;
        }
        .total-box {
          margin-top: 30px;
          border-top: 2px solid #eee;
          padding-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #B76E79;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #A0AEC0;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 0;
          }
          .invoice-box {
            box-shadow: none;
            border: none;
            padding: 0;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <h1>INVOICE PEMBAYARAN</h1>
            <p>Bukti Pelunasan Resmi</p>
          </div>
          <div class="brand">
            <h2>Fleuriste.</h2>
            <p>Magnolia Florist Gateway</p>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <h4>Detail Transaksi</h4>
            <div class="info-item">
              <span>No. Ref (Payment)</span>
              <span>PAY-${payment.id}</span>
            </div>
            <div class="info-item">
              <span>ID Order</span>
              <span>${payment.orderId}</span>
            </div>
            <div class="info-item">
              <span>Pelanggan</span>
              <span>${payment.customerName}</span>
            </div>
            <div class="info-item">
              <span>Tanggal</span>
              <span>${new Date(payment.updatedAt).toLocaleString("id-ID")}</span>
            </div>
            <div class="info-item">
              <span>Status</span>
              <span style="text-transform: uppercase;">${payment.status}</span>
            </div>
          </div>

          <div class="info-box">
            <h4>Informasi Sumber</h4>
            <div class="info-item">
              <span>Metode Bayar</span>
              <span style="text-transform: uppercase;">${payment.paymentMethod?.replace("_", " ") || "-"}</span>
            </div>
            <div class="info-item">
              <span>Sumber/Bank</span>
              <span>${getPaymentDetailsText(payment)}</span>
            </div>            
          </div>
        </div>

        <div class="total-box">
          <div style="text-align: right;">
            <span style="color: #718096; margin-right: 20px; font-size: 16px;">Total Tagihan Lunas:</span>
            <span class="total-amount">${formatIdr(Number(payment.amount))}</span>
          </div>
        </div>

        <div class="footer">
          <p>Terima kasih atas pembayaran Anda. Invoice ini adalah bukti pembayaran yang sah dan dibuat oleh sistem.</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
          // Optional: close window after print dialog is closed
          // window.onafterprint = function() { window.close(); };
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
};
