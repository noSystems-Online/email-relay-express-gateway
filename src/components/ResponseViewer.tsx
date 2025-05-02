
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ResponseViewerProps {
  response: {
    data?: any;
    status?: number;
    error?: string;
  } | null;
  isLoading: boolean;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Response
            <div className="animate-spin h-5 w-5 border-b-2 rounded-full"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Sending email...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Response will appear here after sending an email
          </div>
        </CardContent>
      </Card>
    );
  }

  const isError = response.error || (response.status && response.status >= 400);
  const formattedJson = JSON.stringify(response.data || { error: response.error }, null, 2);

  return (
    <Card className={isError ? "border-destructive/50" : "border-green-500/50"}>
      <CardHeader className={isError ? "text-destructive" : "text-green-600"}>
        <CardTitle className="text-lg flex items-center gap-2">
          {isError ? (
            <>
              <AlertCircle className="h-5 w-5" />
              Error (Status: {response.status || "Unknown"})
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Success (Status: {response.status})
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="bg-muted rounded-md p-4 max-h-[300px]">
          <pre className="text-xs font-mono">{formattedJson}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ResponseViewer;
