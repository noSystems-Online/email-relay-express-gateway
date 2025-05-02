
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiDocs: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">API Documentation</CardTitle>
        <CardDescription>
          Use this API endpoint to send emails via SMTP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoint">
          <TabsList className="mb-4">
            <TabsTrigger value="endpoint">Endpoint</TabsTrigger>
            <TabsTrigger value="request">Request Format</TabsTrigger>
            <TabsTrigger value="response">Response Format</TabsTrigger>
          </TabsList>
          
          <TabsContent value="endpoint">
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-mono text-md mb-2">POST /api/send-email</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Send an email through your specified SMTP server.
              </p>
              <p className="text-sm font-semibold">Headers:</p>
              <pre className="bg-background p-2 rounded text-xs mt-1">
                Content-Type: application/json
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="request">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm mb-2">JSON Body Example:</p>
              <pre className="bg-background p-4 rounded-md text-xs overflow-auto max-h-96">
{`{
  "smtp": {
    "host": "smtp.example.com",
    "port": 587,
    "username": "your-username@example.com",
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
    "subject": "Test Email Subject",
    "text": "This is the plain text version of the email.",
    "html": "<p>This is the <strong>HTML</strong> version of the email.</p>",
    "attachments": [
      {
        "filename": "attachment.txt",
        "content": "Hello World!",
        "contentType": "text/plain"
      }
    ]
  }
}`}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="response">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-semibold mb-2">Success Response (200 OK):</p>
              <pre className="bg-background p-2 rounded text-xs mb-4">
{`{
  "success": true,
  "messageId": "<random-message-id>",
  "message": "Email sent successfully"
}`}
              </pre>
              
              <p className="text-sm font-semibold mb-2">Error Response (400 Bad Request):</p>
              <pre className="bg-background p-2 rounded text-xs mb-4">
{`{
  "success": false,
  "errors": [
    {
      "msg": "SMTP host is required",
      "param": "smtp.host",
      "location": "body"
    }
  ]
}`}
              </pre>
              
              <p className="text-sm font-semibold mb-2">Error Response (500 Server Error):</p>
              <pre className="bg-background p-2 rounded text-xs">
{`{
  "success": false,
  "error": "Error details",
  "message": "Failed to send email"
}`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApiDocs;
