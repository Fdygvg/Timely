timely/
├── backend/
│   ├── src/
│   │   ├── controllers/
<!-- │   │   │   ├── auth.controller.js -->
<!-- │   │   │   ├── stack.controller.js -->
<!-- │   │   │   └── user.controller.js -->
│   │   ├── middleware/
<!-- │   │   │   ├── auth.js -->
<!-- │   │   │   └── rateLimit.js -->
│   │   ├── models/
<!-- │   │   │   ├── User.js -->
<!-- │   │   │   ├── Stack.js -->
<!-- │   │   │   ├── StackItem.js/ -->
<!-- │   │   │   └── Session.js -->
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── stack.routes.js
│   │   │   └── user.routes.js
│   │   ├── utils/
<!-- │   │   │   ├── generateToken.js -->
│   │   │   └── email.js (optional for later)
<!-- │   │   └── app.js -->
<!-- │   ├── package.json -->
│   └── .env
│


├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
<!-- │   │   │   │   ├── Navbar.jsx -->
<!-- │   │   │   │   ├── Modal.jsx -->
<!-- │   │   │   │   └── Button.jsx -->
│   │   │   ├── auth/
<!-- │   │   │   │   ├── LoginModal.jsx -->
<!-- │   │   │   │   └── RegisterModal.jsx -->
│   │   │   ├── dashboard/
<!-- │   │   │   │   ├── StreakCard.jsx -->
<!-- │   │   │   │   ├── StackCard.jsx -->
<!-- │   │   │   │   └── CreateStackModal.jsx -->
│   │   │   ├── stack/
<!-- │   │   │   │   ├── StackPage.jsx -->
<!-- │   │   │   │   ├── StackItemCard.jsx -->
<!-- │   │   │   │   └── ShortcutBar.jsx -->
│   │   │   └── player/
<!-- │   │   │       ├── TimerDisplay.jsx -->
<!-- │   │   │       ├── PrayerPointDisplay.jsx -->
<!-- │   │   │       └── CompletionModal.jsx -->
│   │   ├── pages/
<!-- │   │   │   ├── Home.jsx -->
<!-- │   │   │   ├── Dashboard.jsx -->
<!-- │   │   │   ├── StackPage.jsx -->
<!-- │   │   │   └── PlayerPage.jsx -->
│   │   ├── context/
<!-- │   │   │   └── AuthContext.jsx -->
│   │   ├── hooks/
<!-- │   │   │   └── useTimer.js -->
│   │   ├── utils/
<!-- │   │   │   ├── api.js -->
<!-- │   │   │   └── helpers.js -->
<!-- │   │   ├── App.jsx -->
<!-- │   │   └── main.jsx -->
<!-- │   ├── index.html/ -->
│   ├── package.json
│   └── tailwind.config.js
│
├── package.json (optional root for scripts)
└── README.md




Phase 1: Backend Foundation (Week 1)
Setup

Initialize Express server

MongoDB connection

Environment variables

Authentication System

User model (token, username, avatar)

Generate/validate 64-char tokens

JWT setup for sessions

Rate limiting middleware

Core Models

Stack model

StackItem model

Session/History model

Basic Routes

Auth routes (register, login)

User profile update

Health check

Phase 2: Backend Features (Week 2)
Stack CRUD

Create, read, update, delete stacks

Update item order (swap functionality)

Player Logic

Start/finish session endpoint

Streak calculation

Shortcuts

CRUD for user shortcuts

Testing

Test all endpoints with Postman

Phase 3: Frontend Foundation (Week 3)
React Setup

Vite + Tailwind

Router setup (4 pages)

Auth context

Homepage

Static design + animations

Login/Register modals

Auth Flow

Token generation modal

Token login modal

Avatar/username modal

Phase 4: Dashboard (Week 4)
Dashboard Layout

Navbar with profile dropdown

Streak/total stats

Stack Management

Create stack modal

Display stack cards

Edit/delete stack

Shortcuts UI

Add/view shortcuts

Phase 5: Stack Page (Week 5)
Stack Editor

Add/remove items

Shortcut buttons

Glass card design

Drag/Swap Logic

Click-to-swap functionality

Smooth transitions

Phase 6: Player Page (Week 6)
Timer System

Countdown with +/- controls

Vibration/sound hooks

Three-Section Display

Previous/current/next UI

Completion Screen

Stats + replay button

Phase 7: Polish & Deploy (Week 7)
Responsive Design

Error Handling

Deployment

Backend: Railway/Render

Frontend: Vercel/Netlify

MongoDB: Atlas

