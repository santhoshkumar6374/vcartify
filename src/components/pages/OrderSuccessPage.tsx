import { CheckCircle, Package, Home, ArrowRight } from "lucide-react";

interface Props {
  orderId: string;
  onContinueShopping: () => void;
  onViewOrders?: () => void;
}

export function OrderSuccessPage({ orderId, onContinueShopping }: Props) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border-2 border-black shadow-2xl p-8 text-center">
        {/* Success icon with animation — BLACK */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-black animate-ping opacity-30" />
          <div className="relative h-24 w-24 rounded-full bg-black flex items-center justify-center shadow-lg">
            <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-black mb-2 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-gray-600 mb-6 font-semibold">
          Thank you for shopping with vCartify
        </p>

       {/* <div className="bg-gray-100 border-2 border-black rounded-xl p-4 mb-6">
          <p className="text-xs text-black uppercase tracking-widest font-black mb-1">
            Order ID
          </p>
          <p className="text-2xl font-black text-black tracking-tight">{orderId}</p>
        </div>
            */}
        {/*<div className="flex items-center gap-3 justify-center text-sm text-black font-bold mb-8">
          <Package size={16} className="text-black" strokeWidth={2.5} />
          <span>Expected delivery in 3-5 days</span>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinueShopping}
            className="w-full h-12 rounded-lg bg-black text-white font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
          >
            Continue Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={onContinueShopping}
            className="w-full h-12 rounded-lg border-2 border-black text-black font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Home size={16} strokeWidth={2.5} />
            Back to Home
          </button>
        </div> */}
      
      </div>
    </div>
  );
}