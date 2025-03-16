# Run-IO Backend

The backend for the Run-IO application, responsible for handling user authentication, data storage, and API endpoints. This backend is built using Node.js, Express, and Firebase.

## Features

-   User Registration and Login
-   Data Storage with Firebase Firestore
-   Secure Authentication with Firebase Authentication
-   Rate Limiting for API Protection
-   Environment Variable Validation

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)
-   Firebase Project with Firestore and Authentication enabled

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Josey34/Run-IO_backend.git
    cd Run-IO_backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

    ```
    FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
    FIREBASE_API_KEY=your-firebase-api-key
    FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
    FIREBASE_PROJECT_ID=your-firebase-project-id
    FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
    FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
    FIREBASE_APP_ID=your-firebase-app-id
    ```

4. Start the server:
    ```bash
    npm start
    ```

### API Endpoints

#### User Registration

-   **URL:** `/api/register`
-   **Method:** POST
-   **Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```

#### User Login

-   **URL:** `/api/login`
-   **Method:** POST
-   **Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```

#### Store Data

-   **URL:** `/api/store-data`
-   **Method:** POST
-   **Body:**
    ```json
    {
        "userId": "user-id",
        "data": {
            "someField": "someValue"
        }
    }
    ```

### Project Structure

-   `server.js`: Main server file
-   `routes.js`: Defines API routes
-   `utils/checkEnvVariables.js`: Utility function to check environment variables
-   `controllers/`: Contains controller logic (if applicable)
-   `models/`: Contains data models (if applicable)

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
