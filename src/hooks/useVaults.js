import { useState } from 'react';
import { getFromStorage, setToStorage } from '../utils/storage';

export const useVaults = (userId) => {
  const [vaults, setVaults] = useState(() => {
    if (!userId) return [];
    const allVaults = getFromStorage('vaults') || [];
    return allVaults.filter(v => v.createdBy === userId);
  });

  const createVault = (vaultData) => {
    if (!vaultData.name?.trim()) {
      throw new Error('Vault name is required');
    }

    const allVaults = getFromStorage('vaults') || [];
    
    const newVault = {
      id: `vault-${Date.now()}`,
      createdBy: userId,
      name: vaultData.name.trim(),
      description: vaultData.description?.trim() || '',
      resources: vaultData.resources || [],
      richNotes: vaultData.richNotes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allVaults.push(newVault);
    setToStorage('vaults', allVaults);
    setVaults(prev => [newVault, ...prev]);

    return newVault;
  };

  const updateVault = (vaultId, vaultData) => {
    const allVaults = getFromStorage('vaults') || [];
    const index = allVaults.findIndex(v => v.id === vaultId);

    if (index === -1) throw new Error('Vault not found');

    const updatedVault = {
      ...allVaults[index],
      ...vaultData,
      updatedAt: new Date().toISOString()
    };

    allVaults[index] = updatedVault;
    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? updatedVault : v));

    return updatedVault;
  };

  const deleteVault = (vaultId) => {
    const allVaults = getFromStorage('vaults') || [];
    const filtered = allVaults.filter(v => v.id !== vaultId);
    
    setToStorage('vaults', filtered);
    setVaults(prev => prev.filter(v => v.id !== vaultId));
  };

  const getVaultById = (vaultId) => {
    return vaults.find((vault) => vault.id === vaultId) || null;
  };

  const addResource = (vaultId, resource) => {
    if (!resource.title?.trim() || !resource.url?.trim()) {
      throw new Error('Title and URL are required');
    }

    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);

    if (!vault) throw new Error('Vault not found');

    const newResource = {
      id: `resource-${Date.now()}`,
      title: resource.title.trim(),
      url: resource.url.trim(),
      createdAt: new Date().toISOString(),
      notes: []
    };

    vault.resources.push(newResource);
    vault.updatedAt = new Date().toISOString();
    
    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));

    return newResource;
  };

  const deleteResource = (vaultId, resourceId) => {
    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);

    if (!vault) throw new Error('Vault not found');

    vault.resources = vault.resources.filter(r => r.id !== resourceId);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));
  };

  const addNote = (vaultId, resourceId, noteContent) => {
    if (!noteContent?.trim()) {
      throw new Error('Note cannot be empty');
    }

    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);
    const resource = vault?.resources.find(r => r.id === resourceId);

    if (!resource) throw new Error('Resource not found');

    const newNote = {
      id: `note-${Date.now()}`,
      content: noteContent.trim(),
      createdAt: new Date().toISOString()
    };

    resource.notes.push(newNote);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));

    return newNote;
  };

  const deleteNote = (vaultId, resourceId, noteId) => {
    const allVaults = getFromStorage('vaults') || [];
    const vault = allVaults.find(v => v.id === vaultId);
    const resource = vault?.resources.find(r => r.id === resourceId);

    if (!resource) throw new Error('Resource not found');

    resource.notes = resource.notes.filter(n => n.id !== noteId);
    vault.updatedAt = new Date().toISOString();

    setToStorage('vaults', allVaults);
    setVaults(prev => prev.map(v => v.id === vaultId ? vault : v));
  };

  return {
    vaults,
    getVaultById,
    createVault,
    updateVault,
    deleteVault,
    addResource,
    deleteResource,
    addNote,
    deleteNote
  };
};