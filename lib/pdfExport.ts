import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MonthlyReport, Transaction } from './types';

export const exportMonthlyReportToPDF = (report: MonthlyReport, transactions: Transaction[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text(`Monthly Report - ${report.month} ${report.year}`, 14, 20);
  
  // Summary Section
  doc.setFontSize(14);
  doc.text('Financial Summary', 14, 35);
  
  const summaryData = [
    ['Income', `₹${report.income.toLocaleString('en-IN')}`],
    ['Expenses', `₹${report.expenses.toLocaleString('en-IN')}`],
    ['Savings', `₹${report.savings.toLocaleString('en-IN')}`],
    ['Investments', `₹${report.investments.toLocaleString('en-IN')}`],
    ['Net Change', `₹${report.netChange.toLocaleString('en-IN')}`],
  ];
  
  autoTable(doc, {
    startY: 40,
    head: [['Category', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  // Transactions Section
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(14);
  doc.text('Transactions', 14, finalY + 15);
  
  const transactionData = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-IN'),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category.replace('_', ' '),
    `₹${t.amount.toLocaleString('en-IN')}`,
    t.notes || '-',
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Date', 'Type', 'Category', 'Amount', 'Notes']],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 8 },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save
  doc.save(`monthly-report-${report.month}-${report.year}.pdf`);
};

export const exportYearlyReportToPDF = (year: number, monthlyReports: MonthlyReport[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text(`Yearly Report - ${year}`, 14, 20);
  
  // Calculate totals
  const totalIncome = monthlyReports.reduce((sum, r) => sum + r.income, 0);
  const totalExpenses = monthlyReports.reduce((sum, r) => sum + r.expenses, 0);
  const totalSavings = monthlyReports.reduce((sum, r) => sum + r.savings, 0);
  const totalInvestments = monthlyReports.reduce((sum, r) => sum + r.investments, 0);
  
  // Summary Section
  doc.setFontSize(14);
  doc.text('Annual Summary', 14, 35);
  
  const summaryData = [
    ['Total Income', `₹${totalIncome.toLocaleString('en-IN')}`],
    ['Total Expenses', `₹${totalExpenses.toLocaleString('en-IN')}`],
    ['Total Savings', `₹${totalSavings.toLocaleString('en-IN')}`],
    ['Total Investments', `₹${totalInvestments.toLocaleString('en-IN')}`],
  ];
  
  autoTable(doc, {
    startY: 40,
    head: [['Category', 'Amount']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
  });
  
  // Monthly Breakdown
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(14);
  doc.text('Monthly Breakdown', 14, finalY + 15);
  
  const monthlyData = monthlyReports.map(r => [
    r.month,
    `₹${r.income.toLocaleString('en-IN')}`,
    `₹${r.expenses.toLocaleString('en-IN')}`,
    `₹${r.savings.toLocaleString('en-IN')}`,
    `₹${r.investments.toLocaleString('en-IN')}`,
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Month', 'Income', 'Expenses', 'Savings', 'Investments']],
    body: monthlyData,
    theme: 'striped',
    headStyles: { fillColor: [14, 165, 233] },
    styles: { fontSize: 9 },
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save
  doc.save(`yearly-report-${year}.pdf`);
};

// Made with Bob
