# 🧝 Elf Runner

A simple **jump-and-run browser game** inspired by the classic offline dinosaur game in Google Chrome.
I also added a Dockerfile, so it can run on any machine.

## 🎮 About the Game

Elf Runner is a lightweight arcade game where you control an elf character that must jump over obstacles and survive as long as possible. The longer you last, the higher your score.

Built as a fun project to practice game logic, rendering, and basic animation using JavaScript and the HTML5 Canvas.

## 🚀 Features

* Endless runner gameplay
* Jump mechanics with gravity
* Increasing difficulty over time
* Score tracking
* Simple and clean visuals

## 🕹️ Controls

* **Spacebar / Arrow Up** → Jump

## 🛠️ Tech Stack

* JavaScript (React)
* HTML5 Canvas
* CSS
* Docker

## Requirement
* 

## 📦 Installation & Setup

🐳 Run with Docker

1. Clone the repository:

```bash
git clone https://github.com/janinakoenig/elf-runner.git
```

2. Navigate into the project folder:

```bash
cd elf-runner
```

3. Build the Docker image:

```bash
docker build -t elf-runner .
```

4. Run the container:

```bash
coker run -p 3000:3000 elf-runner
```

5. Open your browser at http://localhost:3000 and start playing!




💻 Run locally (without Docker)

1. Clone the repository:

```bash
git clone https://github.com/janinakoenig/elf-runner.git
```

2. Navigate into the project folder:

```bash
cd elf-runner
```

3. Install dependencies:

```bash
npm install
```

4. Start the server to play:

```bash
npm run dev
```

## 📁 Project Structure

```bash
elf-runner/
 ├── public/            # Static assets
 ├── src/
 │    ├── components/
 │    │    └── ElfGame.jsx   # Main game logic and rendering
 │    ├── assets/            # Images and sprites
 │    ├── App.jsx
 │    └── index.jsx
 ├── Dockerfile             # Container setup
 ├── index.html
 └── package.json 
```

✨ Inspired by the Chrome offline dinosaur game.
