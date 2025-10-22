"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useAppSelector } from "@lib/redux/store";
import useDictionary from "@hooks/useDict";
import useLocale from "@hooks/useLocale";
import { cancel_payment, prapare_payment, processed_payment } from "@src/actions";
import { useRouter } from "next/navigation";
import Dropdown from "@components/core/Dropdown";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Traveller {
  traveller_type: string;
  title: string;
  first_name: string;
  last_name: string;
}

interface RoomData {
  id: string;
  name: string;
  price: string;
  currency: string;
}

interface HotelInvoiceProps {
  invoiceDetails: any[];
}

const HotelInvoice: React.FC<HotelInvoiceProps> = ({ invoiceDetails }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const appData = useAppSelector((state) => state.appData?.data?.app);
  const { locale } = useLocale();
  const { data: dict } = useDictionary(locale as any);
  const [showInvoiceImage, setShowInvoiceImage] = useState(false);
  const lang = locale || "en";
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    invoiceDetails[0]?.payment_gateway || ""
  );
  const { payment_gateways } = useAppSelector((state) => state.appData?.data);
  const activePayments = payment_gateways
    ?.filter((p: any) => p.status)
    ?.map((p: any) => ({
      id: p.id,
      name: p.name,
      label: p.label || p.name,
      icon: p.icon || null,
    })) || [];

  // ✅ New loading states
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!invoiceDetails?.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-lg">
        {dict?.hotelInvoice?.errors?.noInvoiceFound}
      </div>
    );
  }

  const data = invoiceDetails[0];
  const travellers: Traveller[] = JSON.parse(data.guest || "[]");
  const rooms: RoomData[] = JSON.parse(data.room_data || "[]");
  const parsedBookingData = JSON.parse(invoiceDetails[0].booking_data || "{}");

  const invoiceUrl = `${window.location.origin}/hotel/invoice/${data.booking_ref_no}`;

  const bookingData = {
    paymentStatus: data.payment_status,
    bookingStatus: data.booking_status,
    phone: data.phone || "N/A",
    email: data.email || "N/A",
    bookingId: data.booking_id,
    bookingReference: data.booking_ref_no,
    bookingDate: data.booking_date,
    travellers,
    hotel: {
      name: data.hotel_name,
      rating: Number(data.stars) || 0,
      address: data.hotel_address || "N/A",
      location: data.location,
      phone: data.hotel_phone || "N/A",
      email: data.hotel_email || "N/A",
      website: data.hotel_website || "N/A",
      image: data.hotel_img,
    },
    room: {
      checkin: data.checkin,
      checkout: data.checkout,
      totalNights: 1,
      type: rooms[0]?.name || "N/A",
      quantity: rooms.length,
      price: rooms[0]?.price || data.price_markup,
      currency: rooms[0]?.currency || data.currency_markup,
    },
    taxes: data.tax || "0",
    total: `${data.currency_markup} ${data.price_markup}`,
    customer: {
      email: data.email || "N/A",
      contact: data.phone || "N/A",
      address: data.address || "N/A",
    },
    customerCare: {
      email: "support@toptiertravel.vip",
      contact: "+971-000-0000",
      website: "https://toptiertravel.vip",
    },
  };


  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    setIsDownloading(true);

    const style = document.createElement("style");
    style.innerHTML = `
      .pdf-rendering * {
        color: rgb(0, 0, 0) !important;
        background-color: rgb(255, 255, 255) !important;
        background-image: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        border-color: rgb(0, 0, 0) !important;
        font-family: Arial, sans-serif !important;
        font-size: 12px !important;
      }

      .pdf-rendering img {
        filter: none !important;
        max-width: 100% !important;
        height: auto !important;
      }

      .pdf-rendering .hidden.pdf-rendering\\:hidden {
        display: none !important;
      }

      .pdf-rendering .flex, .pdf-rendering .grid {
        display: block !important;
      }

      .pdf-rendering .w-full, .pdf-rendering .max-w-4xl {
        width: 100% !important;
      }

      .pdf-rendering table {
        border-collapse: collapse !important;
        width: 100% !important;
      }

      .pdf-rendering td, .pdf-rendering th {
        padding: 4px !important;
        border: 1px solid #ccc !important;
      }

      .pdf-rendering .text-right {
        text-align: right !important;
      }

      .pdf-rendering .text-left {
        text-align: left !important;
      }

      .pdf-rendering .font-bold {
        font-weight: bold !important;
      }

      .pdf-rendering .bg-white {
        background-color: #fff !important;
      }

      .pdf-rendering .border {
        border: 1px solid #ddd !important;
      }

      .pdf-rendering .rounded-lg {
        border-radius: 0 !important;
      }
    `;
    document.head.appendChild(style);

    invoiceRef.current.classList.add('pdf-rendering');

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = invoiceRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 0,
        foreignObjectRendering: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = -pdfHeight * Math.ceil((imgHeight - heightLeft) / pdfHeight);
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Hotel-Invoice-${bookingData.bookingReference}.pdf`);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      invoiceRef.current?.classList.remove('pdf-rendering');
      style.remove();
      setIsDownloading(false);
    }
  };


  const handlePayNow = async () => {
    const re_id = invoiceDetails[0].booking_ref_no;
    const response = await prapare_payment({
      booking_ref_no: re_id,
      invoice_url: invoiceUrl,
      payment_getway: selectedPaymentMethod,
    });
    const result = response?.data;
    if (response.success) {
      const { payload, payment_gateway } = result;
      const payment_response = await processed_payment({
        payload: payload,
        payment_gateway: payment_gateway,
      });
      const payment_result = payment_response?.data;
      const url = payment_result?.checkout_url || payment_response.checkout_url;
      if (payment_response.success) {
        router.push(url);
      }
    }
  };

const handleCancellation = async () => {
  setIsCancelling(true);
  try {
    const response = await cancel_payment(invoiceDetails[0].booking_ref_no);
    if (response.status) {
      toast.success(response.message);

      // ✅ Refresh the page after a short delay (optional)
      setTimeout(() => {
        window.location.reload();
      }, 1500); // wait for toast to show
    }
  } catch (error) {
    console.error("Cancellation error:", error);
  } finally {
    setIsCancelling(false);
  }
};


  const handleSelectPayment = (payment: any) => {
    setSelectedPaymentMethod(payment.name.toLowerCase());
  };




  const handleShareWhatsApp = () => {
    const message = `Hotel Booking Confirmation
