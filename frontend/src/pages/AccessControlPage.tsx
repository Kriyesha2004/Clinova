import React, { useEffect, useState } from 'react';
import { ArrowLeft, Lock, Plus, Edit2, Trash2, Shield, AlertCircle, HeartPulse, Upload, Image as ImageIcon, X, Loader } from 'lucide-react';
import { dengueContentService } from '../services/dengueContentService';
import type { DengueContentItem } from '../services/dengueContentService';

interface AccessControlPageProps {
  onBack: () => void;
}

export default function AccessControlPage({ onBack }: AccessControlPageProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'permissions'>('content');
  const [contentList, setContentList] = useState<DengueContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DengueContentItem | null>(null);
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'prevention' | 'safety' | 'help'>('prevention');
  const [formContent, setFormContent] = useState<string>('');
  const [formImage, setFormImage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dengueContentService.getAllContent();
      setContentList(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('prevention');
    setFormContent('');
    setFormImage('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: DengueContentItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContent(item.content);
    setFormImage(item.image || '');
    setIsFormOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormImage('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Title and Content are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload: DengueContentItem = {
        title: formTitle,
        category: formCategory,
        content: formContent,
        image: formImage
      };

      if (editingItem && editingItem._id) {
        await dengueContentService.updateContent(editingItem._id, payload);
      } else {
        await dengueContentService.createContent(payload);
      }

      setIsFormOpen(false);
      fetchContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await dengueContentService.deleteContent(id);
        fetchContent();
      } catch (err: any) {
        alert(err.message || 'Failed to delete content');
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prevention':
        return <Shield size={16} color="#00e5c3" />;
      case 'safety':
        return <AlertCircle size={16} color="#f59e0b" />;
      case 'help':
        return <HeartPulse size={16} color="#f87171" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prevention': return 'Prevention';
      case 'safety': return 'Safety';
      case 'help': return 'Help & Medical';
      default: return 'General';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prevention': return '#00e5c3';
      case 'safety': return '#f59e0b';
      case 'help': return '#f87171';
      default: return '#818cf8';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>Access Control & Content Management</h1>
      </header>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('content')}
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === 'content' ? '3px solid #00e5c3' : '3px solid transparent',
            color: activeTab === 'content' ? '#ffffff' : '#94a3b8',
            backgroundColor: activeTab === 'content' ? 'rgba(0, 229, 195, 0.05)' : 'transparent',
          }}
        >
          Dengue Resource Hub Manager
        </button>
        <button 
          onClick={() => setActiveTab('permissions')}
          style={{
            ...styles.tabButton,
            borderBottom: activeTab === 'permissions' ? '3px solid #00e5c3' : '3px solid transparent',
            color: activeTab === 'permissions' ? '#ffffff' : '#94a3b8',
            backgroundColor: activeTab === 'permissions' ? 'rgba(0, 229, 195, 0.05)' : 'transparent',
          }}
        >
          System Access & Permissions
        </button>
      </div>

      <main style={styles.main}>
        {activeTab === 'content' && (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Manage Resource Material</h2>
                <p style={styles.sectionSubtitle}>Add, edit, or delete public-facing dengue prevention, safety guidelines, and emergency contacts.</p>
              </div>
              <button style={styles.addBtn} onClick={handleOpenAddForm}>
                <Plus size={18} />
                Add Resource
              </button>
            </div>

            {/* Error state */}
            {error && (
              <div style={styles.errorAlert}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div style={styles.loadingBox}>
                <div style={styles.spinner} />
                <p style={{ marginTop: '16px', color: '#94a3b8' }}>Syncing with database...</p>
              </div>
            ) : contentList.length === 0 ? (
              <div style={styles.emptyBox}>
                <ImageIcon size={48} color="#475569" />
                <h3 style={{ marginTop: '16px', fontSize: '18px' }}>No Resource Postings Found</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>Click "Add Resource" to populate the Dengue Resource Page.</p>
              </div>
            ) : (
              <div style={styles.contentTable}>
                {contentList.map((item) => (
                  <div key={item._id} style={styles.tableRow}>
                    <div style={styles.rowVisual}>
                      {item.image ? (
                        <img src={item.image} alt={item.title} style={styles.rowThumbnail} />
                      ) : (
                        <div style={styles.rowThumbnailPlaceholder}>
                          <ImageIcon size={18} color="#475569" />
                        </div>
                      )}
                    </div>
                    <div style={styles.rowInfo}>
                      <div style={styles.rowMeta}>
                        <span 
                          style={{
                            ...styles.rowCategoryBadge,
                            color: getCategoryColor(item.category),
                            backgroundColor: `${getCategoryColor(item.category)}14`,
                            borderColor: `${getCategoryColor(item.category)}33`,
                          }}
                        >
                          {getCategoryIcon(item.category)}
                          {getCategoryLabel(item.category)}
                        </span>
                        <span style={styles.rowDate}>
                          Updated {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <h4 style={styles.rowTitle}>{item.title}</h4>
                      <p style={styles.rowSnippet}>{item.content.substring(0, 160)}...</p>
                    </div>
                    <div style={styles.rowActions}>
                      <button style={styles.actionEditBtn} onClick={() => handleOpenEditForm(item)} title="Edit Resource">
                        <Edit2 size={16} />
                      </button>
                      <button style={styles.actionDeleteBtn} onClick={() => handleDelete(item._id)} title="Delete Resource">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Form Overlay */}
            {isFormOpen && (
              <div style={styles.modalOverlay}>
                <div style={styles.modalContent}>
                  <div style={styles.modalHeader}>
                    <h3 style={styles.modalTitle}>
                      {editingItem ? 'Edit Dengue Resource' : 'Add New Dengue Resource'}
                    </h3>
                    <button style={styles.closeBtn} onClick={() => setIsFormOpen(false)}>
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Title</label>
                      <input 
                        type="text" 
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Draining Stagnant Water Safely" 
                        required
                        style={styles.formInput}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Category</label>
                      <select 
                        value={formCategory} 
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        style={styles.formSelect}
                      >
                        <option value="prevention">Prevention (How to prevent dengue)</option>
                        <option value="safety">Safety (How to be safe in infected areas)</option>
                        <option value="help">Help (Basic instructions & emergency details)</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Instructional Content / Guidelines</label>
                      <textarea 
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        placeholder="Describe the instructions in detail. Use linebreaks to separate paragraphs." 
                        required
                        rows={6}
                        style={styles.formTextarea}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Illustration / Image Attachment</label>
                      <div style={styles.fileUploadContainer}>
                        {formImage ? (
                          <div style={styles.imagePreviewContainer}>
                            <img src={formImage} alt="Preview" style={styles.imagePreview} />
                            <button type="button" style={styles.removeImageBtn} onClick={handleRemoveImage}>
                              <X size={14} /> Remove
                            </button>
                          </div>
                        ) : (
                          <label style={styles.uploadBox}>
                            <Upload size={24} color="#64748b" />
                            <span style={styles.uploadText}>Click to upload image (Max 2MB)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange} 
                              style={{ display: 'none' }} 
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    <div style={styles.modalFooter}>
                      <button 
                        type="button" 
                        style={styles.cancelBtn} 
                        onClick={() => setIsFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        style={styles.submitBtn}
                      >
                        {submitting ? (
                          <>
                            <Loader size={16} className="spin" style={{ marginRight: '6px' }} />
                            Saving...
                          </>
                        ) : editingItem ? 'Save Changes' : 'Publish Resource'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'permissions' && (
          <div style={styles.content}>
            <div style={styles.card}>
              <Lock size={48} color="#00e5c3" />
              <h2 style={styles.heading}>Access Control Management</h2>
              <p style={styles.description}>Manage user access and system configuration permissions</p>
              
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Active Users</h3>
                <div style={styles.list}>
                  <div style={styles.userItem}>
                    <span style={styles.userName}>Dr. Smith</span>
                    <span style={styles.role}>Administrator</span>
                  </div>
                  <div style={styles.userItem}>
                    <span style={styles.userName}>Dr. Johnson</span>
                    <span style={styles.role}>Editor</span>
                  </div>
                  <div style={styles.userItem}>
                    <span style={styles.userName}>Nurse Brown</span>
                    <span style={styles.role}>Viewer</span>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Permissions</h3>
                <div style={styles.permissionList}>
                  <div style={styles.permission}>
                    <input type="checkbox" defaultChecked />
                    <span>Read Access</span>
                  </div>
                  <div style={styles.permission}>
                    <input type="checkbox" defaultChecked />
                    <span>Write Access</span>
                  </div>
                  <div style={styles.permission}>
                    <input type="checkbox" />
                    <span>Delete Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#030d16',
    color: '#ffffff',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    paddingBottom: '60px',
  },
  header: {
    backgroundColor: 'rgba(10, 25, 41, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backdropFilter: 'blur(10px)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
    color: '#3b82f6',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0 40px',
  },
  tabButton: {
    padding: '16px 24px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  main: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#00e5c3',
    border: 'none',
    borderRadius: '8px',
    color: '#030d16',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'transform 0.2s, opacity 0.2s',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    color: '#f87171',
    fontSize: '14.5px',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  spinner: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '3px solid rgba(0, 229, 195, 0.1)',
    borderTopColor: '#00e5c3',
    animation: 'spin 1s linear infinite',
  },
  emptyBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    backgroundColor: 'rgba(10, 25, 41, 0.2)',
    border: '1px dashed rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    textAlign: 'center',
  },
  contentTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  rowVisual: {
    flexShrink: 0,
  },
  rowThumbnail: {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  rowThumbnailPlaceholder: {
    width: '80px',
    height: '60px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: {
    flex: 1,
  },
  rowMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
  },
  rowCategoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    border: '1px solid transparent',
  },
  rowDate: {
    fontSize: '11px',
    color: '#64748b',
  },
  rowTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
  },
  rowSnippet: {
    fontSize: '13px',
    color: '#94a3b8',
    margin: '4px 0 0 0',
    lineHeight: 1.5,
  },
  rowActions: {
    display: 'flex',
    gap: '10px',
  },
  actionEditBtn: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    color: '#94a3b8',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  actionDeleteBtn: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },

  // Modal CSS
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    backgroundColor: '#0a1929',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
    color: '#ffffff',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  formInput: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14.5px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  formSelect: {
    padding: '12px 16px',
    backgroundColor: '#0a1929',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14.5px',
    outline: 'none',
    cursor: 'pointer',
  },
  formTextarea: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14.5px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: 1.6,
  },
  fileUploadContainer: {
    marginTop: '4px',
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  uploadText: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '8px',
  },
  imagePreviewContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
  },
  imagePreview: {
    width: '100px',
    height: '75px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  removeImageBtn: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '20px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#00e5c3',
    border: 'none',
    borderRadius: '8px',
    color: '#030d16',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Permissions view overrides (from original implementation)
  content: {
    display: 'flex',
    gap: '20px',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(10, 25, 41, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    marginTop: '20px',
  },
  description: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '30px',
  },
  section: {
    textAlign: 'left',
    marginTop: '30px',
    marginBottom: '30px',
  },
  sectionTitle2: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '8px',
  },
  userName: {
    fontWeight: '500',
  },
  role: {
    color: '#94a3b8',
    fontSize: '12px',
  },
  permissionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  permission: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'rgba(10, 25, 41, 0.3)',
    borderRadius: '8px',
  },
};
