#Fala.Dor — PET Saúde

**Fala.Dor** is a Progressive Web App (PWA) developed as part of the **PET Saúde** university program. It is dedicated to promoting healthy habits, balanced nutrition, physical exercise routines, and overall mental health and well-being for its users.

## Quick Access
* **Live Production App:** [Access Caminhos do Bem-Estar](https://tuannycristinef.github.io/CaminhosDoBemEstar/)
* **Official Repository:** [GitHub - Caminhos do Bem-Estar](https://github.com/tuannycristinef/CaminhosDoBemEstar)

---

## Technologies & Tools
This project was built using modern front-end development practices and tools:
* **React + TypeScript:** User interface construction with static typing and code safety.
* **Tailwind CSS:** Modern, utility-first, and fully responsive styling.
* **Firebase (Firestore & Storage):** Real-time NoSQL database and cloud storage.
* **React Router Dom:** Single Page Application (SPA) routing and navigation.
* **GitHub Pages:** Continuous hosting and automated production deployment.

---

## Getting Started (Local Development)

To clone and run this project on your local development environment, follow the steps below:

### Prerequisites
Make sure you have **Node.js** and **Git** installed on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/tuannycristinef/CaminhosDoBemEstar.git](https://github.com/tuannycristinef/CaminhosDoBemEstar.git)
cd CaminhosDoBemEstar

### 2. Install dependences
```bash
npm install

### 3. Configure the database

This project relies on Firebase as its back-end service. Ensure that the Firebase configuration file (src/firebase.ts) is properly set up with your project's API keys before starting the app.

### 4. Start the development server

```bash
npm start

Open http://localhost:3000/CaminhosDoBemEstar in your browser to view the application.

---

### Admin Panels (Content Management)

The application features dedicated administrative interfaces designed for the project team to add, edit, and delete content in real time directly into the database—without needing to alter the source code:

* **Recipes Manager** (Alimentação): /admin/alimentação

* **Activities Manager** (Bem-Estar): /admin/bem-estar

Note for Content Managers: To select new images within the admin panels, the corresponding image files must first be added to their respective local folders in src/assets/receitas/ or src/assets/bem-estar/.

