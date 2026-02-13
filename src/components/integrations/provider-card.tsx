"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Github,
  Globe,
  CreditCard,
  Webhook,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

type ProviderWithStatus = {
  id: string;
  name: string;
  description: string;
  authType: "oauth2" | "api_key" | "webhook";
  icon: string;
  available: boolean;
  connected: boolean;
  status: string | null;
  credentialId: string | null;
  accountLabel: string | null;
  connectedAt: Date | null;
};

type Props = {
  provider: ProviderWithStatus;
  projectId: string;
};

// ─── Icon Map ───────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  globe: Globe,
  credit_card: CreditCard,
  webhook: Webhook,
};

// ─── Component ──────────────────────────────────────────────────────

export function ProviderCard({ provider, projectId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [apiKeyDialog, setApiKeyDialog] = useState(false);
  const [webhookDialog, setWebhookDialog] = useState(false);
  const [disconnectConfirm, setDisconnectConfirm] = useState(false);
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const initiateOAuth = useMutation(
    trpc.credentials.initiateOAuth.mutationOptions({})
  );
  const storeApiKey = useMutation(
    trpc.credentials.storeApiKey.mutationOptions({})
  );
  const storeWebhook = useMutation(
    trpc.credentials.storeWebhook.mutationOptions({})
  );
  const disconnect = useMutation(
    trpc.credentials.disconnect.mutationOptions({})
  );
  const testConnection = useMutation(
    trpc.credentials.testConnection.mutationOptions({})
  );

  const invalidate = () => {
    void queryClient.invalidateQueries({
      queryKey: trpc.credentials.providers.queryKey({ projectId }),
    });
  };

  // ─── Handlers ───────────────────────────────────────────────────

  const handleConnect = async () => {
    if (provider.authType === "oauth2") {
      const result = await initiateOAuth.mutateAsync({
        projectId,
        provider: provider.id,
      });
      window.location.href = result.authorizeUrl;
    } else if (provider.authType === "api_key") {
      setApiKeyValue("");
      setApiKeyDialog(true);
    } else {
      setWebhookUrl("");
      setWebhookSecret("");
      setWebhookDialog(true);
    }
  };

  const handleSaveApiKey = async () => {
    await storeApiKey.mutateAsync({
      projectId,
      provider: provider.id,
      apiKey: apiKeyValue,
    });
    setApiKeyDialog(false);
    setApiKeyValue("");
    invalidate();
  };

  const handleSaveWebhook = async () => {
    await storeWebhook.mutateAsync({
      projectId,
      provider: provider.id,
      webhookUrl,
      webhookSecret: webhookSecret || undefined,
    });
    setWebhookDialog(false);
    setWebhookUrl("");
    setWebhookSecret("");
    invalidate();
  };

  const handleDisconnect = async () => {
    if (!provider.credentialId) return;
    await disconnect.mutateAsync({ id: provider.credentialId });
    setDisconnectConfirm(false);
    invalidate();
  };

  const handleTest = async () => {
    if (!provider.credentialId) return;
    setTestResult(null);
    const result = await testConnection.mutateAsync({
      id: provider.credentialId,
    });
    setTestResult(result);
    invalidate();
  };

  // ─── Render ─────────────────────────────────────────────────────

  const Icon = ICON_MAP[provider.icon] ?? Globe;
  const isLoading =
    initiateOAuth.isPending ||
    storeApiKey.isPending ||
    storeWebhook.isPending ||
    disconnect.isPending;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{provider.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {provider.description}
                </p>
              </div>
            </div>
            <StatusBadge
              connected={provider.connected}
              status={provider.status}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {provider.connected && provider.accountLabel && (
            <p className="mb-3 text-sm text-muted-foreground">
              Connected as{" "}
              <span className="font-medium text-foreground">
                {provider.accountLabel}
              </span>
            </p>
          )}

          {testResult && (
            <div
              className={`mb-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                testResult.success
                  ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                  : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {testResult.success
                ? "Connection is working"
                : `Connection failed: ${testResult.error}`}
            </div>
          )}

          <div className="flex gap-2">
            {provider.connected ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={testConnection.isPending}
                >
                  {testConnection.isPending && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  Test
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDisconnectConfirm(true)}
                  disabled={isLoading}
                >
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={
                  isLoading ||
                  (provider.authType === "oauth2" && !provider.available)
                }
              >
                {isLoading && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                {provider.authType === "oauth2" && !provider.available
                  ? "Not Configured"
                  : provider.authType === "webhook"
                    ? "Configure"
                    : "Connect"}
                {provider.authType === "oauth2" && provider.available && (
                  <ExternalLink className="ml-1 h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialog} onOpenChange={setApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {provider.name}</DialogTitle>
            <DialogDescription>
              Enter your {provider.name} API key to connect. The key will be
              encrypted and stored securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={`sk_live_...`}
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKeyValue || storeApiKey.isPending}
            >
              {storeApiKey.isPending && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              Test & Save
            </Button>
          </DialogFooter>
          {storeApiKey.isError && (
            <p className="text-sm text-destructive">
              {storeApiKey.error.message}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Webhook Dialog */}
      <Dialog open={webhookDialog} onOpenChange={setWebhookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Webhook</DialogTitle>
            <DialogDescription>
              Enter your webhook URL to receive project event notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://example.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">
                Secret <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="whsec_..."
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveWebhook}
              disabled={!webhookUrl || storeWebhook.isPending}
            >
              {storeWebhook.isPending && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
          {storeWebhook.isError && (
            <p className="text-sm text-destructive">
              {storeWebhook.error.message}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation */}
      <Dialog open={disconnectConfirm} onOpenChange={setDisconnectConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect {provider.name}?</DialogTitle>
            <DialogDescription>
              This will remove the connection and revoke access. You can
              reconnect at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisconnectConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={disconnect.isPending}
            >
              {disconnect.isPending && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────

function StatusBadge({
  connected,
  status,
}: {
  connected: boolean;
  status: string | null;
}) {
  if (!status) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Not connected
      </Badge>
    );
  }

  switch (status) {
    case "active":
      return <Badge className="bg-green-600 hover:bg-green-600">Connected</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    case "expired":
      return <Badge variant="destructive">Expired</Badge>;
    case "revoked":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Revoked
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {connected ? "Connected" : "Not connected"}
        </Badge>
      );
  }
}
