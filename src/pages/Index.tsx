
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import SmtpForm, { SmtpSettings } from '@/components/SmtpForm';
import EmailForm, { EmailContent } from '@/components/EmailForm';
import ApiDocs from '@/components/ApiDocs';
import ResponseViewer from '@/components/ResponseViewer';
import { Button } from '@/components/ui/button';
import { Github, Mail, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index: React.FC = () => {
  const { toast } = useToast();
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    crypto: 'tls'
  });

  const [emailContent, setEmailContent] = useState<EmailContent>({
    fromEmail: '',
    fromName: '',
    replyTo: [],
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    text: '',
    html: '',
    attachments: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('/api/send-email');
  const [response, setResponse] = useState<{
    data?: any;
    status?: number;
    error?: string;
  } | null>(null);

  const validateRequest = () => {
    if (!smtpSettings.host) return 'SMTP host is required';
    if (!smtpSettings.port) return 'SMTP port is required';
    if (!smtpSettings.username) return 'SMTP username is required';
    if (!smtpSettings.password) return 'SMTP password is required';
    if (!emailContent.fromEmail) return 'From email is required';
    if (!emailContent.fromName) return 'From name is required';
    if (emailContent.to.length === 0) return 'At least one recipient is required';
    if (!emailContent.subject) return 'Subject is required';
    if (!emailContent.text && !emailContent.html) return 'Email body (text or HTML) is required';
    return null;
  };

  const handleSendEmail = async () => {
    const validationError = validateRequest();
    if (validationError) {
      toast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      // Prepare payload for attachments (convert content to base64 if needed)
      const processedAttachments = emailContent.attachments.map(attachment => ({
        ...attachment,
        // Simple check if it's already base64 or needs encoding
        content: attachment.content.startsWith('data:') ? 
          attachment.content : 
          btoa(unescape(encodeURIComponent(attachment.content)))
      }));

      const payload = {
        smtp: smtpSettings,
        email: {
          ...emailContent,
          attachments: processedAttachments.length > 0 ? processedAttachments : undefined
        }
      };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      setResponse({
        data,
        status: response.status,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Email sent successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to send email',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground py-6 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6" />
              <h1 className="text-xl font-bold">SMTP Email API Gateway</h1>
            </div>
            <a
              href="https://github.com/yourusername/email-relay-express-gateway"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-foreground/80"
            >
              <Github className="h-5 w-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <Tabs defaultValue="sender" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sender">Email Sender</TabsTrigger>
            <TabsTrigger value="documentation">API Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sender" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  API Endpoint Configuration
                </CardTitle>
                <CardDescription>
                  Configure the server endpoint for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input 
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="/api/send-email"
                    className="font-mono"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <SmtpForm onSmtpUpdate={setSmtpSettings} />
                <EmailForm onEmailUpdate={setEmailContent} />
              </div>
              
              <div className="space-y-8">
                <ResponseViewer response={response} isLoading={isLoading} />
                
                <div className="flex justify-center">
                  <Button 
                    size="lg"
                    onClick={handleSendEmail}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Sending...' : 'Send Email'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documentation">
            <ApiDocs />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-6 border-t border-border mt-12 bg-background">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SMTP Email API Gateway • Built with Express.js and Nodemailer</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
