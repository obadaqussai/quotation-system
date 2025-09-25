import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import QuotationPDF from './QuotationPDF';
import { products as initialProducts } from '../data/products';
import { mergeQuotationWithCatalogues } from './pdfMerger';
import '../styles/QuotationApp.css';

const InputField = ({ label, type = "text", value, onChange, disabled = false }) => (
  <div className="input-field">
    <label>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange}
      disabled={disabled}
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
  
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [downPaymentType, setDownPaymentType] = useState("percentage");
  const [downPaymentValue, setDownPaymentValue] = useState(30);
  const [installmentYears, setInstallmentYears] = useState(1);
  const [paymentFrequency, setPaymentFrequency] = useState(1);
  // Removed unused installmentMonths state

  const [products, setProducts] = useState(initialProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showManageProducts, setShowManageProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: null,
    catalogue: null
  });
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [editingItemDescription, setEditingItemDescription] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  useEffect(() => {
    const savedQuotations = localStorage.getItem('sany_quotations');
    const lastQuoteNumber = localStorage.getItem('last_quote_number');
    const savedSalesman = localStorage.getItem('salesman_info');
    const savedProducts = localStorage.getItem('sany_products');
    
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations));
    if (lastQuoteNumber) setNextQuoteNumber(parseInt(lastQuoteNumber) + 1);
    if (savedSalesman) setSalesman(JSON.parse(savedSalesman));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  useEffect(() => {
    localStorage.setItem('sany_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('salesman_info', JSON.stringify(salesman));
  }, [salesman]);

  useEffect(() => {
    localStorage.setItem('sany_products', JSON.stringify(products));
  }, [products]);

  // Removed useEffect for unused installmentMonths

  const today = new Date().toLocaleDateString();

  const handleAddItem = () => {
    setItems([...items, { 
      product: products[0], 
      quantity: 1, 
      customPrice: products[0].price,
      paymentPlan: "cash",
      customDescription: products[0].description
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
      updatedItems[index].customDescription = value.description;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.customPrice * item.quantity * 1.15);
    }, 0);
  };

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
    
    const feesPercentage = installmentYears * 6;
    const feesAmount = remainingAmount * (feesPercentage / 100);
    
    const totalWithFees = remainingAmount + feesAmount;
    
    const numberOfPayments = Math.ceil(installmentYears * 12 / paymentFrequency);
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
      total: calculateTotal(),
      paymentMethod,
      downPaymentType,
      downPaymentValue,
      installmentYears,
      paymentFrequency
    };

    setQuotations([...quotations, newQuote]);
    setNextQuoteNumber(nextQuoteNumber + 1);
    localStorage.setItem('last_quote_number', nextQuoteNumber.toString());
    return quoteNumber;
  };

  const prepareForDownload = async () => {
    const newQuoteNumber = generateNewQuotation();
    setCurrentQuoteNumber(newQuoteNumber);
    
    // Generate merged PDF with catalogues
    try {
      const mergedUrl = await mergeQuotationWithCatalogues(
        customer, items, newQuoteNumber, today, salesman, terms, selectedTerms,
        paymentMethod, downPaymentType, downPaymentValue, installmentYears, paymentFrequency
      );
      setMergedPdfUrl(mergedUrl);
      setIsReadyForDownload(true);
    } catch (error) {
      console.error('Error generating merged PDF:', error);
      setIsReadyForDownload(true); // Fallback to regular PDF
    }
  };

  const loadQuotation = (quote) => {
    setCustomer({ ...quote.customer });
    setItems([...quote.items]);
    setSalesman({ ...quote.salesman });
    setTerms(quote.terms || []);
    setSelectedTerms(quote.selectedTerms || []);
    setPaymentMethod(quote.paymentMethod || "cash");
    setDownPaymentType(quote.downPaymentType || "percentage");
    setDownPaymentValue(quote.downPaymentValue || 30);
    setInstallmentYears(quote.installmentYears || 1);
    setPaymentFrequency(quote.paymentFrequency || 1);
    setIsReadyForDownload(false);
    setMergedPdfUrl(null);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      image: null,
      catalogue: null
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      
      const updatedItems = items.filter(item => item.product.id !== productId);
      setItems(updatedItems);
    }
  };

  const handleSaveProduct = () => {
    if (newProduct.name.trim() && newProduct.description.trim() && newProduct.price > 0) {
      if (editingProduct) {
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p
        );
        setProducts(updatedProducts);
        
        const updatedItems = items.map(item => 
          item.product.id === editingProduct.id ? { ...item, product: { ...newProduct, id: editingProduct.id } } : item
        );
        setItems(updatedItems);
      } else {
        const productToAdd = {
          ...newProduct,
          id: Math.max(...products.map(p => p.id), 0) + 1
        };
        setProducts([...products, productToAdd]);
      }
      setShowProductModal(false);
    }
  };

  const handleImageUpload = (e, type, productIndex = null) => {
    const file = e.target.files[0];
    if (file) {
      if (productIndex !== null) {
        const updatedItems = [...items];
        if (type === 'image') {
          updatedItems[productIndex].product.image = file;
        } else {
          updatedItems[productIndex].product.catalogue = file;
        }
        setItems(updatedItems);
      } else {
        if (type === 'image') {
          setNewProduct({ ...newProduct, image: file });
        } else {
          setNewProduct({ ...newProduct, catalogue: file });
        }
      }
    }
  };

  const handleEditDescription = (index) => {
    setEditingItemDescription(index);
  };

  const handleSaveDescription = (index) => {
    setEditingItemDescription(null);
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

  const getQuotationCatalogues = () => {
    return items.filter(item => item.product.catalogue).map(item => item.product);
  };

  const downloadMergedPdf = () => {
    if (mergedPdfUrl) {
      const link = document.createElement('a');
      link.href = mergedPdfUrl;
      link.download = `SANY_Quotation_${customer.company || 'Customer'}_${currentQuoteNumber}.pdf`;
      link.click();
    }
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

          <div className="input-group">
            <h4>Default Payment Options</h4>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash Payment
              </label>
              <label>
                <input
                  type="radio"
                  value="installment"
                  checked={paymentMethod === "installment"}
                  onChange={() => setPaymentMethod("installment")}
                />
                Installment Payment
              </label>
            </div>

            {paymentMethod === "installment" && (
              <div className="installment-details">
                <div className="input-field">
                  <label>Down Payment Type</label>
                  <select
                    value={downPaymentType}
                    onChange={(e) => setDownPaymentType(e.target.value)}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <InputField
                  label={downPaymentType === "percentage" ? "Down Payment Percentage" : "Down Payment Amount (SAR)"}
                  type="number"
                  value={downPaymentValue}
                  onChange={(e) => setDownPaymentValue(parseFloat(e.target.value) || 0)}
                />

                <InputField
                  label="Installment Period (Years)"
                  type="number"
                  min="1"
                  step="0.5"
                  value={installmentYears}
                  onChange={(e) => setInstallmentYears(parseFloat(e.target.value) || 1)}
                />

                <InputField
                  label="Payment Frequency (Months)"
                  type="number"
                  min="1"
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(parseInt(e.target.value) || 1)}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="input-group">
            <div className="product-header">
              <h4>Product List</h4>
              <div>
                <button onClick={handleAddItem} className="add-button">
                  + Add Product
                </button>
                <button onClick={() => setShowManageProducts(true)} className="add-button" style={{marginLeft: '10px'}}>
                  📦 Manage Products
                </button>
              </div>
            </div>
            {items.map((item, index) => {
              const installmentDetails = item.paymentPlan === "installment" ? calculateInstallmentDetails(item) : null;
              
              return (
                <div key={index} className="product-card">
                  <div className="product-card-header">
                    <div className="product-basic-info">
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
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(index)} 
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>

                  <div className="product-attachments">
                    <div className="attachment-section">
                      <label>Product Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'image', index)}
                      />
                      {item.product.image && <span className="file-indicator">✓ Image</span>}
                    </div>
                    <div className="attachment-section">
                      <label>Product Catalogue (PDF):</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleImageUpload(e, 'catalogue', index)}
                      />
                      {item.product.catalogue && <span className="file-indicator">✓ Catalogue</span>}
                    </div>
                  </div>

                  <div className="product-description-section">
                    {editingItemDescription === index ? (
                      <div className="description-edit-mode">
                        <textarea
                          value={item.customDescription}
                          onChange={(e) => updateItem(index, "customDescription", e.target.value)}
                          placeholder="Product description"
                          rows="2"
                        />
                        <button onClick={() => handleSaveDescription(index)} className="save-btn">
                          💾 Save
                        </button>
                      </div>
                    ) : (
                      <div className="description-view-mode">
                        <button onClick={() => handleEditDescription(index)} className="edit-btn">
                          ✏️ Edit Description
                        </button>
                        {item.customDescription && (
                          <div className="description-preview">
                            <span>{item.customDescription}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="product-payment-options">
                    <label>
                      <input
                        type="radio"
                        value="cash"
                        checked={item.paymentPlan === "cash"}
                        onChange={() => updateItem(index, "paymentPlan", "cash")}
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="installment"
                        checked={item.paymentPlan === "installment"}
                        onChange={() => updateItem(index, "paymentPlan", "installment")}
                      />
                      Installment
                    </label>
                    
                    {item.paymentPlan === "installment" && installmentDetails && (
                      <div className="installment-summary">
                        <span>Total: SAR {installmentDetails.itemTotalWithVAT.toLocaleString('en-US')}</span>
                        <span>Down: SAR {installmentDetails.downPaymentAmount.toLocaleString('en-US')}</span>
                        <span>Monthly: SAR {installmentDetails.monthlyPayment.toLocaleString('en-US')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            
            <InputField
              label="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            
            <div className="input-field">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                rows="3"
              />
            </div>
            
            <InputField
              label="Price (SAR)"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
            />
            
            <div className="input-field">
              <label>Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'image')}
              />
              {newProduct.image && (
                <div className="file-preview">
                  <span>Selected: {newProduct.image.name}</span>
                </div>
              )}
            </div>
            
            <div className="input-field">
              <label>Product Catalogue (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleImageUpload(e, 'catalogue')}
              />
              {newProduct.catalogue && (
                <div className="file-preview">
                  <span>Selected: {newProduct.catalogue.name}</span>
                </div>
              )}
            </div>
            
            <div className="modal-buttons">
              <button onClick={handleSaveProduct} className="button">
                Save Product
              </button>
              <button onClick={() => setShowProductModal(false)} className="button clear-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showManageProducts && (
        <div className="modal-overlay">
          <div className="modal-content manage-products-modal">
            <div className="modal-header">
              <h3>Manage Products ({products.length})</h3>
              <button onClick={() => setShowManageProducts(false)} className="close-button">×</button>
            </div>
            
            <div className="products-management">
              <button onClick={handleAddProduct} className="add-button">
                + Add New Product
              </button>
              
              <div className="products-list">
                {products.map((product) => (
                  <div key={product.id} className="product-management-card">
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">SAR {product.price.toLocaleString()}</p>
                      <p className="product-description">{product.description}</p>
                      <div className="product-files">
                        {product.image && <span>📷 Image</span>}
                        {product.catalogue && <span>📋 Catalogue</span>}
                      </div>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleEditProduct(product)} className="edit-product-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="delete-product-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCatalogue && (
        <div className="modal-overlay">
          <div className="modal-content catalogue-modal">
            <div className="modal-header">
              <h3>Product Catalogues ({getQuotationCatalogues().length})</h3>
              <button onClick={() => setShowCatalogue(false)} className="close-button">×</button>
            </div>
            <div className="catalogue-list">
              {getQuotationCatalogues().length === 0 ? (
                <p className="no-catalogues">No catalogues attached to products in this quotation</p>
              ) : (
                getQuotationCatalogues().map((product, index) => (
                  <div key={index} className="catalogue-item">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    {product.catalogue && (
                      <div className="catalogue-info">
                        <span>📋 {product.catalogue.name}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="button-group">
        <button onClick={prepareForDownload} className="button">
          Prepare PDF Download
        </button>
        
        {isReadyForDownload && mergedPdfUrl && (
          <button onClick={downloadMergedPdf} className="button">
            Download Merged PDF
          </button>
        )}

        {isReadyForDownload && !mergedPdfUrl && (
          <PDFDownloadLink
            document={<QuotationPDF 
              customer={customer} 
              items={items} 
              quoteNumber={currentQuoteNumber}
              today={today} 
              salesman={salesman}
              terms={terms}
              selectedTerms={selectedTerms}
              paymentMethod={paymentMethod}
              downPaymentType={downPaymentType}
              downPaymentValue={downPaymentValue}
              installmentYears={installmentYears}
              paymentFrequency={paymentFrequency}
            />}
            fileName={`SANY_Quotation_${customer.company || 'Customer'}_${currentQuoteNumber}.pdf`}
          >
            {({ loading }) => (
              <button className={`button ${loading ? 'loading' : ''}`}>
                {loading ? "Generating..." : "Download PDF (No Catalogues)"}
              </button>
            )}
          </PDFDownloadLink>
        )}
        
        <button onClick={() => setShowPreview(!showPreview)} className="button preview-button">
          {showPreview ? "Hide Preview" : "Preview PDF"}
        </button>
        
        <button onClick={() => setShowCatalogue(!showCatalogue)} className="button catalogue-button">
          {showCatalogue ? "Hide Catalogue" : "Show Catalogue"}
        </button>
        
        <button onClick={() => {
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
          setPaymentMethod("cash");
          setDownPaymentType("percentage");
          setDownPaymentValue(30);
          setInstallmentYears(1);
          setPaymentFrequency(1);
          setIsReadyForDownload(false);
          setMergedPdfUrl(null);
        }} className="button clear-button">
          Clear Form
        </button>
      </div>

      {showPreview && (
        <div className="preview-modal">
          <button onClick={() => setShowPreview(false)} className="close-button">
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
              paymentMethod={paymentMethod}
              downPaymentType={downPaymentType}
              downPaymentValue={downPaymentValue}
              installmentYears={installmentYears}
              paymentFrequency={paymentFrequency}
            />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}