Booking Reference: ${bookingData.bookingReference}
Hotel: ${bookingData.hotel.name}
Check-in: ${bookingData.room.checkin}
Check-out: ${bookingData.room.checkout}
Guest: ${travellers[0]?.first_name || "N/A"}
Total: ${bookingData.total}
View Invoice: ${invoiceUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4 sm:px-6">
      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <img
            src={appData.header_logo_img || "https://via.placeholder.com/150"}
            alt="Hotel"
            className="h-16 w-auto object-contain rounded-md"
          />

          <div
            className={`flex-1 ${lang === "ar" ? "text-right sm:text-left" : "text-left sm:text-right"}`}
          >
            <div>
              <span className="text-sm font-semibold">
                {dict?.hotelInvoice?.header?.paymentStatus}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                {bookingData.paymentStatus}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold">
                {dict?.hotelInvoice?.header?.bookingStatus}
              </span>
              <span className="text-sm text-blue-600 font-semibold">
                {bookingData.bookingStatus}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>
                <span className="font-semibold">
                  {dict?.hotelInvoice?.header?.phone}
                </span>{" "}
                {bookingData.phone}
              </div>
              <div>
                <span className="font-semibold">
                  {dict?.hotelInvoice?.header?.email}
                </span>{" "}
                {bookingData.email}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div
            className="w-20 h-20 p-1 cursor-pointer"
            onClick={() => setShowInvoiceImage(true)}
          >
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoiceUrl)}`}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {bookingData.paymentStatus === "unpaid" && (
          <div className="mt-3 mx-6 p-4 bg-white border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-4 items-center gap-6">
            <div className="text-lg font-semibold text-gray-800">Pay With</div>

            <Dropdown
              label={
                <div className="flex items-center gap-2">
                  {selectedPaymentMethod ? (
                    <span>{selectedPaymentMethod}</span>
                  ) : (
                    <span className="text-gray-500">Select payment method</span>
                  )}
                </div>
              }
              dropDirection="down"
              buttonClassName="w-full justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-left"
            >
              {({ onClose }) => (
                <div className="p-1 max-h-60 overflow-y-auto">
                  {activePayments.map((method: any) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        handleSelectPayment(method);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 cursor-pointer px-3 py-2.5 text-sm rounded-lg ${selectedPaymentMethod === method.name.toLowerCase()
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {method.icon ? (
                        <img
                          src={method.icon}
                          alt={method.label}
                          className="w-5 h-5 rounded"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">
                          {method.label.charAt(0)}
                        </div>
                      )}
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </Dropdown>

            <button
              onClick={handlePayNow}
              disabled={!selectedPaymentMethod}
              className={`px-6 py-2.5 rounded-lg cursor-pointer font-medium text-white w-full ${!selectedPaymentMethod
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-gray-800"
                }`}
            >
              {dict?.hotelInvoice?.bookingInfo?.proceed}
            </button>

            <div className="text-xl font-bold text-gray-800 text-center md:text-right">
              USD {bookingData.total.replace(/[^0-9.,]/g, "")}
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="p-6 space-y-6">
          {/* Booking Note */}
          {bookingData.paymentStatus === "paid" && data.cancellation_request === "0" && (
            <div>
              <ul className="border border-gray-200 rounded-lg mb-2">
                <li className="p-3 border-b border-gray-200 last:border-b-0">
                  <p>
                    Payable through{" "}
                    <span className="font-medium">{invoiceDetails[0]?.supplier}</span>, acting as agent for the service operating company,
                    details of which can be provided upon request. VAT:{" "}
                    <span className="font-medium">{invoiceDetails[0]?.vat}</span> Reference:{" "}
                    <span className="font-medium">
                      {invoiceDetails[0]?.pnr ? invoiceDetails[0]?.pnr : "N/A"}
                    </span>
                  </p>
                </li>
              </ul>
            </div>
          )}

          {invoiceDetails[0].cancellation_request === "1" && (
            <div className="border bg-red-100 border-red-200 rounded-lg p-4 text-start">
              {dict?.hotelInvoice?.bookingNote}
            </div>
          )}

          {/* Booking Info */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border border-gray-200 rounded-lg p-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {dict?.hotelInvoice?.bookingInfo?.bookingId}
              </div>
              <div className="text-sm font-medium">{bookingData.bookingId}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {dict?.hotelInvoice?.bookingInfo?.reference}
              </div>
              <div className="text-sm font-medium">{bookingData.bookingReference}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {dict?.hotelInvoice?.bookingInfo?.bookingpnr}
              </div>
              <div className="text-sm font-medium">
                {invoiceDetails[0]?.pnr === null ? "N/A" : invoiceDetails[0]?.pnr}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {dict?.hotelInvoice?.bookingInfo?.date}
              </div>
              <div className="text-sm font-medium">{bookingData.bookingDate}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">
                {dict?.hotelInvoice?.bookingInfo?.location}
              </div>
              <div className="text-sm font-medium">{bookingData.hotel.location}</div>
            </div>
          </div>

          {/* Travellers */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase">
              {dict?.hotelInvoice?.travellers?.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 font-semibold text-gray-600">
                      {dict?.hotelInvoice?.travellers?.table?.no}
                    </th>
                    <th className="text-left p-2 font-semibold text-gray-600">
                      {dict?.hotelInvoice?.travellers?.table?.sr}
                    </th>
                    <th className="text-left p-2 font-semibold text-gray-600">
                      {dict?.hotelInvoice?.travellers?.table?.name}
                    </th>
                    <th className="text-left p-2 font-semibold text-gray-600">
                      {"Traveler Type"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {travellers.map((t, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{t.title}</td>
                      <td className="p-2">
                        {t.first_name} {t.last_name}
                      </td>
                      <td className="p-2">
                        {t.traveller_type === "child"
                          ? `${t.traveller_type} (${(t as any)?.age} year old)`
                          : t.traveller_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotel Info */}
          <div className="flex flex-col md:flex-row border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="md:w-1/3 w-full">
              <img
                src={bookingData.hotel.image || "/images/default-hotel.jpg"}
                alt={bookingData.hotel.name}
                className="w-full h-40 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-5 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {bookingData.hotel.name}
              </h2>
              {/* Star Rating */}
              <div className="flex items-center mb-2">
                {[...Array(bookingData.hotel.rating)].map((_, i) => (
                  <span key={i} className="text-orange-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-3">{bookingData.hotel.address}</p>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <span className="font-semibold">{dict?.hotelInvoice?.hotelInfo?.phone}</span>{" "}
                  {bookingData.hotel.phone || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">{dict?.hotelInvoice?.hotelInfo?.email}</span>{" "}
                  {bookingData.hotel.email || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">{dict?.hotelInvoice?.hotelInfo?.website}</span>{" "}
                  {bookingData.hotel.website || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
              {dict?.hotelInvoice?.roomDetails?.title}
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="font-semibold py-2 pr-4">
                    {dict?.hotelInvoice?.roomDetails?.checkin}
                  </td>
                  <td className="py-2">{bookingData.room.checkin}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="font-semibold py-2 pr-4">
                    {dict?.hotelInvoice?.roomDetails?.checkout}
                  </td>
                  <td className="py-2">{bookingData.room.checkout}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="font-semibold py-2 pr-4">
                    {dict?.hotelInvoice?.roomDetails?.type}
                  </td>
                  <td className="py-2">{bookingData.room.type}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-2 pr-4">
                    {dict?.hotelInvoice?.roomDetails?.total}
                  </td>
                  <td className="py-2">{bookingData.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fare + Tax Info */}
          <div className="border border-gray-200 rounded-xl p-4">
            {/* Rate Comment Section */}
            {invoiceDetails[0]?.supplier && invoiceDetails[0].cancellation_request === "0" && (
              <div>
                <div>
                  <h3 className="font-bold text-center pb-2">Rate Comment</h3>
                </div>
                <ul className="border border-gray-200 rounded-lg mb-2">
                  <li className="p-3 border-b border-gray-200 last:border-b-0">
                    <p>
                      Payable through{" "}
                      <span className="font-medium">{invoiceDetails[0].supplier}</span>, acting as agent for the service operating company,
                      details of which can be provided upon request. VAT:{" "}
                      <span className="font-medium">{invoiceDetails[0].vat}</span> Reference:{" "}
                      <span className="font-medium">
                        {invoiceDetails[0].pnr ? invoiceDetails[0].pnr : "N/A"}
                      </span>
                    </p>
                  </li>
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded mb-2">
              <span className="text-sm font-semibold">
                {dict?.hotelInvoice?.fareAndTax?.taxLabel}
              </span>
              <span className="text-sm font-semibold">
                {"%"} {invoiceDetails[0].tax}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded">
              <span className="text-sm font-bold">
                {dict?.hotelInvoice?.fareAndTax?.totalLabel}
              </span>
              <span className="text-sm font-bold">{bookingData.total}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-bold text-gray-700 mb-3">
                {dict?.hotelInvoice?.customer?.title}
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customer?.email}</span>{" "}
                  {bookingData.customer.email}
                </p>
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customer?.contact}</span>{" "}
                  {bookingData.customer.contact}
                </p>
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customer?.address}</span>{" "}
                  {bookingData.customer.address}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-bold text-gray-700 mb-3">
                {dict?.hotelInvoice?.customerCare?.title}
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customerCare?.email}</span>{" "}
                  {appData.contact_email}
                </p>
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customerCare?.contact}</span>{" "}
                  {appData.contact_phone}
                </p>
                <p>
                  <span className="font-semibold">{dict?.hotelInvoice?.customerCare?.website}</span>{" "}
                  {appData.site_url}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons Row */}
        <div className="border-t border-gray-200 bg-white py-5 px-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          {/* Download PDF Button — Loading without changing width */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold cursor-pointer h-11 px-6 rounded-lg shadow-sm transition-opacity"
          >
            {isDownloading ? (
              <>
                <Icon icon="eos-icons:loading" className="animate-spin" width="20" height="20" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:tray-arrow-down" width="20" height="20" />
                <span>{dict?.hotelInvoice?.buttons?.downloadPdf || "Download as PDF"}</span>
              </>
            )}
          </button>

          {/* Send to WhatsApp Button — unchanged */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold cursor-pointer h-11 px-6 rounded-lg shadow-sm"
          >
            <Icon icon="mdi:whatsapp" width="20" height="20" />
            <span>{dict?.hotelInvoice?.buttons?.sendToWhatsApp || "Send to WhatsApp"}</span>
          </button>

          {/* Request for Cancellation Button */}
          <button
            onClick={handleCancellation}
            className="flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold cursor-pointer h-11 px-6 rounded-lg shadow-sm"
          >
            {isCancelling ? (
              <>
                <Icon icon="eos-icons:loading" className="animate-spin" width="20" height="20" />
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:close" width="20" height="20" />
                <span>{dict?.hotelInvoice?.buttons?.requestCancellation || "Request for Cancellation"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelInvoice;