import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { uploadSchoolAsset } from '../../utils/uploadHelper';

interface AssetUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  placeholder?: string;
  isImage?: boolean;
}

export function AssetUploadField({
  label,
  value,
  onChange,
  folder,
  accept = 'image/*',
  placeholder = 'https://... অথবা নিচ থেকে ফাইল আপলোড করুন',
  isImage = true,
}: AssetUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const res = await uploadSchoolAsset(file, folder);
      onChange(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <label className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 transition-colors">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{uploading ? 'আপলোড হচ্ছে...' : 'ফাইল আপলোড'}</span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {isImage && value && (
        <div className="mt-2 w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt={label}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
