import { useState } from "react";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Phone,
  Mail,
  MapPin,
  Lock,
  ArrowLeft,
  Printer,
  CheckCircle2,
} from "lucide-react";
import type { PolicyType } from "@/components/modals/PolicyModal";

interface PolicyPageProps {
  initialPolicy?: PolicyType;
  storeName?: string;
  storePhone?: string;
  onBackToHome: () => void;
}

export function PolicyPage({
  initialPolicy = "privacy",
  storeName = "vCartify",
  storePhone = "+91 98765 43210",
  onBackToHome,
}: PolicyPageProps) {
  const [activeTab, setActiveTab] = useState<PolicyType>(initialPolicy);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f9f6f0] py-6 sm:py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#e5ddd0]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#d8cfbf] text-xs sm:text-sm font-semibold text-[#20291e] hover:bg-[#f2ede4] transition-colors shadow-2xs"
            >
              <ArrowLeft size={16} />
              Back to Store
            </button>
            <div className="text-xs text-[#6f7a6b]">
              <span>Home</span> / <span className="text-[#384a35] font-semibold">Legal & Policies</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#d8cfbf] text-xs font-semibold text-[#384a35] hover:bg-[#f2ede4] transition-colors"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Header Banner */}
        <div className="bg-[#384a35] rounded-2xl p-6 sm:p-8 text-[#faf7f2] mb-8 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-xs text-[#d8c29d]">
              <Lock size={12} />
              RBI & IT Act (India) Compliant Store
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
              Customer Trust & Legal Policies
            </h1>
            <p className="text-xs sm:text-sm text-[#e8dfd3] leading-relaxed">
              Transparency, data protection, and secure payment processing for {storeName}.
              All online payments are safeguarded by Cashfree Payments India Pvt. Ltd.
            </p>
          </div>
          <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-9xl font-serif">
            §
          </div>
        </div>

        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT: Sticky Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-[#e5ddd0] p-3 shadow-2xs sticky top-28 space-y-1">
              <p className="text-[11px] font-bold tracking-wider uppercase text-[#6f7a6b] px-3 py-2">
                Legal Documents
              </p>

              <button
                onClick={() => setActiveTab("privacy")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left ${
                  activeTab === "privacy"
                    ? "bg-[#384a35] text-white shadow-xs"
                    : "text-[#3d4739] hover:bg-[#f5f1e9]"
                }`}
              >
                <ShieldCheck size={16} />
                <span>Privacy Policy</span>
              </button>

              <button
                onClick={() => setActiveTab("terms")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left ${
                  activeTab === "terms"
                    ? "bg-[#384a35] text-white shadow-xs"
                    : "text-[#3d4739] hover:bg-[#f5f1e9]"
                }`}
              >
                <FileText size={16} />
                <span>Terms & Conditions</span>
              </button>

              <button
                onClick={() => setActiveTab("refund")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left ${
                  activeTab === "refund"
                    ? "bg-[#384a35] text-white shadow-xs"
                    : "text-[#3d4739] hover:bg-[#f5f1e9]"
                }`}
              >
                <RotateCcw size={16} />
                <span>Cancellation & Refunds</span>
              </button>

              <button
                onClick={() => setActiveTab("shipping")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left ${
                  activeTab === "shipping"
                    ? "bg-[#384a35] text-white shadow-xs"
                    : "text-[#3d4739] hover:bg-[#f5f1e9]"
                }`}
              >
                <Truck size={16} />
                <span>Shipping & Delivery</span>
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-left ${
                  activeTab === "contact"
                    ? "bg-[#384a35] text-white shadow-xs"
                    : "text-[#3d4739] hover:bg-[#f5f1e9]"
                }`}
              >
                <Phone size={16} />
                <span>Customer Care & Contact</span>
              </button>

              <div className="pt-4 mt-2 border-t border-[#f0eae0] px-3 pb-2 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#384a35] font-semibold">
                  <Lock size={13} />
                  <span>Cashfree Verified Gateway</span>
                </div>
                <p className="text-[10px] text-[#788574] leading-normal">
                  Certified PCI-DSS Level 1 compliant online payment infrastructure.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Document Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-[#e5ddd0] p-6 sm:p-10 shadow-xs space-y-6">
              {/* TAB 1: PRIVACY POLICY */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="border-b border-[#e5ddd0] pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#384a35]">
                      Compliance Document
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mt-1">
                      Privacy & Data Protection Policy
                    </h2>
                    <p className="text-xs text-[#6f7a6b] mt-1">
                      In accordance with the Digital Personal Data Protection Act (DPDP Act 2023)
                      and Information Technology Act 2000.
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-[#3d4739]">
                    This Privacy Policy governs the manner in which <strong>{storeName}</strong>{" "}
                    collects, maintains, uses, and discloses personal data collected from customers
                    and visitors of this website.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">
                      1. Information We Collect
                    </h3>
                    <p className="text-sm text-[#3d4739] leading-relaxed">
                      We collect personal identification data only when voluntarily submitted by
                      customers during checkout or communication:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3.5 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] text-xs text-[#3d4739]">
                        <strong>Identity & Contact:</strong> Full name, phone number, and WhatsApp
                        contact.
                      </div>
                      <div className="p-3.5 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] text-xs text-[#3d4739]">
                        <strong>Delivery Details:</strong> Complete street address, city, district,
                        and 6-digit postal pincode.
                      </div>
                    </div>
                  </div>

                  {/* Cashfree Security Highlight */}
                  <div className="bg-[#eef3eb] border-2 border-[#384a35]/20 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#384a35] font-bold text-sm">
                      <ShieldCheck size={20} />
                      <h4>2. Payment Security & Zero Raw Card Storage</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#20291e] leading-relaxed">
                      We prioritize your financial safety. <strong>{storeName} does NOT store, log,
                      or process your credit card numbers, debit card details, CVV codes, net banking
                      credentials, or UPI PINs on any server.</strong>
                    </p>
                    <p className="text-xs text-[#3d4739] leading-relaxed">
                      All online payments are securely handed over to{" "}
                      <strong>Cashfree Payments India Pvt. Ltd.</strong>, an authorized payment
                      aggregator regulated by the Reserve Bank of India (RBI). Cashfree encrypts all
                      sensitive cardholder data using 256-bit bank-grade SSL encryption and maintains
                      the highest global PCI-DSS certification.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">
                      3. Purpose of Data Processing
                    </h3>
                    <ul className="space-y-2 text-sm text-[#3d4739]">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                        <span>To dispatch parcels and verify delivery locations with our courier partners.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                        <span>To send electronic invoices, transaction receipts, and WhatsApp delivery tracking links.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                        <span>We pledge to <strong>never sell, rent, or trade</strong> your mobile number or contact details to third-party telemarketers or advertisers.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: TERMS AND CONDITIONS */}
              {activeTab === "terms" && (
                <div className="space-y-6">
                  <div className="border-b border-[#e5ddd0] pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#384a35]">
                      Legal Agreement
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mt-1">
                      Terms & Conditions of Service
                    </h2>
                    <p className="text-xs text-[#6f7a6b] mt-1">
                      Please read these terms carefully before placing an order on our store.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">1. Pricing and Product Information</h3>
                    <p className="text-sm text-[#3d4739] leading-relaxed">
                      All prices displayed on {storeName} are listed in Indian National Rupees (INR)
                      and include all applicable statutory taxes. We make every effort to display
                      product colors and specifications accurately, but minor variations due to
                      screen resolutions may occur.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">2. Order Placement and Acceptance</h3>
                    <p className="text-sm text-[#3d4739] leading-relaxed">
                      When you place an order, you will receive an automated order confirmation via
                      screen, SMS, or WhatsApp. We reserve the right to cancel orders due to sudden
                      stock unavailability, logistical unserviceability, or pricing errors. If an
                      order is cancelled after payment, a 100% refund is issued immediately.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">3. Jurisdiction & Dispute Resolution</h3>
                    <p className="text-sm text-[#3d4739] leading-relaxed">
                      These Terms are governed by the laws of the Republic of India. Any legal dispute
                      shall be subject to the exclusive jurisdiction of the competent courts in Tamil
                      Nadu, India.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: RETURN & REFUND POLICY */}
              {activeTab === "refund" && (
                <div className="space-y-6">
                  <div className="border-b border-[#e5ddd0] pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#384a35]">
                      Consumer Protection
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mt-1">
                      Cancellation & Refund Policy
                    </h2>
                    <p className="text-xs text-[#6f7a6b] mt-1">
                      Fair, straightforward, and quick resolution for your returns and refunds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] text-center space-y-1">
                      <div className="text-xl font-bold text-[#384a35]">7 Days</div>
                      <p className="text-xs font-semibold text-[#20291e]">Return Window</p>
                      <p className="text-[11px] text-[#6f7a6b]">From date of package delivery</p>
                    </div>

                    <div className="p-4 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] text-center space-y-1">
                      <div className="text-xl font-bold text-[#384a35]">5-7 Days</div>
                      <p className="text-xs font-semibold text-[#20291e]">Refund Speed</p>
                      <p className="text-[11px] text-[#6f7a6b]">Direct credit via Cashfree</p>
                    </div>

                    <div className="p-4 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] text-center space-y-1">
                      <div className="text-xl font-bold text-[#384a35]">100%</div>
                      <p className="text-xs font-semibold text-[#20291e]">Zero Deduction</p>
                      <p className="text-[11px] text-[#6f7a6b]">On verified defects or damage</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">
                      How to Request a Return or Refund
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-[#3d4739]">
                      <li>
                        Contact our support team on WhatsApp at <strong>{storePhone}</strong> or email{" "}
                        <strong>support@vcartify.com</strong> within 7 days of delivery.
                      </li>
                      <li>
                        Share your Order ID (starts with <code>VC...</code>) and a brief photo or
                        video if the item arrived defective or incorrect.
                      </li>
                      <li>
                        Our team will arrange reverse pickup. Once the parcel is received at our
                        fulfillment hub, the refund will be triggered immediately.
                      </li>
                      <li>
                        <strong>Refund Destination:</strong> All online payments are credited back
                        to the original payment method (Bank Account / UPI / Card) through Cashfree.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* TAB 4: SHIPPING POLICY */}
              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <div className="border-b border-[#e5ddd0] pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#384a35]">
                      Fulfillment
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mt-1">
                      Shipping & Delivery Timelines
                    </h2>
                    <p className="text-xs text-[#6f7a6b] mt-1">
                      Nationwide delivery coverage across all serviceable Indian pincodes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-[#20291e]">Delivery Speed</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0]">
                        <h4 className="font-semibold text-sm text-[#20291e]">Order Processing</h4>
                        <p className="text-xs text-[#6f7a6b] mt-1">
                          Orders placed before 2:00 PM are packed and handed to logistics within 24
                          hours.
                        </p>
                      </div>
                      <div className="p-4 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0]">
                        <h4 className="font-semibold text-sm text-[#20291e]">Transit Time</h4>
                        <p className="text-xs text-[#6f7a6b] mt-1">
                          3 to 5 business days for South India & Metros; 4 to 7 business days for the
                          rest of India.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-[#20291e]">Complimentary Delivery</h3>
                    <p className="text-sm text-[#3d4739] leading-relaxed">
                      Standard delivery is complimentary on all prepaid orders placed through our
                      secure Cashfree online gateway.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT & GRIEVANCE REDRESSAL */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="border-b border-[#e5ddd0] pb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#384a35]">
                      Support & Escalation
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mt-1">
                      Customer Care & Grievance Redressal
                    </h2>
                    <p className="text-xs text-[#6f7a6b] mt-1">
                      We are dedicated to resolving customer concerns swiftly and transparently.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] space-y-2">
                      <div className="flex items-center gap-2 text-[#384a35] font-bold text-sm">
                        <Phone size={18} />
                        <h4>Direct Telephone & WhatsApp</h4>
                      </div>
                      <p className="text-base font-semibold text-[#20291e]">{storePhone}</p>
                      <p className="text-xs text-[#6f7a6b]">
                        Operational: Monday to Saturday, 9:00 AM – 7:00 PM IST
                      </p>
                    </div>

                    <div className="p-5 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] space-y-2">
                      <div className="flex items-center gap-2 text-[#384a35] font-bold text-sm">
                        <Mail size={18} />
                        <h4>Customer Support Email</h4>
                      </div>
                      <p className="text-base font-semibold text-[#20291e]">support@vcartify.com</p>
                      <p className="text-xs text-[#6f7a6b]">
                        Average response turnaround within 12–24 business hours
                      </p>
                    </div>

                    <div className="sm:col-span-2 p-5 bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] space-y-2">
                      <div className="flex items-center gap-2 text-[#384a35] font-bold text-sm">
                        <MapPin size={18} />
                        <h4>Principal Place of Business</h4>
                      </div>
                      <p className="text-sm font-semibold text-[#20291e]">
                        {storeName} Enterprise & Retail Network
                      </p>
                      <p className="text-xs text-[#6f7a6b]">
                        Tirupur District, Tamil Nadu, India — PIN 641604
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#fcfaf6] p-4 rounded-xl border border-[#e5ddd0] text-xs text-[#6f7a6b] space-y-1">
                    <p className="font-semibold text-[#20291e]">
                      Consumer Protection (E-Commerce) Rules 2020 Compliance:
                    </p>
                    <p>
                      Grievance Officer: Customer Support Directorate, {storeName}. All grievances
                      will be formally acknowledged within 48 hours and resolved within 30 days of
                      receipt.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
