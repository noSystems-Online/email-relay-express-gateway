
# SMTP Email API Gateway

A flexible REST API gateway that allows sending emails through any SMTP provider. Built with Node.js, Express, React, and Nodemailer.

## Features

- **Dynamic SMTP Configuration**: Connect to any SMTP provider by providing credentials at runtime
- **Comprehensive Email Options**: Support for CC, BCC, reply-to, HTML/plain text content
- **Error Handling**: Detailed validation and error reporting
- **Modern UI**: Clean interface for testing the API
- **API Documentation**: Built-in documentation for integrating with other services

## API Endpoint

```
POST /api/send-email
```

### Request Format

```json
{
  "smtp": {
    "host": "smtp.example.com",
    "port": 587,
    "username": "your-username",
    "password": "your-password",
    "crypto": "tls"  // "ssl", "tls", or "none"
  },
  "email": {
    "fromEmail": "sender@example.com",
    "fromName": "Sender Name",
    "replyTo": ["reply@example.com"],
    "to": ["recipient@example.com"],
    "cc": ["cc@example.com"],
    "bcc": ["bcc@example.com"],
    "subject": "Test Subject",
    "text": "Plain text version",
    "html": "<p>HTML version</p>",
    "attachments": [
      {
        "filename": "attachment.txt",
        "content": "Hello World!",
        "contentType": "text/plain"
      }
    ]
  }
}
```

## Setup and Usage

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start both the frontend and backend:
   ```
   node start.js
   ```
4. Or start them separately:
   ```
   # Start backend
   node src/server/index.js
   
   # Start frontend (in a different terminal)
   npm run dev
   ```

## Technologies Used

- **Backend**: Node.js, Express, Nodemailer
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Validation**: Express Validator

## License

MIT
