import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from 'lucide-react';
import { generateValidId, removeDocument, saveDocument } from '../../services/firestoreService';
import { AssetUploadField } from './AssetUploadField';
import { ConfirmDialog } from '../Toast';
import { toBengaliNumber } from '../AnimatedCounter';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'date' | 'image' | 'file';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  folder?: string;
  accept?: string;
}

interface AdminGenericCrudProps<T extends { id: string; isActive?: boolean; isDemo?: boolean }> {
  title: string;
  subtitle: string;
  collectionName: string;
  idPrefix: string;
  items: T[];
  fields: FieldConfig[];
  defaultValues: Record<string, unknown>;
  filterKey?: string;
  filterOptions?: string[];
  primaryField: string;
  secondaryField?: string;
  imageField?: string;
  onNotify: (type: 'success' | 'error' | 'info', text: string) => void;
}

const PAGE_SIZE = 8;

export function AdminGenericCrud<T extends { id: string; isActive?: boolean; isDemo?: boolean }>({
  title,
  subtitle,
  collectionName,
  idPrefix,
  items,
  fields,
  defaultValues,
  filterKey,
  filterOptions,
  primaryField,
  secondaryField,
  imageField,
  onNotify,
}: AdminGenericCrudProps<T>) {
  const [search, setSearch] = useState('');
  const [filterVal, setFilterVal] = useState('সকল');
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (!filterKey || filterVal === 'সকল') return true;
        return String((item as Record<string, unknown>)[filterKey] || '') === filterVal;
      })
      .filter((item) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const rec = item as Record<string, unknown>;
        return Object.values(rec).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(q)
        );
      });
  }, [items, filterKey, filterVal, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openCreate = () => {
    setIsCreating(true);
    setEditingItem({ ...defaultValues });
  };

  const openEdit = (item: T) => {
    setIsCreating(false);
    setEditingItem({ ...(item as Record<string, unknown>) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const targetId = isCreating
        ? generateValidId(idPrefix)
        : String(editingItem.id || generateValidId(idPrefix));

      const payload: Record<string, unknown> = { ...editingItem, isDemo: false };
      for (const f of fields) {
        if (f.type === 'number') {
          payload[f.key] = Number(payload[f.key] || 0);
        }
      }
      // Check if it was a demo item that doesn't exist in Firestore yet
      const wasDemoId = targetId.startsWith('demo-') || targetId.startsWith('class-') || targetId.startsWith('menu-');
      await saveDocument(collectionName, targetId, payload, isCreating ? true : wasDemoId ? undefined : false);
      onNotify('success', isCreating ? 'নতুন তথ্য সফলভাবে যুক্ত হয়েছে।' : 'তথ্য সফলভাবে হালনাগাদ হয়েছে।');
      setEditingItem(null);
    } catch (err) {
      onNotify('error', err instanceof Error ? err.message : 'সংরক্ষণে সমস্যা হয়েছে।');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: T) => {
    try {
      const nextActive = !item.isActive;
      await saveDocument(collectionName, item.id, { ...(item as Record<string, unknown>), isActive: nextActive });
      onNotify('success', nextActive ? 'আইটেমটি সক্রিয় করা হয়েছে।' : 'আইটেমটি নিষ্ক্রিয় করা হয়েছে।');
    } catch {
      onNotify('error', 'স্ট্যাটাস পরিবর্তন করা যায়নি।');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeDocument(collectionName, deleteTarget.id);
      onNotify('success', 'তথ্য সফলভাবে মুছে ফেলা হয়েছে।');
    } catch {
      onNotify('error', 'মুছে ফেলতে সমস্যা হয়েছে।');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-blue-950">{title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" /> নতুন যুক্ত করুন
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="তালিকায় খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
          />
        </div>

        {filterKey && filterOptions && (
          <select
            value={filterVal}
            onChange={(e) => {
              setFilterVal(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-blue-900"
          >
            <option value="সকল">সকল বিভাগ</option>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            কোনো তথ্য পাওয়া যায়নি। "নতুন যুক্ত করুন" বাটনে ক্লিক করে শুরু করুন।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">বিবরণ</th>
                  {secondaryField && <th className="px-4 py-3">বিভাগ / তথ্য</th>}
                  <th className="px-4 py-3">অবস্থা</th>
                  <th className="px-4 py-3 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((item) => {
                  const rec = item as Record<string, unknown>;
                  const imgSrc = imageField ? String(rec[imageField] || '') : '';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {imageField && (
                            <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                  ছবি নেই
                                </div>
                              )}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                              {String(rec[primaryField] || '')}
                            </div>
                            {item.isDemo && (
                              <span className="text-[11px] text-amber-700 font-medium">
                                নমুনা ডেমো তথ্য
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {secondaryField && (
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                          {String(rec[secondaryField] || '—')}
                        </td>
                      )}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                            item.isActive ? 'text-emerald-700' : 'text-slate-400'
                          }`}
                        >
                          {item.isActive ? (
                            <>
                              <ToggleRight className="w-5 h-5" /> সক্রিয়
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5" /> নিষ্ক্রিয়
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingItem(item)}
                            title="দেখুন"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            title="সম্পাদনা"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-900"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            title="মুছে ফেলুন"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="tabular-nums">
              পৃষ্ঠা {toBengaliNumber(safePage)} / {toBengaliNumber(totalPages)} (মোট{' '}
              {toBengaliNumber(filtered.length)}টি)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-200 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-slate-200 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 my-auto shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-display font-bold text-lg text-blue-950">
                {isCreating ? 'নতুন তথ্য যুক্ত করুন' : 'তথ্য সম্পাদনা করুন'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((f) => {
                const val = editingItem[f.key];
                if (f.type === 'image' || f.type === 'file') {
                  return (
                    <AssetUploadField
                      key={f.key}
                      label={f.label}
                      value={String(val || '')}
                      onChange={(url) => setEditingItem({ ...editingItem, [f.key]: url })}
                      folder={f.folder || collectionName}
                      accept={f.accept || (f.type === 'image' ? 'image/*' : '.pdf,.xlsx,.xls,.doc,.docx,image/*')}
                      isImage={f.type === 'image'}
                      placeholder={f.placeholder}
                    />
                  );
                }
                if (f.type === 'checkbox') {
                  return (
                    <label
                      key={f.key}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(val)}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, [f.key]: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-blue-900"
                      />
                      <span>{f.label}</span>
                    </label>
                  );
                }
                if (f.type === 'select') {
                  return (
                    <div key={f.key} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {f.label}
                      </label>
                      <select
                        value={String(val || '')}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, [f.key]: e.target.value })
                        }
                        required={f.required}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-900"
                      >
                        {(f.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (f.type === 'textarea') {
                  return (
                    <div key={f.key} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {f.label}
                      </label>
                      <textarea
                        rows={4}
                        value={String(val || '')}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, [f.key]: e.target.value })
                        }
                        required={f.required}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key} className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={val === undefined || val === null ? '' : String(val)}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, [f.key]: e.target.value })
                      }
                      required={f.required}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-60 rounded-lg"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {viewingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setViewingItem(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-blue-950">বিস্তারিত বিবরণ</h3>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <dl className="space-y-2.5 text-sm">
              {fields.map((f) => {
                const v = (viewingItem as Record<string, unknown>)[f.key];
                if (f.type === 'image' && typeof v === 'string' && v) {
                  return (
                    <div key={f.key}>
                      <dt className="text-xs text-slate-500 mb-1">{f.label}</dt>
                      <img
                        src={v}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="max-h-48 rounded-lg border border-slate-200"
                      />
                    </div>
                  );
                }
                return (
                  <div key={f.key} className="border-b border-slate-100 pb-2">
                    <dt className="text-xs text-slate-500">{f.label}</dt>
                    <dd className="text-slate-900 mt-0.5 whitespace-pre-line">
                      {typeof v === 'boolean' ? (v ? 'হ্যাঁ' : 'না') : String(v || '—')}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="তথ্য মুছে ফেলার নিশ্চিতকরণ"
        description="আপনি কি নিশ্চিত যে এই তথ্যটি স্থায়ীভাবে মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
