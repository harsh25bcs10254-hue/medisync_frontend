import React, { useEffect, useState } from 'react';
import { apiRequest, ApiError, restoreSession } from './api.js';

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  };
  const shapes = {
    cross: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    heart: <><path d="M20.8 8.6c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10A4.6 4.6 0 0 1 12 6.1a4.6 4.6 0 0 1 8.8 2.5Z" /><path d="M3.5 12h4l2-3 3 6 2-3h5" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" /></>
  };
  return <svg {...common}>{shapes[name]}</svg>;
}

function Brand({ compact = false }) {
  return (
    <a className={`brand${compact ? ' brand-compact' : ''}`} href="/" aria-label="MediSync home">
      <span className="brand-mark"><Icon name="cross" size={21} /></span>
      <span>Medi<span>Sync</span></span>
    </a>
  );
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { fullName, email, password };
      const result = await apiRequest(path, { method: 'POST', body });
      onAuthenticated(result.data.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-intro">
          <div className="intro-top">
            <Brand />
            <div className="intro-pill"><span /> Your care, in one place</div>
          </div>
          <div className="intro-copy">
            <p className="eyebrow">A healthier way forward</p>
            <h1>Good care feels<br /><span>connected.</span></h1>
            <p className="intro-description">One calm place to stay close to your care team and the people who matter most.</p>
            <div className="care-illustration" aria-hidden="true">
              <div className="illustration-glow" />
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="care-card">
                <span className="care-card-icon"><Icon name="heart" size={26} /></span>
                <div><strong>Care, made personal</strong><small>Support that stays with you</small></div>
                <span className="care-card-check">✓</span>
              </div>
              <div className="floating-note note-top"><span className="note-dot" /><span>Here for your health</span></div>
              <div className="floating-note note-bottom"><span className="note-sparkle">✳</span><span>A little more peace of mind</span></div>
              <div className="illustration-cross"><Icon name="cross" size={52} /></div>
            </div>
          </div>
          <div className="intro-footer"><Icon name="shield" size={17} /> Private by design. Focused on you.</div>
        </section>

        <section className="auth-panel" aria-label={mode === 'login' ? 'Sign in' : 'Create account'}>
          <div className="mobile-brand"><Brand compact /></div>
          <div className="form-heading">
            <div className="form-kicker"><span className="status-dot" /> YOUR PERSONAL HEALTHSPACE</div>
            <h2>{mode === 'login' ? 'Welcome back' : 'Let’s get started'}</h2>
            <p>{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Create your account and take the first step.'}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')} role="tab" aria-selected={mode === 'login'}>Sign in</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')} role="tab" aria-selected={mode === 'register'}>Create account</button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === 'register' && (
              <label className="field">
                <span>Full name</span>
                <input autoComplete="name" name="fullName" type="text" placeholder="How should we address you?" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={100} required />
              </label>
            )}
            <label className="field">
              <span>Email address</span>
              <input autoComplete="email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required />
            </label>
            <label className="field">
              <span>Password</span>
              <span className="password-input">
                <input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} name="password" type={showPassword ? 'text' : 'password'} placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={mode === 'register' ? 8 : undefined} maxLength={72} required />
                <button className="show-password" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
              </span>
              {mode === 'register' && <small className="field-hint">Use at least 8 characters.</small>}
            </label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="submit-button" type="submit" disabled={busy}>
              <span>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in to MediSync' : 'Create my account'}</span>
              {!busy && <Icon name="arrow" size={18} />}
            </button>
          </form>

          <div className="secure-note"><Icon name="lock" size={15} /><span>Your information is protected with secure, private sign-in.</span></div>
          <div className="panel-bottom">{mode === 'login' ? 'New to MediSync?' : 'Already have an account?'} <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div>
        </section>
      </div>
      <div className="auth-copyright">© 2026 MediSync <span>•</span> Thoughtful care starts here</div>
    </main>
  );
}

const patientSections = [
  { id: 'overview', label: 'Overview', icon: 'sparkle' },
  { id: 'appointments', label: 'Appointments', icon: 'calendar' },
  { id: 'records', label: 'Health records', icon: 'file' }
];
const doctorSections = [
  { id: 'overview', label: 'Overview', icon: 'sparkle' },
  { id: 'appointments', label: 'My appointments', icon: 'calendar' },
  { id: 'reports', label: 'Patient reports', icon: 'file' }
];
const adminSections = [
  { id: 'accounts', label: 'Manage accounts', icon: 'people' }
];

