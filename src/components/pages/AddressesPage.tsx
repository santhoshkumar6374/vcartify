import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";

const ADDRESSES_STORAGE_KEY = "store_addresses";

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

interface Props {
  onBack: () => void;
}

// Sample addresses
const SAMPLE_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Priya Sharma",
    phone: "9876543210",
    addressLine: "42, Rose Garden, 3rd Cross",
    city: "Tirupur",
    state: "Tamil Nadu",
    pincode: "641604",
    type: "home",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Priya Sharma",
    phone: "9876543210",
    addressLine: "Office Block, Tech Park",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641014",
    type: "work",
    isDefault: false,
  },
];

// ═══════════════════════════════════════════════════
export function AddressesPage({ onBack }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(ADDRESSES_STORAGE_KEY);
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch {
        setAddresses(SAMPLE_ADDRESSES);
      }
    } else {
      setAddresses(SAMPLE_ADDRESSES);
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(SAMPLE_ADDRESSES));
    }
  }, []);

  const saveAddresses = (list: Address[]) => {
    setAddresses(list);
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(list));
  };

  const handleSaveAddress = (data: Omit<Address, "id" | "isDefault">) => {
    if (editingAddress) {
      // Update existing
      const updated = addresses.map((a) =>
        a.id === editingAddress.id ? { ...editingAddress, ...data } : a
      );
      saveAddresses(updated);
    } else {
      // Add new
      const newAddress: Address = {
        ...data,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
      };
      saveAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this address?")) {
      const updated = addresses.filter((a) => a.id !== id);
      // If deleted default, make first one default
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0].isDefault = true;
      }
      saveAddresses(updated);
    }
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    saveAddresses(updated);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  return (
    <div className="bg-white min-h-screen py-4 sm:py-8">
      <div className="mx-auto max-w-4xl px-3 sm:px-4">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black font-black text-sm hover:underline mb-4"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black flex items-center justify-center">
              <MapPin size={20} className="text-white sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
                Saved Addresses
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-black text-white font-black text-sm hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add New
          </button>
        </div>

        {/* Empty state */}
        {addresses.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl py-16 text-center">
            <MapPin size={48} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-black text-black mb-2">
              No addresses saved
            </h3>
            <p className="text-gray-600 font-semibold mb-6">
              Add your first delivery address
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-black hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address.id)}
                onSetDefault={() => handleSetDefault(address.id)}
              />
            ))}
          </div>
        )}

        {/* Address Form Modal */}
        {showForm && (
          <AddressForm
            initial={editingAddress}
            onSave={handleSaveAddress}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const TypeIcon = address.type === "home" ? Home : address.type === "work" ? Briefcase : MapPin;

  return (
    <article
      className={`bg-white rounded-xl border-2 p-5 transition-colors ${
        address.isDefault
          ? "border-black shadow-md"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
            <TypeIcon size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-black">
              {address.type}
            </span>
            {address.isDefault && (
              <span className="ml-2 bg-black text-white text-[10px] px-2 py-0.5 rounded font-black">
                DEFAULT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1 mb-4">
        <p className="text-base font-black text-black">{address.name}</p>
        <p className="text-sm text-black font-semibold">
          {address.addressLine}
        </p>
        <p className="text-sm text-black font-semibold">
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-sm text-gray-600 font-semibold">
          📞 +91 {address.phone}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t-2 border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border-2 border-gray-300 text-black font-black text-xs hover:border-black transition-colors"
        >
          <Edit2 size={12} strokeWidth={2.5} />
          Edit
        </button>
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border-2 border-gray-300 text-black font-black text-xs hover:border-black transition-colors"
          >
            <Check size={12} strokeWidth={2.5} />
            Set Default
          </button>
        )}
        <button
          onClick={onDelete}
          className="h-9 w-9 rounded-lg border-2 border-gray-300 text-black hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center"
          aria-label="Delete"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}

// ─── Address Form Modal ──────────────────────────────
function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Address | null;
  onSave: (data: Omit<Address, "id" | "isDefault">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [addressLine, setAddressLine] = useState(initial?.addressLine || "");
  const [city, setCity] = useState(initial?.city || "");
  const [state, setState] = useState(initial?.state || "Tamil Nadu");
  const [pincode, setPincode] = useState(initial?.pincode || "");
  const [type, setType] = useState<Address["type"]>(initial?.type || "home");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    if (!name.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !pincode.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter valid 10-digit phone");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter valid 6-digit pincode");
      return;
    }
    onSave({ name, phone, addressLine, city, state, pincode, type });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[90]" onClick={onCancel} />

      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[95vh] overflow-y-auto">

          {/* Header */}
          <div className="bg-black text-white p-5 rounded-t-2xl flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight">
              {initial ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={onCancel}
              className="h-9 w-9 rounded-full hover:bg-white/15 flex items-center justify-center"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            {/* Type Selector */}
            <div>
              <label className="text-sm font-black text-black mb-2 block">
                Address Type
              </label>
              <div className="flex gap-2">
                {(["home", "work", "other"] as Address["type"][]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 h-10 rounded-lg border-2 font-black text-sm uppercase transition-all ${
                      type === t
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-black hover:border-black"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <Input label="Full Name" value={name} onChange={setName} placeholder="Enter your name" />

            {/* Phone */}
            <Input
              label="Phone Number"
              value={phone}
              onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile"
              inputMode="numeric"
            />

            {/* Address */}
            <Input
              label="Address Line"
              value={addressLine}
              onChange={setAddressLine}
              placeholder="House no, Street, Area"
            />

            {/* City & Pincode */}
            <div className="grid grid-cols-2 gap-3">
              <Input label="City" value={city} onChange={setCity} placeholder="City" />
              <Input
                label="Pincode"
                value={pincode}
                onChange={(v) => setPincode(v.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit"
                inputMode="numeric"
              />
            </div>

            {/* State */}
            <Input label="State" value={state} onChange={setState} placeholder="State" />

            {error && <p className="text-sm text-red-600 font-bold">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 h-12 rounded-lg border-2 border-black text-black font-black hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 h-12 rounded-lg bg-black text-white font-black hover:bg-gray-800 transition-colors"
              >
                {initial ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Input ────────────────────────────────────────────
function Input({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric";
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-black mb-2 block">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full h-11 px-3 rounded-lg border-2 border-gray-300 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
      />
    </label>
  );
}