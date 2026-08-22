import React, { useState } from 'react';
import { Download, Printer, FileText, Check, Loader2, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function ExportPdfButton({ trip, printTargetId = 'printable-trip-document' }) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!trip) return null;

  const handleExportPdf = async () => {
    setIsExporting(true);
    setIsSuccess(false);

    try {
      // Find printable document element
      const element = document.getElementById(printTargetId);
      if (!element) {
        // Fallback to window.print if element not found
        window.print();
        setIsExporting(false);
        return;
      }

      // Render element to high-res canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0f172a'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeTitle = (trip.title || 'GlobeTrotter_Voyage')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 40);

      pdf.save(`${safeTitle}_Itinerary.pdf`);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export failed, opening browser print dialog as fallback:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        disabled={isExporting}
        onClick={handleExportPdf}
        className={`btn btn-sm ${isSuccess ? 'btn-secondary' : 'btn-primary'}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: isSuccess
            ? 'rgba(16, 185, 129, 0.2)'
            : 'linear-gradient(135deg, #38bdf8, #6366f1)',
          borderColor: isSuccess ? '#10b981' : '#38bdf8',
          color: isSuccess ? '#6ee7b7' : '#ffffff',
          boxShadow: '0 2px 10px rgba(56, 189, 248, 0.25)'
        }}
        title="Download complete formatted itinerary as PDF"
      >
        {isExporting ? (
          <>
            <Loader2 size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Generating PDF...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check size={14} color="#10b981" />
            <span>PDF Downloaded!</span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>Export PDF Itinerary</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="btn btn-secondary btn-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 10px',
          fontSize: '0.78rem'
        }}
        title="Open browser print dialog (Ctrl + P)"
      >
        <Printer size={13} />
        <span>Print</span>
      </button>
    </div>
  );
}
