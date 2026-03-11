import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const usePdfExport = () => {
  const exportTableToPdf = (title: string, columns: string[], rows: any[][], filename: string) => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.setTextColor(40, 40, 40)
    doc.text(title, 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 36,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }, // Violet-500
      alternateRowStyles: { fillColor: [245, 243, 255] }, // Violet-50
    })

    doc.save(filename)
  }

  return {
    exportTableToPdf
  }
}
