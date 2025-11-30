🎯 MindSpace – Multilingual AI Mental Health Support System

A digital mental health support platform designed for Indian students, offering AI-based emotional support, mood tracking, journaling, sleep tools, dream logging, appointments, crisis support, and institution dashboards — all in six Indian languages.

🚀 Features

🧠 AI Mental Health Chatbot

Empathetic chatbot powered by Gemini (primary) and OpenAI (fallback)

Provides emotional support and guidance

Supports English, Hindi, Kannada, Marathi, Telugu, and Urdu

📊 Mood & Wellness Tracking

Daily mood logging

Journal entries

Dream logging

Sleep sound library

🩺 Mental Health Assessments

WHO-5 Well-Being Index

GAD-7 Anxiety Assessment

💬 Anonymous Community Space

Students can share thoughts anonymously

Like and interact safely

📅 Appointments & Emergency Support

Book counselling sessions

Add emergency contacts

Crisis helplines available 24/7

📈 Dashboards

Student Dashboard: Mood trends & history

Admin Dashboard: Overview of activities

Institution Dashboard: Anonymous analytics for well-being trends

🛠️ Tech Stack
Frontend

React.js

Vite

Tailwind CSS

Framer Motion

Recharts

Axios

Backend

Node.js

Express.js

LowDB (JSON-based DB)

Firebase Authentication

AI Integration

Google Gemini API

OpenAI API

📂 Project Structure
/frontend
  ├── src/
  │   ├── pages/
  │   ├── components/
  │   ├── layout/
  │   ├── App.jsx
  │   └── firebaseConfig.js

/backend
  ├── server.js
  ├── db.json
  ├── package.json
  └── .env

▶️ Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/mindspace.git
cd mindspace

2. Setup Backend
cd backend
npm install


Create .env file:

GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key


Start backend:

node server.js


Backend runs on: http://localhost:4000

3. Setup Frontend
cd frontend
npm install
npm run dev


Frontend runs on: http://localhost:5173

🧪 Testing

All API routes tested using Postman / Thunder Client

UI tested for responsiveness and form validation

Functional tests done for mood, journals, dreams, appointments, chatbot, and dashboards

🔐 Security

Firebase Authentication for secure login

No sensitive data stored in browser

LowDB used for local JSON data storage

📌 Future Scope

Dedicated counsellor portal

Advanced AI analytics for early-risk detection

More regional languages

Mobile application (Android/iOS)

👩‍💻 Author

Shaguftha Nikhar
AI Mental Health Support System – Pre Final Year Project



Pull requests are welcome! For major changes, open an issue first.

📜 License

MIT License
