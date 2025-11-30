#🌟 MindSpace – Multilingual AI Mental Health Support System

A digital mental health support platform created for Indian students, offering AI-powered emotional support, mood and journal tracking, dream logging, sleep sounds, appointments, community support, and institution dashboards — available in 6 Indian languages.

##🚀 Features
###🧠 AI Mental Health Chatbot

Powered by Google Gemini (primary) + OpenAI fallback

Provides empathetic emotional support

Supports English, Hindi, Kannada, Marathi, Telugu, and Urdu

###📊 Mood & Wellness Tools

Mood tracker

Journal writing

Dream logging

Sleep sound library

###🩺 Assessments

WHO-5 Well-Being Index

GAD-7 Anxiety Assessment

###💬 Anonymous Community

Share posts safely

Like and interact anonymously

###📅 Counselling & Safety Support

Book counselling appointments

Add emergency contacts

Access crisis helplines instantly

###📈 Dashboards

Student Dashboard – Mood history, patterns

Admin Dashboard – Activity overview

Institution Dashboard – Anonymous well-being analytics

###🛠️ Tech Stack
Frontend

React.js

Vite

Tailwind CSS

Recharts

Framer Motion

Axios

Backend

Node.js

Express.js

LowDB (JSON database)

Firebase Authentication

AI Integration

Google Gemini API

OpenAI API

###📂 Project Structure
MindSpace/
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── App.jsx
│
└── backend/
    ├── server.js
    ├── db.json
    └── .env

###▶️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/mindspace.git
cd mindspace

2️⃣ Backend Setup
cd backend
npm install


Create a .env file:

GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key


Start backend:

node server.js


Backend runs at: http://localhost:4000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at: http://localhost:5173

###🧪 Testing
✔ Functional Testing

Mood tracker, journals, dreams, appointments, emergency contacts, assessments, community, dashboard.

✔ API Testing

All API routes tested using Postman/Thunder Client.

✔ UI Testing

Responsive UI, form validation, component behavior, navigation flow.

###🔐 Security

Firebase Authentication for secure login

No passwords stored locally

All user data stored in LowDB securely

###🔮 Future Scope

Counsellor dashboard

Advanced AI risk-pattern analytics

More regional languages

Mobile app (Android/iOS)

### 🎥 Project Demo
Watch the full demo here:  
🔗 https://drive.google.com/file/d/1DjbCKxWWB4EDREVVyEBimrfHQTVPTrIs/view?usp=drive_link


##👩‍💻 Author

Shaguftha Nikhar
Pre Final Year Project – AI Mental Health Support System
