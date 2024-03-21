# Wallet App

The Wallet App is a web application that allows users to manage their finances, make transactions, and track their balance conveniently.

## Table of Contents
- [Wallet App](#wallet-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)

## Features
- **User Authentication:** Users can sign up, log in, and manage their accounts securely.
- **Transaction Management:** Users can deposit funds, withdraw funds, and view transaction history.
- **Balance Tracking:** Real-time balance updates and summaries.
- **Admin Panel:** Admin users can manage users, view transaction reports, and perform administrative tasks.
- **Responsive Design:** User-friendly and responsive layout for easy access on different devices.

## Technologies Used
- Frontend: React.js, Redux, React Router
- Backend: Node.js, Express.js, MongoDB
- Authentication: JSON Web Tokens (JWT)
- Payment Integration: Stripe API

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Shiv-cybr03/MERN_Wallet_app.git

2. Navigate to the project directory:
    cd MERN_Wallet_app

3. Install dependencies for frontend and backend:
    cd client && npm install
    cd .. && npm install

4. Set up environment variables:
    Create a .env file in the backend directory.
    Add environment variables for MongoDB connection, JWT secret, Stripe API keys and port number etc.

## Usage
1. Start the backend server:
    node server/server

2. Start the frontend development server:
    cd client && npm start

3. Access the application on your browser:
    http://localhost:3000.

## Contributing
Contributions are welcome! Please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Make your changes and test thoroughly.
- Submit a pull request with a clear description of your changes and why they are necessary.