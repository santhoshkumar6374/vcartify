import { useState, useEffect } from "react";
import { X, MapPin, Search, Check, Loader2, Home, Briefcase } from "lucide-react";

export interface DeliveryLocation {
  pincode: string;
  city: string;
  state: string;
}

interface Props {
  isOpen: boolean;
  currentLocation: DeliveryLocation;
  onClose: () => void;
  onLocationChange: (location: DeliveryLocation) => void;
  savedAddresses?: Array<{
    id: string;
    name: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    type: "home" | "work" | "other";
  }>;
}

// Popular cities database (mock)
const POPULAR_CITIES: DeliveryLocation[] = [
  { pincode: "641604", city: "Tirupur", state: "Tamil Nadu" },
  { pincode: "641014", city: "Coimbatore", state: "Tamil Nadu" },
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu" },
  { pincode: "560001", city: "Bangalore", state: "Karnataka" },
  { pincode: "400001", city: "Mumbai", state: "Maharashtra" },
  { pincode: "110001", city: "New Delhi", state: "Delhi" },
  { pincode: "500001", city: "Hyderabad", state: "Telangana" },
  { pincode: "700001", city: "Kolkata", state: "West Bengal" },
];

// Mock pincode-to-city mapping
const PINCODE_DATABASE: Record<string, { city: string; state: string }> = {
  "641604": { city: "Tirupur", state: "Tamil Nadu" },
  "641014": { city: "Coimbatore", state: "Tamil Nadu" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "560001": { city: "Bangalore", state: "Karnataka" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "641002": { city: "Coimbatore", state: "Tamil Nadu" },
  "641003": { city: "Coimbatore", state: "Tamil Nadu" },
  "641601": { city: "Tirupur", state: "Tamil Nadu" },
  "641602": { city: "Tirupur", state: "Tamil Nadu" },
};

export function LocationModal({
  isOpen,
  currentLocation,
  onClose,
  onLocationChange,
  savedAddresses = [],
}: Props) {
  const [pincode, setPincode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [foundLocation, setFoundLocation] = useState<DeliveryLocation | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPincode("");
      setError("");
      setFoundLocation(null);
      setChecking(false);
    }
  }, [isOpen]);

  // Escape to close + body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Check pincode
  const handleCheckPincode = async () => {
    setError("");
    setFoundLocation(null);

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setChecking(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setChecking(false);

    const data = PINCODE_DATABASE[pincode];
    if (data) {
      setFoundLocation({
        pincode,
        city: data.city,
        state: data.state,
      });
    } else {
      // Mock: accept any valid pincode
      setFoundLocation({
        pincode,
        city: "Unknown City",
        state: "Unknown State",
      });
    }
  };

  const handleApplyLocation = (location: DeliveryLocation) => {
    onLocationChange(location);
    onClose();
  };

  // Auto-detect location (mock geolocation)
  const handleDetectLocation = () => {
    setChecking(true);
    setError("");

    // Simulate GPS detection
    setTimeout(() => {
      setChecking(false);
      handleApplyLocation({
        pincode: "641604",
        city: "Tirupur",
        state: "Tamil Nadu",
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-[90] transition-opacity"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[95vh] overflow-y-auto">

          {/* ═══ Header ═══ */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white p-5 rounded-t-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  <MapPin size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">
                    Choose Delivery Location
                  </h2>
                  <p className="text-xs text-white/80 font-medium">
                    Enter pincode to check availability
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-9 w-9 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Current Location */}
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-2.5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-semibold">
                Currently delivering to{" "}
                <span className="font-bold">
                  {currentLocation.city} - {currentLocation.pincode}
                </span>
              </p>
            </div>
          </div>

          {/* ═══ Body ═══ */}
          <div className="p-5 space-y-4">

            {/* Pincode Input */}
            <div>
              <label className="block">
                <span className="text-sm font-semibold text-gray-900 mb-2 block">
                  Enter Pincode
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                      setFoundLocation(null);
                    }}
                    placeholder="e.g., 641604"
                    className="flex-1 h-11 px-4 rounded-lg border-2 border-gray-300 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                    inputMode="numeric"
                    autoFocus
                  />
                  <button
                    onClick={handleCheckPincode}
                    disabled={checking || pincode.length !== 6}
                    className="h-11 px-5 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {checking ? (
                      <>
                        <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
                        <span>Checking</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} strokeWidth={2.5} />
                        <span>Check</span>
                      </>
                    )}
                  </button>
                </div>
              </label>

              {error && (
                <p className="text-sm text-red-600 font-semibold mt-2 flex items-center gap-1">
                  <X size={14} strokeWidth={2.5} />
                  {error}
                </p>
              )}
            </div>

            {/* Found Location Result */}
            {foundLocation && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-green-800 mb-0.5">
                      Delivery Available!
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {foundLocation.city}, {foundLocation.state}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Pincode: {foundLocation.pincode}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyLocation(foundLocation)}
                  className="mt-3 w-full h-10 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} strokeWidth={2.5} />
                  Deliver Here
                </button>
              </div>
            )}

            {/* Auto-Detect Button */}
            <button
              onClick={handleDetectLocation}
              disabled={checking}
              className="w-full h-11 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold text-sm hover:border-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {checking ? (
                <>
                  <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                  Detecting your location...
                </>
              ) : (
                <>
                  <MapPin size={16} strokeWidth={2} />
                  Use Current Location
                </>
              )}
            </button>

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Your Saved Addresses
                </p>
                <div className="space-y-2">
                  {savedAddresses.slice(0, 3).map((addr) => {
                    const AddressIcon = addr.type === "home" ? Home : Briefcase;
                    return (
                      <button
                        key={addr.id}
                        onClick={() =>
                          handleApplyLocation({
                            pincode: addr.pincode,
                            city: addr.city,
                            state: addr.state,
                          })
                        }
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gray-100 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                            <AddressIcon size={14} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold uppercase text-gray-500">
                                {addr.type}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs font-semibold text-gray-700">
                                {addr.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium truncate">
                              {addr.addressLine}
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                              {addr.city} - {addr.pincode}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Popular Cities */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Popular Cities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_CITIES.slice(0, 6).map((city) => (
                  <button
                    key={city.pincode}
                    onClick={() => handleApplyLocation(city)}
                    className={`text-left p-2.5 rounded-lg border transition-all ${
                      currentLocation.pincode === city.pincode
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-900"
                    }`}
                  >
                    <p className="text-sm font-bold">{city.city}</p>
                    <p className={`text-xs font-medium ${
                      currentLocation.pincode === city.pincode
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}>
                      {city.pincode}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Info footer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-semibold">
                💡 <span className="font-bold">Tip:</span> Delivery time and charges may vary based on your location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}