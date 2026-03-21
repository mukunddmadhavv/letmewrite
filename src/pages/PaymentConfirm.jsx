import { Link } from 'react-router-dom';
import { QrCode, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function PaymentConfirm() {
  // In a real app we would read order ID and amount from location state or context
  // For now displaying generic text per requirements
  const upiId = 'letmewrite@upi';
  const whatsappNumber = '919876543210'; 
  const message = encodeURIComponent("Hi, I just placed an order on LetMeWrite.in and paid the amount.");

  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden text-center fade-in">
        
        <div className="bg-blue-600 p-8 text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Order Captured!</h1>
          <p className="text-blue-100/90 text-sm">Action Required: Complete your payment to begin writing.</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider mb-4">Step 1: Scan & Pay</h2>
            <div className="mx-auto w-48 h-48 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 mb-4">
              <QrCode size={48} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">QR Code Placeholder</span>
            </div>
            <p className="text-sm text-zinc-600 font-medium tracking-wide">UPI: {upiId}</p>
          </div>

          <div className="w-full h-px bg-zinc-100 my-6"></div>

          <div>
             <h2 className="text-zinc-500 font-semibold text-sm uppercase tracking-wider mb-4">Step 2: Confirm Order</h2>
             <a
              href={`https://wa.me/${whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-md shadow-green-500/20"
            >
              <MessageCircle size={20} />
              Confirm on WhatsApp
              <ChevronRight size={18} className="opacity-70" />
            </a>
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              Send us a screenshot of your payment on WhatsApp. We will start working on your assignment immediately.
            </p>
          </div>
        </div>

      </div>

      <Link to="/dashboard" className="mt-8 text-sm text-zinc-500 hover:text-blue-600 font-medium transition-colors">
        Skip to Dashboard
      </Link>
    </div>
  );
}
