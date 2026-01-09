# Smart Event Booking System 🎫

A full-stack event booking application built with MERN stack + MySQL, featuring real-time seat availability, QR code tickets, email notifications, and a modern Summitra-inspired glassmorphic UI.

![EventHub](https://img.shields.io/badge/EventHub-Live-purple?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js)

## 🌟 Features

### User Features
- ✅ Browse and search events with advanced filters (location, date, category)
- ✅ View detailed event information with Google Maps integration
- ✅ Book tickets with real-time seat availability
- ✅ Animated booking flow with confetti celebration
- ✅ Receive instant QR code tickets
- ✅ Email confirmations with booking details
- ✅ View booking history and download tickets
- ✅ Mobile-responsive PWA support

### Admin Features
- ✅ Create, update, and delete events
- ✅ View dashboard statistics (revenue, bookings, users)
- ✅ Manage all bookings with status updates
- ✅ Real-time event analytics
- ✅ Upload event images
- ✅ Tabbed interface for events and bookings

### Advanced Features
- ✅ JWT authentication with role-based access
- ✅ Real-time seat availability updates
- ✅ QR code generation for tickets
- ✅ Automated email notifications
- ✅ Responsive Summitra-inspired UI
- ✅ Smooth animations with Framer Motion
- ✅ PWA support for mobile installation

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MySQL (with connection pooling)
- JWT Authentication
- Multer (file uploads)
- QRCode generation
- Nodemailer (email notifications)
- CORS enabled

**Frontend:**
- React.js 19 + Vite
- Tailwind CSS 3
- Framer Motion (animations)
- React Router v7
- Axios
- QRCode React
- Canvas Confetti
- Google Maps integration

**Design:**
- Summitra-inspired modern UI
- Bento-box aesthetic
- Purple gradient theme
- Glassmorphism effects
- Dark mode optimized

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- MySQL v8 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Update `.env` file with your credentials:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=event_booking

   # JWT
   JWT_SECRET=your_super_secret_jwt_key

   # Email (Optional - for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password

   # Frontend
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create database:**
   
   Open MySQL and run:
   ```sql
   CREATE DATABASE event_booking;
   ```

5. **Import schema:**
   ```bash
   mysql -u root -p event_booking < config/schema.sql
   ```
   
   Or manually run the SQL in `config/schema.sql`

6. **Start backend server:**
   ```bash
   npm start
   ```
   
   Backend runs on: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend runs on: `http://localhost:5173`

## 🎯 Usage

### Default Admin Account
After running the schema, you can create an admin account:
- Register normally through the UI
- Manually update the `role` field in the database to `'admin'`

Or use SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### User Flow
1. **Register/Login** - Create an account or sign in
2. **Browse Events** - View all available events on the landing page
3. **Search & Filter** - Use location, date, and category filters
4. **View Details** - Click on an event to see full details and location
5. **Book Tickets** - Select number of tickets and confirm booking
6. **Get Tickets** - Receive QR code tickets instantly
7. **Email Confirmation** - Get booking details via email
8. **View Dashboard** - Access all your bookings and tickets

### Admin Flow
1. **Login as Admin** - Use admin credentials
2. **View Dashboard** - See statistics and analytics
3. **Create Events** - Add new events with all details
4. **Manage Events** - Edit or delete existing events
5. **Manage Bookings** - View all bookings and update status
6. **Track Revenue** - Monitor total revenue and bookings

## 📁 Project Structure

```
event-booking-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection
│   │   └── schema.sql         # Database schema
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── events.js          # Event CRUD routes
│   │   ├── bookings.js        # Booking + email routes
│   │   └── admin.js           # Admin dashboard routes
│   ├── uploads/               # Event images
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server
│
└── frontend/
    ├── public/
    │   └── manifest.json      # PWA manifest
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── EventCard.jsx
    │   │   ├── SearchFilter.jsx
    │   │   └── TicketQR.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx      # Summitra-style home
    │   │   ├── EventDetails.jsx     # Event info + maps
    │   │   ├── BookingFlow.jsx      # Animated booking
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UserDashboard.jsx    # User bookings
    │   │   └── AdminDashboard.jsx   # Admin panel
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css              # Tailwind + custom styles
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Bookings
- `POST /api/bookings` - Create booking (sends email)
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/:id/tickets` - Get booking tickets
- `GET /api/bookings/event/:eventId` - Get event bookings (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status

## 🎨 UI Features

### Summitra-Inspired Design
- **Pure black background** with purple gradient accents
- **Bento-box cards** with 32px rounded corners
- **Pill-shaped buttons** with hover effects
- **Gradient headings** (yellow-to-white)
- **Modern navbar** with contact info
- **Smooth animations** throughout

### Animations
- Confetti celebration on successful booking
- Smooth page transitions
- Hover effects on cards
- Loading spinners
- Success/error notifications

### Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop enhanced
- PWA installable

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build production version:
   ```bash
   npm run build
   ```
2. Deploy `dist` folder
3. Configure environment variables
4. Set API URL

### Database (PlanetScale/Railway)
1. Create MySQL database
2. Import schema
3. Update connection string in backend

## 📧 Email Configuration

To enable email notifications:

1. **Gmail Setup:**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Use in `.env` file

2. **Other SMTP:**
   - Update `EMAIL_HOST` and `EMAIL_PORT`
   - Provide credentials

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes (frontend & backend)
- Role-based access control
- SQL injection prevention
- CORS configuration
- Environment variables for secrets

## 📱 PWA Support

The app can be installed on mobile devices:
- Add to home screen
- Offline capability (future)
- App-like experience
- Custom icons and splash screen

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database exists
- Check port 5000 is available

### Frontend shows errors
- Run `npm install` in frontend directory
- Check backend is running on port 5000
- Clear browser cache
- Check console for errors

### Email not sending
- Verify email credentials in `.env`
- Check SMTP settings
- Enable "Less secure app access" (Gmail)
- Use App Password instead of regular password

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 👨‍💻 Author

Built with ❤️ using MERN Stack + MySQL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**⭐ Star this repo if you find it helpful!**