const recordTypes = [
  ['visit', 'Visit note'],
  ['lab', 'Lab result'],
  ['prescription', 'Prescription'],
  ['vaccination', 'Vaccination'],
  ['other', 'Other']
];

function localDateTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function localDateValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function nextAppointmentTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() < 30 ? 30 : 0, 0, 0);
  if (date.getMinutes() === 0) date.setHours(date.getHours() + 1);
  return localDateTimeValue(date);
}

function localDayRange(dateValue) {
  const start = new Date(`${dateValue}T00:00:00`);
  const nextDay = new Date(start);
  nextDay.setDate(nextDay.getDate() + 1);
  return {
    startAt: dateTimeWithOffset(`${dateValue}T00:00`),
    endAt: dateTimeWithOffset(`${localDateValue(nextDay)}T00:00`)
  };
}

function dateTimeWithOffset(value) {
  const date = new Date(value);
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const pad = (part) => String(Math.floor(Math.abs(part))).padStart(2, '0');
  const hours = pad(offset / 60);
  const minutes = pad(offset % 60);
  return `${value}:00${sign}${hours}:${minutes}`;
}

function getAvailableAppointmentTimes(dateValue, bookedSlots) {
  if (!dateValue) return [];
  const bookedTimes = new Set(bookedSlots
    .map((slot) => localDateTimeValue(new Date(slot)))
    .filter((slot) => slot.startsWith(`${dateValue}T`))
    .map((slot) => slot.slice(11, 16)));
  const now = Date.now();
  const latestAllowedTime = now + 180 * 24 * 60 * 60 * 1000;

  return Array.from({ length: 48 }, (_, index) => {
    const hour = String(Math.floor(index / 2)).padStart(2, '0');
    const minute = index % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  }).filter((time) => {
    if (bookedTimes.has(time)) return false;
    const slot = new Date(`${dateValue}T${time}`).getTime();
    return slot > now && slot <= latestAllowedTime;
  });
}

function sortAppointmentsCancelledFirst(appointments, direction = 1) {
  return [...appointments].sort((a, b) => {
    const cancellationOrder = Number(a.status === 'cancelled') - Number(b.status === 'cancelled');
    if (cancellationOrder !== 0) return cancellationOrder;
    return direction * (new Date(a.scheduledAt) - new Date(b.scheduledAt));
  });
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function formatAppointmentFee(fee, currency = 'INR') {
  if (fee === null || fee === undefined) return 'Fee not provided';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(fee);
}

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-razorpay-checkout]');
    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Secure payment checkout could not be loaded.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Secure payment checkout could not be loaded.'));
    document.body.appendChild(script);
  });
}

