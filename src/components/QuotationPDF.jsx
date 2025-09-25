import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import sanyLogo from '../assets/sany-logo.png';

Font.register({
  family: 'Helvetica-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

Font.register({
  family: 'Helvetica',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
    lineHeight: 1.4,
    display: 'flex',
    flexDirection: 'column',
  },
  coverPage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  coverLogo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#e30613",
    marginBottom: 5,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 14,
    marginBottom: 30,
    color: '#666',
    textAlign: 'center',
  },
  coverInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 20,
    width: '100%',
  },
  originalCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#e30613",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#e30613",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e30613',
    paddingBottom: 5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 9,
  },
  cardValue: {
    color: '#666',
    fontSize: 9,
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  totalCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#e30613",
    width: '100%',
    marginTop: 10,
  },
  totalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#e30613",
    textAlign: 'center',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#e30613",
    textAlign: 'center',
    marginBottom: 5,
  },
  totalWords: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: { 
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e30613",
    paddingBottom: 15,
    textAlign: "center",
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: { 
    width: 150,
    height: 75,
    marginRight: 15,
  },
  companyInfo: {
    textAlign: 'left',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#e30613",
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
  },
  contentWrapper: {
    flex: 1,
    marginBottom: 60,
  },
  section: { 
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#e30613",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#e30613",
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  column: {
    width: '48%',
  },
  label: { 
    fontWeight: "bold",
    color: "#000",
    fontFamily: 'Helvetica-Bold',
  },
  table: { 
    width: "100%",
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 3,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e30613",
    color: "#fff",
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textAlign: "center",
  },
  tableRow: { 
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: 'center',
    fontSize: 8,
    minHeight: 30,
  },
  tableRowAlt: { 
    backgroundColor: "#f9f9f9",
  },
  tableColHeader: {
    padding: 6,
    fontWeight: 'bold',
    textAlign: "center",
  },
  tableCol: {
    padding: 6,
    textAlign: "center",
  },
  imageCol: {
    width: '8%',
  },
  productCol: {
    width: '12%',
  },
  descriptionCol: {
    width: '20%',
  },
  paymentCol: {
    width: '12%',
  },
  numberCol: {
    width: '8%',
  },
  totalRow: {
    backgroundColor: "#f2f2f2",
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 2,
    borderTopColor: '#e30613',
    paddingVertical: 8,
  },
  totalCell: {
    fontWeight: 'bold',
    color: "#e30613",
    textAlign: 'center',
  },
  validity: {
    backgroundColor: '#fff8e6',
    padding: 8,
    borderRadius: 3,
    textAlign: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffe8a1',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  termsContainer: {
    marginBottom: 15,
  },
  termsColumn: {
    width: '48%',
  },
  termItem: {
    marginBottom: 5,
    fontSize: 8,
  },
  footer: { 
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e30613",
    fontSize: 7,
    textAlign: 'center',
  },
  signatureArea: {
    marginTop: 20,
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    textAlign: 'center',
  },
  productImage: {
    width: 25,
    height: 20,
    objectFit: 'cover',
    borderRadius: 2,
  },
  noImagePlaceholder: {
    width: 25,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 6,
    color: '#666',
  },
});

