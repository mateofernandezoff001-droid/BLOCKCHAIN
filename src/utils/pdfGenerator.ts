import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../types';

export const generateTransactionsPDF = (transactions: Transaction[], title: string = 'Blockchain Transactions Report') => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text('BLOCKCHAIN', 14, 22);
  doc.setFontSize(12);
  doc.text(title, 14, 32);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 40);

  const tableData = transactions.map((t) => [
    `${t.firstName} ${t.lastName}`,
    t.email,
    t.walletAddress.substring(0, 10) + '...',
    `${t.amountUSD.toFixed(2)} $`,
    `${t.amountEUR.toFixed(2)} €`,
    `${t.cryptoAmount.toFixed(6)} ${t.cryptoSymbol.toUpperCase()}`,
    new Date(t.timestamp).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Name', 'Email', 'Wallet', 'USD', 'EUR', 'Crypto', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [63, 81, 181] }, // Indigo-ish
    styles: { fontSize: 8 },
  });

  doc.save(`blockchain_report_${Date.now()}.pdf`);
};
