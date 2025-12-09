type ReceiptData = {
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentId: string;
  orderId: string;
  receiptNo?: string;
  createdAt?: string;
};

function ReceiptModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ReceiptData | null;
}) {
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!open || !data) return null;

  const downloadPdf = async () => {
    try {
      // ✅ Robust dynamic imports for Next.js
      const html2canvasModule = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const html2canvas = html2canvasModule.default;

      if (!printRef.current) {
        console.error("printRef is null, cannot generate PDF");
        alert("Something went wrong generating the receipt. Please try again.");
        return;
      }

      // Render the receipt container to a canvas
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 portrait PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210; // mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`BhaktaSammilan_Receipt_${data.paymentId}.pdf`);
    } catch (err) {
      console.error("Error while generating PDF:", err);
      alert("Unable to download the receipt right now. Please check console.");
    }
  };

  const formattedDate =
    data.createdAt && !Number.isNaN(Date.parse(data.createdAt))
      ? new Date(data.createdAt).toLocaleDateString()
      : new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/60">
      <div className="w-full max-w-5xl overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Header actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Donation Receipt
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={downloadPdf}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Download PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable receipt */}
        <div className="p-6 bg-gray-100">
          <div
            ref={printRef}
            className="mx-auto bg-white border shadow-md rounded-xl overflow-hidden"
          >
            {/* Top orange band similar to sample */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
                  <img
                    src="/Om.png"
                    alt="Bhakta Sammilan Logo"
                    className="object-contain w-14 h-14"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-wide">
                    SHRI RAM TEMPLE KAMARPAL
                  </h1>
                  <p className="text-sm font-medium">
                    by Bhakta Sammilan &amp; Suma Blessings Foundation
                  </p>
                  <p className="mt-1 text-xs leading-snug text-orange-50">
                    Head Office: C-49/50, Nawada Housing Complex, Near Dwarka
                    Mor Metro, Uttam Nagar, New Delhi - 110059
                    <br />
                    Temple Location: Kamarapal, Dagarpara, Balasore, Odisha
                    756047
                  </p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p>
                  <span className="font-semibold">Receipt No:</span>{" "}
                  {data.receiptNo || "To be assigned"}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {formattedDate}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Payment ID:</span>{" "}
                  <span className="font-mono text-xs break-all">
                    {data.paymentId}
                  </span>
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Order ID:</span>{" "}
                  <span className="font-mono text-xs break-all">
                    {data.orderId}
                  </span>
                </p>
              </div>
            </div>

            {/* Tax band */}
            <div className="flex justify-between px-6 py-3 text-xs bg-amber-50 border-y">
              <p className="font-semibold text-gray-800">
                Income Tax Exemption (80-G) Number: ABHCS5608RF20227
              </p>
              <p className="text-gray-700">
                Mode of Payment: <span className="font-semibold">Online</span>
              </p>
            </div>

            {/* Donor + Transaction details */}
            <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
              {/* Donor details */}
              <div>
                <h2 className="mb-2 text-sm font-semibold text-gray-800 uppercase">
                  Donor Details
                </h2>
                <p className="text-xs italic text-gray-600">
                  Received with thanks from:
                </p>
                <div className="mt-2 text-sm text-gray-900">
                  <p className="font-semibold">{data.donorName}</p>
                  <p className="text-gray-700">{data.donorEmail}</p>
                  <p className="text-gray-700">{data.donorPhone}</p>
                </div>
                <div className="mt-4 text-sm text-gray-800">
                  <p>
                    As donation for the cause of{" "}
                    <span className="font-semibold">
                      Temple Construction &amp; Maintenance
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Transaction block */}
              <div className="text-sm text-gray-900">
                <div className="mb-3 border border-orange-400 rounded-lg">
                  <div className="px-3 py-2 text-xs font-semibold tracking-wide text-white uppercase bg-orange-500 rounded-t-lg">
                    Transaction Detail
                  </div>
                  <div className="px-3 py-3">
                    <p className="text-xs text-gray-600">Amount Donated</p>
                    <p className="mt-1 text-xl font-bold text-orange-700">
                      ₹{data.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-3 border border-orange-400 rounded-lg">
                  <div className="px-3 py-2 text-xs font-semibold tracking-wide text-white uppercase bg-orange-500 rounded-t-lg">
                    Purpose of Donation
                  </div>
                  <div className="px-3 py-3 text-sm">
                    Donation - Temple Construction &amp; Maintenance
                  </div>
                </div>

                <div className="mb-3 border border-orange-400 rounded-lg">
                  <div className="px-3 py-2 text-xs font-semibold tracking-wide text-white uppercase bg-orange-500 rounded-t-lg">
                    Payment Details
                  </div>
                  <div className="px-3 py-3 text-sm">
                    Razorpay - Online Transaction
                  </div>
                </div>
              </div>
            </div>

            {/* Amount box */}
            <div className="px-6 pb-4">
              <div className="inline-block px-6 py-3 text-xl font-bold border rounded-lg border-amber-500 bg-amber-50">
                INR {data.amount.toLocaleString()}
              </div>
            </div>

            {/* Notes */}
            <div className="px-6 py-4 text-xs leading-relaxed text-gray-700 bg-orange-50">
              <p className="mb-2 font-semibold">Please note:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Donation is irrevocable.</li>
                <li>
                  PAN is compulsory for issuance of 80-G receipts as per Income
                  Tax rules.
                </li>
                <li>
                  80-G receipts are available for donations received towards
                  temple construction, maintenance, and charitable purposes.
                </li>
                <li>
                  In case of any error/discrepancy, contact us within 15 days
                  from the date of this receipt.
                </li>
              </ul>

              <p className="mt-4 font-medium text-center text-gray-800">
                Hare Rama Hare Rama Rama Rama Hare Hare <br />
                Hare Krishna Hare Krishna Krishna Krishna Hare Hare
              </p>
            </div>

            {/* Signature */}
            <div className="flex items-center justify-between px-6 py-4 text-xs text-gray-800">
              <div>
                <p>For Bhakta Sammilan &amp; Suma Blessings Foundation</p>
              </div>
              <div className="text-right">
                <div className="h-10 mb-1 border-b border-gray-600" />
                <p className="font-medium">Authorised Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
