import {
  X,
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Phone,
  Mail,
  MapPin,
  Lock,
  CheckCircle2,
} from "lucide-react";

export type PolicyType = "privacy" | "terms" | "refund" | "shipping" | "contact";

interface PolicyModalProps {
  isOpen: boolean;
  activePolicy: PolicyType;
  onClose: () => void;
  onSelectPolicy: (policy: PolicyType) => void;
  storeName?: string;
  storePhone?: string;
}

export function PolicyModal({
  isOpen,
  activePolicy,
  onClose,
  onSelectPolicy,
  storeName = "vCartify",
  storePhone = "+91 98765 43210",
}: PolicyModalProps) {
  if (!isOpen) return null;

  const tabs: { id: PolicyType; label: string; icon: React.ReactNode }[] = [
    { id: "privacy", label: "Privacy Policy", icon: <ShieldCheck size={15} /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText size={15} /> },
    { id: "refund", label: "Return & Refund", icon: <RotateCcw size={15} /> },
    { id: "shipping", label: "Shipping Policy", icon: <Truck size={15} /> },
    { id: "contact", label: "Contact Us", icon: <Phone size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#e8e1d5] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4.5 bg-[#fdfbf7] border-b border-[#eee7dc] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#384a35] text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck size={20} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#20291e] tracking-tight">
                  Legal & Customer Policies
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef3eb] text-[#384a35] border border-[#c9d7c5]">
                  <Lock size={10} /> Verified
                </span>
              </div>
              <p className="text-xs text-[#70796c] mt-0.5">
                Official store terms and compliance documents for {storeName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white border border-[#e5ddd0] text-[#6f7a6b] hover:text-[#20291e] hover:bg-[#f7f3ec] transition-colors flex items-center justify-center shadow-2xs"
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Modern Segmented Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#fcfaf6] border-b border-[#eee7dc] shrink-0">
          <div className="flex items-center gap-1 p-1 bg-[#ede6d8]/70 rounded-xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activePolicy === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectPolicy(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-[#384a35] text-white shadow-xs"
                      : "text-[#5e6b5a] hover:text-[#20291e] hover:bg-white/60"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-[#7b8977]"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body Area */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 text-sm text-[#384234] leading-relaxed space-y-6">
          {/* TAB 1: PRIVACY POLICY */}
          {activePolicy === "privacy" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#eee7dc]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eef3eb] text-[#384a35] text-[11px] font-semibold mb-1.5">
                  DPDP Act (India) & IT Act Compliant
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#20291e]">
                  Privacy & Data Protection Policy
                </h3>
                <p className="text-xs text-[#70796c] mt-1">
                  Last updated: October 2026 • Effective for all store orders
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#4a5546] leading-relaxed">
                At <strong>{storeName}</strong>, accessible via our online eCommerce store, the
                confidentiality of your personal information is our highest priority. This policy
                explains what data we collect, how it is safeguarded, and how our payment partners
                process your transactions.
              </p>

              {/* Data We Collect Cards */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#20291e] flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#384a35] text-white text-[11px] flex items-center justify-center font-bold">
                    1
                  </span>
                  Information We Collect
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1">
                    <p className="font-semibold text-xs text-[#20291e]">👤 Contact & Identity</p>
                    <p className="text-xs text-[#606c5c]">
                      Full customer name, primary mobile number, and WhatsApp contact for order updates.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1">
                    <p className="font-semibold text-xs text-[#20291e]">📍 Delivery Address</p>
                    <p className="text-xs text-[#606c5c]">
                      Street address, city, state, and 6-digit postal pincode for accurate dispatch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cashfree Payment Security Callout */}
              <div className="p-5 rounded-2xl bg-[#f4f7f2] border-2 border-[#384a35]/25 space-y-2.5">
                <div className="flex items-center gap-2 text-[#384a35] font-bold text-sm">
                  <Lock size={18} className="shrink-0" />
                  <h4>2. Payment Security & Zero Raw Card Storage</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#243122] leading-relaxed">
                  We guarantee total payment safety. <strong>{storeName} does NOT collect, view, or
                  store your credit/debit card numbers, CVV codes, net banking passwords, or UPI
                  PINs on our servers.</strong>
                </p>
                <p className="text-xs text-[#4a5546] leading-relaxed">
                  All online payments are securely handed over to{" "}
                  <strong>Cashfree Payments India Pvt. Ltd.</strong>, an authorized payment
                  aggregator regulated by the Reserve Bank of India (RBI). Cashfree processes
                  transactions with 256-bit SSL encryption and Level-1 PCI-DSS compliance.
                </p>
              </div>

              {/* How We Use Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#20291e] flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-[#384a35] text-white text-[11px] flex items-center justify-center font-bold">
                    3
                  </span>
                  How Your Data Is Used
                </h4>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4a5546]">
                    <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                    <span>To dispatch orders and share tracking details with verified courier partners.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4a5546]">
                    <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                    <span>To send invoices and delivery confirmations via SMS and WhatsApp.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4a5546]">
                    <CheckCircle2 size={16} className="text-[#384a35] shrink-0 mt-0.5" />
                    <span>
                      We strictly pledge to <strong>never sell, rent, or leak</strong> your contact
                      details to telemarketers or external advertising networks.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS AND CONDITIONS */}
          {activePolicy === "terms" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#eee7dc]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eef3eb] text-[#384a35] text-[11px] font-semibold mb-1.5">
                  Legal Agreement
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#20291e]">
                  Terms & Conditions of Sale
                </h3>
                <p className="text-xs text-[#70796c] mt-1">
                  Please review the terms applicable to all purchases made on {storeName}.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#20291e]">
                    1. Product Pricing & Currency
                  </h4>
                  <p className="text-xs text-[#525f4e] leading-relaxed">
                    All prices are listed in Indian National Rupees (INR) and are inclusive of all
                    applicable statutory goods & services taxes. We reserve the right to amend
                    prices or offer promotional discounts at our discretion.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#20291e]">
                    2. Order Confirmation & Fulfillment
                  </h4>
                  <p className="text-xs text-[#525f4e] leading-relaxed">
                    Order confirmation generated upon payment constitutes receipt of your request.
                    In rare cases of inventory mismatch or courier non-serviceability, we reserve the
                    right to cancel an order and immediately issue a 100% refund to the source
                    account.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1.5">
                  <h4 className="font-bold text-xs sm:text-sm text-[#20291e]">
                    3. Governing Jurisdiction
                  </h4>
                  <p className="text-xs text-[#525f4e] leading-relaxed">
                    These terms are governed in accordance with the substantive laws of India.
                    Disputes arising out of or related to website orders are subject to the
                    exclusive jurisdiction of courts in Tamil Nadu, India.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activePolicy === "refund" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#eee7dc]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eef3eb] text-[#384a35] text-[11px] font-semibold mb-1.5">
                  Fair Refund Assurance
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#20291e]">
                  Cancellation & Refund Policy
                </h3>
                <p className="text-xs text-[#70796c] mt-1">
                  Clear, hassle-free returns and automated refunds powered by Cashfree.
                </p>
              </div>

              {/* 3 Metric Badges */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] text-center">
                  <p className="text-lg sm:text-2xl font-serif font-bold text-[#384a35]">7 Days</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#20291e] mt-0.5">
                    Return Window
                  </p>
                  <p className="text-[10px] text-[#788574] hidden sm:block">From delivery date</p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] text-center">
                  <p className="text-lg sm:text-2xl font-serif font-bold text-[#384a35]">5-7 Days</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#20291e] mt-0.5">
                    Refund Speed
                  </p>
                  <p className="text-[10px] text-[#788574] hidden sm:block">Back to source account</p>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] text-center">
                  <p className="text-lg sm:text-2xl font-serif font-bold text-[#384a35]">100%</p>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#20291e] mt-0.5">
                    Full Reversal
                  </p>
                  <p className="text-[10px] text-[#788574] hidden sm:block">Zero deduction on defect</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-[#20291e]">
                  How to Initiate a Return:
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-[#4a5546]">
                  <p>
                    1. Notify our support desk on WhatsApp (<strong>{storePhone}</strong>) or email{" "}
                    <strong>support@vcartify.com</strong> within 7 days of package receipt.
                  </p>
                  <p>
                    2. Provide your Order ID (starts with <code>VC...</code>) and a brief photo if
                    the item arrived damaged or defective.
                  </p>
                  <p>
                    3. Once the returned parcel arrives at our fulfillment facility, a 100% refund is
                    dispatched immediately via Cashfree Payments directly to your bank/card.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHIPPING POLICY */}
          {activePolicy === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#eee7dc]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eef3eb] text-[#384a35] text-[11px] font-semibold mb-1.5">
                  Nationwide Logistics
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#20291e]">
                  Shipping & Delivery Timelines
                </h3>
                <p className="text-xs text-[#70796c] mt-1">
                  Speed, tracking, and delivery guidelines across Indian postal codes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1">
                  <p className="text-xs font-bold text-[#20291e] uppercase tracking-wider text-[#384a35]">
                    Order Processing
                  </p>
                  <p className="text-sm font-semibold text-[#20291e]">Within 24 to 48 Hours</p>
                  <p className="text-xs text-[#606c5c]">
                    All orders are packed and dispatched swiftly with verified courier partners.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1">
                  <p className="text-xs font-bold text-[#20291e] uppercase tracking-wider text-[#384a35]">
                    Delivery Speed
                  </p>
                  <p className="text-sm font-semibold text-[#20291e]">3 to 7 Business Days</p>
                  <p className="text-xs text-[#606c5c]">
                    Metro locations: 3-4 days • Other Indian destinations: 4-7 days.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#eef3eb] border border-[#c9d7c5] space-y-1 text-xs sm:text-sm text-[#243122]">
                <p className="font-semibold text-[#384a35]">🚚 Free Standard Shipping</p>
                <p className="text-xs text-[#4a5546]">
                  Standard doorstep delivery is complimentary for all prepaid orders on {storeName}.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT US */}
          {activePolicy === "contact" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-[#eee7dc]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#eef3eb] text-[#384a35] text-[11px] font-semibold mb-1.5">
                  Direct Support
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#20291e]">
                  Customer Care & Grievance Redressal
                </h3>
                <p className="text-xs text-[#70796c] mt-1">
                  Get in touch with our team for order inquiries, returns, and support.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <a
                  href={`tel:${storePhone}`}
                  className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] hover:border-[#384a35] transition-colors group space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#384a35] font-semibold text-xs">
                    <Phone size={16} /> Phone Support
                  </div>
                  <p className="font-bold text-sm text-[#20291e] group-hover:text-[#384a35]">
                    {storePhone}
                  </p>
                  <p className="text-[11px] text-[#70796c]">Mon - Sat: 9:00 AM – 7:00 PM IST</p>
                </a>

                <a
                  href="mailto:support@vcartify.com"
                  className="p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] hover:border-[#384a35] transition-colors group space-y-1"
                >
                  <div className="flex items-center gap-2 text-[#384a35] font-semibold text-xs">
                    <Mail size={16} /> Email Support
                  </div>
                  <p className="font-bold text-sm text-[#20291e] group-hover:text-[#384a35]">
                    support@vcartify.com
                  </p>
                  <p className="text-[11px] text-[#70796c]">Responses within 24 business hours</p>
                </a>

                <div className="sm:col-span-2 p-4 rounded-xl bg-[#fcfaf6] border border-[#e8e1d5] space-y-1">
                  <div className="flex items-center gap-2 text-[#384a35] font-semibold text-xs">
                    <MapPin size={16} /> Operational Office
                  </div>
                  <p className="font-bold text-sm text-[#20291e]">
                    {storeName} Enterprise & Retail Network
                  </p>
                  <p className="text-xs text-[#606c5c]">
                    Tirupur District, Tamil Nadu, India — PIN 641604
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fdfbf7] border border-[#eee7dc] text-xs text-[#606c5c]">
                <strong>Grievance Officer:</strong> In compliance with the Information Technology
                Act 2000, for unresolved escalations, please contact{" "}
                <a href="mailto:grievance@vcartify.com" className="text-[#384a35] underline">
                  grievance@vcartify.com
                </a>
                .
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-[#fdfbf7] border-t border-[#eee7dc] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#70796c]">
            <Lock size={13} className="text-[#384a35]" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted • Powered by Cashfree</span>
            <span className="sm:hidden">Cashfree Verified</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#384a35] text-white font-semibold text-xs sm:text-sm hover:bg-[#283626] transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
