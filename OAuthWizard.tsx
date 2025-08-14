import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface OAuthConfig {
  google: {
    clientId: string;
    clientSecret: string;
    status: 'configured' | 'partial' | 'missing';
  };
  apple: {
    clientId: string;
    teamId: string;
    keyId: string;
    privateKey: string;
    status: 'configured' | 'partial' | 'missing';
  };
}

export default function OAuthWizard() {
  const { toast } = useToast();
  const [config, setConfig] = useState<OAuthConfig>({
    google: {
      clientId: '',
      clientSecret: '',
      status: 'missing'
    },
    apple: {
      clientId: '',
      teamId: '',
      keyId: '',
      privateKey: '',
      status: 'missing'
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The redirect URI has been copied to your clipboard."
    });
  };

  const testOAuthConfig = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', `/api/admin/oauth/test/${provider}`);
      
      if (response.success) {
        setConfig(prev => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            status: 'configured'
          }
        }));
        
        toast({
          title: "OAuth Configuration Valid",
          description: `${provider === 'google' ? 'Google' : 'Apple'} OAuth is properly configured.`
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: `Failed to validate ${provider} OAuth configuration.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfiguration = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const configData = provider === 'google' 
        ? {
            clientId: config.google.clientId,
            clientSecret: config.google.clientSecret
          }
        : {
            clientId: config.apple.clientId,
            teamId: config.apple.teamId,
            keyId: config.apple.keyId,
            privateKey: config.apple.privateKey
          };

      await apiRequest('POST', `/api/admin/oauth/configure/${provider}`, configData);

      toast({
        title: "Configuration Saved",
        description: `${provider === 'google' ? 'Google' : 'Apple'} OAuth configuration has been saved successfully.`
      });

      await testOAuthConfig(provider);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: `Failed to save ${provider} OAuth configuration.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: 'configured' | 'partial' | 'missing' }) => {
    const variants = {
      configured: { variant: 'default' as const, icon: CheckCircle2, text: 'Configured' },
      partial: { variant: 'secondary' as const, icon: AlertCircle, text: 'Partial' },
      missing: { variant: 'destructive' as const, icon: AlertCircle, text: 'Missing' }
    };
    
    const { variant, icon: Icon, text } = variants[status];
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">OAuth Configuration Wizard</h2>
        <p className="text-gray-400">
          Set up Google and Apple OAuth authentication for seamless user login experience.
        </p>
      </div>

      <Tabs defaultValue="google" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google" className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google OAuth
            <StatusBadge status={config.google.status} />
          </TabsTrigger>
          <TabsTrigger value="apple" className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple Sign In
            <StatusBadge status={config.apple.status} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google OAuth Configuration
              </CardTitle>
              <CardDescription>
                Configure Google OAuth for seamless user authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Setup Instructions */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-400 hover:underline">Google Cloud Console</a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the Google+ API and OAuth consent screen</li>
                  <li>Go to "Credentials" → "Create Credentials" → "OAuth client ID"</li>
                  <li>Select "Web application" as the application type</li>
                  <li>Add the authorized redirect URI below</li>
                </ol>
              </div>

              {/* Redirect URI */}
              <div className="space-y-2">
                <Label>Authorized Redirect URI</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.protocol}//${window.location.host}/api/auth/google/callback`}
                    readOnly
                    className="bg-gray-800/50 border-gray-600"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.host}/api/auth/google/callback`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Copy this URL and add it to your Google OAuth configuration</p>
              </div>

              <Separator />

              {/* Configuration Form */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Your Google OAuth Client ID"
                    value={config.google.clientId}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      google: { ...prev.google, clientId: e.target.value }
                    }))}
                    className="bg-gray-800/50 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-client-secret">Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    placeholder="Your Google OAuth Client Secret"
                    value={config.google.clientSecret}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      google: { ...prev.google, clientSecret: e.target.value }
                    }))}
                    className="bg-gray-800/50 border-gray-600"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => saveConfiguration('google')}
                    disabled={!config.google.clientId || !config.google.clientSecret || isLoading}
                    className="flex-1"
                  >
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testOAuthConfig('google')}
                    disabled={config.google.status === 'missing' || isLoading}
                  >
                    Test Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple Sign In Configuration
              </CardTitle>
              <CardDescription>
                Configure Apple Sign In for iOS and web authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Setup Instructions */}
              <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://developer.apple.com/account/" target="_blank" className="text-blue-400 hover:underline">Apple Developer Portal</a></li>
                  <li>Create an App ID with Sign In with Apple enabled</li>
                  <li>Create a Service ID for web authentication</li>
                  <li>Generate a private key for Sign In with Apple</li>
                  <li>Configure the return URL below in your Service ID</li>
                </ol>
              </div>

              {/* Redirect URI */}
              <div className="space-y-2">
                <Label>Return URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.protocol}//${window.location.host}/api/auth/apple/callback`}
                    readOnly
                    className="bg-gray-800/50 border-gray-600"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(`${window.location.protocol}//${window.location.host}/api/auth/apple/callback`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400">Copy this URL and add it to your Apple Service ID configuration</p>
              </div>

              <Separator />

              {/* Configuration Form */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apple-client-id">Service ID (Client ID)</Label>
                  <Input
                    id="apple-client-id"
                    placeholder="com.yourdomain.yourapp.signin"
                    value={config.apple.clientId}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      apple: { ...prev.apple, clientId: e.target.value }
                    }))}
                    className="bg-gray-800/50 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apple-team-id">Team ID</Label>
                  <Input
                    id="apple-team-id"
                    placeholder="Your Apple Developer Team ID"
                    value={config.apple.teamId}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      apple: { ...prev.apple, teamId: e.target.value }
                    }))}
                    className="bg-gray-800/50 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apple-key-id">Key ID</Label>
                  <Input
                    id="apple-key-id"
                    placeholder="Your Apple Private Key ID"
                    value={config.apple.keyId}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      apple: { ...prev.apple, keyId: e.target.value }
                    }))}
                    className="bg-gray-800/50 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apple-private-key">Private Key</Label>
                  <textarea
                    id="apple-private-key"
                    placeholder="-----BEGIN PRIVATE KEY-----&#10;Your Apple Private Key Content&#10;-----END PRIVATE KEY-----"
                    value={config.apple.privateKey}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      apple: { ...prev.apple, privateKey: e.target.value }
                    }))}
                    className="w-full min-h-[120px] bg-gray-800/50 border border-gray-600 rounded-md px-3 py-2 text-sm text-white resize-none font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => saveConfiguration('apple')}
                    disabled={!config.apple.clientId || !config.apple.teamId || !config.apple.keyId || !config.apple.privateKey || isLoading}
                    className="flex-1"
                  >
                    Save Configuration
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => testOAuthConfig('apple')}
                    disabled={config.apple.status === 'missing' || isLoading}
                  >
                    Test Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>OAuth Status Overview</CardTitle>
          <CardDescription>Current configuration status for all OAuth providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Google OAuth</span>
              </div>
              <StatusBadge status={config.google.status} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium">Apple Sign In</span>
              </div>
              <StatusBadge status={config.apple.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}