"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bot, Globe, MessageCircle, Send, Hash, Mail, Check } from "lucide-react";
import { useI18n } from "@/lib/demo/i18n/context";
import type { ChannelsContent } from "@/lib/demo/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  "message-circle": MessageCircle,
  send: Send,
  hash: Hash,
  mail: Mail,
};

type Props = { isPlaying: boolean; onComplete: () => void; content: ChannelsContent };

export default function ChannelsPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    if (connectedCount < content.channels.length) {
      const timer = setTimeout(() => setConnectedCount((c) => c + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [connectedCount, content.channels.length]);

  useEffect(() => {
    if (connectedCount >= content.channels.length && isPlaying) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [connectedCount, content.channels.length, isPlaying, onComplete]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t("channels.alwaysAccessible")}</h2>
        <p className="mt-1 text-muted-foreground">
          {t("channels.description")}
        </p>
      </div>

      {/* Central hub */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
          <Bot className="h-10 w-10" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-white">
          <span className="text-[10px] font-bold">{t("channels.ai")}</span>
        </div>
      </div>

      {/* Channel grid */}
      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {content.channels.map((channel, i) => {
          const isConnected = i < connectedCount;
          const Icon = ICON_MAP[channel.icon] || Globe;
          return (
            <Card
              key={channel.name}
              className={cn(
                "transition-all duration-500",
                isConnected ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                isConnected && "border-emerald-200 dark:border-emerald-800"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    `bg-${channel.color}-100 text-${channel.color}-700 dark:bg-${channel.color}-900 dark:text-${channel.color}-300`
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{channel.name}</span>
                      {isConnected && <Check className="h-3 w-3 text-emerald-600" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {channel.previewMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {connectedCount >= content.channels.length && (
        <div className="text-center animate-in fade-in">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {t("channels.allConnected")}
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("channels.allConnectedDescription")}
          </p>
        </div>
      )}
    </div>
  );
}
