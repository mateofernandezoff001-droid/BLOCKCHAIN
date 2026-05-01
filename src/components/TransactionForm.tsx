import React, { useState, useEffect } from 'react';
import { CryptoPrice, Transaction, TransactionMovement } from '../types';
import { User, Mail, Wallet, DollarSign, Euro, Search, ChevronDown, Bitcoin, Trash2, Calendar, PlusCircle } from 'lucide-react';

interface Props {
  cryptos: CryptoPrice[];
  exchangeRate: number;
  onSubmit: (data: Omit<Transaction, 'userId' | 'timestamp'>) => void;
  initialData?: Transaction;
  onCancel?: () => void;
}

export default function TransactionForm({ cryptos, exchangeRate, onSubmit, initialData, onCancel }: Props) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    walletAddress: initialData?.walletAddress || '',
    amountUSD: initialData?.amountUSD || 0,
    amountEUR: initialData?.amountEUR || 0,
    cryptoSymbol: initialData?.cryptoSymbol || 'btc',
    cryptoAmount: initialData?.cryptoAmount || 0,
    movements: initialData?.movements || [] as TransactionMovement[]
  });

  const [movements, setMovements] = useState<TransactionMovement[]>(
    initialData?.movements && initialData.movements.length > 0 
      ? initialData.movements 
      : [{ date: new Date().toISOString().split('T')[0], amountUSD: 0, amountEUR: 0 }]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showCryptoList, setShowCryptoList] = useState(false);

  const filteredCryptos = cryptos.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // Recalculate totals when movements change
    const totalUSD = movements.reduce((sum, m) => sum + (m.amountUSD || 0), 0);
    const totalEUR = totalUSD * exchangeRate;
    
    const selectedCrypto = cryptos.find(c => c.symbol.toLowerCase() === formData.cryptoSymbol.toLowerCase());
    const cryptoAmount = selectedCrypto ? totalUSD / selectedCrypto.current_price : 0;

    setFormData(prev => ({
      ...prev,
      amountUSD: totalUSD,
      amountEUR: totalEUR,
      cryptoAmount,
      movements
    }));
  }, [movements, formData.cryptoSymbol, exchangeRate, cryptos]);

  const addMovement = () => {
    setMovements([...movements, { date: new Date().toISOString().split('T')[0], amountUSD: 0, amountEUR: 0 }]);
  };

  const removeMovement = (index: number) => {
    if (movements.length > 1) {
      setMovements(movements.filter((_, i) => i !== index));
    }
  };

  const updateMovement = (index: number, field: keyof TransactionMovement, value: string) => {
    const newMovements = [...movements];
    if (field === 'amountUSD') {
      const usd = parseFloat(value) || 0;
      newMovements[index] = { ...newMovements[index], amountUSD: usd, amountEUR: usd * exchangeRate };
    } else {
      newMovements[index] = { ...newMovements[index], [field]: value };
    }
    setMovements(newMovements);
  };

  const selectCrypto = (crypto: CryptoPrice) => {
    setFormData(prev => ({ ...prev, cryptoSymbol: crypto.symbol }));
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
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">Escritura de Transacciones</h2>
        <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Configuración de Movimientos Distribuidos</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup 
            label="Nombre" 
            icon={<User size={16} />} 
            value={formData.firstName}
            onChange={v => setFormData(p => ({ ...p, firstName: v }))}
            placeholder="Nombre del Cliente"
            required
          />
          <InputGroup 
            label="Apellido" 
            icon={<User size={16} />} 
            value={formData.lastName}
            onChange={v => setFormData(p => ({ ...p, lastName: v }))}
            placeholder="Apellido del Cliente"
            required
          />
        </div>

        <InputGroup 
          label="Identificación de Red (Email)" 
          icon={<Mail size={16} />} 
          type="email"
          value={formData.email}
          onChange={v => setFormData(p => ({ ...p, email: v }))}
          placeholder="email@servidor.com"
          required
        />

        <InputGroup 
          label="Dirección de Billetera (Clave Pública)" 
          icon={<Wallet size={16} />} 
          value={formData.walletAddress}
          onChange={v => setFormData(p => ({ ...p, walletAddress: v }))}
          placeholder="0x..."
          isFontMono
          required
        />

        <div className="space-y-6 pt-6 border-t border-slate-800/50">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar size={14} className="text-cyan-400" /> Movimientos Cronológicos
            </h3>
            <button 
              type="button" 
              onClick={addMovement}
              className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors"
            >
              <PlusCircle size={14} /> Añadir Fecha
            </button>
          </div>

          <div className="space-y-4">
            {movements.map((movement, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <div className="md:col-span-5">
                  <label className="block text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Fecha de Operación</label>
                  <div className="relative">
                    <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      type="date"
                      value={movement.date}
                      onChange={e => updateMovement(index, 'date', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                <div className="md:col-span-5">
                  <label className="block text-[8px] text-slate-500 uppercase font-bold tracking-widest mb-1">Monto (USD)</label>
                  <div className="relative">
                    <DollarSign size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      type="number"
                      step="0.01"
                      value={movement.amountUSD || ''}
                      onChange={e => updateMovement(index, 'amountUSD', e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => removeMovement(index)}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                    disabled={movements.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Total USD</p>
                <p className="text-xl font-mono font-black text-white">${formData.amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
             </div>
             <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Total EUR</p>
                <p className="text-xl font-mono font-black text-white">€{formData.amountEUR.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
             </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">Protocolo de Activo</label>
            <button 
              type="button"
              onClick={() => setShowCryptoList(!showCryptoList)}
              className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-mono font-bold text-cyan-400 text-xs uppercase border border-slate-800 group-hover:border-slate-700">
                  {formData.cryptoSymbol}
                </div>
                <span className="font-bold text-white text-sm tracking-wide">{selectedCryptoData?.name || 'Seleccionar Activo...'}</span>
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
                      placeholder="Buscar protocolos..."
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
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Distribución Estimada</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-black text-white">{formData.cryptoAmount.toFixed(8)}</span>
                <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">{formData.cryptoSymbol}</span>
              </div>
            </div>
            <div className="text-right relative z-10">
              <p className="text-[9px] text-slate-600 font-mono">TASA ORÁCULO</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">1 {formData.cryptoSymbol} = ${selectedCryptoData?.current_price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-800 text-slate-400 font-black py-5 rounded-2xl hover:bg-slate-700 transition-all uppercase text-xs tracking-[0.3em]"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit"
            disabled={!formData.firstName || formData.amountUSD <= 0}
            className="flex-[2] bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-black py-5 rounded-2xl hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] disabled:opacity-20 disabled:grayscale disabled:scale-100 transition-all shadow-xl active:scale-[0.98] uppercase text-xs tracking-[0.3em]"
          >
            {initialData ? 'Actualizar Registro' : 'Validar & Comprometer'}
          </button>
        </div>
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

