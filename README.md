# MediSync frontend

Responsive React experience for the MediSync healthcare platform. The frontend supports patient registration, sign-in, session restoration, appointment booking, health-record access, admin account management and sign-out using the backend's HttpOnly cookie authentication.

## Deploy

For Vercel frontend and Render backend deployment settings, follow the [root deployment guide](../README.md#deploy-on-vercel-and-render). The production API URL is configured in `.env.production`.

## Run locally

1. Start the backend from the repository's `backend` directory:

   ```bash
   npm install
   npm run dev
   ```

2. From the repository's `backend` directory, seed synthetic demo accounts and sample patient data:

   ```powershell
   $env:SEED_DEMO_DATA = "true"
   $env:SEED_DEMO_PASSWORD = "choose-a-demo-password-at-least-12-characters"
   npm run seed
   Remove-Item Env:\SEED_DEMO_DATA
   Remove-Item Env:\SEED_DEMO_PASSWORD
   ```

   The seed is idempotent and disabled in production. Newly created demo accounts share the supplied password; existing demo account passwords are not changed. The seed prepares four upcoming visits and one completed visit with a synthetic doctor-authored record.

3. Start the frontend from the repository's `frontend` directory:

   ```bash
   npm install
   npm run dev
   ```

4. Open the Vite URL (normally `http://localhost:5173`). The frontend defaults to the deployed Render API; copy `.env.example` to `.env` to use the local API at `http://localhost:5000/api/v1`.

## Seeded demo accounts

The patient account and doctor accounts all use the shared password supplied to the seed command when first created. Seeded account passwords are not printed by the script.

| Account | Email | Specialty | Consultation fee |
|---|---|---|---:|
| Demo patient | `patient@medisync.test` | — | — |
| Demo doctor | `doctor@medisync.test` | General Medicine | ₹500 |
| Cardiology | `doctor.cardiology@medisync.test` | Cardiology | ₹1,200 |
| Dermatology | `doctor.dermatology@medisync.test` | Dermatology | ₹800 |
| Pediatrics | `doctor.pediatrics@medisync.test` | Pediatrics | ₹700 |
| Demo hospital admin | `hospitaladmin@medisync.test` | Account management | — |

The demo hospital admin can manage patient and doctor accounts. The admin account uses the shared `SEED_DEMO_PASSWORD` when first created, or `SEED_ADMIN_PASSWORD` when that variable is supplied to the seed command. Setting `SEED_ADMIN_PASSWORD` also updates the demo admin password without changing other existing demo passwords. Password values are never printed by the seeder.

To set or reset the demo admin password locally, run the seed from the repository's `backend` directory with both environment variables set in that PowerShell process:

```powershell
$env:SEED_DEMO_DATA = "true"
$env:SEED_DEMO_PASSWORD = "your-demo-password-at-least-12-characters"
$env:SEED_ADMIN_PASSWORD = "your-admin-password-at-least-12-characters"
npm run seed
Remove-Item Env:\SEED_DEMO_DATA
Remove-Item Env:\SEED_DEMO_PASSWORD
Remove-Item Env:\SEED_ADMIN_PASSWORD
```

Each doctor has seeded appointments to demonstrate the assigned-doctor workflow. The completed General Medicine appointment includes a synthetic record; upcoming appointments can be completed after their scheduled duration.

Set `VITE_API_URL` in a local `.env` file to use a different backend API URL. See `.env.example`.

Production API requests use a same-origin Vercel rewrite to the Render backend so browser authentication cookies remain first-party. `VITE_API_URL` is set to `/api/v1` in `.env.production`; update the rewrite in `vercel.json` if the backend URL changes. Authentication cookies are HttpOnly and are never read by JavaScript.
Paid appointment checkout requires Razorpay Test Mode keys in the backend environment (`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`).

## Available frontend flows

- Patient sign-up and sign-in
- Session restoration using the access and rotating refresh cookies
- Sign-out through the backend
- Appointment booking with active doctors, 30-minute available time slots, Razorpay checkout, and appointment confirmation only after verified payment
- Appointment cancellation; paid appointment cancellations do not automatically issue a refund
- Patient read-only access to health records authored by the doctor assigned to a completed appointment
- Doctor appointment workflow to complete an elapsed visit and add or update its linked health record
- Hospital admin account management to provision patient/doctor accounts and disable or re-enable them

Public registration creates a patient account; selecting a staff role is not supported.
Health records can only be created or updated by the assigned doctor after completing an appointment. Patients have read-only access; earlier patient-entered notes remain visible as legacy notes. File uploads are not supported.
