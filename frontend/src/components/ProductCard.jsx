import React from 'react';

function ProductCard({ 
  product, 
  editingId, 
  editFormData, 
  handleUpdate, 
  handleEditFormChange, 
  setEditingId, 
  startEditing, 
  handleDelete, 
  backendUrl 
}) {
  const p = product;

  // Wenn diese Karte gerade bearbeitet wird, zeigen wir das Formular an
  if (editingId === p.id) {
    return (
      <div className="product-card">
        <form onSubmit={handleUpdate} className="edit-form">
          <input name="name" value={editFormData.name} onChange={handleEditFormChange} placeholder="Name" />
          <input name="category" value={editFormData.category} onChange={handleEditFormChange} placeholder="Kategorie" />
          <textarea name="description" value={editFormData.description} onChange={handleEditFormChange} placeholder="Beschreibung" />
          <input name="price" value={editFormData.price} onChange={handleEditFormChange} placeholder="Preis" />
          <input name="imageUrl" value={editFormData.imageUrl} onChange={handleEditFormChange} placeholder="Bild-Pfad" />
          <div className="card-buttons">
            <button type="submit" className="btn-save">Speichern</button>
            <button type="button" className="btn-cancel" onClick={() => setEditingId(null)}>Abbrechen</button>
          </div>
        </form>
      </div>
    );
  }

  // Normaler Anzeige-Modus der Hardware-Karte
  return (
    <div className="product-card">
      <div className="image-wrapper">
        {p.imageUrl ? (
          <img src={`${backendUrl}${p.imageUrl}`} alt={p.name} />
        ) : (
          <div className="no-image">Kein Bild</div>
        )}
        <span className="category-badge">{p.category || 'Hardware'}</span>
      </div>
      <div className="product-info">
        <h3>{p.name}</h3>
        <p className="description">{p.description}</p>
        <div className="card-footer">
          <span className="price">{p.price} €</span>
          <div className="card-buttons">
            <button onClick={() => startEditing(p)} className="btn-edit">Edit</button>
            <button onClick={() => handleDelete(p.id)} className="btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hier am Ende verpassen wir der Datei den fehlenden Default-Export!
export default ProductCard;