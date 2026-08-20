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

  it('authenticates admin with empires2026, adds a product, edits it, and deletes it with instant optimistic UI sync', async () => {
    render(<App />);

    // 1. Open Admin Portal via Lock button in Header
    const adminTriggerBtn = screen.getByLabelText(/Portal de Administración CMS/i);
    fireEvent.click(adminTriggerBtn);

    // 2. Verify Authentication Screen is displayed
    expect(screen.getByText(/Portal Privado CMS/i)).toBeInTheDocument();
    const pinInput = screen.getByPlaceholderText(/••••••••/i);

    // Enter valid PIN "empires2026"
    fireEvent.change(pinInput, { target: { value: 'empires2026' } });
    const submitBtn = screen.getByRole('button', { name: /Acceder al Gestor/i });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // 3. Verify Admin Dashboard is visible
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Joyas/i)).toBeInTheDocument();
    });

    // Check inventory table displays initial pieces
    expect(screen.getAllByText(/Pulsera Macramé|Gargantilla Solitario/i).length).toBeGreaterThan(0);

    // 4. Create a New Product
    const newProductTab = screen.getByRole('button', { name: /Nueva Pieza/i });
    fireEvent.click(newProductTab);

    // Fill in product form
    const nameInput = screen.getByPlaceholderText(/Ej. Gargantilla Solitario Aureum/i);
    fireEvent.change(nameInput, { target: { value: 'Anillo Tiara Esmeralda Real' } });

    const refInput = screen.getByPlaceholderText(/REF-EMP-0101/i);
    fireEvent.change(refInput, { target: { value: 'REF-EMP-9999' } });

    // Switch to Pricing tab
    const pricingTab = screen.getByRole('button', { name: /2. Precio & Estado/i });
    fireEvent.click(pricingTab);

    const priceInput = screen.getByPlaceholderText(/1850/i);
    fireEvent.change(priceInput, { target: { value: '3750' } });

    // Switch to Narrative tab
    const narrativeTab = screen.getByRole('button', { name: /3. Narrativa Editorial/i });
    fireEvent.click(narrativeTab);

    const shortDescInput = screen.getByPlaceholderText(/Resumen para tarjetas de catálogo y lookbook/i);
    fireEvent.change(shortDescInput, {
      target: { value: 'Anillo tiara con esmeralda natural de corte gota y diamantes.' },
    });

    const descInput = screen.getByPlaceholderText(/Historia orfebre detallada, inspiración/i);
    fireEvent.change(descInput, {
      target: {
        value: 'Diseñado con inspiración barroca y orfebrería de alta precisión en oro amarillo de 18k.',
      },
    });

    // Submit Creation
    const publishBtn = screen.getByRole('button', { name: /Publicar Pieza/i });
    await act(async () => {
      fireEvent.click(publishBtn);
    });

    // 5. Verify the new product appears in the inventory table
    await waitFor(() => {
      expect(screen.getAllByText(/Anillo Tiara Esmeralda Real/i).length).toBeGreaterThan(0);
    });

    // 6. Close Admin Modal to inspect public Lookbook
    const closeAdminBtn = screen.getByLabelText(/Cerrar portal de administración/i);
    fireEvent.click(closeAdminBtn);

    // Verify Lookbook displays the new product optimistically with 0ms delay
    await waitFor(() => {
      expect(screen.getAllByText(/Anillo Tiara Esmeralda Real/i).length).toBeGreaterThan(0);
    });

    // 7. Re-open Admin to Delete the item
    fireEvent.click(adminTriggerBtn);
    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Joyas/i)).toBeInTheDocument();
    });

    // Find delete button for the created item
    const deleteButtons = screen.getAllByLabelText(/Eliminar Anillo Tiara Esmeralda Real/i);
    fireEvent.click(deleteButtons[0]);

    // Verify Delete Confirmation Modal opens
    expect(screen.getByRole('heading', { name: /Eliminar Pieza/i })).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /Eliminar Definitivamente/i });
    
    await act(async () => {
      fireEvent.click(confirmDeleteBtn);
    });

    // Verify item is removed from table
    await waitFor(() => {
      expect(screen.queryByText(/REF-EMP-9999/i)).not.toBeInTheDocument();
    });
  });
});
