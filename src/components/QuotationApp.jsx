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
    name: "", mobile: "", email: ""
  });
  const [showPreview, setShowPreview] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [nextQuoteNumber, setNextQuoteNumber] = useState(1);
  const [currentQuoteNumber, setCurrentQuoteNumber] = useState('');
  const [isReadyForDownload, setIsReadyForDownload] = useState(false);
  const [terms, setTerms] = useState([
    "1. Payment Terms: 100% advance payment by bank transfer",
    "2. Delivery: Ex-Dammam warehouse, subject to prior sale",
    "3. Prices are in Saudi Riyals (SAR) and exclude transportation, insurance, and registration",
    "4. Warranty: 18 months or 3000 operating hours for Excavators & Loaders",
    "5. Warranty: 12 months or 2000 operating hours for Cranes",
    "6. Warranty: 12 months or 50,000 km for Trucks",
    "7. This quotation does not constitute an offer and is subject to change without notice",
    "8. All disputes are subject to Saudi Arabian law and jurisdiction",
    `9. Prices valid until {formattedValidityDate}`
  ]);
  const [selectedTerms, setSelectedTerms] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    const savedQuotations = localStorage.getItem('sany_quotations');
    const lastQuoteNumber = localStorage.getItem('last_quote_number');
    const savedSalesman = localStorage.getItem('salesman_info');
    
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations));
    if (lastQuoteNumber) setNextQuoteNumber(parseInt(lastQuoteNumber) + 1);
    if (savedSalesman) setSalesman(JSON.parse(savedSalesman));
  }, []);

  useEffect(() => {
    localStorage.setItem('sany_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('salesman_info', JSON.stringify(salesman));
  }, [salesman]);

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
      terms: [...terms],
      selectedTerms: [...selectedTerms],
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
    setTerms(quote.terms || []);
    setSelectedTerms(quote.selectedTerms || []);
    setIsReadyForDownload(false);
  };

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      const updatedTerms = [...terms, newTerm];
      setTerms(updatedTerms);
      setSelectedTerms([...selectedTerms, terms.length]);
      setNewTerm("");
    }
  };

  const handleTermCheckboxChange = (index) => {
    if (selectedTerms.includes(index)) {
      setSelectedTerms(selectedTerms.filter(i => i !== index));
    } else {
      setSelectedTerms([...selectedTerms, index]);
    }
  };

  const handleTermTextChange = (index, value) => {
    const updatedTerms = [...terms];
    updatedTerms[index] = value;
    setTerms(updatedTerms);
  };

  const handleRemoveTerm = (index) => {
    setTerms(terms.filter((_, i) => i !== index));
    setSelectedTerms(selectedTerms.filter(i => i !== index));
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
            <h4>Terms and Conditions</h4>
            <div className="terms-list">
              {terms.map((term, index) => (
                <div key={index} className="term-item">
                  <input
                    type="checkbox"
                    checked={selectedTerms.includes(index)}
                    onChange={() => handleTermCheckboxChange(index)}
                  />
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleTermTextChange(index, e.target.value)}
                    className="term-input"
                  />
                  <button
                    onClick={() => handleRemoveTerm(index)}
                    className="remove-term-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="add-term">
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Add new term"
              />
              <button
                onClick={handleAddTerm}
                className="add-term-button"
              >
                Add Term
              </button>
            </div>
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
              terms={terms}
              selectedTerms={selectedTerms}
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
            setTerms([
              "1. Payment Terms: 100% advance payment by bank transfer",
              "2. Delivery: Ex-Dammam warehouse, subject to prior sale",
              "3. Prices are in Saudi Riyals (SAR) and exclude transportation, insurance, and registration",
              "4. Warranty: 18 months or 3000 operating hours for Excavators & Loaders",
              "5. Warranty: 12 months or 2000 operating hours for Cranes",
              "6. Warranty: 12 months or 50,000 km for Trucks",
              "7. This quotation does not constitute an offer and is subject to change without notice",
              "8. All disputes are subject to Saudi Arabian law and jurisdiction",
              `9. Prices valid until {formattedValidityDate}`
            ]);
            setSelectedTerms([0, 1, 2, 3, 4, 5, 6, 7, 8]);
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
              terms={terms}
              selectedTerms={selectedTerms}
            />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}