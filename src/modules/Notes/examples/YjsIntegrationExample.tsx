import React, { useEffect, useState } from 'react';
import { YjsSyncStatusWidget } from '../components/YjsSyncStatusWidget';
import { useYjsSync } from '../hooks/useYjsSync';
import { yjsPageRepository } from '../repository/YjsPageRepository';
import { Page } from '../types/Page';
import { v4 as uuidv4 } from 'uuid';

const syncConfig = {
    cloudEndpoint: 'https://your-api-endpoint.com/api/v1',
    syncInterval: 30000, // 30 seconds
    authToken: 'your-auth-token-here'
};

export const YjsIntegrationExample: React.FC = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    const { syncPage, syncAllPages, isSyncing } = useYjsSync(syncConfig);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        try {
            const allPages = await yjsPageRepository.getPages();
            setPages(allPages);
        } catch (error) {
            console.error('Failed to load pages:', error);
        }
    };

    const createNewPage = async () => {
        const newPage: Page = {
            id: uuidv4(),
            title: 'New Page',
            content: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            order: Date.now()
        };

        try {
            await yjsPageRepository.createPage(newPage);
            await loadPages();
            setSelectedPage(newPage);
            setTitle(newPage.title);
            setContent(newPage.content || '');
        } catch (error) {
            console.error('Failed to create page:', error);
        }
    };

    const selectPage = async (page: Page) => {
        try {
            const fullPage = await yjsPageRepository.getPage(page.id);
            setSelectedPage(fullPage);
            setTitle(fullPage.title);
            setContent(fullPage.content || '');
        } catch (error) {
            console.error('Failed to load page:', error);
        }
    };

    const saveCurrentPage = async () => {
        if (!selectedPage) return;

        try {
            await yjsPageRepository.updatePage(selectedPage.id, {
                title,
                content
            });
            
            // Trigger sync for this specific page
            const updatedPage = await yjsPageRepository.getPage(selectedPage.id);
            await syncPage(updatedPage);
            
            await loadPages();
        } catch (error) {
            console.error('Failed to save page:', error);
        }
    };

    const deletePage = async (pageId: string) => {
        try {
            await yjsPageRepository.deletePage(pageId);
            await loadPages();
            
            if (selectedPage?.id === pageId) {
                setSelectedPage(null);
                setTitle('');
                setContent('');
            }
        } catch (error) {
            console.error('Failed to delete page:', error);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar with pages list */}
            <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h3>Pages</h3>
                    <button onClick={createNewPage} style={{ marginBottom: '10px' }}>
                        New Page
                    </button>
                    <button onClick={syncAllPages} disabled={isSyncing}>
                        {isSyncing ? 'Syncing...' : 'Sync All'}
                    </button>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <YjsSyncStatusWidget syncConfig={syncConfig} />
                </div>

                <div>
                    {pages.map(page => (
                        <div 
                            key={page.id}
                            style={{
                                padding: '10px',
                                margin: '5px 0',
                                border: selectedPage?.id === page.id ? '2px solid #007bff' : '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: selectedPage?.id === page.id ? '#f0f8ff' : 'white'
                            }}
                            onClick={() => selectPage(page)}
                        >
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{page.title}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                Updated: {page.updatedAt.toLocaleString()}
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage(page.id);
                                }}
                                style={{ 
                                    marginTop: '5px', 
                                    padding: '2px 8px', 
                                    fontSize: '12px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main editor area */}
            <div style={{ flex: 1, padding: '20px' }}>
                {selectedPage ? (
                    <div>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Page title"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}
                            />
                            <button 
                                onClick={saveCurrentPage}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save & Sync
                            </button>
                        </div>
                        
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Page content"
                            style={{
                                width: '100%',
                                height: 'calc(100vh - 200px)',
                                padding: '15px',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                resize: 'none',
                                fontFamily: 'monospace'
                            }}
                        />
                        
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                            Page ID: {selectedPage.id}
                        </div>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666'
                    }}>
                        Select a page to edit or create a new one
                    </div>
                )}
            </div>
        </div>
    );
};