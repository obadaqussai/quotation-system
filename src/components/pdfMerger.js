import { PDFDocument } from 'pdf-lib';

export const mergeQuotationWithCatalogues = async (
  customer, items, quoteNumber, today, salesman, terms, selectedTerms,
  paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency
) => {
  try {
    // Create the main quotation PDF
    const quotationBlob = await generateQuotationPDF(
      customer, items, quoteNumber, today, salesman, terms, selectedTerms,
      paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency
    );
    
    // Get catalogue PDFs from items
    const cataloguePDFs = await getCataloguePDFs(items);
    
    if (cataloguePDFs.length === 0) {
      return URL.createObjectURL(quotationBlob);
    }
    
    // Merge quotation with catalogues
    const mergedPdf = await PDFDocument.create();
    
    // Add quotation pages
    const quotationPdf = await PDFDocument.load(await quotationBlob.arrayBuffer());
    const quotationPages = await mergedPdf.copyPages(quotationPdf, quotationPdf.getPageIndices());
    quotationPages.forEach(page => mergedPdf.addPage(page));
    
    // Add catalogue pages
    for (const catalogue of cataloguePDFs) {
      try {
        const cataloguePdf = await PDFDocument.load(catalogue);
        const cataloguePages = await mergedPdf.copyPages(cataloguePdf, cataloguePdf.getPageIndices());
        cataloguePages.forEach(page => mergedPdf.addPage(page));
      } catch (error) {
        console.warn('Failed to merge catalogue PDF:', error);
        // Add a placeholder page for failed catalogues
        const placeholderPage = mergedPdf.addPage();
        const { height } = placeholderPage.getSize();
        placeholderPage.drawText('Catalogue Not Available', {
          x: 50,
          y: height - 100,
          size: 12,
        });
      }
    }
    
    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    
    return URL.createObjectURL(mergedBlob);
    
  } catch (error) {
    console.error('PDF merging failed:', error);
    throw error;
  }
};

const generateQuotationPDF = async (...args) => {
  // This would normally generate the PDF using your existing QuotationPDF component
  // For now, we'll return a placeholder - you'll need to implement proper PDF generation
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  const { height } = page.getSize();
  page.drawText('SANY Quotation - PDF Generation Placeholder', {
    x: 50,
    y: height - 50,
    size: 12,
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

const getCataloguePDFs = async (items) => {
  const cataloguePDFs = [];
  
  for (const item of items) {
    if (item.product.catalogue) {
      try {
        const arrayBuffer = await readFileAsArrayBuffer(item.product.catalogue);
        cataloguePDFs.push(arrayBuffer);
      } catch (error) {
        console.warn('Failed to read catalogue file:', error);
      }
    }
  }
  
  return cataloguePDFs;
};

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};