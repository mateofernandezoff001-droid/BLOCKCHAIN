import { Transaction } from '../types';
import { Mail, Wallet, ExternalLink, Calendar, Hash, Download, FileText, Edit3 } from 'lucide-react';
import { generateStatementPDF } from '../utils/pdfGenerator';

interface Props {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onEdit }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-6 shadow-2xl">
          <Hash className="w-12 h-12 text-slate-700" />
        </div>
        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">No se detectaron registros</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-3 text-xs font-bold leading-relaxed uppercase tracking-widest">
          El libro mayor distribuido está vacío actualmente. Inicie una transacción para comenzar la sincronización.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Entidad Autorizada</th>
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Valoración Total</th>
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Volumen de Activos</th>
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clave Pública</th>
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Movimientos</th>
            <th className="py-5 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {transactions.map((t) => (
            <tr key={t.id} className="group hover:bg-slate-800/30 transition-all">
              <td className="py-5 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-black text-xs shadow-inner">
                    {t.firstName[0]}{t.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.firstName} {t.lastName}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-0.5 font-mono">
                      <Mail size={10} className="text-cyan-500/50" />
                      <span>{t.email}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="space-y-1">
                  <p className="text-sm font-black text-white font-mono tracking-tighter">${t.amountUSD.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">€{t.amountEUR.toLocaleString()}</p>
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="inline-flex items-center gap-3 bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                  <span className="text-xs font-black text-cyan-400 font-mono tracking-tighter">
                    {t.cryptoAmount.toFixed(6)}
                  </span>
                  <span className="text-[9px] font-black text-cyan-400/50 uppercase tracking-widest">
                    {t.cryptoSymbol}
                  </span>
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="flex items-center gap-2 group/wallet cursor-pointer">
                  <Wallet size={12} className="text-slate-600 group-hover/wallet:text-cyan-400 transition-colors" />
                  <span className="text-[10px] font-mono text-slate-500 group-hover/wallet:text-slate-300 transition-colors truncate w-24">
                    {t.walletAddress}
                  </span>
                  <ExternalLink size={10} className="text-slate-700 opacity-0 group-hover/wallet:opacity-100 transition-all" />
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-500 font-mono">
                    <Calendar size={12} className="text-slate-700" />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      {t.movements?.length || 1} Fechas
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-600 uppercase font-bold">
                    Último: {new Date(t.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </td>
              <td className="py-5 px-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => generateStatementPDF(t)}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-lg transition-all active:scale-95 group/btn"
                    title="Descargar Extracto"
                  >
                    <FileText size={14} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Extracto</span>
                    <Download size={12} className="opacity-50" />
                  </button>
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(t)}
                      className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-500 hover:text-amber-400 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

