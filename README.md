F1WebApp
F1WebApp is a web application that connects to the Ergast API to display Formula 1 data. It provides users with up-to-date information on races, drivers, and standings, making it easier to follow the Formula 1 season.

Features
Race Data: Access detailed information about each race, including race results and timings.
Driver Standings: View the latest driver standings with complete statistics.
Team Information: Explore details about Formula 1 teams, their history, and performance.
Season Overview: Get a snapshot of the entire season, including past and upcoming races.
Technologies Used
Frontend: React.js
Backend: Node.js with Express
API: Ergast API for Formula 1 data
Containerization: Docker for easy deployment
Version Control: Git and GitHub
Getting Started
Prerequisites
Node.js: Ensure that Node.js is installed on your machine. You can download it here.
Docker: For containerization and easy deployment.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/Kaegenkugan/f1webapp.git
cd f1webapp
Install the dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
This will run the app in development mode. Open http://localhost:3000 in your browser to view it.

Docker Setup
To run the application in a Docker container:

Build the Docker image:

bash
Copy code
docker build -t f1webapp .
Run the Docker container:

bash
Copy code
docker run -p 3000:3000 f1webapp
Available Scripts
In the project directory, you can run:

npm start: Runs the app in the development mode.
npm test: Launches the test runner.
npm run build: Builds the app for production.
npm run eject: Removes the single build dependency from your project.
Contributing
Contributions are welcome! Please fork this repository and submit a pull request with your changes.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For questions or suggestions, feel free to open an issue on GitHub.
