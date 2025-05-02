
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SmtpFormProps {
  onSmtpUpdate: (smtpSettings: SmtpSettings) => void;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  crypto: 'ssl' | 'tls' | 'none';
}

const SmtpForm: React.FC<SmtpFormProps> = ({ onSmtpUpdate }) => {
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings>({
    host: '',
    port: 587,
    username: '',
    password: '',
    crypto: 'tls'
  });

  const handleChange = (field: keyof SmtpSettings, value: string | number) => {
    const updated = { ...smtpSettings, [field]: value };
    setSmtpSettings(updated);
    onSmtpUpdate(updated);
  };

  const cryptoOptions = [
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' },
    { label: 'None', value: 'none' }
  ];

  // Preset configurations
  const presets = [
    { name: 'Gmail', host: 'smtp.gmail.com', port: 587, crypto: 'tls' },
    { name: 'Outlook/Office 365', host: 'smtp.office365.com', port: 587, crypto: 'tls' },
    { name: 'Yahoo Mail', host: 'smtp.mail.yahoo.com', port: 587, crypto: 'tls' },
    { name: 'Amazon SES (US East)', host: 'email-smtp.us-east-1.amazonaws.com', port: 587, crypto: 'tls' }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    const updated = { 
      ...smtpSettings, 
      host: preset.host, 
      port: preset.port, 
      crypto: preset.crypto as 'tls' | 'ssl' | 'none'
    };
    setSmtpSettings(updated);
    onSmtpUpdate(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMTP Settings</CardTitle>
        <CardDescription>
          Configure the SMTP server that will send your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 space-x-2 overflow-x-auto pb-2">
          {presets.map(preset => (
            <Button 
              key={preset.name}
              variant="outline" 
              size="sm"
              onClick={() => applyPreset(preset)}
              className="whitespace-nowrap"
            >
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.example.com"
                value={smtpSettings.host}
                onChange={(e) => handleChange('host', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="587"
                value={smtpSettings.port}
                onChange={(e) => handleChange('port', parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">Username</Label>
              <Input
                id="smtpUsername"
                placeholder="your-email@example.com"
                value={smtpSettings.username}
                onChange={(e) => handleChange('username', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••••••"
                value={smtpSettings.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpCrypto">Encryption</Label>
            <Select 
              value={smtpSettings.crypto} 
              onValueChange={(value) => handleChange('crypto', value as 'ssl' | 'tls' | 'none')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select encryption type" />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmtpForm;
