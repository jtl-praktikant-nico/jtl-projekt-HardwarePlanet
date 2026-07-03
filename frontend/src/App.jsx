import { useState, useEffect } from 'react';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './products.js';
import './App.css';

// Die neuen, kleinen Komponenten importieren:
import Header from './components/Header.jsx';
import ProductCard from './components/ProductCard.jsx';

const BACKEND_BASE_URL = 'http://localhost:5102';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchId, setSearchId] = useState('');
  const [singleProduct, setSingleProduct] = useState(null);

  // 1. category im Zustand registriert
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    description: '',
    price: '',
    imageUrl: ''
  });

  // 2. category im Bearbeitungs-Zustand registriert
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '', 
    description: '',
    price: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (searchId === '') return;

    try {
      const product = await getProductById(searchId);
      setSingleProduct(product);
    } catch (err) {
      setError(err.message);
      setSingleProduct(null);
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createProduct(formData);
      setFormData({ name: '', category: '', description: '', price: '', imageUrl: '' });
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Produkt wirklich löschen?')) return;
    try {
      await deleteProduct(id);
      if (singleProduct && singleProduct.id === id) setSingleProduct(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditing(product) {
    setEditingId(product.id);
    // 3. Bestehende Kategorie in das Bearbeitungs-Formular laden
    setEditFormData({
      id: product.id,
      name: product.name,
      category: product.category || '', 
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateProduct(editingId, editFormData);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="loading">Hardware Planet lädt...</div>;
  }

  return (
    <div className="shop-container">
      <Header />

      {error && <div className="error-message">{error}</div>}

      <section className="products-section">
        <h2>Unsere Produkte</h2>
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard 
              key={p.id}
              product={p}
              editingId={editingId}
              editFormData={editFormData}
              handleUpdate={handleUpdate}
              handleEditFormChange={handleEditFormChange}
              setEditingId={setEditingId}
              startEditing={startEditing}
              handleDelete={handleDelete}
              backendUrl={BACKEND_BASE_URL}
            />
          ))}
        </div>
      </section>

      <div className="management-row">
        <section className="management-box">
          <h2>Produkt suchen</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Hardware-ID eingeben"
            />
            <button type="submit" className="btn-primary">Suchen</button>
          </form>
          {singleProduct && (
            <div className="single-product-result">
              <h3>{singleProduct.name}</h3>
              <p>{singleProduct.description}</p>
              {singleProduct.imageUrl && (
                <img src={`${BACKEND_BASE_URL}${singleProduct.imageUrl}`} alt={singleProduct.name} width="100" />
              )}
            </div>
          )}
        </section>

        <section className="management-box">
          <h2>Neues Produkt hinzufügen</h2>
          <form onSubmit={handleCreate} className="create-form">
            <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Name (z.B. RTX 5080)" />
            
            {/* Das Eingabefeld für Kategorien ist wieder da! */}
            <input name="category" value={formData.category} onChange={handleFormChange} placeholder="Kategorie (z.B. Grafikkarten)" />
            
            <input name="description" value={formData.description} onChange={handleFormChange} placeholder="Beschreibung" />
            <input name="price" value={formData.price} onChange={handleFormChange} placeholder="Preis in €" />
            <input name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} placeholder="Bild-URL (z.B. /image/bild1.png)" />
            <button type="submit" className="btn-success">Hinzufügen</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;