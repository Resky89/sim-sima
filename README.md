# SIMA - Sistem Informasi Manajemen

Frontend aplikasi SIMA (Sistem Informasi Manajemen) yang dibangun dengan React, Vite, dan Tailwind CSS. Aplikasi ini menyediakan interface untuk mengelola data pengguna, KTP, dan SIM dengan design modern dan responsive.

## ✨ Fitur Utama

- 🔐 **Autentikasi JWT** - Sistem login yang aman dengan JWT tokens
- 👥 **Manajemen User** - CRUD operations untuk data pengguna
- 🆔 **Manajemen KTP** - Kelola data Kartu Tanda Penduduk
- 🚗 **Manajemen SIM** - Kelola data Surat Izin Mengemudi
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 🎨 **Modern UI/UX** - Design yang clean dan user-friendly
- 🔍 **Search & Filter** - Pencarian dan filter data yang powerful
- 📄 **Pagination** - Navigasi data yang efisien
- ⚡ **Performance** - Optimized dengan React hooks dan context

## 🛠️ Teknologi

- **React 19** - Library JavaScript untuk UI
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Routing untuk SPA
- **Context API** - State management
- **Custom Hooks** - Reusable logic
- **ESLint** - Code linting

## 📁 Struktur Folder

```
sim-sima/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Layout components
│   │   └── ui/            # UI components
│   ├── config/            # Configuration files
│   ├── constants/         # Constants and enums
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── docs/                  # Documentation
└── README.md
```

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Backend API SIMA yang sudah berjalan

### Instalasi

1. Clone repository ini:

```bash
git clone [repository-url]
cd sim-sima
```

2. Install dependencies:

```bash
npm install
```

3. Konfigurasi API endpoint di `src/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: "http://localhost:8026", // Sesuaikan dengan backend URL
  // ...
};
```

4. Jalankan development server:

```bash
npm run dev
```

5. Buka browser dan akses `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

## 🎨 Design System

### Warna Utama

- **Primary**: Blue gradient (#3B82F6 to #2563EB)
- **Secondary**: Purple gradient (#8B5CF6 to #7C3AED)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Komponen UI

#### Button

```jsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

#### Input

```jsx
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  error="Error message"
  required
/>
```

#### Select

```jsx
<Select
  label="Choose option"
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ]}
  placeholder="Select..."
/>
```

#### Table

```jsx
<Table
  columns={columns}
  data={data}
  loading={false}
  onRowClick={handleRowClick}
/>
```

#### Modal

```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title" size="md">
  Content here
</Modal>
```

## 🔧 API Integration

### Services

Setiap entity memiliki service tersendiri:

- `authService` - Autentikasi (login, logout, refresh)
- `userService` - CRUD operations untuk users
- `ktpService` - CRUD operations untuk KTP
- `simService` - CRUD operations untuk SIM

### Custom Hooks

#### useApi

```jsx
const { data, loading, error, execute } = useApi(
  apiFunction,
  params,
  immediate
);
```

#### usePagination

```jsx
const pagination = usePagination(initialPage, initialLimit);
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Autentikasi

Aplikasi menggunakan JWT untuk autentikasi:

1. User login dengan email/password
2. Server mengirim access_token dan refresh_token
3. Access token disimpan di localStorage
4. Setiap request API menyertakan Bearer token
5. Auto-refresh token ketika expired

## 📊 Fitur Pagination

- Search berdasarkan keyword
- Filter berdasarkan criteria
- Sort ascending/descending
- Customizable items per page
- Navigation dengan nomor halaman

## 🎯 Best Practices

### Clean Code

- Menggunakan functional components dengan hooks
- Separation of concerns
- DRY (Don't Repeat Yourself) principle
- Consistent naming conventions
- Proper error handling

### Performance

- Lazy loading components
- Memoization dengan useMemo/useCallback
- Optimized re-renders
- Efficient state management

### Accessibility

- Semantic HTML
- Keyboard navigation
- Screen reader friendly
- ARIA labels
- Color contrast compliance

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**

   - Pastikan backend server berjalan
   - Check CORS configuration
   - Verify API endpoints

2. **Build Error**

   - Clear node_modules dan reinstall
   - Check for syntax errors
   - Update dependencies

3. **Styling Issues**
   - Rebuild Tailwind CSS
   - Check for class conflicts
   - Verify responsive classes

## 📈 Development

### Scripts Available

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

Project menggunakan ESLint dengan konfigurasi:

- React hooks rules
- Modern JavaScript features
- Consistent formatting

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk bantuan atau pertanyaan:

- Email: support@sima.com
- Documentation: [docs.sima.com]
- Issues: [GitHub Issues]

---

**SIMA Frontend** - Sistem Informasi Manajemen yang Modern dan Powerful 🚀
