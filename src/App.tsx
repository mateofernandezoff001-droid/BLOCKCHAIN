import React, { useState, useEffect, FormEvent } from 'react';
import { Transaction, CryptoPrice } from './types';
import { fetchTopCryptos, fetchExchangeRate } from './services/cryptoService';
import { generateTransactionsPDF } from './utils/pdfGenerator';
import { 
  Plus, 
  LogOut, 
  Bitcoin, 
  History,
  LayoutDashboard,
  Coins,
  Wallet,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [exchangeRate, setExchangeRate] = useState(0.92);
  const [view, setView] = useState<'dashboard' | 'form' | 'history'>('dashboard');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Check if was already logged in
    const savedSession = localStorage.getItem('blockchain_session');
    if (savedSession === 'Mateo') {
      setIsLoggedIn(true);
    }
    
    // Load local transactions
    const savedTransactions = localStorage.getItem('blockchain_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    const initData = async () => {
      const cryptoList = await fetchTopCryptos();
      setCryptos(cryptoList);
      const rates = await fetchExchangeRate();
      setExchangeRate(rates.usd_to_eur);
      setLoading(false);
    };

    initData();
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'Mateo' && password === 'Aa123456') {
      setIsLoggedIn(true);
      localStorage.setItem('blockchain_session', 'Mateo');
      setLoginError(null);
    } else {
      setLoginError('Credenciales incorrectas. Usa Mateo / Aa123456');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('blockchain_session');
  };

  const addTransaction = (data: Omit<Transaction, 'userId' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      userId: 'mateo-id',
      timestamp: new Date().toISOString()
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('blockchain_transactions', JSON.stringify(updatedTransactions));
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Bitcoin className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900/40 border border-slate-800 p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="bg-gradient-to-tr from-cyan-400 to-blue-600 p-5 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <Coins className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">BLOCKCHAIN</h1>
          <p className="text-slate-400 mb-10 text-lg uppercase tracking-widest text-[10px] font-bold">Portal de Acceso Seguro</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mateo"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Aa123456"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
              />
            </div>

            {loginError && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-red-400 text-[10px] font-bold uppercase tracking-wider"
              >
                {loginError}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full bg-white text-slate-950 font-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 mt-4 uppercase text-xs tracking-widest"
            >
              Iniciar Nodo
            </button>
            <p className="mt-6 text-[9px] text-slate-600 uppercase tracking-widest font-bold">Credenciales: Mateo / Aa123456</p>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]"></div>
      </div>

      <aside className="hidden md:flex flex-col w-72 bg-slate-950/50 backdrop-blur-md border-r border-slate-800 p-8 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center">
             <Coins className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-widest text-white italic">BLOCKCHAIN</h1>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem active={view === 'form'} onClick={() => setView('form')} icon={<Plus size={20} />} label="Nueva Entrada" />
          <NavItem active={view === 'history'} onClick={() => setView('history')} icon={<History size={20} />} label="Libro Mayor" />
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-8">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-slate-800 flex items-center justify-center font-black text-cyan-400">M</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white uppercase tracking-tight">Mateo</p>
              <p className="text-[10px] text-slate-500 truncate font-mono uppercase tracking-widest">Usuario Autorizado</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={16} />
            Desconectar
          </button>
        </div>
      </aside>


      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10">
        <header className="flex items-center justify-between mb-10 md:hidden">
          <div className="flex items-center gap-3">
            <Coins className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold tracking-widest text-white">BLOCKCHAIN</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400"><LogOut size={24} /></button>
        </header>

        <div className="md:hidden flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <MobileNavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')} label="Dashboard" />
          <MobileNavBtn active={view === 'form'} onClick={() => setView('form')} label="New" />
          <MobileNavBtn active={view === 'history'} onClick={() => setView('history')} label="History" />
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    label="Portfolio Value" 
                    value={`$${transactions.reduce((acc, t) => acc + t.amountUSD, 0).toLocaleString()}`} 
                    subValue={`≈ €${transactions.reduce((acc, t) => acc + t.amountEUR, 0).toLocaleString()}`}
                    icon={<Wallet className="text-cyan-400" size={24} />}
                  />
                  <StatCard 
                    label="Stored Entries" 
                    value={transactions.length.toString()} 
                    subValue="On-chain Verification"
                    icon={<History className="text-blue-400" size={24} />}
                  />
                  <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-cyan-900/20 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Download size={80} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-cyan-100 text-[10px] uppercase font-bold tracking-widest mb-1">Export Archive</p>
                      <h3 className="text-2xl font-black italic">DOWNLOAD LEDGER</h3>
                    </div>
                    <button 
                      onClick={() => generateTransactionsPDF(transactions)}
                      className="mt-6 w-full bg-white text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                    >
                      <Download size={18} />
                      PDF Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Recent Activity</h2>
                      <button onClick={() => setView('history')} className="text-xs font-bold text-slate-500 hover:text-white transition-colors tracking-widest uppercase">Global Ledger</button>
                    </div>
                    <TransactionList transactions={transactions.slice(0, 5)} />
                  </div>
                  
                  <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                         Market Oracle
                      </h2>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> LIVE
                      </span>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                      {cryptos.slice(0, 12).map((crypto) => (
                        <div key={crypto.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 hover:border-slate-700 transition-all group">
                          <div className="flex items-center gap-4">
                            <span className="uppercase font-mono font-bold text-xs text-slate-500 w-10 group-hover:text-cyan-400 transition-colors">{crypto.symbol}</span>
                            <span className="font-semibold text-slate-200 text-sm">{crypto.name}</span>
                          </div>
                          <span className="font-mono text-sm font-bold text-white">${crypto.current_price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <TransactionForm cryptos={cryptos} exchangeRate={exchangeRate} onSubmit={addTransaction} />
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900/20 border border-slate-800 rounded-3xl p-10 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <p className="text-cyan-400 text-[10px] uppercase font-bold tracking-[0.3em] mb-1">Transaction History</p>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">CENTRAL LEDGER</h1>
                  </div>
                  <button 
                    onClick={() => generateTransactionsPDF(transactions)}
                    className="flex items-center gap-3 bg-white text-slate-950 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    <Download size={18} />
                    Export Ledger
                  </button>
                </div>
                <TransactionList transactions={transactions} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full px-10 py-3 border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl z-30 flex justify-between items-center text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold hidden md:flex">
        <div className="flex gap-6 italic">
          <span>Block Height: 842,912</span>
          <span>Latency: 14ms</span>
        </div>
        <div className="flex gap-6">
          <span className="text-emerald-500">Core v2.4.1 Stable</span>
          <span className="text-slate-700">© 2026 Blockchain Network</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 border-none cursor-pointer rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
        active 
          ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] border border-cyan-500/20' 
          : 'text-slate-500 bg-transparent hover:bg-slate-800/30 hover:text-slate-300 border border-transparent'
      }`}
    >
      <div className={active ? 'text-cyan-400' : 'text-slate-600'}>{icon}</div>
      {label}
    </button>
  );
}

function MobileNavBtn({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
        active 
          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
          : 'bg-slate-900 text-slate-500 border border-slate-800 px-4'
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, subValue, icon }: { label: string, value: string, subValue?: string, icon: any }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm relative group hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
        {subValue && <p className="text-xs text-slate-600 mt-1 font-mono uppercase">{subValue}</p>}
      </div>
    </div>
  );
}