const QuotationPDF = ({ customer, items, quoteNumber, today, salesman, terms, selectedTerms, paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency }) => {
  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + 7);
  const formattedValidityDate = validityDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let subtotal = 0;
  let vatTotal = 0;
  let finalTotal = 0;

  items.forEach(item => {
    const itemTotal = item.customPrice * item.quantity;
    const vat = itemTotal * 0.15;
    subtotal += itemTotal;
    vatTotal += vat;
    finalTotal += itemTotal + vat;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage) + 1;

  const renderCoverPage = () => (
    <Page size="A4" style={styles.coverPage}>
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <Image src={sanyLogo} style={styles.coverLogo} />
        <Text style={styles.coverTitle}>COMMERCIAL QUOTATION</Text>
        <Text style={styles.coverSubtitle}>SANY International Development Trading Co. LTD</Text>
      </View>

      <View style={styles.coverInfoContainer}>
        <View style={styles.originalCard}>
          <Text style={styles.cardTitle}>CUSTOMER INFORMATION</Text>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Name:</Text><Text style={styles.cardValue}>{customer.name || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Company:</Text><Text style={styles.cardValue}>{customer.company || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Address:</Text><Text style={styles.cardValue}>{customer.address || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Phone:</Text><Text style={styles.cardValue}>{customer.phone || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Email:</Text><Text style={styles.cardValue}>{customer.email || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Tax ID:</Text><Text style={styles.cardValue}>{customer.taxId || 'N/A'}</Text></View>
        </View>

        <View style={styles.originalCard}>
          <Text style={styles.cardTitle}>QUOTATION DETAILS</Text>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Quote #:</Text><Text style={styles.cardValue}>SANY-{quoteNumber}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Date:</Text><Text style={styles.cardValue}>{today}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Valid Until:</Text><Text style={styles.cardValue}>{formattedValidityDate}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Salesman:</Text><Text style={styles.cardValue}>{salesman.name || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Mobile:</Text><Text style={styles.cardValue}>{salesman.mobile || 'N/A'}</Text></View>
          <View style={styles.cardRow}><Text style={styles.cardLabel}>Email:</Text><Text style={styles.cardValue}>{salesman.email || 'N/A'}</Text></View>
        </View>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalTitle}>TOTAL QUOTATION AMOUNT</Text>
        <Text style={styles.totalAmount}>SAR {finalTotal.toLocaleString('en-US')}</Text>
        <Text style={styles.totalWords}>{numberToWords(finalTotal)} Saudi Riyals Only</Text>
      </View>

      <Text style={styles.footer}>Page 1 of {totalPages}</Text>
    </Page>
  );

  const renderContentPages = () => {
    const pages = [];
    
    for (let i = 0; i < Math.ceil(items.length / itemsPerPage); i++) {
      const startIndex = i * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, items.length);
      const pageNumber = i + 2;

      pages.push(
        <Page key={`page-${i}`} size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerContainer}>
              <Image src={sanyLogo} style={styles.logo} />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>SANY International Development Trading Co. LTD</Text>
                <Text>P.O. Box: 38653 Al Khobar 31942, Saudi Arabia</Text>
                <Text>Tel: 013 8820399 | www.Sanyglobal.com</Text>
              </View>
            </View>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>COMMERCIAL QUOTATION</Text>
            <Text style={{ fontSize: 10, marginTop: 3 }}>Quotation #: SANY-{quoteNumber} | Date: {today}</Text>
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.validity}><Text>This quotation is valid until {formattedValidityDate}</Text></View>

            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableColHeader, styles.imageCol]}>Image</Text>
                <Text style={[styles.tableColHeader, styles.productCol]}>Product</Text>
                <Text style={[styles.tableColHeader, styles.descriptionCol]}>Description</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Qty</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Unit Price</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Total</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>VAT 15%</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Total with VAT</Text>
                <Text style={[styles.tableColHeader, styles.paymentCol]}>Payment Plan</Text>
              </View>

              {items.slice(startIndex, endIndex).map((item, index) => {
                const itemTotal = item.customPrice * item.quantity;
                const vat = itemTotal * 0.15;
                const totalWithVAT = itemTotal + vat;

                return (
                  <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : {}]}>
                    <View style={[styles.tableCol, styles.imageCol]}>
                      {item.product.image ? (
                        <Image 
                          src={item.product.image instanceof File ? 
                            URL.createObjectURL(item.product.image) : 
                            item.product.image
                          } 
                          style={styles.productImage} 
                        />
                      ) : (
                        <View style={styles.noImagePlaceholder}><Text>No Image</Text></View>
                      )}
                    </View>
                    <Text style={[styles.tableCol, styles.productCol]}>{item.product.name}</Text>
                    <Text style={[styles.tableCol, styles.descriptionCol]}>{item.customDescription}</Text>
                    <Text style={[styles.tableCol, styles.numberCol]}>{item.quantity}</Text>
                    <Text style={[styles.tableCol, styles.numberCol]}>{item.customPrice.toLocaleString('en-US')}</Text>
                    <Text style={[styles.tableCol, styles.numberCol]}>{itemTotal.toLocaleString('en-US')}</Text>
                    <Text style={[styles.tableCol, styles.numberCol]}>{vat.toLocaleString('en-US')}</Text>
                    <Text style={[styles.tableCol, styles.numberCol]}>{totalWithVAT.toLocaleString('en-US')}</Text>
                    <Text style={[styles.tableCol, styles.paymentCol]}>{item.paymentPlan === "cash" ? "Cash" : "Installment"}</Text>
                  </View>
                );
              })}

              {i === Math.ceil(items.length / itemsPerPage) - 1 && (
                <View style={[styles.tableRow, styles.totalRow]}>
                  <Text style={[styles.tableCol, styles.imageCol]}></Text>
                  <Text style={[styles.tableCol, styles.productCol, styles.totalCell]}>TOTAL</Text>
                  <Text style={[styles.tableCol, styles.descriptionCol]}></Text>
                  <Text style={[styles.tableCol, styles.numberCol]}></Text>
                  <Text style={[styles.tableCol, styles.numberCol]}></Text>
                  <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{subtotal.toLocaleString('en-US')}</Text>
                  <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{vatTotal.toLocaleString('en-US')}</Text>
                  <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{finalTotal.toLocaleString('en-US')}</Text>
                  <Text style={[styles.tableCol, styles.paymentCol]}></Text>
                </View>
              )}
            </View>

            {i === Math.ceil(items.length / itemsPerPage) - 1 && (
              <>
                <View style={styles.termsContainer}>
                  <Text style={styles.sectionTitle}>Terms and Conditions</Text>
                  <View style={styles.twoColumn}>
                    <View style={styles.termsColumn}>
                      {selectedTerms.slice(0, Math.ceil(selectedTerms.length / 2)).map((index) => (
                        <Text key={index} style={styles.termItem}>
                          {terms[index]?.replace('{formattedValidityDate}', formattedValidityDate) || ''}
                        </Text>
                      ))}
                    </View>
                    <View style={styles.termsColumn}>
                      {selectedTerms.slice(Math.ceil(selectedTerms.length / 2)).map((index) => (
                        <Text key={index} style={styles.termItem}>
                          {terms[index]?.replace('{formattedValidityDate}', formattedValidityDate) || ''}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.signatureArea}>
                  <View style={styles.signatureBox}><Text>Customer Signature</Text><Text>Name: ___________________</Text><Text>Date: ___________________</Text></View>
                  <View style={styles.signatureBox}><Text>SANY Representative</Text><Text>Name: {salesman.name}</Text><Text>Date: ___________________</Text></View>
                </View>
              </>
            )}
          </View>

          <Text style={styles.footer}>Page {pageNumber} of {totalPages}</Text>
        </Page>
      );
    }

    return pages;
  };

  return (
    <Document>
      {renderCoverPage()}
      {renderContentPages()}
    </Document>
  );
};

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  let words = '';
  
  if (num >= 1000000) {
    words += numberToWords(Math.floor(num / 1000000)) + ' Million ';
    num %= 1000000;
  }
  if (num >= 1000) {
    words += numberToWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    num = 0;
  }
  if (num > 0) words += ones[num] + ' ';
  return words.trim();
}

export default QuotationPDF;