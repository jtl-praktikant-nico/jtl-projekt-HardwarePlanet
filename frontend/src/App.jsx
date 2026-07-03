import { useState, useEffect } from 'react';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './products.js';
import './App.css';

import Header from './components/Header.jsx';
import ProductCard from './components/ProductCard.jsx';

// Basis-URL für unser Backend. Wird später genutzt, um Bildpfade aus den Produktdaten in vollständige URLs zu verwandeln.
const BACKEND_BASE_URL = 'http://localhost:5102';

function App() {
  // products speichert die Liste aller Produkte, loading zeigt an, ob gerade Daten geladen werden,
  // error hält die Fehlermeldung, falls ein API-Aufruf fehlschlägt.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // searchId wird durch das Suchfeld verändert. singleProduct speichert das Ergebnis der Suche.
  const [searchId, setSearchId] = useState('');
  const [singleProduct, setSingleProduct] = useState(null);

  // formData ist ein Objekt mit allen Eingabewerten für das Erstellen eines neuen Produkts.
  // Jede Änderung im Formular wird hier in den Zustand geschrieben.
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  // Bearbeitungsmodus: editingId ist die ID des Produkts, das gerade editiert wird.
  // editFormData enthält die aktuellen Werte des Bearbeitungsformulars.
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  // useEffect mit leerer Abhängigkeit sorgt dafür, dass loadProducts nur einmal ausgeführt wird,
  // direkt nach dem ersten Rendern der Komponente. So holen wir beim Start die Produktliste.
  useEffect(() => {
    loadProducts();
  }, []);

  // loadProducts ruft die API-Funktion getProducts auf und speichert das Ergebnis in products.
  // Im Fehlerfall schreiben wir die Fehlermeldung in error. loading wird vor und nach dem Laden gesetzt,
  // damit die UI anzeigen kann, dass gerade Daten angefragt werden.
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

  // Suche ein Produkt nach seiner ID und speichert das Ergebnis in singleProduct.
  // event.preventDefault verhindert den normalen Form-Submit, sodass die Seite nicht neu lädt.
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

  // handleFormChange wird bei jeder Änderung eines Eingabefelds im Erstellungsformular aufgerufen.
  // Das Feldname-Attribut (z. B. name, category) bestimmt, welcher Schlüssel im formData-Objekt aktualisiert wird.
  function handleFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // handleEditFormChange funktioniert genauso wie handleFormChange,
  // aber für das Formular, das ein bestehendes Produkt bearbeitet.
  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }

  // handleCreate sendet die aktuellen Eingaben des Erstellungsformulars an die API.
  // Danach wird das Formular geleert und die Produktliste erneut geladen, damit die neue Hardware sichtbar wird.
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

  // handleDelete fragt vor dem Löschen kurz nach und ruft die API zum Entfernen des Produkts auf.
  // Wenn das gelöschte Produkt gerade im Suchergebnis angezeigt wurde, setzen wir singleProduct zurück.
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

  // startEditing füllt das Bearbeitungsformular mit den Daten des ausgewählten Produkts.
  // editingId wird gesetzt, damit die Produktkarte weiß, dass sie jetzt im Bearbeitungsmodus ist.
  function startEditing(product) {
    setEditingId(product.id);
    setEditFormData({
      id: product.id,
      name: product.name,
      category: product.category || '',
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl
    });
  }

  // handleUpdate sendet die geänderten Werte an die API, beendet den Bearbeitungsmodus
  // und lädt die Produktliste neu, damit die Änderungen sofort sichtbar sind.
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