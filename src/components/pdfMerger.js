// pdfMerger.js - Simplified version
import { PDFDocument } from 'pdf-lib';

export const mergeQuotationWithCatalogues = async (quotationBlob, items) => {
  try {
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

const getCataloguePDFs = async (items) => {
  const cataloguePDFs = [];
  
  for (const item of items) {
    if (item.product.catalogue) {
      try {
        let arrayBuffer;
        if (item.product.catalogue instanceof File) {
          arrayBuffer = await readFileAsArrayBuffer(item.product.catalogue);
        } else {
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