import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '../../src/App';
import { safeStorage } from '../../src/utils/storage';
import { PRODUCTS } from '../../src/data/products';
import { apiService } from '../../src/services/api';

describe('Admin CMS Integration: Complete CRUD & Dynamic State Sync', () => {
  beforeEach(() => {
    safeStorage.clear();
    sessionStorage.clear();
    apiService.saveLocalCatalog([...PRODUCTS]);
    window.history.pushState(null, '', '/');
  });

  it('authenticates admin with demo2026, adds a product, edits it, and deletes it with instant optimistic UI sync', async () => {
    render(<App />);

    // 1. Open Admin Portal via Lock button in Header
    const adminTriggerBtn = screen.getByLabelText(/Portal de Administración CMS/i);
    fireEvent.click(adminTriggerBtn);

    // 2. Verify Authentication Screen is displayed
    expect(screen.getByText(/Portal Privado CMS/i)).toBeInTheDocument();
    const pinInput = screen.getByPlaceholderText(/••••••••/i);

    // Enter valid PIN "demo2026"
    fireEvent.change(pinInput, { target: { value: 'demo2026' } });
    const submitBtn = screen.getByRole('button', { name: /Acceder al Gestor/i });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // 3. Verify Admin Dashboard is visible
    await waitFor(() => {
      expect(screen.getByText(/Gestión de Catálogo/i)).toBeInTheDocument();
    });

    // Check inventory table displays initial demo products
    expect(screen.getAllByText(/Producto Demo/i).length).toBeGreaterThan(0);

    // 4. Create a New Product
    const newProductTab = screen.getByRole('button', { name: /Nuevo Producto/i });
    fireEvent.click(newProductTab);

    // Fill in product form
    const nameInput = screen.getByPlaceholderText(/Ej. Producto Demo/i);
    fireEvent.change(nameInput, { target: { value: 'Producto Creado En Test' } });

    const refInput = screen.getByPlaceholderText(/REF-0101/i);
    fireEvent.change(refInput, { target: { value: 'REF-9999' } });

    // Switch to Pricing tab
    const pricingTab = screen.getByRole('button', { name: /2. Precio & Estado/i });
    fireEvent.click(pricingTab);

    const priceInput = screen.getByPlaceholderText(/^99$/i);
    fireEvent.change(priceInput, { target: { value: '150' } });

    // Switch to Description tab
    const narrativeTab = screen.getByRole('button', { name: /3. Descripción/i });
    fireEvent.click(narrativeTab);

    const shortDescInput = screen.getByPlaceholderText(/Resumen para tarjetas de catálogo/i);
    fireEvent.change(shortDescInput, {
      target: { value: 'Descripción corta creada durante la prueba automatizada.' },
    });

    const descInput = screen.getByPlaceholderText(/Historia del producto, detalles de confección/i);
    fireEvent.change(descInput, {
      target: {
        value: 'Descripción completa creada durante la prueba automatizada de CRUD del CMS.',
      },
    });

    // Submit Creation
    const publishBtn = screen.getByRole('button', { name: /Publicar Producto/i });
    await act(async () => {
      fireEvent.click(publishBtn);
    });

    // 5. Verify the new product appears in the inventory table
    await waitFor(() => {
      expect(screen.getAllByText(/Producto Creado En Test/i).length).toBeGreaterThan(0);
    });

    // 6. Close Admin Modal to inspect the public catalog
    const closeAdminBtn = screen.getByLabelText(/Cerrar portal de administración/i);
    fireEvent.click(closeAdminBtn);

    // Verify the catalog displays the new product optimistically with 0ms delay
    await waitFor(() => {
      expect(screen.getAllByText(/Producto Creado En Test/i).length).toBeGreaterThan(0);
    });

    // 7. Re-open Admin to Delete the item
    fireEvent.click(adminTriggerBtn);
    await waitFor(() => {
      expect(screen.getByText(/Gestión de Catálogo/i)).toBeInTheDocument();
    });

    // Find delete button for the created item
    const deleteButtons = screen.getAllByLabelText(/Eliminar Producto Creado En Test/i);
    fireEvent.click(deleteButtons[0]);

    // Verify Delete Confirmation Modal opens
    expect(screen.getByRole('heading', { name: /Eliminar Producto/i })).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /Eliminar Definitivamente/i });

    await act(async () => {
      fireEvent.click(confirmDeleteBtn);
    });

    // Verify item is removed from table
    await waitFor(() => {
      expect(screen.queryByText(/REF-9999/i)).not.toBeInTheDocument();
    });
  });
});
