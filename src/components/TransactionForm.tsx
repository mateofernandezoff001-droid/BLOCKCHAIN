import React, { useState, useEffect } from 'react';
import { CryptoPrice, Transaction } from '../types';
import { User, Mail, Wallet, DollarSign, Euro, Search, ChevronDown, Bitcoin } from 'lucide-react';

interface Props {
  cryptos: CryptoPrice[];
  exchangeRate: number;
  onSubmit: (data: Omit<Transaction, 'userId' | 'timestamp'>) => void;
}

export default function TransactionForm({ cryptos, exchangeRate, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    walletAddress: '',
    amountUSD: 0,
    amountEUR: 0,
    cryptoSymbol: 'btc',
    cryptoAmount: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCryptoList, setShowCryptoList] = useState(false);

  const filteredCryptos = cryptos.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUSDChange = (val: string) => {
    const usd = parseFloat(val) || 0;
    const eur = usd * exchangeRate;
    updateCryptoAmount(usd, eur, formData.cryptoSymbol);
  };

  const handleEURChange = (val: string) => {
    const eur = parseFloat(val) || 0;
    const usd = eur / exchangeRate;
    updateCryptoAmount(usd, eur, formData.cryptoSymbol);
  };

  const updateCryptoAmount = (usd: number, eur: number, symbol: string) => {
    const selectedCrypto = cryptos.find(c => c.symbol.toLowerCase() === symbol.toLowerCase());
    const cryptoAmount = selectedCrypto ? usd / selectedCrypto.current_price : 0;
    setFormData(prev => ({ ...prev, amountUSD: usd, amountEUR: eur, cryptoSymbol: symbol, cryptoAmount }));
  };

  const selectCrypto = (crypto: CryptoPrice) => {
    setFormData(prev => ({ ...prev, cryptoSymbol: crypto.symbol }));
    updateCryptoAmount(formData.amountUSD, formData.amountEUR, crypto.symbol);
    setShowCryptoList(false);
    setSearchTerm('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedCryptoData = cryptos.find(c => c.symbol.toLowerCase() === formData.cryptoSymbol.toLowerCase());

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
      <div className="bg-slate-950/80 px-8 py-6 border-b border-slate-800">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">Transaction Ledger</h2>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Authorized Node Input Section</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup 
            label="First Name" 
            icon={<User size={16} />} 
            value={formData.firstName}
            onChange={v => setFormData(p => ({ ...p, firstName: v }))}
            placeholder="John"
            required
          />
          <InputGroup 
            label="Last Name" 
            icon={<User size={16} />} 
            value={formData.lastName}
            onChange={v => setFormData(p => ({ ...p, lastName: v }))}
            placeholder="Doe"
            required
          />
        </div>

        <InputGroup 
          label="Network Identification (Email)" 
          icon={<Mail size={16} />} 
          type="email"
          value={formData.email}
          onChange={v => setFormData(p => ({ ...p, email: v }))}
          placeholder="john@ledger.network"
          required
        />

        <InputGroup 
          label="Wallet Address (Public Key)" 
          icon={<Wallet size={16} />} 
          value={formData.walletAddress}
          onChange={v => setFormData(p => ({ ...p, walletAddress: v }))}
          placeholder="0x..."
          isFontMono
          required
        />

        <div className="space-y-6 pt-6 border-t border-slate-800/50">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <DollarSign size={14} className="text-cyan-400" /> Valuation Parameters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="USD Value" 
              icon={<DollarSign size={16} />} 
              type="number"
              step="0.01"
              value={formData.amountUSD.toString()}
              onChange={handleUSDChange}
              required
            />
            <InputGroup 
              label="EUR Value" 
              icon={<Euro size={16} />} 
              type="number"
              step="0.01"
              value={formData.amountEUR.toString()}
              onChange={handleEURChange}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Asset Protocol</label>
            <button 
              type="button"
              onClick={() => setShowCryptoList(!showCryptoList)}
              className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-mono font-bold text-cyan-400 text-xs uppercase border border-slate-800 group-hover:border-slate-700">
                  {formData.cryptoSymbol}
                </div>
                <span className="font-bold text-white text-sm tracking-wide">{selectedCryptoData?.name || 'Select Asset...'}</span>
              </div>
              <ChevronDown size={20} className={`text-slate-600 transition-transform ${showCryptoList ? 'rotate-180' : ''}`} />
            </button>

            {showCryptoList && (
              <div className="absolute z-50 w-full mt-2 bg-slate-950 border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text"
                      autoFocus
                      placeholder="Search protocols..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 text-sm rounded-xl outline-none focus:border-cyan-500/50 transition-colors text-white"
                    />
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {filteredCryptos.map(crypto => (
                    <button
                      key={crypto.id}
                      type="button"
                      onClick={() => selectCrypto(crypto)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-900 transition-colors text-left border-b border-slate-900/50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase w-10">{crypto.symbol}</span>
                        <span className="text-sm font-bold text-slate-200">{crypto.name}</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-400/70 tracking-tighter">${crypto.current_price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl flex items-center justify-between border border-slate-800 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <Bitcoin size={60} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Calculated Distribution</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-white">{formData.cryptoAmount.toFixed(8)}</span>
                <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">{formData.cryptoSymbol}</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-[9px] text-slate-600 font-mono">ORACLE RATE</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">1 {formData.cryptoSymbol} = ${selectedCryptoData?.current_price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={!formData.firstName || !formData.amountUSD}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black py-5 rounded-2xl hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:opacity-20 disabled:grayscale disabled:scale-100 transition-all shadow-xl active:scale-[0.98] mt-4 uppercase text-xs tracking-[0.3em]"
        >
          Validate & Commit to Ledger
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, icon, value, onChange, placeholder, type = 'text', required = false, step, isFontMono }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">
          {icon}
        </div>
        <input 
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          step={step}
          className={`w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-white text-sm placeholder:text-slate-700 ${isFontMono ? 'font-mono' : ''}`}
        />
      </div>
    </div>
  );
}
