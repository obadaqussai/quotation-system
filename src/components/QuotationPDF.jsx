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
    position: 'relative',
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
    width: 200,
    height: 100,
    marginRight: 15,
  },
  companyInfo: {
    textAlign: 'left',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#e30613",
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
  },
  contentWrapper: {
    marginTop: 0,
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
  productCol: {
    width: '15%',
  },
  descriptionCol: {
    width: '25%',
  },
  paymentCol: {
    width: '15%',
  },
  numberCol: {
    width: '9%',
  },
  totalRow: {
    backgroundColor: "#f2f2f2",
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 2,
    borderTopColor: '#e30613',
    borderTopStyle: 'solid',
    paddingVertical: 4,
  },
  totalCell: {
    fontWeight: 'bold',
    color: "#e30613",
    textAlign: 'center',
  },
  validity: {
    backgroundColor: '#fff8e6',
    padding: 5,
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
    bottom: 30,
    left: 30,
    right: 30,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e30613",
    fontSize: 8,
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
  installmentSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#0070c0",
  },
  installmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  productInstallmentNote: {
    fontSize: 7,
    fontStyle: 'italic',
    marginTop: 2,
    color: '#0070c0',
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

  const calculateInstallmentDetails = (item) => {
    const itemTotal = item.customPrice * item.quantity;
    const itemTotalWithVAT = itemTotal * 1.15;

    let downPaymentAmount = 0;
    
    if (downPaymentType === "percentage") {
      downPaymentAmount = itemTotalWithVAT * (downPaymentValue / 100);
    } else {
      downPaymentAmount = Math.min(downPaymentValue, itemTotalWithVAT);
    }

    const remainingAmount = itemTotalWithVAT - downPaymentAmount;
    
    // Calculate fees (6% per year)
    const feesPercentage = installmentYears * 6;
    const feesAmount = remainingAmount * (feesPercentage / 100);
    
    const totalWithFees = remainingAmount + feesAmount;
    
    // Calculate number of payments based on frequency
    const numberOfPayments = Math.ceil((installmentYears * 12) / paymentFrequency);
    const monthlyPayment = totalWithFees / numberOfPayments;

    return {
      itemTotal,
      itemTotalWithVAT,
      downPaymentAmount,
      remainingAmount,
      feesPercentage,
      feesAmount,
      totalWithFees,
      numberOfPayments,
      monthlyPayment
    };
  };

  // Calculate how many items fit on the first page
  const itemsPerPage = 7; // Increased to fit more items with smaller font
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;

  const renderHeader = () => (
    <View style={styles.header} fixed>
      <View style={styles.headerContainer}>
        <Image 
          src={sanyLogo}
          style={styles.logo} 
        />
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>SANY International Development Trading Co. LTD</Text>
          <Text>P.O. Box: 38653 Al Khobar 31942, Saudi Arabia</Text>
          <Text>Tel: 013 8820399 | www.Sanyglobal.com</Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>COMMERCIAL QUOTATION</Text>
    </View>
  );

  const renderFooter = (currentPage, total) => (
    <View style={styles.footer} fixed>
      <Text>Page {currentPage} of {total}</Text>
      <Text>SANY International Development Trading Co. LTD</Text>
      <Text>P.O. Box: 38653 Al Khobar 31942, Saudi Arabia | Tel: 013 8820399</Text>
    </View>
  );

  const renderCustomerInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Customer Information</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text><Text style={styles.label}>Name:</Text> {customer.name}</Text>
          <Text><Text style={styles.label}>Company:</Text> {customer.company}</Text>
          <Text><Text style={styles.label}>Address:</Text> {customer.address}</Text>
        </View>
        <View style={styles.column}>
          <Text><Text style={styles.label}>Phone:</Text> {customer.phone}</Text>
          <Text><Text style={styles.label}>Email:</Text> {customer.email}</Text>
          <Text><Text style={styles.label}>Tax ID / CR:</Text> {customer.taxId}</Text>
        </View>
      </View>
    </View>
  );

  const renderQuotationDetails = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quotation Details</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <Text><Text style={styles.label}>Quotation #:</Text> SANY-{quoteNumber}</Text>
          <Text><Text style={styles.label}>Date:</Text> {today}</Text>
          <Text><Text style={styles.label}>Validity:</Text> {formattedValidityDate}</Text>
        </View>
        <View style={styles.column}>
          <Text><Text style={styles.label}>Salesman:</Text> {salesman.name}</Text>
          <Text><Text style={styles.label}>Mobile:</Text> {salesman.mobile}</Text>
          <Text><Text style={styles.label}>Email:</Text> {salesman.email}</Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentPlanDetails = () => {
    if (items.some(item => item.paymentPlan === "installment")) {
      return (
        <View style={styles.installmentSection}>
          <Text style={[styles.sectionTitle, {color: "#0070c0"}]}>Installment Plan Details</Text>
          
          <View style={styles.installmentRow}>
            <Text><Text style={styles.label}>Down Payment:</Text></Text>
            <Text>{downPaymentType === "percentage" ? `${downPaymentValue}%` : `SAR ${downPaymentValue.toLocaleString('en-US')}`}</Text>
          </View>
          
          <View style={styles.installmentRow}>
            <Text><Text style={styles.label}>Installment Period:</Text></Text>
            <Text>{installmentYears} years ({installmentYears * 12} months)</Text>
          </View>
          
          <View style={styles.installmentRow}>
            <Text><Text style={styles.label}>Payment Frequency:</Text></Text>
            <Text>Every {paymentFrequency} month(s)</Text>
          </View>
          
          <View style={styles.installmentRow}>
            <Text><Text style={styles.label}>Annual Fee Rate:</Text></Text>
            <Text>6% per year (Total: {installmentYears * 6}%)</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderProductsTable = (startIndex, endIndex, pageNumber, totalPages) => (
    <View>
      <Text style={styles.sectionTitle}>Products & Services {totalPages > 1 ? `(Page ${pageNumber} of ${totalPages})` : ''}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableColHeader, styles.productCol]}>Product</Text>
          <Text style={[styles.tableColHeader, styles.descriptionCol]}>Description</Text>
          <Text style={[styles.tableColHeader, styles.paymentCol]}>Payment Plan</Text>
          <Text style={[styles.tableColHeader, styles.numberCol]}>Unit Price</Text>
          <Text style={[styles.tableColHeader, styles.numberCol]}>Qty</Text>
          <Text style={[styles.tableColHeader, styles.numberCol]}>Price</Text>
          <Text style={[styles.tableColHeader, styles.numberCol]}>VAT (15%)</Text>
          <Text style={[styles.tableColHeader, styles.numberCol]}>Total</Text>
        </View>
        
        {items.slice(startIndex, endIndex).map((item, index) => {
          const itemTotal = item.customPrice * item.quantity;
          const vat = itemTotal * 0.15;
          const finalItemTotal = itemTotal + vat;
          const installmentDetails = item.paymentPlan === "installment" ? calculateInstallmentDetails(item) : null;

          return (
            <View style={[styles.tableRow, (startIndex + index) % 2 === 0 ? styles.tableRowAlt : null]} key={startIndex + index}>
              <Text style={[styles.tableCol, styles.productCol]}>{item.product.name}</Text>
              <Text style={[styles.tableCol, styles.descriptionCol]}>{item.product.description}</Text>
              <Text style={[styles.tableCol, styles.paymentCol]}>
                {item.paymentPlan === "installment" ? "Installment" : "Cash"}
                {item.paymentPlan === "installment" && installmentDetails && (
                  <Text style={styles.productInstallmentNote}>
                    {"\n"}Down: {installmentDetails.downPaymentAmount.toLocaleString('en-US')}
                    {"\n"}Monthly: {installmentDetails.monthlyPayment.toLocaleString('en-US')}
                  </Text>
                )}
              </Text>
              <Text style={[styles.tableCol, styles.numberCol]}>{item.customPrice.toLocaleString('en-US')}</Text>
              <Text style={[styles.tableCol, styles.numberCol]}>{item.quantity}</Text>
              <Text style={[styles.tableCol, styles.numberCol]}>{itemTotal.toLocaleString('en-US')}</Text>
              <Text style={[styles.tableCol, styles.numberCol]}>{vat.toLocaleString('en-US')}</Text>
              <Text style={[styles.tableCol, styles.numberCol]}>{finalItemTotal.toLocaleString('en-US')}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderTotalRow = () => (
    <View style={[styles.tableRow, styles.totalRow]}>
      <Text style={[styles.tableCol, styles.productCol, { textAlign: 'right', fontWeight: 'bold' }]} colSpan={5}>TOTAL (SAR):</Text>
      <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{subtotal.toLocaleString('en-US')}</Text>
      <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{vatTotal.toLocaleString('en-US')}</Text>
      <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{finalTotal.toLocaleString('en-US')}</Text>
    </View>
  );

  const renderValidity = () => (
    <View style={styles.validity}>
      <Text>This quotation is valid until {formattedValidityDate}</Text>
    </View>
  );

  const renderTerms = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Terms and Conditions</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          {selectedTerms
            .filter(index => index < terms.length)
            .slice(0, Math.ceil(selectedTerms.length / 2))
            .map(index => (
              <Text style={styles.termItem} key={index}>
                {terms[index].replace('{formattedValidityDate}', formattedValidityDate)}
              </Text>
            ))}
        </View>
        <View style={styles.column}>
          {selectedTerms
            .filter(index => index < terms.length)
            .slice(Math.ceil(selectedTerms.length / 2))
            .map(index => (
              <Text style={styles.termItem} key={index}>
                {terms[index].replace('{formattedValidityDate}', formattedValidityDate)}
              </Text>
            ))}
        </View>
      </View>
    </View>
  );

  const renderSignatureArea = () => (
    <View style={styles.signatureArea}>
      <View style={styles.signatureBox}>
        <Text>Customer Signature</Text>
        <Text>Name: ________________________</Text>
        <Text>Date: ________________________</Text>
      </View>
      <View style={styles.signatureBox}>
        <Text>Authorized Signature</Text>
        <Text>Name: {salesman.name}</Text>
        <Text>Date: {today}</Text>
      </View>
    </View>
  );

  // Generate pages
  const pages = [];
  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);
    const isLastPage = i === totalPages - 1;
    
    pages.push(
      <Page size="A4" style={styles.page} key={i}>
        {renderHeader()}
        
        <View style={styles.contentWrapper}>
          {i === 0 && renderQuotationDetails()}
          {i === 0 && renderCustomerInfo()}
          {i === 0 && renderPaymentPlanDetails()}
          
          {renderProductsTable(startIndex, endIndex, i + 1, totalPages)}
          
          {isLastPage && renderTotalRow()}
          {isLastPage && renderValidity()}
          {isLastPage && renderTerms()}
          {isLastPage && renderSignatureArea()}
        </View>

        {renderFooter(i + 1, totalPages)}
      </Page>
    );
  }

  return <Document>{pages}</Document>;
};

export default QuotationPDF;