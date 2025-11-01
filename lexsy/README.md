# Lexsy Document Assistant

This is a web application that allows users to upload a `.docx` document template, fill in its placeholders through a conversational interface, and download the completed document.

## Live Application

You can access the live application here: **[https://fluffy-cascaron-30b6e1.netlify.app/](https://fluffy-cascaron-30b6e1.netlify.app/)**

### Important Hosting Note

The backend for this project is hosted on a free-tier service that may spin down after a period of inactivity. As a result, **the very first document upload may take up to 60 seconds to process** as the server wakes up. Subsequent requests will be much faster.

## How It Works

1.  **Upload:** Upload a `.docx` file containing placeholders in the `{{placeholder_name}}` format.
2.  **Fill:** The application will ask for the value of each placeholder one by one.
3.  **Download:** Once all placeholders are filled, you can download the completed `.docx` file.

## Tech Stack

*   **Frontend:** React, Material-UI
*   **Backend:** Node.js, Express
*   **Deployment:** Frontend on Netlify, Backend on Render
