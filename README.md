# Practical 4 Frontend

A React-based frontend application for managing products and attendants with full CRUD operations and user authentication.

## 🚀 Features

- **Product Management**: Create, read, update, and delete products
- **Attendant Management**: Manage attendant information
- **User Authentication**: Login/logout functionality
- **Responsive Design**: Mobile-friendly interface
- **API Integration**: Connects to backend REST API
- **Routing**: Client-side navigation with React Router
- **Testing**: Comprehensive test suite with Jest and React Testing Library

## 🛠️ Tech Stack

- **React** 19.1.1 - Frontend framework
- **React Router DOM** 7.8.2 - Client-side routing
- **Axios** 1.11.0 - HTTP client for API calls
- **React Scripts** 5.0.1 - Build tools and development server
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend API server running on `http://localhost:8080`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roshanaryal1/practicle4-front-end.git
   cd practical4-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Ensure your backend API is running on `http://localhost:8080`
   - The frontend will connect to the backend automatically

## 🚀 Running the Application

### Development Mode
```bash
npm start
```
- Opens the app in development mode
- Available at [http://localhost:3000](http://localhost:3000)
- Hot reload enabled for development

### Production Build
```bash
npm run build
```
- Builds the app for production to the `build` folder
- Optimizes the build for best performance

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Configuration
- Jest configured for ESM module support
- React Testing Library for component testing
- Mocks configured for React Router DOM
- Coverage reports available

## 📁 Project Structure

```
practical4-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AttendantPage.jsx     # Attendant management
│   │   ├── Header.jsx            # Navigation header
│   │   ├── Hello.jsx             # Welcome component
│   │   ├── HomePage.jsx          # Home page
│   │   ├── LoginPage.jsx         # Login form
│   │   └── ProductPage.jsx       # Product management
│   ├── services/
│   │   └── apiService.js         # API communication
│   ├── __mocks__/
│   │   └── react-router-dom.js   # Router mocks for testing
│   ├── App.js                    # Main app component
│   ├── App.test.js              # App component tests
│   ├── Hello.test.jsx           # Hello component tests
│   └── index.js                 # App entry point
├── package.json
└── README.md
```

## 🌐 API Endpoints

The frontend communicates with the backend API for:

- **Authentication**: `/api/auth/login`, `/api/auth/logout`
- **Products**: `/api/products` (GET, POST, PUT, DELETE)
- **Attendants**: `/api/attendants` (GET, POST, PUT, DELETE)

## 🔧 Configuration

### Jest Configuration
- ESM module transformation for `axios` and `react-router-dom`
- React Testing Library setup
- Coverage collection enabled

### Browser Support
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, and Safari

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run eject` | Eject from Create React App |

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend server is running on `http://localhost:8080`
   - Check CORS configuration on backend

2. **Module Resolution Issues**
   - Run `npm install` to ensure all dependencies are installed
   - Clear node_modules and package-lock.json, then reinstall

3. **Test Failures**
   - Tests expect no backend server during testing
   - API errors in test logs are normal and expected

### Development Tips

- Use `npm run test:watch` for continuous testing during development
- Check browser console for detailed error messages
- Ensure backend API is running before testing full functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a practical assignment and is for educational purposes.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are met
3. Verify backend API connectivity
4. Check browser console for error details

---

**Note**: This frontend application requires the corresponding backend API to be running for full functionality. The tests are designed to work independently of the backend server.