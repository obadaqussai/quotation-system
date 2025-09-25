import { PDFDocument } from 'pdf-lib';
import { renderToStream } from '@react-pdf/renderer';
import QuotationPDF from './QuotationPDF';

export const mergeQuotationWithCatalogues = async (
  customer, items, quoteNumber, today, salesman, terms, selectedTerms,
  paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency
) => {
  try {
    // Generate the actual quotation PDF using QuotationPDF component
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

const generateQuotationPDF = async (
  customer, items, quoteNumber, today, salesman, terms, selectedTerms,
  paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency
) => {
  try {
    // Use react-pdf's renderToStream to generate the actual PDF
    const pdfStream = await renderToStream(
      <QuotationPDF 
        customer={customer}
        items={items}
        quoteNumber={quoteNumber}
        today={today}
        salesman={salesman}
        terms={terms}
        selectedTerms={selectedTerms}
        paymentMethod={paymentMethod}
        downPaymentType={downPaymentType}
        downPaymentValue={downPaymentValue}
        installmentYears={installmentYears}
        paymentFrequency={paymentFrequency}
      />
    );

    // Convert stream to blob
    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    
    const pdfBuffer = Buffer.concat(chunks);
    return new Blob([pdfBuffer], { type: 'application/pdf' });
    
  } catch (error) {
    console.error('Error generating quotation PDF:', error);
    // Fallback to placeholder if react-pdf fails
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    
    const { height } = page.getSize();
    page.drawText('SANY Quotation - Error Generating PDF', {
      x: 50,
      y: height - 50,
      size: 12,
    });
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  }
};

const getCataloguePDFs = async (items) => {
  const cataloguePDFs = [];
  
  for (const item of items) {
    if (item.product.catalogue) {
      try {
        // Handle both File objects and imported PDFs
        let arrayBuffer;
        if (item.product.catalogue instanceof File) {
          arrayBuffer = await readFileAsArrayBuffer(item.product.catalogue);
        } else {
          // For imported PDFs (like from assets), fetch them
          const response = await fetch(item.product.catalogue);
          arrayBuffer = await response.arrayBuffer();
        }
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