function Dashboard({ user, onSignOut }) {
  const isAdmin = user.role === 'hospitalAdmin' || user.role === 'superadmin';
  const name = user.fullName?.trim().split(/\s+/)[0] || 'there';
  const role = user.role?.replace(/([a-z])([A-Z])/g, '$1 $2') || 'MediSync member';
  const [section, setSection] = useState(isAdmin ? 'accounts' : 'overview');
  const [appointments, setAppointments] = useState([]);
  const [managedAccounts, setManagedAccounts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilityVersion, setAvailabilityVersion] = useState(0);
  const [records, setRecords] = useState([]);
  const [paymentConfirmation, setPaymentConfirmation] = useState(null);
  const [activeRecordAppointment, setActiveRecordAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [appointmentForm, setAppointmentForm] = useState(() => {
    const [scheduledDate] = nextAppointmentTime().split('T');
    return { doctorId: '', scheduledDate, scheduledTime: '', reason: '' };
  });
  const [recordForm, setRecordForm] = useState({ title: '', type: 'visit', recordDate: localDateValue(), provider: '', notes: '' });
  const [managedAccountForm, setManagedAccountForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'patient',
    specialty: '',
    appointmentFee: ''
  });

  useEffect(() => {
    let active = true;
    async function loadSection() {
      if (section === 'overview') return;
      setLoading(true);
      setError('');
      setNotice('');
      try {
        if (section === 'accounts' && isAdmin) {
          const result = await apiRequest('/admin/accounts');
          if (active) setManagedAccounts(result.data.accounts);
        } else if ((section === 'appointments' || section === 'reports') && user.role === 'doctor') {
          const result = await apiRequest('/appointments/doctor');
          if (active) setAppointments(result.data.appointments);
        } else if (section === 'appointments') {
          const [appointmentResult, doctorResult] = await Promise.all([
            apiRequest('/appointments'),
            apiRequest('/appointments/doctors')
          ]);
          if (!active) return;
          setAppointments(sortAppointmentsCancelledFirst(appointmentResult.data.appointments));
          setDoctors(doctorResult.data.doctors);
        } else if (section === 'records') {
          const result = await apiRequest('/health-records');
          if (active) setRecords(result.data.records);
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSection();
    return () => { active = false; };
  }, [isAdmin, section, user.role]);

  useEffect(() => {
    if (section !== 'appointments' || user.role !== 'patient' || !appointmentForm.doctorId || !appointmentForm.scheduledDate) {
      setBookedSlots([]);
      setAvailabilityError('');
      setAvailabilityLoading(false);
      return undefined;
    }

    let active = true;
    const { startAt, endAt } = localDayRange(appointmentForm.scheduledDate);
    const query = new URLSearchParams({
      doctorId: appointmentForm.doctorId,
      startAt,
      endAt
    });
    setAvailabilityLoading(true);
    setAvailabilityError('');
    apiRequest(`/appointments/availability?${query}`)
      .then((result) => {
        if (active) setBookedSlots(result.data.bookedSlots);
      })
      .catch((requestError) => {
        if (active) {
          setBookedSlots([]);
          setAvailabilityError(requestError.message);
        }
      })
      .finally(() => {
        if (active) setAvailabilityLoading(false);
      });

    return () => { active = false; };
  }, [appointmentForm.doctorId, appointmentForm.scheduledDate, availabilityVersion, section, user.role]);

  function navigate(nextSection) {
    setSection(nextSection);
    setError('');
    setNotice('');
  }

  async function submitManagedAccount(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const body = {
        fullName: managedAccountForm.fullName,
        email: managedAccountForm.email,
        password: managedAccountForm.password,
        role: managedAccountForm.role
      };
      if (managedAccountForm.role === 'doctor') {
        body.specialty = managedAccountForm.specialty;
        body.appointmentFee = Number(managedAccountForm.appointmentFee);
      }
      const result = await apiRequest('/admin/accounts', { method: 'POST', body });
      setManagedAccounts((current) => [...current, result.data.account].sort((a, b) => (
        a.role.localeCompare(b.role) || a.fullName.localeCompare(b.fullName)
      )));
      setManagedAccountForm({
        fullName: '',
        email: '',
        password: '',
        role: 'patient',
        specialty: '',
        appointmentFee: ''
      });
      setNotice('Account created. Share the initial password with the new account holder securely.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleManagedAccount(account) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest(`/admin/accounts/${account.id}/status`, {
        method: 'PATCH',
        body: { isActive: !account.isActive }
      });
      setManagedAccounts((current) => current.map((item) => item.id === account.id ? result.data.account : item));
      setNotice(`${account.fullName}'s account was ${result.data.account.isActive ? 'enabled' : 'disabled'}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitAppointment(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    let checkoutOpened = false;
    try {
      const selectedDoctor = doctors.find((doctor) => doctor.id === appointmentForm.doctorId);
      if (selectedDoctor?.appointmentFee > 0) await loadRazorpayCheckout();
      const body = {
        doctorId: appointmentForm.doctorId,
        scheduledAt: dateTimeWithOffset(`${appointmentForm.scheduledDate}T${appointmentForm.scheduledTime}`),
        reason: appointmentForm.reason
      };
      const result = await apiRequest('/appointments', { method: 'POST', body });
      if (!result.data.requiresPayment && result.data.appointment) {
        setAppointments((current) => sortAppointmentsCancelledFirst([...current, result.data.appointment]));
        const [scheduledDate] = nextAppointmentTime().split('T');
        setAppointmentForm((current) => ({ ...current, reason: '', scheduledDate, scheduledTime: '' }));
        setAvailabilityVersion((version) => version + 1);
        setNotice('Your appointment has been booked. No payment was due.');
        return;
      }
      const { payment } = result.data;
      if (!result.data.requiresPayment || !payment) {
        throw new Error('Payment could not be started. No appointment has been booked.');
      }
      if (!window.Razorpay) await loadRazorpayCheckout();

      let paymentHandlerStarted = false;
      const checkout = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.orderId,
        name: 'MediSync',
        description: `${payment.doctorSpecialty} appointment`,
        prefill: { name: user.fullName, email: user.email },
        theme: { color: '#237b6a' },
        handler: (gatewayResponse) => {
          paymentHandlerStarted = true;
          void verifyPendingAppointmentPayment({
            orderId: gatewayResponse.razorpay_order_id,
            paymentId: gatewayResponse.razorpay_payment_id,
            signature: gatewayResponse.razorpay_signature
          });
        },
        modal: {
          ondismiss: () => {
            setAvailabilityVersion((version) => version + 1);
            if (!paymentHandlerStarted) {
              setBusy(false);
              setNotice('Payment was not completed. No appointment has been booked.');
            }
          }
        }
      });
      checkout.on('payment.failed', (gatewayResponse) => {
        setError(gatewayResponse.error?.description || 'Payment failed. No appointment has been booked.');
      });
      checkout.open();
      checkoutOpened = true;
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.status === 409) {
        setAppointmentForm((current) => ({ ...current, scheduledTime: '' }));
        setAvailabilityVersion((version) => version + 1);
      }
    } finally {
      if (!checkoutOpened) setBusy(false);
    }
  }

  async function verifyPendingAppointmentPayment(confirmation) {
    setPaymentConfirmation(confirmation);
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest('/appointments/verify-payment', {
        method: 'POST',
        body: confirmation
      });
      setAppointments((current) => sortAppointmentsCancelledFirst([...current, result.data.appointment]));
      const [scheduledDate] = nextAppointmentTime().split('T');
      setAppointmentForm((current) => ({ ...current, reason: '', scheduledDate, scheduledTime: '' }));
      setPaymentConfirmation(null);
      setAvailabilityVersion((version) => version + 1);
      setNotice('Payment verified. Your appointment is confirmed.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancelAppointment(appointmentId) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest(`/appointments/${appointmentId}/cancel`, { method: 'PATCH' });
      setAppointments((current) => sortAppointmentsCancelledFirst(
        current.map((appointment) => appointment.id === appointmentId ? result.data.appointment : appointment)
      ));
      setNotice(result.data.appointment.refundMessage || 'The appointment was cancelled.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function completeAppointment(appointment) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest(`/appointments/${appointment.id}/complete`, { method: 'PATCH' });
      setAppointments((current) => current.map((item) => item.id === appointment.id ? { ...item, ...result.data.appointment } : item));
      setNotice('Appointment completed. You can now add its health record.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function startHealthRecord(appointment) {
    setActiveRecordAppointment(appointment);
    setRecordForm(appointment.healthRecord
      ? {
          title: appointment.healthRecord.title,
          type: appointment.healthRecord.type,
          recordDate: localDateValue(new Date(appointment.healthRecord.recordDate)),
          provider: '',
          notes: appointment.healthRecord.notes || ''
        }
      : {
          title: '',
          type: 'visit',
          recordDate: localDateValue(new Date(appointment.scheduledAt)),
          provider: '',
          notes: ''
        });
    setError('');
    setNotice('');
  }

  async function submitDoctorRecord(event) {
    event.preventDefault();
    if (!activeRecordAppointment) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const body = {
        title: recordForm.title,
        type: recordForm.type,
        recordDate: recordForm.recordDate,
        notes: recordForm.notes
      };
      const existingRecord = activeRecordAppointment.healthRecord;
      const result = existingRecord
        ? await apiRequest(`/health-records/${existingRecord.id}`, { method: 'PATCH', body })
        : await apiRequest('/health-records', { method: 'POST', body: { ...body, appointmentId: activeRecordAppointment.id } });
      setAppointments((current) => current.map((item) => item.id === activeRecordAppointment.id
        ? { ...item, healthRecord: result.data.record }
        : item));
      setActiveRecordAppointment(null);
      setNotice(existingRecord ? 'Health record updated.' : 'Health record added to the completed appointment.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  function renderAdminAccounts() {
    const activeCount = managedAccounts.filter((account) => account.isActive).length;
    return (
      <>
        <div className="workspace-heading"><div><p className="eyebrow">ADMINISTRATION</p><h2>Manage accounts</h2><p>Create patient and doctor accounts, or disable and restore access.</p></div></div>
        <form className="workspace-form" onSubmit={submitManagedAccount}>
          <label className="field"><span>Account type</span><select value={managedAccountForm.role} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, role: event.target.value })}><option value="patient">Patient</option><option value="doctor">Doctor</option></select></label>
          <label className="field"><span>Full name</span><input type="text" minLength={2} maxLength={100} autoComplete="name" value={managedAccountForm.fullName} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, fullName: event.target.value })} required /></label>
          <label className="field"><span>Email address</span><input type="email" maxLength={254} autoComplete="email" value={managedAccountForm.email} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, email: event.target.value })} required /></label>
          <label className="field"><span>Initial password</span><input type="password" minLength={8} maxLength={72} autoComplete="new-password" value={managedAccountForm.password} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, password: event.target.value })} required /><small className="field-hint">At least 8 characters. Share it securely with the account holder.</small></label>
          {managedAccountForm.role === 'doctor' && <>
            <label className="field"><span>Specialty</span><input type="text" minLength={2} maxLength={100} value={managedAccountForm.specialty} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, specialty: event.target.value })} required /></label>
            <label className="field"><span>Consultation fee (INR)</span><input type="number" min="0" max="1000000" step="0.01" value={managedAccountForm.appointmentFee} onChange={(event) => setManagedAccountForm({ ...managedAccountForm, appointmentFee: event.target.value })} required /></label>
          </>}
          <button className="submit-button workspace-submit" type="submit" disabled={busy}><span>{busy ? 'Please wait…' : 'Create account'}</span><Icon name="arrow" size={18} /></button>
        </form>
        <div className="list-heading"><h3>Patients and doctors</h3><span>{activeCount} active · {managedAccounts.length} total</span></div>
        {managedAccounts.length === 0 && !loading
          ? <div className="empty-state"><Icon name="people" size={22} /><p>No patient or doctor accounts have been created yet.</p></div>
          : <div className="item-list">{managedAccounts.map((account) => (
            <article className="care-item" key={account.id}>
              <span className="care-item-icon mint"><Icon name={account.role === 'doctor' ? 'heart' : 'people'} size={19} /></span>
              <div className="care-item-main">
                <strong>{account.fullName}</strong>
                <span>{account.email}</span>
                <small>{account.role === 'doctor' ? `${account.specialty || 'Specialty not provided'} · ${formatAppointmentFee(account.appointmentFee)}` : 'Patient'}</small>
              </div>
              <span className={`item-status ${account.isActive ? 'scheduled' : 'cancelled'}`}>{account.isActive ? 'active' : 'disabled'}</span>
              <button className="text-action" type="button" disabled={busy} onClick={() => toggleManagedAccount(account)}>{account.isActive ? 'Disable' : 'Enable'}</button>
            </article>
          ))}</div>}
      </>
    );
  }

  function renderAppointmentSection() {
    if (user.role === 'doctor') {
      return renderDoctorAppointments(false);
    }

    return (
      <>
        <div className="workspace-heading"><div><p className="eyebrow">PLAN YOUR NEXT VISIT</p><h2>Appointments</h2><p>Book a 30-minute visit with an available MediSync doctor.</p></div></div>
        <form className="workspace-form" onSubmit={submitAppointment}>
          <label className="field"><span>Specialty and appointment fee</span><select value={appointmentForm.doctorId} onChange={(event) => setAppointmentForm({ ...appointmentForm, doctorId: event.target.value, scheduledTime: '' })} required><option value="">Choose a specialty</option>{doctors.map((doctor) => <option value={doctor.id} key={doctor.id}>{doctor.specialty} · {formatAppointmentFee(doctor.appointmentFee, doctor.currency)}</option>)}</select></label>
          <label className="field"><span>Appointment date</span><input type="date" min={localDateValue()} max={localDateValue(new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))} value={appointmentForm.scheduledDate} onChange={(event) => setAppointmentForm({ ...appointmentForm, scheduledDate: event.target.value, scheduledTime: '' })} required /></label>
          <label className="field"><span>Available time <small>30-minute appointment</small></span><select value={appointmentForm.scheduledTime} onChange={(event) => setAppointmentForm({ ...appointmentForm, scheduledTime: event.target.value })} disabled={!appointmentForm.doctorId || !appointmentForm.scheduledDate || availabilityLoading || Boolean(availabilityError) || getAvailableAppointmentTimes(appointmentForm.scheduledDate, bookedSlots).length === 0} required><option value="">{availabilityLoading ? 'Checking open times…' : availabilityError ? 'Availability could not be loaded' : !appointmentForm.doctorId ? 'Choose a specialty first' : !appointmentForm.scheduledDate ? 'Choose a date first' : getAvailableAppointmentTimes(appointmentForm.scheduledDate, bookedSlots).length === 0 ? 'No available times' : 'Choose an available time'}</option>{getAvailableAppointmentTimes(appointmentForm.scheduledDate, bookedSlots).map((time) => <option value={time} key={time}>{new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</option>)}</select><small className="field-hint">Choose a specialty and date, then select an open time. Booked times are hidden.</small></label>
          {availabilityError && <p className="form-error field-wide" role="alert">{availabilityError}</p>}
          {!availabilityLoading && !availabilityError && appointmentForm.doctorId && appointmentForm.scheduledDate && getAvailableAppointmentTimes(appointmentForm.scheduledDate, bookedSlots).length === 0 && <p className="empty-note field-wide">No appointment times are available on this date. Choose another date.</p>}
          <label className="field"><span>What would you like help with? <small>Optional</small></span><input type="text" maxLength={500} placeholder="A short reason for your visit" value={appointmentForm.reason} onChange={(event) => setAppointmentForm({ ...appointmentForm, reason: event.target.value })} /></label>
          {doctors.length === 0 && !loading && <p className="empty-note">No doctors have been added yet. Ask a hospital administrator to add doctor accounts; their specialties will appear here.</p>}
          <p className="form-disclaimer field-wide"><Icon name="shield" size={15} /> Your appointment is confirmed only after Razorpay verifies successful payment. Unfinished checkout reservations expire after 10 minutes; no payment is due for a free appointment.</p>
          <button className="submit-button workspace-submit" type="submit" disabled={busy || loading || availabilityLoading || Boolean(availabilityError) || doctors.length === 0 || !appointmentForm.scheduledTime}><span>{busy ? 'Please wait…' : 'Continue to payment'}</span><Icon name="arrow" size={18} /></button>
        </form>
        {paymentConfirmation && <button className="text-action" type="button" disabled={busy} onClick={() => verifyPendingAppointmentPayment(paymentConfirmation)}>Retry payment confirmation</button>}
        <div className="list-heading"><h3>Your visits</h3><span>{appointments.length} total</span></div>
        {appointments.length === 0 && !loading ? <div className="empty-state"><Icon name="calendar" size={22} /><p>No appointments yet. Book your first visit above.</p></div> : <div className="item-list">{appointments.map((appointment) => <article className="care-item" key={appointment.id}><span className="care-item-icon mint"><Icon name="calendar" size={19} /></span><div className="care-item-main"><strong>{appointment.doctor?.specialty || 'Specialty not provided'}</strong><span>{formatAppointmentFee(appointment.doctor?.appointmentFee, appointment.doctor?.currency)} · {formatDateTime(appointment.scheduledAt)}</span>{appointment.reason && <small>{appointment.reason}</small>}</div><span className={`item-status ${appointment.status}`}>{appointment.status}</span>{appointment.status === 'scheduled' && new Date(appointment.scheduledAt) > new Date() && <button className="text-action" type="button" disabled={busy} onClick={() => cancelAppointment(appointment.id)}>Cancel</button>}</article>)}</div>}
      </>
    );
  }

  function renderDoctorAppointments(reportsOnly) {
    const doctorAppointments = reportsOnly
      ? appointments.filter((appointment) => appointment.status !== 'cancelled')
      : appointments;
    return (
      <>
        <div className="workspace-heading"><div><p className="eyebrow">YOUR CLINIC</p><h2>{reportsOnly ? 'Patient reports' : 'My appointments'}</h2><p>{reportsOnly ? 'Review your appointments and write or update reports after each visit is completed.' : 'Complete an appointment after its scheduled time, then add or update its health record.'}</p></div></div>
        {doctorAppointments.length === 0 && !loading
          ? <div className="empty-state"><Icon name={reportsOnly ? 'file' : 'calendar'} size={22} /><p>{reportsOnly ? 'Reports become available here after your appointments are completed.' : 'Your assigned appointments will appear here.'}</p></div>
          : <div className="item-list">{doctorAppointments.map((appointment) => {
            const canComplete = appointment.status === 'scheduled' && new Date(appointment.scheduledAt).getTime() + 30 * 60 * 1000 <= Date.now();
            const canWriteRecord = appointment.status === 'completed';
            return (
              <article className="care-item doctor-appointment" key={appointment.id}>
                <span className="care-item-icon mint"><Icon name="calendar" size={19} /></span>
                <div className="care-item-main">
                  <strong>{appointment.patient?.fullName || 'Patient'}</strong>
                  <span>{formatDateTime(appointment.scheduledAt)}</span>
                  {appointment.reason && <small>Visit reason: {appointment.reason}</small>}
                  {appointment.healthRecord && <p>Record: {appointment.healthRecord.title} · {recordTypes.find(([value]) => value === appointment.healthRecord.type)?.[1] || 'Other'}</p>}
                  {reportsOnly && appointment.status !== 'completed' && <small>Report available after this appointment is completed.</small>}
                </div>
                <span className={`item-status ${appointment.status}`}>{appointment.status}</span>
                {canComplete && <button className="text-action" type="button" disabled={busy} onClick={() => completeAppointment(appointment)}>Mark complete</button>}
                {canWriteRecord && <button className="text-action" type="button" disabled={busy} onClick={() => startHealthRecord(appointment)}>{appointment.healthRecord ? 'Edit report' : 'Write report'}</button>}
              </article>
            );
          })}</div>}
        {activeRecordAppointment && (
          <form className="workspace-form doctor-record-form" onSubmit={submitDoctorRecord}>
            <div className="workspace-heading field-wide"><div><p className="eyebrow">COMPLETED VISIT</p><h2>{activeRecordAppointment.healthRecord ? 'Update patient report' : 'Write patient report'}</h2><p>For {activeRecordAppointment.patient?.fullName || 'patient'} · {formatDateTime(activeRecordAppointment.scheduledAt)}</p></div><button className="text-action" type="button" onClick={() => setActiveRecordAppointment(null)}>Close</button></div>
            <label className="field"><span>Report title</span><input type="text" minLength={2} maxLength={120} placeholder="e.g. Follow-up consultation" value={recordForm.title} onChange={(event) => setRecordForm({ ...recordForm, title: event.target.value })} required /></label>
            <label className="field"><span>Report type</span><select value={recordForm.type} onChange={(event) => setRecordForm({ ...recordForm, type: event.target.value })}>{recordTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
            <label className="field"><span>Report date</span><input type="date" min={localDateValue(new Date(activeRecordAppointment.scheduledAt))} max={localDateValue()} value={recordForm.recordDate} onChange={(event) => setRecordForm({ ...recordForm, recordDate: event.target.value })} required /></label>
            <label className="field field-wide"><span>Clinical notes</span><textarea rows="4" maxLength={2000} placeholder="Add the visit summary and care notes" value={recordForm.notes} onChange={(event) => setRecordForm({ ...recordForm, notes: event.target.value })} /></label>
            <p className="form-disclaimer field-wide"><Icon name="shield" size={15} /> Only the doctor assigned to this completed appointment can add or update this report.</p>
            <button className="submit-button workspace-submit" type="submit" disabled={busy}><span>{busy ? 'Saving…' : activeRecordAppointment.healthRecord ? 'Update patient report' : 'Save patient report'}</span><Icon name="arrow" size={18} /></button>
          </form>
        )}
      </>
    );
  }

  function renderRecordsSection() {
    return (
      <>
        <div className="workspace-heading"><div><p className="eyebrow">YOUR HEALTH HISTORY</p><h2>Health records</h2><p>Records are added by your doctor after a completed appointment. You can view them here.</p></div></div>
        <div className="list-heading"><h3>Your records</h3><span>{records.length} total</span></div>
        {records.length === 0 && !loading ? <div className="empty-state"><Icon name="file" size={22} /><p>Records will appear here after your doctor updates a completed appointment.</p></div> : <div className="item-list">{records.map((record) => <article className="care-item record-item" key={record.id}><span className="care-item-icon lavender"><Icon name="file" size={19} /></span><div className="care-item-main"><strong>{record.title}</strong><span>{formatDate(record.recordDate)} · {recordTypes.find(([value]) => value === record.type)?.[1] || 'Other'}</span>{record.doctorSpecialty && <small>Recorded by {record.doctorSpecialty}</small>}{record.notes && <p>{record.notes}</p>}{!record.isDoctorAuthored && <small>Earlier patient-entered note · view only</small>}</div></article>)}</div>}
      </>
    );
  }

  function renderOverview() {
    if (user.role === 'doctor') {
      return (
        <>
          <section className="welcome-card">
            <div className="welcome-copy">
              <span className="welcome-icon"><Icon name="sparkle" size={20} /></span>
              <p className="eyebrow">YOUR CLINIC</p>
              <h2>Care continues<br />after the visit.</h2>
              <p>Review your assigned appointments and write or update patient reports after completed visits.</p>
              <span className="welcome-status"><span /> Doctor workspace</span>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="welcome-circle circle-back" />
              <div className="welcome-circle circle-front" />
              <div className="welcome-heart"><Icon name="file" size={42} /></div>
              <div className="welcome-leaf leaf-one" />
              <div className="welcome-leaf leaf-two" />
            </div>
          </section>
          <section className="section-heading"><div><p className="eyebrow">YOUR WORKFLOW</p><h2>Appointment to health record</h2></div></section>
          <section className="privacy-card"><span className="privacy-icon"><Icon name="shield" size={21} /></span><div><h3>Only the assigned doctor can update visit records.</h3><p>Records can be created or edited after the scheduled appointment has been completed.</p></div><Icon name="lock" size={19} /></section>
          <button className="submit-button doctor-overview-action" type="button" onClick={() => navigate('reports')}><span>Write patient reports</span><Icon name="arrow" size={18} /></button>
        </>
      );
    }

    return (
      <>
        <section className="welcome-card">
          <div className="welcome-copy">
            <span className="welcome-icon"><Icon name="sparkle" size={20} /></span>
            <p className="eyebrow">A GOOD PLACE TO BEGIN</p>
            <h2>Your health journey,<br />all in one place.</h2>
            <p>Manage your appointments and keep track of your health records in one place.</p>
            <span className="welcome-status"><span /> Account active</span>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <div className="welcome-circle circle-back" />
            <div className="welcome-circle circle-front" />
            <div className="welcome-heart"><Icon name="heart" size={70} /></div>
            <div className="welcome-leaf leaf-one" />
            <div className="welcome-leaf leaf-two" />
            <div className="welcome-orbit-card"><span className="orbit-icon"><Icon name="cross" size={18} /></span><span><b>Care that connects</b><small>Centered around you</small></span></div>
          </div>
        </section>
        <section className="section-heading"><div><p className="eyebrow">YOUR CARE, AT A GLANCE</p><h2>What would you like to do?</h2></div></section>
        <section className="feature-grid" aria-label="MediSync care">
          {[
            { id: 'appointments', icon: 'calendar', title: 'Appointments', description: 'Book or manage your visits', tone: 'mint' },
            { id: 'records', icon: 'file', title: 'Health records', description: 'Keep your health notes together', tone: 'lavender' },
          ].map((feature) => <button className="feature-card feature-button" type="button" onClick={() => navigate(feature.id)} key={feature.id}><span className={`feature-icon ${feature.tone}`}><Icon name={feature.icon} size={21} /></span><h3>{feature.title}</h3><p>{feature.description}</p><span className="feature-link">Open section <Icon name="arrow" size={14} /></span></button>)}
        </section>
        <section className="privacy-card"><span className="privacy-icon"><Icon name="shield" size={21} /></span><div><h3>Your health information deserves care.</h3><p>Your sign-in is protected. Your personal records are visible only from your account.</p></div><Icon name="lock" size={19} /></section>
      </>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Brand />
        <div className="header-right">
          <span className="secure-label"><Icon name="shield" size={16} /> Private space</span>
          <span className="avatar">{name.charAt(0).toUpperCase()}</span>
          <button className="sign-out" onClick={onSignOut}><Icon name="logout" size={17} /><span>Sign out</span></button>
        </div>
      </header>
      <div className="dashboard-content">
        <div className="dashboard-greeting">
          <div>
            <p className="eyebrow">YOUR MEDISYNC SPACE</p>
            <h1>Good to see you, {name}<span className="greeting-period">.</span></h1>
            <p className="greeting-subtitle">A little more connected to the care you deserve.</p>
          </div>
          <div className="member-chip"><span className="status-dot" /> {role}</div>
        </div>
        <nav className="section-nav" aria-label="Care sections">{(isAdmin ? adminSections : user.role === 'doctor' ? doctorSections : patientSections).map((item) => <button className={section === item.id ? 'active' : ''} type="button" key={item.id} onClick={() => navigate(item.id)}><Icon name={item.icon} size={17} />{item.label}</button>)}</nav>
        {error && <div className="workspace-message error" role="alert">{error}</div>}
        {notice && <div className="workspace-message success" role="status">{notice}</div>}
        {loading ? <div className="workspace-loading"><span className="loading-mark"><Icon name="cross" size={20} /></span><span>Loading your care information…</span></div> : <section className="workspace-panel">{isAdmin ? renderAdminAccounts() : section === 'overview' ? renderOverview() : section === 'appointments' ? renderAppointmentSection() : section === 'reports' && user.role === 'doctor' ? renderDoctorAppointments(true) : renderRecordsSection()}</section>}
        <footer className="dashboard-footer"><Brand compact /><span>Thoughtful care starts here.</span></footer>
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    let active = true;
    restoreSession()
      .then((sessionUser) => {
        if (active) setUser(sessionUser);
      })
      .catch((error) => {
        if (active && !(error instanceof ApiError && error.status === 401)) {
          setSessionError(error.message);
        }
      })
      .finally(() => {
        if (active) setRestoring(false);
      });
    return () => { active = false; };
  }, []);

  async function signOut() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
      setSessionError('');
    } catch (error) {
      setSessionError(error.message);
    } finally {
      setUser(null);
    }
  }

  if (restoring) {
    return <main className="loading-screen"><span className="loading-mark"><Icon name="cross" size={24} /></span><span>Opening your private space…</span></main>;
  }

  return user
    ? <Dashboard user={user} onSignOut={signOut} />
    : <><AuthPage onAuthenticated={setUser} />{sessionError && <div className="connection-toast" role="status">{sessionError}</div>}</>;
}
