# Fantasy-Loot-Generator
A fullstack web app that generates fantasy loot (weapons, armor, potions, etc.) using procedural generation with probability weighting. Users can generate loot, save items, and view them in an interactive inventory.



## Features
	•	Procedurally generate random loot with weighted rarities
	•	Display loot as interactive cards
	•	Save items to a personal inventory (frontend placeholder)
	•	Future: user accounts, MongoDB storage, filtering/searching



## Stack
	•	Frontend: React
	•	Backend: Node.js + Express
	•	Database: MongoDB (planned for future)
	•	Version Control: GitHub



# Getting Started

1. Clone the repository

## 2. Install dependencies

### Backend
cd backend
npm install

### Frontend
cd ../frontend
npm install

## 3. Run the project

### Step A — Start the backend
cd backend
node index.js

	•	Server will run at: http://localhost:5000
	•	Test API: http://localhost:5000/generate-item

### Step B — Start the frontend
cd ../frontend
npm start

•	App will open in your browser at: http://localhost:3000
•	Click Generate Item to see loot cards



## 4. Notes
	•	Make sure the backend is running before clicking Generate Item.
	•	If the backend port changes, update the fetch URL in /frontend/src/App.js.

