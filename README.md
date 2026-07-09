# Clinova 🩺

Clinova is a comprehensive healthcare dashboard and management system designed to assist Medical Officer of Health (MOH) departments and hospital administrators. It features a modern React frontend, a robust Node.js/Express backend connected to MongoDB, and a powerful AI Microservice for predicting dengue outbreak risk levels based on meteorological data.

## 🌟 Key Features
- **MOH Dashboard**: Monitor regional health statistics and manage public health initiatives.
- **Hospital Dashboard**: Manage ward supplies, blood stock levels, and internal hospital operations.
- **AI Analytics**: Predict dengue outbreak risks (High, Medium, Low) using a trained Random Forest machine learning model based on 10 meteorological features.
- **Real-time Data**: Seamless integration between the frontend, backend, and AI microservices.

---

## 🏗️ Project Architecture

The repository is structured into three main microservices:

1. **/frontend**
   - **Tech Stack**: React, TypeScript, Vite, TailwindCSS / Custom CSS
   - **Description**: The user interface featuring beautifully designed, responsive dashboards.
   
2. **/backend**
   - **Tech Stack**: Node.js, Express, MongoDB (Mongoose)
   - **Description**: The core API handling user authentication, database operations, and proxying requests to the AI service.

3. **/ai_service**
   - **Tech Stack**: Python, FastAPI, Scikit-Learn, Pandas
   - **Description**: A dedicated machine learning microservice that loads the pre-trained `best_random_forest_model.joblib` to serve real-time predictions.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Git**

### 1. Installation & Running (The Easy Way ⭐)

We have included a convenient batch script that makes setup effortless! You **do not** need to manually install dependencies or create virtual environments.

Simply double-click the **`start_all.bat`** file located in the root of this project.

- The script is smart: if it's your first time running the project, it will automatically download and install all Node.js and Python dependencies for you!
- It will instantly open three terminal windows and start the Frontend, Backend, and AI Service simultaneously.

*Alternatively, you can run it from your IDE terminal:*
```bash
.\start_all.bat
```

### 2. Environment Setup

Ensure your backend has a `.env` file (`backend/.env`) with the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
JWT_SECRET=super_secret_clinova_key_123
AI_SERVICE_URL=http://127.0.0.1:8000
```

### 3. Running the Application (Manually)

If you prefer to start the services individually, open three separate terminals and run the following commands:

**Terminal 1: AI Service**
```cmd
cd ai_service
venv\Scripts\activate
python app.py -> Enter
```

**Terminal 2: Node Backend**
```cmd
cd backend
npm run dev
```

**Terminal 3: React Frontend**
```cmd
cd frontend
npm run dev
```

---

## 🧠 Using the AI Analytics
1. Log in to the application as an **MOH User**.
2. Navigate to the **AI Analytics** section.
3. Enter the current meteorological data (Temperature, Humidity, Wind Speed, etc.).
4. Click **Run Prediction**.
5. The frontend will hit the Node.js backend, which securely proxies the data to the Python FastAPI service. The predicted risk level (High, Medium, Low) will be returned and displayed on the screen!

---
*Built with ❤️ for better healthcare management.*
