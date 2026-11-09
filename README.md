# PCS26140: Blockchain-Based Academic Certificate Verification System

An enterprise-grade decentralized academic credential issuance and verification platform built with **React**, **JavaScript**, **CSS3**, and **HTML5**, utilizing the browser native **Web Crypto API** for true SHA-256 cryptographic hashing and simulated Proof-of-Authority (PoA) consortium blockchain ledger operations.

---

## 🌟 Key Features

1. **Persistent Side Navbar**:
   - 🏠 **Home**: Live consortium metrics, system architecture diagram, quick verification bar, and recently anchored blocks.
   - 🛡️ **Admin Dashboard**: Institutional validator node status, PoA consensus parameters, ERC-721 Soulbound smart contract specifications, and accredited registrars directory.
   - ➕ **Certificate Add Section**: Student record entry form that produces a verified **Cryptographic Message & SHA-256 Hash**.
   - ⏳ **Certificate Pending Section**: Multi-signature consensus pool where pending student credentials await institutional approval and block mining.
   - ✅ **Verifies Section**: Searchable on-chain registry and live interactive cryptographic verifier (recomputes SHA-256 hash in real time to guarantee 100% integrity).
   - 📞 **Contact & Support**: Institutional node onboarding, fraud reporting hotline, and verification FAQs.

2. **Institutional Administrator Authentication**:
   - **Admin Sign In**: Secure authentication with pre-configured demo credentials (`admin@university.edu` / `admin123`).
   - **Institution Registration**: Onboarding portal to register universities, generate 256-bit ECDSA validator keys, and issue credentials.

3. **Cryptographic Proofs & Blockchain Simulation**:
   - **True SHA-256 Engine**: Uses `window.crypto.subtle.digest('SHA-256', ...)` to compute a deterministic 256-bit cryptographic digest of student data.
   - **Digital Signature**: Generates simulated ECDSA private key signatures (`0x...`).
   - **Block Mining**: Generates block height, previous block hash, nonce, and transaction hashes.
   - **Printable Diploma Document**: Official high-resolution academic certificate with gold verification seal, registrar signature, and QR code verification strip.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🏛️ System Architecture Workflow (PCS26140)

```
[University Registrar / Admin]
           │
           ▼
[1. Enters Student Graduation Details]
           │
           ▼
[2. Web Crypto API: SHA-256 Digest & ECDSA Signature]
           │
           ├──► [Cryptographic Message Generated]
           │
           ▼
[3. Certificate Pending Queue] ──(Multi-Sig Approval)──► [4. Block Mined & Anchored]
                                                                  │
                                                                  ▼
                                                      [5. Public Verifies Portal]
                                                      (Instant 1-Click Verification)
```

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── AddCertificateSection.jsx   # Data entry & Cryptographic Message card
│   │   ├── AdminSection.jsx            # Validator node & contract parameters
│   │   ├── AuthModal.jsx               # Admin Login & Register modal
│   │   ├── CertificateModal.jsx        # Printable high-res academic diploma
│   │   ├── ContactSection.jsx          # Inquiry form & FAQs
│   │   ├── Header.jsx                  # Top navigation & block height ticker
│   │   ├── HomeSection.jsx             # System explorer & architecture flow
│   │   ├── PendingSection.jsx          # Consensus queue & mining trigger
│   │   ├── Sidebar.jsx                 # Collapsible persistent side navbar
│   │   └── VerifiedSection.jsx         # Ledger registry & live hash verifier
│   ├── data/
│   │   └── mockData.js                 # Seed data & localStorage synchronization
│   ├── utils/
│   │   └── cryptoUtils.js              # Native Web Crypto SHA-256 hashing
│   ├── App.jsx                         # Main orchestrator & state management
│   ├── index.css                       # Web3 dark theme & print styles
│   └── main.jsx                        # React root entrypoint
├── index.html
├── package.json
└── vite.config.js
```
