import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import QuotationPDF from './QuotationPDF';
import { products } from '../data/products';
import '../styles/QuotationApp.css';

const InputField = ({ label, type = "text", value, onChange }) => (
  <div className="input-field">
    <label>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
    />
  </div>
);

export default function QuotationApp() {
  const [customer, setCustomer] = useState({
    name: "", company: "", address: "", phone: "", email: "", taxId: ""
  });
  const [items, setItems] = useState([]);
  const [salesman, setSalesman] = useState({
    name: "Obada Al-Darwish", mobile: "0554865105", email: "aldarwisho@sanygroup.com"
  });
  const [showPreview, setShowPreview] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [nextQuoteNumber, setNextQuoteNumber] = useState(1);
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState('');
  const [isReadyForDownload, setIsReadyForDownload] = useState(false);

  useEffect(() => {
    const savedQuotations = localStorage.getItem('sany_quotations');
    const lastQuoteNumber = localStorage.getItem('last_quote_number');
    
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations));
    if (lastQuoteNumber) setNextQuoteNumber(parseInt(lastQuoteNumber) + 1);
  }, []);

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
      updatedItems[index].customPrice = value.price;
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
      return total + (item.customPrice * item.quantity * 1.15);
    }, 0);
  };

  const loadQuotation = (quote) => {
    setCustomer({ ...quote.customer });
    setItems([...quote.items]);
    setSalesman({ ...quote.salesman });
    setIsReadyForDownload(false);
  };

  return (
    <div className="quotation-app">
      <h2>SANY Quotation Generator</h2>
      
      <div className="app-grid">
        <div>
          <div className="input-group">
            <h4>Customer Information</h4>
            <InputField label="Customer Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <InputField label="Company" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
            <InputField label="Address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            <InputField label="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <InputField label="Email" type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            <InputField label="Tax ID / CR" value={customer.taxId} onChange={(e) => setCustomer({ ...customer, taxId: e.target.value })} />
          </div>

          <div className="input-group">
            <h4>Salesman Information</h4>
            <InputField label="Name" value={salesman.name} onChange={(e) => setSalesman({ ...salesman, name: e.target.value })} />
            <InputField label="Mobile" value={salesman.mobile} onChange={(e) => setSalesman({ ...salesman, mobile: e.target.value })} />
            <InputField label="Email" type="email" value={salesman.email} onChange={(e) => setSalesman({ ...salesman, email: e.target.value })} />
          </div>
        </div>

        <div>
          <div className="input-group">
            <div className="product-header">
              <h4>Product List</h4>
              <button onClick={handleAddItem} className="add-button">
                + Add Product
              </button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="product-item">
                <select 
                  value={item.product.name} 
                  onChange={(e) => updateItem(index, "product", products.find(p => p.name === e.target.value))}
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
  placeholder="Qty"
/>
<input 
  type="number" 
  min="0"
  value={item.customPrice} 
  onChange={(e) => updateItem(index, "customPrice", Math.max(0, parseInt(e.target.value) || 0))} 
  placeholder="Price"
/>
                <button 
                  onClick={() => handleRemoveItem(index)} 
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="input-group">
            <h4>Saved Quotations</h4>
            {quotations.length === 0 ? (
              <p>No saved quotations yet</p>
            ) : (
              <div className="quotations-list">
                {quotations.map((quote) => (
                  <div key={quote.id} className="quotation-item" onClick={() => loadQuotation(quote)}>
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

      <div className="button-group">
        <button onClick={prepareForDownload} className="button">
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
              <button className={`button ${loading ? 'loading' : ''}`}>
                {loading ? "Generating..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}
        
        <button 
          onClick={() => setShowPreview(!showPreview)} 
          className="button preview-button"
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
          className="button clear-button"
        >
          Clear Form
        </button>
      </div>

      {showPreview && (
        <div className="preview-modal">
          <button 
            onClick={() => setShowPreview(false)} 
            className="close-button"
          >
            ×
          </button>
          <PDFViewer className="pdf-viewer">
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