"use client";

import { useState, useEffect, useRef } from 'react';
import { 
    Search, Filter, Plus, FileText, Download, Trash2, RefreshCw, Eye, X, Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DocumentsPage() {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Upload modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadType, setUploadType] = useState('Policy');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (token) {
            fetchDocuments();
        }
    }, [token]);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/admin/documents/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Filter docs
    const filteredDocs = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        try {
            const res = await fetch(`http://localhost:8000/api/admin/documents/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setDocuments(docs => docs.filter(d => d.id !== id));
            }
        } catch (e) {
            console.error("Delete failed", e);
        }
    };

    const handleView = (doc: any) => {
        fetch(`http://localhost:8000/api/admin/documents/${doc.id}/content`, {
             headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.blob())
        .then(blob => {
            const fileURL = window.URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
        })
        .catch(err => alert("Failed to open document: " + err));
    };

    const handleUpload = async () => {
        if (!uploadFile || !uploadTitle.trim()) {
            setUploadError("Please select a file and enter a title.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('title', uploadTitle);
            formData.append('document_type', uploadType);

            const res = await fetch('http://localhost:8000/api/documents/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Upload failed');
            }

            // Success - close modal and refresh list
            setShowUploadModal(false);
            setUploadFile(null);
            setUploadTitle('');
            setUploadType('Policy');
            fetchDocuments();
        } catch (e: any) {
            setUploadError(e.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadFile(file);
            // Auto-fill title from filename if empty
            if (!uploadTitle) {
                setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-2.5 text-[var(--gray-400)]" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search documents..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--gray-300)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-50)] transition-colors">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg hover:bg-[var(--primary-blue-dark)] transition-colors shadow-sm">
                        <Plus size={18} />
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white border border-[var(--gray-200)] rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[var(--gray-50)] border-b border-[var(--gray-200)] text-[var(--gray-600)] text-sm font-medium">
                            <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                            <th className="p-4">Title</th>
                            <th className="p-4 hidden md:table-cell">Type</th>
                            <th className="p-4 hidden md:table-cell">Category</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 hidden lg:table-cell">Indexed Chunks</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--gray-100)]">
                        {isLoading ? (
                             <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading documents...</td></tr>
                        ) : filteredDocs.length === 0 ? (
                             <tr><td colSpan={7} className="p-8 text-center text-gray-500">No documents found.</td></tr>
                        ) : (
                            filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-[var(--gray-50)] group transition-colors">
                                    <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-[var(--primary-blue-light)] text-[var(--primary-blue)] flex items-center justify-center shrink-0">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--gray-900)]">{doc.title}</p>
                                                <p className="text-xs text-[var(--gray-500)] md:hidden">{doc.type || 'Policy'} • {doc.chunk_count} chunks</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell text-sm text-[var(--gray-600)]">{doc.type || 'Policy'}</td>
                                    <td className="p-4 hidden md:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {doc.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={doc.status || 'Active'} />
                                    </td>
                                    <td className="p-4 hidden lg:table-cell text-sm text-[var(--gray-600)]">{doc.chunk_count}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleView(doc)}
                                                className="p-2 text-gray-400 hover:text-[var(--primary-blue)] hover:bg-blue-50 rounded-lg" title="View">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-[var(--primary-blue)] hover:bg-blue-50 rounded-lg" title="Reindex">
                                                <RefreshCw size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-[var(--gray-500)] px-2">
                <p>Showing {filteredDocs.length} documents</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-[var(--gray-200)] rounded bg-white disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-[var(--gray-200)] rounded bg-white hover:bg-[var(--gray-50)]">Next</button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--gray-200)]">
                            <h2 className="text-lg font-semibold text-[var(--gray-900)]">Upload Document</h2>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* File Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                    uploadFile
                                        ? "border-green-300 bg-green-50"
                                        : "border-[var(--gray-300)] hover:border-[var(--primary-blue)] hover:bg-blue-50"
                                )}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                {uploadFile ? (
                                    <div className="flex items-center justify-center gap-2 text-green-700">
                                        <FileText size={24} />
                                        <span className="font-medium">{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="mx-auto text-[var(--gray-400)] mb-2" size={32} />
                                        <p className="text-[var(--gray-600)]">Click to upload or drag and drop</p>
                                        <p className="text-xs text-[var(--gray-400)] mt-1">PDF, DOCX, or TXT (max 10MB)</p>
                                    </>
                                )}
                            </div>

                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    placeholder="e.g. Employment Act 2007"
                                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Type Select */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1">
                                    Document Type
                                </label>
                                <select
                                    value={uploadType}
                                    onChange={(e) => setUploadType(e.target.value)}
                                    className="w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent outline-none bg-white"
                                >
                                    <option value="Policy">Policy Document</option>
                                    <option value="Law">Law / Statute</option>
                                    <option value="Contract">Contract Template</option>
                                    <option value="Guide">Guide / Manual</option>
                                    <option value="News">News Article</option>
                                </select>
                            </div>

                            {/* Error Message */}
                            {uploadError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {uploadError}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 p-4 border-t border-[var(--gray-200)]">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="flex-1 px-4 py-2 border border-[var(--gray-300)] text-[var(--gray-700)] rounded-lg hover:bg-[var(--gray-50)] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || !uploadFile}
                                className={cn(
                                    "flex-1 px-4 py-2 bg-[var(--primary-blue)] text-white rounded-lg transition-colors flex items-center justify-center gap-2",
                                    isUploading || !uploadFile
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-[var(--primary-blue-dark)]"
                                )}
                            >
                                {isUploading ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        Upload & Index
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Active': 'bg-green-100 text-green-700',
        'Processing': 'bg-blue-100 text-blue-700 animate-pulse',
        'Inactive': 'bg-gray-100 text-gray-600',
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            styles[status] || styles['Inactive']
        )}>
            {status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />}
            {status}
        </span>
    );
}
