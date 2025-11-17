// Sample Weekly Report Generator
// Run with: node generate-sample-report.js

const jsPDF = require('jspdf').jsPDF;
require('jspdf-autotable');

// Generate sample weekly report data
function generateSampleReport() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Sample daily data
  const eventsByDay = [
    {
      dayOfWeek: 'Monday',
      date: new Date(weekStart.getTime()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 45, pallets: 18, trailers: 12, security: 15 }
    },
    {
      dayOfWeek: 'Tuesday',
      date: new Date(weekStart.getTime() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 52, pallets: 22, trailers: 15, security: 15 }
    },
    {
      dayOfWeek: 'Wednesday',
      date: new Date(weekStart.getTime() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 48, pallets: 20, trailers: 13, security: 15 }
    },
    {
      dayOfWeek: 'Thursday',
      date: new Date(weekStart.getTime() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 50, pallets: 21, trailers: 14, security: 15 }
    },
    {
      dayOfWeek: 'Friday',
      date: new Date(weekStart.getTime() + 345600000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 55, pallets: 24, trailers: 16, security: 15 }
    },
    {
      dayOfWeek: 'Saturday',
      date: new Date(weekStart.getTime() + 432000000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 28, pallets: 10, trailers: 8, security: 10 }
    },
    {
      dayOfWeek: 'Sunday',
      date: new Date(weekStart.getTime() + 518400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      summary: { total: 12, pallets: 5, trailers: 3, security: 4 }
    }
  ];

  const weekTotal = {
    total: 290,
    pallets: 120,
    trailers: 81,
    security: 89
  };

  return { weekStart, weekEnd, eventsByDay, weekTotal };
}

// Export to PDF
function exportSampleReportToPDF(reportData) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('Best Way Vision', 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Weekly Activity Report', 14, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `${reportData.weekStart.toLocaleDateString()} - ${reportData.weekEnd.toLocaleDateString()}`,
    14,
    37
  );

  // Summary Table
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Weekly Summary', 14, 50);

  doc.autoTable({
    startY: 55,
    head: [['Metric', 'Count']],
    body: [
      ['Total Events', reportData.weekTotal.total.toString()],
      ['Pallet Scans', reportData.weekTotal.pallets.toString()],
      ['Trailer Activity', reportData.weekTotal.trailers.toString()],
      ['Security Alerts', reportData.weekTotal.security.toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 197, 94] },
  });

  // Daily Breakdown
  doc.text('Daily Breakdown', 14, doc.lastAutoTable.finalY + 15);

  const dailyData = reportData.eventsByDay.map(day => [
    day.dayOfWeek,
    day.date,
    day.summary.total.toString(),
    day.summary.pallets.toString(),
    day.summary.trailers.toString(),
    day.summary.security.toString(),
  ]);

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 20,
    head: [['Day', 'Date', 'Total', 'Pallets', 'Trailers', 'Security']],
    body: dailyData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  );
  doc.text(
    `Page ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  );

  // Save
  const filename = `weekly-report-template-${reportData.weekStart.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);

  console.log(`✓ Sample report generated: ${filename}`);
}

// Generate and export
const reportData = generateSampleReport();
exportSampleReportToPDF(reportData);
