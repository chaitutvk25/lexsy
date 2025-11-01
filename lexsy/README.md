# Lexsy Document Assistant

This is a web application that allows users to upload a `.docx` document template, fill in its placeholders through a conversational interface, and download the completed document.

## Live Application

You can access the live application here: **[https://fluffy-cascaron-30b6e1.netlify.app/](https://fluffy-cascaron-30b6e1.netlify.app/)**

### Important Hosting Note

The backend for this project is hosted on a free-tier service that may spin down after a period of inactivity. As a result, **the very first document upload may take up to 60 seconds to process** as the server wakes up. Subsequent requests will be much faster.

## How to Use

### 1. Create a Template Document

*   Using an editor like Microsoft Word or Google Docs, create a new `.docx` document.
*   Write your template text as you normally would.
*   Anywhere you need a value to be filled in later, use a placeholder with double curly braces: `{{placeholder_name}}`.

**Example Template Text:**
> This agreement is made between **{{company_name}}** and **{{client_name}}**. The effective date is **{{date}}**.

### 2. Use the Web Application

1.  **Go to the Live Site:** [https://fluffy-cascaron-30b6e1.netlify.app/](https://fluffy-cascaron-30b6e1.netlify.app/)
2.  **Upload:** Click to upload the `.docx` template file you just created.
3.  **Fill In Values:** The application will then ask you for each placeholder's value, one by one. For the example above, it would first ask for `company_name`.
4.  **Download:** After you provide the last value, a "Download" button will appear. Click it to download your final, completed document.

## Tech Stack

*   **Frontend:** React, Material-UI
*   **Backend:** Node.js, Express
*   **Deployment:** Frontend on Netlify, Backend on Render
