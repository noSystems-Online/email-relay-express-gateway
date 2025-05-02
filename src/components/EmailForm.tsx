
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagInput } from "@/components/TagInput";
import { Plus, Trash } from "lucide-react";

export interface EmailContent {
  fromEmail: string;
  fromName: string;
  replyTo: string[];
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

interface EmailFormProps {
  onEmailUpdate: (emailContent: EmailContent) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onEmailUpdate }) => {
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

  const handleChange = (field: keyof EmailContent, value: string | string[] | any[]) => {
    const updated = { ...emailContent, [field]: value };
    setEmailContent(updated);
    onEmailUpdate(updated);
  };

  const handleAttachmentChange = (index: number, field: string, value: string) => {
    const updatedAttachments = [...emailContent.attachments];
    updatedAttachments[index] = { ...updatedAttachments[index], [field]: value };
    handleChange('attachments', updatedAttachments);
  };

  const addAttachment = () => {
    handleChange('attachments', [
      ...emailContent.attachments,
      { filename: '', content: '', contentType: 'text/plain' }
    ]);
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = emailContent.attachments.filter((_, i) => i !== index);
    handleChange('attachments', updatedAttachments);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Content</CardTitle>
        <CardDescription>
          Compose your email message
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                placeholder="sender@example.com"
                value={emailContent.fromEmail}
                onChange={(e) => handleChange('fromEmail', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                placeholder="Sender Name"
                value={emailContent.fromName}
                onChange={(e) => handleChange('fromName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>To Recipients</Label>
            <TagInput
              placeholder="Add recipient email..."
              tags={emailContent.to}
              setTags={(tags) => handleChange('to', tags)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CC Recipients</Label>
              <TagInput
                placeholder="Add CC email..."
                tags={emailContent.cc}
                setTags={(tags) => handleChange('cc', tags)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>BCC Recipients</Label>
              <TagInput
                placeholder="Add BCC email..."
                tags={emailContent.bcc}
                setTags={(tags) => handleChange('bcc', tags)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reply-To Addresses</Label>
            <TagInput
              placeholder="Add reply-to email..."
              tags={emailContent.replyTo}
              setTags={(tags) => handleChange('replyTo', tags)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email Subject"
              value={emailContent.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email Body</Label>
            <Tabs defaultValue="text">
              <TabsList>
                <TabsTrigger value="text">Plain Text</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <Textarea
                  placeholder="Plain text content of your email"
                  className="min-h-[200px]"
                  value={emailContent.text}
                  onChange={(e) => handleChange('text', e.target.value)}
                />
              </TabsContent>
              <TabsContent value="html">
                <Textarea
                  placeholder="<p>HTML content of your email</p>"
                  className="min-h-[200px] font-mono"
                  value={emailContent.html}
                  onChange={(e) => handleChange('html', e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <Label>Attachments</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addAttachment}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>

            {emailContent.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attachments</p>
            ) : (
              emailContent.attachments.map((attachment, index) => (
                <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-2 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs">Filename</Label>
                    <Input
                      placeholder="file.txt"
                      value={attachment.filename}
                      onChange={(e) => handleAttachmentChange(index, 'filename', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Content Type</Label>
                    <Input
                      placeholder="text/plain"
                      value={attachment.contentType}
                      onChange={(e) => handleAttachmentChange(index, 'contentType', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttachment(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailForm;
