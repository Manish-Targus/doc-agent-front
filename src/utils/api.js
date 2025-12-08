export const API_BASE_URL = 'http://localhost:9002';

export const api = {
    upload: async (file, collectionName) => {
        const formData = new FormData();

        // Append file FIRST (matching user's curl command)
        formData.append('files', file);

        // Use provided collection name or fallback to sanitized filename
        const finalCollectionName = collectionName || file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_");

        formData.append('scope', 'default');
        formData.append('collection', finalCollectionName);
        formData.append('recreate', 'false');

        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', response.status, errorText);
            throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }
        return response.json();
    },
    getCollections: async () => {
        const response = await fetch(`${API_BASE_URL}/collections`);
        if (!response.ok) throw new Error('Failed to fetch collections');
        return response.json();
    },
    getCollectionInfo: async (name) => {
        const response = await fetch(`${API_BASE_URL}/collection/${name}`);
        if (!response.ok) throw new Error('Failed to fetch collection info');
        return response.json();
    },
    deleteCollection: async (name) => {
        const response = await fetch(`${API_BASE_URL}/collection/${name}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Delete failed');
        return response.json();
    },
    chat: async (query, collectionName, k = 6, scope = "default", history = []) => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                k,
                scope,
                collection: collectionName,
                history
            }),
        });
        if (!response.ok) throw new Error('Chat failed');
        return response.json();
    },
    generateRfpSummary: async (collectionName) => {
        const response = await fetch(`${API_BASE_URL}/generate_rfp_summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection_name: collectionName }),
        });
        if (!response.ok) throw new Error('Summary generation failed');
        return response.json();
    },
    search: async (query, collectionName) => {
        const url = new URL(`${API_BASE_URL}/search`);
        url.searchParams.append('query', query);
        if (collectionName) url.searchParams.append('collection_name', collectionName);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
    }
};
