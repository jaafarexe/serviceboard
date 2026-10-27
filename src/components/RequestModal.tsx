import React, { useState, useEffect } from 'react';
import { 
  ServiceRequest, 
  RequestStatus, 
  PriorityLevel, 
  STATUS_CONFIGS, 
  COMMON_SERVICES, 
  TIME_WINDOW_PRESETS 
} from '../types.ts';
import { getTodayString, getRelativeDateString } from '../utils/dateUtils.ts';
import { X, Calendar, Clock, DollarSign, User, Phone, Mail, FileText, Check } from 'lucide-react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialData?: ServiceRequest | null;
  defaultStatus?: RequestStatus;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultStatus = 'new',
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [timeWindow, setTimeWindow] = useState('09:00 - 11:00 AM');
  const [notes, setNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [status, setStatus] = useState<RequestStatus>(defaultStatus);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCustomerName(initialData.customerName || '');
        setPhone(initialData.phone || '');
        setEmail(initialData.email || '');
        setServiceType(initialData.serviceType || '');
        setDate(initialData.date || getTodayString());
        setTimeWindow(initialData.timeWindow || '');
        setNotes(initialData.notes || '');
        setEstimatedPrice(initialData.estimatedPrice !== undefined ? String(initialData.estimatedPrice) : '');
        setPriority(initialData.priority || 'normal');
        setStatus(initialData.status || 'new');
      } else {
        setCustomerName('');
        setPhone('');
        setEmail('');
        setServiceType('');
        setDate(getTodayString());
        setTimeWindow('09:00 - 11:00 AM');
        setNotes('');
        setEstimatedPrice('');
        setPriority('normal');
        setStatus(defaultStatus);
      }
      setErrorMsg('');
    }
  }, [isOpen, initialData, defaultStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Please enter the customer name.');
      return;
    }
    if (!serviceType.trim()) {
      setErrorMsg('Please enter or select a service type.');
      return;
    }
    if (!date) {
      setErrorMsg('Please choose a date for the request.');
      return;
    }

    const priceNum = estimatedPrice.trim() ? parseFloat(estimatedPrice) : undefined;

    onSave(
      {
        customerName: customerName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        serviceType: serviceType.trim(),
        date,
        timeWindow: timeWindow.trim() || 'Flexible',
        notes: notes.trim() || undefined,
        estimatedPrice: !isNaN(priceNum as number) ? priceNum : undefined,
        priority,
        status,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              {initialData ? 'Edit Service Request' : 'New Service Request'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {initialData
                ? 'Update customer requirements or reschedule time window'
                : 'Organize incoming work for your service schedule'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Elena Rostova or Liam Chen"
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden transition-colors"
                autoFocus
              />
            </div>
          </div>

          {/* Contact: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Phone Number (optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden font-mono text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email Address (optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Service Type with suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Service Type <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-neutral-400">Type or select suggestion</span>
            </div>
            <input
              type="text"
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="e.g. Comprehensive Bike Tune-up, Dog Walk, Cake Order..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden transition-colors"
            />
            {/* Quick Suggestions Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {COMMON_SERVICES.slice(0, 6).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setServiceType(preset)}
                  className={`text-[11px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                    serviceType === preset
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200/80'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Service Date <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDate(getTodayString())}
                    className="text-[11px] text-neutral-600 hover:text-neutral-900 underline"
                  >
                    Today
                  </button>
                  <span className="text-neutral-300">·</span>
                  <button
                    type="button"
                    onClick={() => setDate(getRelativeDateString(1))}
                    className="text-[11px] text-neutral-600 hover:text-neutral-900 underline"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>

            {/* Time Window */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Time Window <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  placeholder="e.g. 09:00 - 11:00 AM or Morning"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden"
                />
              </div>
              {/* Quick time slots */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {TIME_WINDOW_PRESETS.slice(0, 4).map((tw) => (
                  <button
                    key={tw}
                    type="button"
                    onClick={() => setTimeWindow(tw)}
                    className="text-[10px] px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded cursor-pointer"
                  >
                    {tw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Quote & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Price Quote / Estimate ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('normal')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    priority === 'normal'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    priority === 'urgent'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Pipeline Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['new', 'scheduled', 'in_progress', 'done'] as RequestStatus[]).map((st) => {
                const cfg = STATUS_CONFIGS[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {cfg.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes & Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Service Notes & Instructions
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details about the job, gate codes, parts needed, customer pickup instructions..."
                className="w-full p-3 text-sm bg-neutral-50 focus:bg-white border border-neutral-300 focus:border-neutral-900 rounded-lg focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Create Request'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
