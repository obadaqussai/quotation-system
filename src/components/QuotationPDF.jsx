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
    fontSize: 9,
    textAlign: "center",
  },
  tableRow: { 
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: 'center',
  },
  tableRowAlt: { 
    backgroundColor: "#f9f9f9",
  },
  tableColHeader: {
    padding: 8,
    fontWeight: 'bold',
    textAlign: "center",
  },
  tableCol: {
    padding: 8,
    textAlign: "center",
    fontSize: 9,
  },
  productCol: {
    width: '18%',
  },
  descriptionCol: {
    width: '22%',
  },
  numberCol: {
    width: '10%',
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
});

const QuotationPDF = ({ customer, items, quoteNumber, today, salesman }) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        
        <View style={styles.contentWrapper}>
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

          <View>
            <Text style={styles.sectionTitle}>Products & Services</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableColHeader, styles.productCol]}>Product</Text>
                <Text style={[styles.tableColHeader, styles.descriptionCol]}>Description</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Unit Price</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Qty</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Price</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>VAT (15%)</Text>
                <Text style={[styles.tableColHeader, styles.numberCol]}>Total</Text>
              </View>
              
              {items.map((item, index) => {
                const itemTotal = item.customPrice * item.quantity;
                const vat = itemTotal * 0.15;
                const finalItemTotal = itemTotal + vat;

                return (
                  <View style={[styles.tableRow, index % 2 === 0 ? styles.tableRowAlt : null]} key={index}>
                    <Text style={[styles.tableCol, styles.productCol]}>{item.product.name}</Text>
                    <Text style={[styles.tableCol, styles.descriptionCol]}>{item.product.description}</Text>
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

          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCol, styles.productCol, { textAlign: 'right', fontWeight: 'bold' }]} colSpan={4}>TOTAL (SAR):</Text>
            <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{subtotal.toLocaleString('en-US')}</Text>
            <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{vatTotal.toLocaleString('en-US')}</Text>
            <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{finalTotal.toLocaleString('en-US')}</Text>
          </View>

          <View style={styles.validity}>
            <Text>This quotation is valid until {formattedValidityDate}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms and Conditions</Text>
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <Text style={styles.termItem}>1. Payment Terms: 100% advance payment by bank transfer</Text>
                <Text style={styles.termItem}>2. Delivery: Ex-Dammam warehouse, subject to prior sale</Text>
                <Text style={styles.termItem}>3. Prices are in Saudi Riyals (SAR) and exclude transportation, insurance, and registration</Text>
                <Text style={styles.termItem}>4. Warranty: 18 months or 3000 operating hours for Excavators & Loaders</Text>
                <Text style={styles.termItem}>5. Warranty: 12 months or 2000 operating hours for Cranes</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.termItem}>6. Warranty: 12 months or 50,000 km for Trucks</Text>
                <Text style={styles.termItem}>7. This quotation does not constitute an offer and is subject to change without notice</Text>
                <Text style={styles.termItem}>8. All disputes are subject to Saudi Arabian law and jurisdiction</Text>
                <Text style={styles.termItem}>9. Prices valid until {formattedValidityDate}</Text>
              </View>
            </View>
          </View>

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
        </View>

        {renderFooter(1, 1)}
      </Page>
    </Document>
  );
};

export default QuotationPDF;