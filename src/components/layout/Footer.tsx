import { ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin, Lock } from "lucide-react";
import type { PolicyType } from "@/components/modals/PolicyModal";

interface FooterProps {
  storeName?: string;
  storePhone?: string;
  onOpenPolicy: (policy: PolicyType, fullPage?: boolean) => void;
  onHomeClick?: () => void;
}

export function Footer({
  storeName = "vCartify",
  storePhone = "+91 98765 43210",
  onOpenPolicy,
  onHomeClick,
}: FooterProps) {
  return (
    <footer className="bg-[#20291e] text-[#e8dfd3] pt-12 pb-24 lg:pb-12 border-t border-[#384a35]/40 mt-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-[#384a35]/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#384a35] flex items-center justify-center text-[#faf7f2] shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">100% Secure Payments</h4>
              <p className="text-xs text-[#a3b19f]">Powered by Cashfree Payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#384a35] flex items-center justify-center text-[#faf7f2] shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Complimentary Delivery</h4>
              <p className="text-xs text-[#a3b19f]">Across India on all orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#384a35] flex items-center justify-center text-[#faf7f2] shrink-0">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Easy 7-Day Returns</h4>
              <p className="text-xs text-[#a3b19f]">Simple & hassle-free refund policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#384a35] flex items-center justify-center text-[#faf7f2] shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Dedicated Support</h4>
              <p className="text-xs text-[#a3b19f]">Call & WhatsApp assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <h3
              onClick={onHomeClick}
              className="font-serif font-bold text-2xl text-[#faf7f2] cursor-pointer hover:opacity-90"
            >
              {storeName}
            </h3>
            <p className="text-xs text-[#a3b19f] leading-relaxed">
              Curated collection of quality products crafted for modern lifestyles. Seamless
              ordering with verified security and fast nationwide delivery.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#c9d7c5] pt-1">
              <Lock size={12} className="text-[#86efac]" />
              <span>PCI-DSS 256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Col 2: Mandatory Compliance Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#faf7f2]">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#a3b19f]">
              <li>
                <button
                  onClick={() => onOpenPolicy("privacy")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("terms")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("refund")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("shipping")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onOpenPolicy("privacy", true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#d8c29d] font-semibold hover:text-white transition-colors"
                >
                  View Full Compliance Center →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#faf7f2]">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-[#a3b19f]">
              <li>
                <button
                  onClick={() => onOpenPolicy("contact")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Help & Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("refund")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Track Order / Return Request
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy("shipping")}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Delivery FAQs
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${storePhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I need help with my order on " + storeName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#86efac] font-medium hover:underline text-xs"
                >
                  Chat with Us on WhatsApp 💬
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider uppercase text-[#faf7f2]">
              Reach Us
            </h4>
            <div className="space-y-2 text-xs text-[#a3b19f]">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5 text-[#faf7f2]" />
                <span>Tirupur, Tamil Nadu, India - 641604</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-[#faf7f2]" />
                <a href={`tel:${storePhone}`} className="hover:text-white">
                  {storePhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-[#faf7f2]" />
                <a href="mailto:support@vcartify.com" className="hover:text-white">
                  support@vcartify.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-6 border-t border-[#384a35]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a3b19f]">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-[#c9d7c5] font-medium mr-1">Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-[#2e3b2b] text-[10px] text-white border border-[#44563f]">
              UPI / GPay / PhonePe
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2e3b2b] text-[10px] text-white border border-[#44563f]">
              Credit & Debit Cards
            </span>
            <span className="px-2 py-0.5 rounded bg-[#2e3b2b] text-[10px] text-white border border-[#44563f]">
              Net Banking
            </span>
            <span className="px-2 py-0.5 rounded bg-[#384a35] text-[10px] text-white font-semibold border border-[#526a4c]">
              Cashfree Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
