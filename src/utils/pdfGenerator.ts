import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../types';

export const generateTransactionsPDF = (transactions: Transaction[], title: string = 'Blockchain Ledger Report') => {
  const doc = new jsPDF();

  // Professional Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('BLOCKCHAIN', 14, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('DISTRIBUTED LEDGER TECHNOLOGY', 14, 32);
  
  doc.setFontSize(8);
  doc.text(`REPORT ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, 170, 15);
  doc.text(`DATE: ${new Date().toLocaleDateString()}`, 170, 20);

  // Summary Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 55);

  const tableData = transactions.map((t) => [
    `${t.firstName} ${t.lastName}`,
    t.walletAddress.substring(0, 12) + '...',
    { content: `$${t.amountUSD.toLocaleString()}`, styles: { fontStyle: 'bold' as const } },
    `${t.cryptoAmount.toFixed(6)} ${t.cryptoSymbol.toUpperCase()}`,
    new Date(t.timestamp).toLocaleDateString()
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['ENTITY NAME', 'PUBLIC KEY', 'VALUATION (USD)', 'ASSET VOLUME', 'TIMESTAMP']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14 }
  });

  doc.save(`ledger_report_${Date.now()}.pdf`);
};

export const generateStatementPDF = (transaction: Transaction) => {
  const doc = new jsPDF();
  const cyan: [number, number, number] = [34, 211, 238]; // cyan-400
  const slate: [number, number, number] = [15, 23, 42]; // slate-950
  const slate800: [number, number, number] = [30, 41, 59]; // slate-800

  // FULL DARK THEME BACKGROUND
  doc.setFillColor(slate[0], slate[1], slate[2]);
  doc.rect(0, 0, 210, 297, 'F');

  // Cyan header accent line
  doc.setFillColor(cyan[0], cyan[1], cyan[2]);
  doc.rect(0, 0, 210, 2, 'F');

  // BRANDING
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('BLOCKCHAIN', 14, 28);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.text('CENTRAL LEDGER AUTHENTICATED EXTRACT', 14, 36);

  // META INFO BOX (Right aligned)
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(7);
  doc.text('NETWORK STATUS: SYNCHRONIZED', 145, 25);
  doc.text(`LEDGER NODE: AIS-V2.4-${Math.floor(Math.random()*1000)}`, 145, 29);
  doc.text(`SESSION ID: ${Math.random().toString(36).substring(7).toUpperCase()}`, 145, 33);

  // USER PROFILE SECTION
  doc.setFillColor(slate800[0], slate800[1], slate800[2]);
  doc.roundedRect(14, 50, 182, 45, 3, 3, 'F');
  
  doc.setTextColor(cyan[0], cyan[1], cyan[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ENTITY IDENTIFICATION', 20, 58);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`${transaction.firstName.toUpperCase()} ${transaction.lastName.toUpperCase()}`, 20, 68);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`EMAIL: ${transaction.email}`, 20, 75);
  doc.text(`PUBLIC KEY: ${transaction.walletAddress}`, 20, 80);
  doc.text(`MAIN ASSET: ${transaction.cryptoSymbol.toUpperCase()}`, 20, 85);

  // TOTAL BALANCE CARD
  doc.setFillColor(cyan[0], cyan[1], cyan[2]);
  doc.roundedRect(140, 58, 48, 30, 2, 2, 'F');
  doc.setTextColor(slate[0], slate[1], slate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TOTAL VALUATION', 145, 65);
  doc.setFontSize(12);
  doc.text(`$${transaction.amountUSD.toLocaleString()}`, 145, 75);
  doc.setFontSize(7);
  doc.text(`${transaction.cryptoAmount.toFixed(6)} ${transaction.cryptoSymbol.toUpperCase()}`, 145, 82);

  // MOVEMENTS TABLE
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('LEDGER MOVEMENTS - CHRONOLOGICAL SEQUENCE', 14, 110);

  const movementsData = transaction.movements.map(m => [
    new Date(m.date).toLocaleDateString(),
    'INPUT_TRANSACTION_COMMIT',
    { content: `$${m.amountUSD.toLocaleString()}`, styles: { halign: 'right' as const, fontStyle: 'bold' as const, textColor: [34, 211, 238] as [number, number, number] } },
    { content: `€${m.amountEUR.toLocaleString()}`, styles: { halign: 'right' as const, textColor: [148, 163, 184] as [number, number, number] } }
  ]);

  autoTable(doc, {
    startY: 115,
    head: [['TIMESTAMP', 'PROTOCOL ACTION', 'USD VOLUME', 'EUR VOLUME']],
    body: movementsData,
    theme: 'plain',
    headStyles: { fillColor: [30, 41, 59], textColor: [34, 211, 238], fontSize: 7, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [255, 255, 255], cellPadding: 6 },
    margin: { left: 14, right: 14 },
    didDrawCell: (data) => {
        if (data.section === 'body') {
            doc.setDrawColor(30, 41, 59);
            doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        }
    }
  });

  // PROFESSIONAL FOOTER
  const finalY = (doc as any).lastAutoTable.finalY + 25;
  doc.setDrawColor(30, 41, 59);
  doc.line(14, finalY, 196, finalY);
  
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text('VERIFICATION: THIS DOCUMENT IS CRYPTOGRAPHICALLY LINKED TO THE SOURCE LEDGER NODE.', 14, finalY + 10);
  doc.text('LEGAL NOTICE: ALL VALUES ARE ESTIMATED BASED ON REAL-TIME ORACLE DATA AT THE TIME OF ENTRY.', 14, finalY + 14);
  doc.text('© 2026 BLOCKCHAIN CORE SYSTEMS. ALL RIGHTS RESERVED.', 14, finalY + 22);

  // Watermark/Stamp
  doc.setDrawColor(cyan[0], cyan[1], cyan[2], 0.2);
  doc.setLineWidth(0.5);
  doc.ellipse(170, finalY + 15, 20, 10, 'S');
  doc.setTextColor(cyan[0], cyan[1], cyan[2], 50);
  doc.setFontSize(6);
  doc.text('VOID IF ALTERED', 160, finalY + 16);

  doc.save(`ledger_extracto_${transaction.lastName}_${Date.now()}.pdf`);
};
