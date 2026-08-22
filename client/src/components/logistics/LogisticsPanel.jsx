import React, { useState } from 'react';
import {
  Building,
  Plane,
  Train,
  Car,
  Bus,
  Ship,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useTrips } from '../../context/TripContext';
import { budgetService } from '../../services/budgetService';

const TRANSPORT_ICONS = {
  'Flight': Plane,
  'Train / Rail': Train,
  'Car / Rental': Car,
  'Bus': Bus,
  'Ferry': Ship,
  'Other': Car
};

export function LogisticsPanel({ trip }) {
  const {
    setStopAccommodation,
    addTransport,
    updateTransport,
    deleteTransport,
    toggleTransportBooking,
    showToast
  } = useTrips();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState('stays'); // 'stays' | 'transits'

  // Accommodation edit modal state
  const [editingStopAcc, setEditingStopAcc] = useState(null);
  const [hotelForm, setHotelForm] = useState({
    hotelName: '',
    checkInDate: '',
    checkOutDate: '',
    confirmationCode: '',
    cost: '',
    currency: trip?.currency || 'INR',
    address: '',
    isConfirmed: false,
    notes: ''
  });

  // Transport modal state
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [transportForm, setTransportForm] = useState({
    mode: 'Train / Rail',
    fromCity: '',
    toCity: '',
    carrier: '',
    referenceNumber: '',
    departureTime: '',
    arrivalTime: '',
    cost: '',
    currency: trip?.currency || 'INR',
    isBooked: false,
    notes: ''
  });

  if (!trip) return null;

  const stops = trip.stops || [];
  const transports = trip.transports || [];

  // Open Accommodation editor
  const handleOpenAccEdit = (stop) => {
    setEditingStopAcc(stop);
    const acc = stop.accommodation || {};
    setHotelForm({
      hotelName: acc.hotelName || '',
      checkInDate: acc.checkInDate || stop.arrivalDate || '',
      checkOutDate: acc.checkOutDate || stop.departureDate || '',
      confirmationCode: acc.confirmationCode || '',
      cost: acc.cost !== undefined ? acc.cost : '',
      currency: acc.currency || trip.currency || 'INR',
      address: acc.address || '',
      isConfirmed: Boolean(acc.isConfirmed),
      notes: acc.notes || ''
    });
  };

  // Save Accommodation
  const handleSaveAccommodation = async (e) => {
    e.preventDefault();
    if (!editingStopAcc) return;
    try {
      await setStopAccommodation(trip.id, editingStopAcc.id, hotelForm);
      setEditingStopAcc(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Open Transport Modal (New or Edit)
  const handleOpenTransportModal = (transport = null) => {
    if (transport) {
      setEditingTransport(transport);
      setTransportForm({
        mode: transport.mode || 'Train / Rail',
        fromCity: transport.fromCity || '',
        toCity: transport.toCity || '',
        carrier: transport.carrier || '',
        referenceNumber: transport.referenceNumber || '',
        departureTime: transport.departureTime || '',
        arrivalTime: transport.arrivalTime || '',
        cost: transport.cost !== undefined ? transport.cost : '',
        currency: transport.currency || trip.currency || 'INR',
        isBooked: Boolean(transport.isBooked),
        notes: transport.notes || ''
      });
    } else {
      setEditingTransport(null);
      const defaultFrom = stops[0]?.cityName || '';
      const defaultTo = stops[1]?.cityName || '';
      setTransportForm({
        mode: 'Train / Rail',
        fromCity: defaultFrom,
        toCity: defaultTo,
        carrier: '',
        referenceNumber: '',
        departureTime: '',
        arrivalTime: '',
        cost: '',
        currency: trip.currency || 'INR',
        isBooked: false,
        notes: ''
      });
    }
    setIsTransportModalOpen(true);
  };

  // Save Transport
  const handleSaveTransport = async (e) => {
    e.preventDefault();
    try {
      if (editingTransport) {
        await updateTransport(trip.id, editingTransport.id, transportForm);
      } else {
        await addTransport(trip.id, transportForm);
      }
      setIsTransportModalOpen(false);
      setEditingTransport(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab Switcher & Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('stays')}
            className={`btn btn-sm ${activeTab === 'stays' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ gap: '6px' }}
          >
            <Building size={15} />
            <span>Stays & Accommodations ({stops.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transits')}
            className={`btn btn-sm ${activeTab === 'transits' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ gap: '6px' }}
          >
            <Train size={15} />
            <span>Transit & Logistics ({transports.length})</span>
          </button>
        </div>

        {activeTab === 'transits' && (
          <button
            type="button"
            onClick={() => handleOpenTransportModal()}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add Transit Segment</span>
          </button>
        )}
      </div>

      {/* --- STAYS & ACCOMMODATIONS TAB --- */}
      {activeTab === 'stays' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {stops.map((stop, sIdx) => {
            const acc = stop.accommodation;
            const hasAcc = acc && acc.hotelName;

            return (
              <div
                key={stop.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  border: hasAcc ? '1px solid rgba(56, 189, 248, 0.3)' : '1px dashed var(--border-subtle)',
                  background: hasAcc ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: hasAcc ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: hasAcc ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: hasAcc ? '#38bdf8' : 'var(--text-muted)'
                      }}
                    >
                      <Building size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Stop {sIdx + 1}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>
                          {stop.cityName}, {stop.country}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        {stop.arrivalDate ? `${stop.arrivalDate} ➔ ${stop.departureDate || 'Ongoing'}` : 'Dates not scheduled'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAccEdit(stop)}
                    className={`btn btn-sm ${hasAcc ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ gap: '6px' }}
                  >
                    <Edit2 size={13} />
                    <span>{hasAcc ? 'Edit Stay' : '+ Add Hotel / Resort'}</span>
                  </button>
                </div>

                {/* Hotel Details Card */}
                {hasAcc ? (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '1.1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Hotel / Accommodation
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                        {acc.hotelName}
                      </div>
                      {acc.address && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="#38bdf8" />
                          <span>{acc.address}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Confirmation Code
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8', marginTop: '2px', fontFamily: 'monospace' }}>
                        {acc.confirmationCode || 'Pending confirmation'}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: acc.isConfirmed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: acc.isConfirmed ? '#34d399' : '#fbbf24',
                            fontWeight: 600,
                            border: `1px solid ${acc.isConfirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                          }}
                        >
                          {acc.isConfirmed ? '✓ Confirmed Booking' : '⏳ Reservation Pending'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Estimated Cost
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                        {budgetService.formatCurrency(acc.cost || 0, acc.currency || trip.currency)}
                      </div>
                      {acc.notes && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          "{acc.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    No hotel or accommodation logged for {stop.cityName}. Click "+ Add Hotel / Resort" to record your reservation.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- TRANSIT & LOGISTICS TAB --- */}
      {activeTab === 'transits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transports.length === 0 ? (
            <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#38bdf8' }}>
                <Train size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#ffffff' }}>No Transit Logged Yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                Keep track of train routes (e.g. Vande Bharat Express), flights, road trips, and ferry bookings between cities.
              </p>
              <button
                type="button"
                onClick={() => handleOpenTransportModal()}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <Plus size={15} />
                <span>Add First Transit Leg</span>
              </button>
            </div>
          ) : (
            transports.map((trn) => {
              const IconComponent = TRANSPORT_ICONS[trn.mode] || Train;

              return (
                <div
                  key={trn.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    border: trn.isBooked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: trn.isBooked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          border: `1px solid ${trn.isBooked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: trn.isBooked ? '#34d399' : '#38bdf8'
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {trn.mode}
                          </span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                            {trn.fromCity || 'Origin'} <span style={{ color: '#38bdf8' }}>➔</span> {trn.toCity || 'Destination'}
                          </span>
                        </div>
                        {trn.carrier && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            Carrier: <strong style={{ color: '#e2e8f0' }}>{trn.carrier}</strong>
                            {trn.referenceNumber && ` (Ref: ${trn.referenceNumber})`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => toggleTransportBooking(trip.id, trn.id)}
                        className={`btn btn-sm ${trn.isBooked ? 'btn-secondary' : 'btn-primary'}`}
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          background: trn.isBooked ? 'rgba(16, 185, 129, 0.2)' : undefined,
                          borderColor: trn.isBooked ? 'rgba(16, 185, 129, 0.4)' : undefined,
                          color: trn.isBooked ? '#34d399' : undefined
                        }}
                      >
                        {trn.isBooked ? '✓ Booked' : 'Mark Booked'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenTransportModal(trn)}
                        className="btn btn-ghost btn-sm btn-icon"
                        title="Edit Transit"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTransport(trip.id, trn.id)}
                        className="btn btn-ghost btn-sm btn-icon"
                        title="Delete Transit"
                      >
                        <Trash2 size={14} color="#fca5a5" />
                      </button>
                    </div>
                  </div>

                  {/* Transit Metrics row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      fontSize: '0.8rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      flexWrap: 'wrap'
                    }}
                  >
                    {trn.departureTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                        <Clock size={13} color="#38bdf8" />
                        <span>Departs: <strong style={{ color: '#ffffff' }}>{trn.departureTime}</strong></span>
                      </div>
                    )}
                    {trn.arrivalTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                        <Clock size={13} color="#34d399" />
                        <span>Arrives: <strong style={{ color: '#ffffff' }}>{trn.arrivalTime}</strong></span>
                      </div>
                    )}
                    {Number(trn.cost) > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        <span>Fare:</span>
                        <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>
                          {budgetService.formatCurrency(trn.cost, trn.currency || trip.currency)}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* --- ACCOMMODATION MODAL --- */}
      {editingStopAcc && (
        <div className="modal-overlay" onClick={() => setEditingStopAcc(null)} style={{ zIndex: 1300 }}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '95%' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <Building size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Stay in {editingStopAcc.cityName}</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Log hotel, resort, or homestay booking details
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveAccommodation} className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Hotel / Resort Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The House of MG / Sea View Resort"
                    value={hotelForm.hotelName}
                    onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Check-In Date</label>
                    <input
                      type="date"
                      value={hotelForm.checkInDate}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkInDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Check-Out Date</label>
                    <input
                      type="date"
                      value={hotelForm.checkOutDate}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkOutDate: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Booking Reference / Code</label>
                    <input
                      type="text"
                      placeholder="e.g. BK-9821-DEL"
                      value={hotelForm.confirmationCode}
                      onChange={(e) => setHotelForm({ ...hotelForm, confirmationCode: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Cost ({hotelForm.currency})</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={hotelForm.cost}
                      onChange={(e) => setHotelForm({ ...hotelForm, cost: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Property Address / Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Opp Sidi Saiyyed Mosque, Old City"
                    value={hotelForm.address}
                    onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <input
                    type="checkbox"
                    id="isConfirmedStay"
                    checked={hotelForm.isConfirmed}
                    onChange={(e) => setHotelForm({ ...hotelForm, isConfirmed: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                  <label htmlFor="isConfirmedStay" style={{ fontSize: '0.85rem', color: '#ffffff', cursor: 'pointer', margin: 0 }}>
                    Booking is confirmed & paid
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setEditingStopAcc(null)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Stay Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TRANSPORT MODAL --- */}
      {isTransportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsTransportModalOpen(false)} style={{ zIndex: 1300 }}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '540px', width: '95%' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                  <Train size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                    {editingTransport ? 'Edit Transit Segment' : 'Add Inter-City Transit'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Flight, train, car rental, or bus transfer
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveTransport} className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mode of Travel</label>
                  <select
                    value={transportForm.mode}
                    onChange={(e) => setTransportForm({ ...transportForm, mode: e.target.value })}
                    className="form-select"
                  >
                    <option value="Train / Rail">🚆 Train / Rail (e.g. Vande Bharat / Shinkansen)</option>
                    <option value="Flight">✈️ Flight (Domestic / International)</option>
                    <option value="Car / Rental">🚗 Car / Cab / Rental Drive</option>
                    <option value="Bus">🚌 Express Bus</option>
                    <option value="Ferry">⛴️ Ferry / Boat</option>
                    <option value="Other">🚐 Other Shuttle</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">From (Departure City) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ahmedabad (ADI)"
                      value={transportForm.fromCity}
                      onChange={(e) => setTransportForm({ ...transportForm, fromCity: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To (Arrival City) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vapi / Daman"
                      value={transportForm.toCity}
                      onChange={(e) => setTransportForm({ ...transportForm, toCity: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Carrier / Train / Flight #</label>
                    <input
                      type="text"
                      placeholder="e.g. Vande Bharat (20902)"
                      value={transportForm.carrier}
                      onChange={(e) => setTransportForm({ ...transportForm, carrier: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PNR / Ticket Reference</label>
                    <input
                      type="text"
                      placeholder="e.g. PNR-84291048"
                      value={transportForm.referenceNumber}
                      onChange={(e) => setTransportForm({ ...transportForm, referenceNumber: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Departure Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 06:10 AM"
                      value={transportForm.departureTime}
                      onChange={(e) => setTransportForm({ ...transportForm, departureTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Arrival Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:45 AM"
                      value={transportForm.arrivalTime}
                      onChange={(e) => setTransportForm({ ...transportForm, arrivalTime: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Fare Cost ({transportForm.currency})</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={transportForm.cost}
                    onChange={(e) => setTransportForm({ ...transportForm, cost: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <input
                    type="checkbox"
                    id="isBookedTransit"
                    checked={transportForm.isBooked}
                    onChange={(e) => setTransportForm({ ...transportForm, isBooked: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                  <label htmlFor="isBookedTransit" style={{ fontSize: '0.85rem', color: '#ffffff', cursor: 'pointer', margin: 0 }}>
                    Transit tickets already booked & confirmed
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsTransportModalOpen(false)} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingTransport ? 'Update Transit' : 'Add Transit Leg'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
