const URL = 'http://localhost:5102/api/products';

export async function getProducts() {
    const response = await fetch(URL);

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export async function getProductById(id) {
    const response = await fetch(`${URL}/${id}`);

    if (!response.ok) {
        throw new Error('Produkt konnte nicht geladen werden');
    }

    return response.json();
}

export async function createProduct(product) {
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || 'Produkt konnte nicht erstellt werden');
    }

    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return text;
    }
    
}
export async function updateProduct(id, product) {
    const response = await fetch(`${URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || 'Produkt konnte nicht aktualisiert werden');
    }

    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return text;
    }
}
export async function deleteProduct(id) {
    const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE'
    });

    const text = await response.text();

    if (!response.ok) {
        throw new Error(text || 'Produkt konnte nicht gelöscht werden');
    }

    return text;
}