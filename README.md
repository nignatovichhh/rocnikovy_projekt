# rocnikovy_projekt
This repository is intended for student annual project.

## Project Overview

Student: Anastasiya Ihnatovich (ihnatovich1@uniba.sk)

Supervisor: Pavel Petrovič (pavel.petrovic@fmph.uniba.sk)

Project Goal:
Develop a personalized travel route planning system that recommends optimal routes based on the user's starting and destination points, along with exact departure and arrival dates. The system will take into account various factors such as user interests, travel experience, preferred modes of transport, and other criteria that influence the travel experience.

Target Audience:
Tourists

## 📁 Folder Structure

- `apis/`: External API files
  - `openaiapi.py`: 4o model requests handler
  - `context_prompt.txt`: 4o model requests for recommendations template 
  - `tripadvisorapi.py`: TripAdvisor requests handler

- `routewise_src/`: React frontend source code
- `reports`: project reports for Winter and Summer semesters
- `index.html`: project description page
- `main.py`: simple backend Flask app

Files needed for Render hosting service:
- `package.json`: Node dependencies
- `requirements.txt`: Python dependencies
- `Procfile`: Configuration for Render deployment
