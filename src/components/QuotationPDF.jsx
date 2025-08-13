import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import sanyLogo from '../assets/sany-logo.png';
import {
  PDFDownloadLink,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
// Removed duplicate import of sanyLogo

// Register fonts
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});

Font.register({
  family: 'Helvetica',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

// PRODUCTS LIST
const products = [
  { name: "SY215H Excavator", description: "Isuzu Engine,Hydraulic System: Kawasaki, 21,9T, 1.2 m³, 133 KW, 178.2 HP", price: 350000 },
  { name: "SY365H Excavator", description: "Isuzu Engine,Hydraulic System: Kawasaki, 36.6T, 1.6 m³, 212 kW, 285 HP", price: 580000 },
  { name: "SY500H Excavator", description: "Isuzu Engine,Hydraulic System: Kawasaki, 50T, 2.5 m³,300 KW, 402 HP", price: 850000 },
  { name: "SY550HD Excavator", description: "Isuzu Engine,Hydraulic System: Kawasaki, 52T, 3.2 m³,300 KW, 402 HP", price: 900000 },
  { name: "SYL956H5 Wheel Loader", description: "17.5T, 3 m³, 220 HP", price: 280000 },
  { name: "SW978K1 Wheel Loader", description: "5.5 m³, 310 HP", price: 580000 },
  { name: "SPS40000 Boom Truck", description: "40T capacity, 12.5m reach", price: 520000 },
  { name: "Dump Truck 8X4", description: "DUTEZ 460HP, 25m³ Drum, 16-speed manual", price: 310000 },
  { name: "Dump Truck 6X4", description: "YUCHAI 400HP, 20m³ Drum", price: 250000 },
  { name: "Roller STR100C-8C", description: "10.5T,Frequency/Hz: 50/61,Centrifugal Force/kN:149/94,CUMMINS 119 KW,", price: 255000 },
  { name: "Roller SPR160C-8", description: "16T,Compaction width 2085 mm, Warning light on cab,Engine: Cummins , 93 KW", price: 260000 },
  { name: "Roller SPR260C-8S", description: "26T,Compaction width 2368 mm,Warning light on cab,Engine: Weicai,140 KW", price: 275000 },
  { name: "MILLING MACHINE SCM2000C-10", description: "Milling width (mm) 2010,Milling depth (mm) 0~330 ,Working speed (km/h): 0~5,Engine:Amercan Cumminns, 503KW ", price: 1250000 },
  { name: "Paver SSP90C-8", description: "Heating Mode: Electric Heated ,Max. Paving Thickness: 50 CM,Paving Capacity: 90 T/H,Engine:SANY, 180 KW ,Paving Width:Basic width (m):Hydraulic: 3~5.7 m,Max paving whdth: 9.2m ,Working speed (m/min)1~16", price: 814000 },
  { name: "GRADER STG265-10C", description: "five-tooth rear ripper,transmission: ZF Jingda rear axle,Engine:SANY Deutz D09S3T5A,Rated power 200 kw/267hp,The cabin is air conditioned", price: 518000 },
  { name: "SINGLE DRUM ROLLER SSR200C-8H", description: "Operation weigt: 20,000 kg,Frequncy/Hz: 29/35 Hz,Centerifugal force/KN: 380/275,Engine: WEICHAI, 147 KW", price: 212000 },
  { name: "SINGLE DRUM ROLLER SSR120C-8H", description: "Operation weigt: 12,000 kg,Frequncy/Hz: 32/36 Hz,Centerifugal force/KN: 380/178,Engine: CUMMINS, 93 KW", price: 250000 },
  { name: "GRADER STG230-8S", description: "Max Total Power 603 Kw,Rated Mixing Capacity 3500 kg, Rated Productivity 240  t/h ", price: 3384000 },
];

// STYLES
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
  footer: { 
    padding: 10,
    backgroundColor: "#D3D3D3",
    borderRadius: 3,
    color: '#e30613',
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  footerText: { 
    fontSize: 8,
    marginBottom: 3,
  },
  signatureArea: {
    marginTop: 'auto',
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
  signatureLine: {
    height: 1,
    backgroundColor: '#000',
    margin: '20px 0',
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
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
            
            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={[styles.tableCol, styles.productCol, { textAlign: 'right', fontWeight: 'bold' }]} colSpan={4}>TOTAL (SAR):</Text>
              <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{subtotal.toLocaleString('en-US')}</Text>
              <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{vatTotal.toLocaleString('en-US')}</Text>
              <Text style={[styles.tableCol, styles.numberCol, styles.totalCell]}>{finalTotal.toLocaleString('en-US')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.validity}>
          <Text>This quotation is valid until {formattedValidityDate}</Text>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <View style={styles.footer}>
            <Text style={styles.footerText}>1. Payment Terms: 100% advance payment by bank transfer</Text>
            <Text style={styles.footerText}>2. Delivery: Ex-Dammam warehouse, subject to prior sale</Text>
            <Text style={styles.footerText}>3. Prices are in Saudi Riyals (SAR) and exclude transportation, insurance, and registration</Text>
            <Text style={styles.footerText}>4. Warranty: 18 months or 3000 operating hours for Excavators & Loaders</Text>
            <Text style={styles.footerText}>5. Warranty: 12 months or 2000 operating hours for Cranes</Text>
            <Text style={styles.footerText}>6. Warranty: 12 months or 50,000 km for Trucks</Text>
            <Text style={styles.footerText}>7. This quotation does not constitute an offer and is subject to change without notice</Text>
            <Text style={styles.footerText}>8. All disputes are subject to Saudi Arabian law and jurisdiction</Text>
            <Text style={styles.footerText}>9. Prices valid until {formattedValidityDate}</Text>
          </View>
        </View>

        <View style={styles.signatureArea}>
          <View style={styles.signatureBox}>
            <Text>Customer Signature</Text>
            <View style={styles.signatureLine} />
            <Text>Name: ________________________</Text>
            <Text>Date: ________________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text>Authorized Signature</Text>
            <View style={styles.signatureLine} />
            <Text>Name: {salesman.name}</Text>
            <Text>Date: {today}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// COMPONENT STYLES
const InputField = ({ label, type = "text", value, onChange }) => (
  <div style={{ marginBottom: "10px" }}>
    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      style={{ 
        width: "100%", 
        padding: "8px", 
        border: "1px solid #ddd", 
        borderRadius: "4px" 
      }} 
    />
  </div>
);

const inputGroupStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const productItemStyle = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  margin: "10px 0",
  padding: "10px",
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
};

const selectStyle = {
  flex: 2,
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
};

const inputNumberStyle = {
  flex: 1,
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  textAlign: "center",
};

const addButtonStyle = {
  padding: "8px 15px",
  backgroundColor: "#e30613",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

const removeButtonStyle = {
  padding: "8px 12px",
  backgroundColor: "#ff4444",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

const buttonStyles = {
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#e30613",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  minWidth: "150px",
};

const previewModalStyle = {
  position: "fixed", 
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0, 
  backgroundColor: "rgba(0,0,0,0.9)", 
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const closeButtonStyle = {
  position: "absolute", 
  top: "20px", 
  right: "20px", 
  background: "#e30613", 
  color: "white", 
  border: "none", 
  padding: "5px 12px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
};

export default function QuotationApp() {
  const [customer, setCustomer] = useState({ 
    name: "", 
    company: "", 
    address: "", 
    phone: "", 
    email: "", 
    taxId: "" 
  });
  const [items, setItems] = useState([]);
  const [salesman, setSalesman] = useState({ 
    name: "Obada Al-Darwish", 
    mobile: "0554865105", 
    email: "aldarwisho@sanygroup.com" 
  });
  const [showPreview, setShowPreview] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [nextQuoteNumber, setNextQuoteNumber] = useState(1);
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState('');
  const [isReadyForDownload, setIsReadyForDownload] = useState(false);

  // Load saved quotations from localStorage
  useEffect(() => {
    const savedQuotations = localStorage.getItem('sany_quotations');
    const lastQuoteNumber = localStorage.getItem('last_quote_number');
    
    if (savedQuotations) {
      setQuotations(JSON.parse(savedQuotations));
    }
    
    if (lastQuoteNumber) {
      setNextQuoteNumber(parseInt(lastQuoteNumber) + 1);
    }
  }, []);

  // Save quotations to localStorage when they change
  useEffect(() => {
    localStorage.setItem('sany_quotations', JSON.stringify(quotations));
  }, [quotations]);

  const today = new Date().toLocaleDateString();

  const handleAddItem = () => {
    setItems([...items, { 
      product: products[0], 
      quantity: 1, 
      customPrice: products[0].price 
    }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    
    if (field === "product") {
      updatedItems[index].product = value;
      updatedItems[index].customPrice = value.price; // Reset to new product's price
    } else {
      updatedItems[index][field] = value;
    }
    
    setItems(updatedItems);
  };

  const generateNewQuotation = () => {
    const quoteNumber = nextQuoteNumber.toString().padStart(4, '0');
    const newQuote = {
      id: Date.now(),
      quoteNumber,
      date: today,
      customer: { ...customer },
      items: [...items],
      salesman: { ...salesman },
      total: calculateTotal()
    };

    setQuotations([...quotations, newQuote]);
    setNextQuoteNumber(nextQuoteNumber + 1);
    localStorage.setItem('last_quote_number', nextQuoteNumber.toString());
    return quoteNumber;
  };

  const prepareForDownload = () => {
    const newQuoteNumber = generateNewQuotation();
    setCurrentQuoteNumber(newQuoteNumber);
    setIsReadyForDownload(true);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const itemTotal = item.customPrice * item.quantity * 1.15; // Include VAT
      return total + itemTotal;
    }, 0);
  };

  const loadQuotation = (quote) => {
    setCustomer({ ...quote.customer });
    setItems([...quote.items]);
    setSalesman({ ...quote.salesman });
    setIsReadyForDownload(false);
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "800px", 
      margin: "0 auto", 
      fontFamily: "Arial",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh"
    }}>
      <h2 style={{ 
        color: "#e30613", 
        borderBottom: "2px solid #e30613", 
        paddingBottom: "10px",
        textAlign: "center"
      }}>
        SANY Quotation Generator
      </h2>
      
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "20px",
        "@media (min-width: 768px)": {
          gridTemplateColumns: "1fr 1fr"
        }
      }}>
        {/* Left Column */}
        <div>
          <div style={inputGroupStyle}>
            <h4 style={{ color: "#e30613", marginBottom: "10px" }}>Customer Information</h4>
            <InputField label="Customer Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <InputField label="Company" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
            <InputField label="Address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            <InputField label="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <InputField label="Email" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            <InputField label="Tax ID / CR" value={customer.taxId} onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })} />
          </div>

          <div style={inputGroupStyle}>
            <h4 style={{ color: "#e30613", marginBottom: "10px" }}>Salesman Information</h4>
            <InputField label="Name" value={salesman.name} onChange={(e) => setSalesman({ ...salesman, name: e.target.value })} />
            <InputField label="Mobile" value={salesman.mobile} onChange={(e) => setSalesman({ ...salesman, mobile: e.target.value })} />
            <InputField label="Email" type="email" value={salesman.email} onChange={(e) => setSalesman({ ...salesman, email: e.target.value })} />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={inputGroupStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ color: "#e30613", margin: "0" }}>Product List</h4>
              <button onClick={handleAddItem} style={addButtonStyle}>
                + Add Product
              </button>
            </div>
            {items.map((item, index) => (
  <div key={index} style={productItemStyle}>
    <select 
      value={item.product.name} 
      onChange={(e) => updateItem(index, "product", products.find(p => p.name === e.target.value))}
      style={selectStyle}
    >
      {products.map((product) => (
        <option key={product.name} value={product.name}>{product.name}</option>
      ))}
    </select>
    <input 
      type="number" 
      min="1"
      value={item.quantity} 
      onChange={(e) => updateItem(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))} 
      style={inputNumberStyle}
      placeholder="Qty"
    />
    <input 
      type="number" 
      min="0"
      value={item.customPrice} 
      onChange={(e) => updateItem(index, "customPrice", Math.max(0, parseInt(e.target.value) || 0))} 
      style={inputNumberStyle}
      placeholder="Price"
    />
    <button 
      onClick={() => handleRemoveItem(index)} 
      style={removeButtonStyle}
    >
      ×
    </button>
  </div>
))}
          </div>

          <div style={inputGroupStyle}>
            <h4 style={{ color: "#e30613", marginBottom: "10px" }}>Saved Quotations</h4>
            {quotations.length === 0 ? (
              <p>No saved quotations yet</p>
            ) : (
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {quotations.map((quote) => (
                  <div key={quote.id} style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f0f0"
                    }
                  }} onClick={() => loadQuotation(quote)}>
                    <div><strong>SANY-{quote.quoteNumber}</strong></div>
                    <div>{quote.customer.company} - {quote.date}</div>
                    <div>Total: SAR {quote.total.toLocaleString('en-US')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginTop: "20px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button onClick={prepareForDownload} style={buttonStyles}>
          Prepare PDF Download
        </button>
        
        {isReadyForDownload && (
          <PDFDownloadLink
            document={<QuotationPDF 
              customer={customer} 
              items={items} 
              quoteNumber={currentQuoteNumber}
              today={today} 
              salesman={salesman} 
            />}
            fileName={`SANY_Quotation_${customer.company || 'Customer'}_${currentQuoteNumber}.pdf`}
          >
            {({ loading }) => (
              <button style={loading ? { ...buttonStyles, cursor: "wait" } : buttonStyles}>
                {loading ? "Generating..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}
        
        <button 
          onClick={() => setShowPreview(!showPreview)} 
          style={{ ...buttonStyles, backgroundColor: "#000" }}
        >
          {showPreview ? "Hide Preview" : "Preview PDF"}
        </button>
        
        <button 
          onClick={() => {
            setCustomer({ name: "", company: "", address: "", phone: "", email: "", taxId: "" });
            setItems([]);
            setSalesman({ name: "Obada Al-Darwish", mobile: "0554865105", email: "aldarwisho@sanygroup.com" });
            setIsReadyForDownload(false);
          }}
          style={{ ...buttonStyles, backgroundColor: "#666" }}
        >
          Clear Form
        </button>
      </div>

      {showPreview && (
        <div style={previewModalStyle}>
          <button 
            onClick={() => setShowPreview(false)} 
            style={closeButtonStyle}
          >
            ×
          </button>
          <PDFViewer style={{ width: "800px", height: "600px" }}>
            <QuotationPDF 
              customer={customer} 
              items={items} 
              quoteNumber={currentQuoteNumber || nextQuoteNumber.toString().padStart(4, '0')} 
              today={today} 
              salesman={salesman} 
            />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}