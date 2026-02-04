import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlertReport, Language } from '../types';
import { translations } from '../constants';

export const generateSeizureReport = (reports: AlertReport[], language: Language) => {
    const t = translations[language];
    const doc = new jsPDF();

    // Header - Logo & Title
    // Ideally load image here, but for now simple title enhancement
    doc.setFontSize(22);
    doc.text(t.title || 'Seizure Alert', 14, 20);

    doc.setFontSize(14);
    doc.text('Seizure Report', 14, 30);

    doc.setFontSize(10);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, 14, 38);

    // Table Data
    const tableBody = reports.map(report => [
        new Date(report.date).toLocaleDateString(),
        new Date(report.date).toLocaleTimeString(),
        report.duration ? `${Math.floor(report.duration / 60)}m ${report.duration % 60}s` : 'N/A',
        report.notes || 'No notes'
    ]);

    // Generate Table
    autoTable(doc, {
        startY: 45,
        head: [['Date', 'Time', 'Duration', 'Notes']],
        body: tableBody,
        foot: [['', '', '', '']], // Placeholder
        margin: { bottom: 40 }, // More room for extended footer
        didDrawPage: (data) => {
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);

            // Disclaimer
            const disclaimer = "DISCLAIMER: This application and report are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. Coqui Cloud Dev Co and its developers are not liable for any actions taken based on this information. Always consult a healthcare professional.";
            const splitDisclaimer = doc.splitTextToSize(disclaimer, doc.internal.pageSize.width - 30);
            doc.text(splitDisclaimer, 14, pageHeight - 25);

            // Developer & Company Branding
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0); // Black for brands
            doc.text('Developed by RamonRios.NET', 14, pageHeight - 12);

            doc.setTextColor(100, 100, 100);
            doc.text(' | Coqui Cloud Dev Co', 14 + doc.getTextWidth('Developed by RamonRios.NET'), pageHeight - 12);

            // Page Number
            doc.setFontSize(8);
            const pageCount = 'Page ' + doc.getNumberOfPages();
            const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
            doc.text(pageCount, pageWidth - 14 - doc.getTextWidth(pageCount), pageHeight - 12);
        }
    });

    // Save/Download
    const fileName = `Seizure_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
