import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface WeeklyDigestEmailProps {
  tenantName: string;
  plan: string;
  tokensUsed: number;
  projectCount: number;
  kbStorageMb: number;
  appUrl: string;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function WeeklyDigestEmail({
  tenantName,
  plan,
  tokensUsed,
  projectCount,
  kbStorageMb,
  appUrl,
}: WeeklyDigestEmailProps) {
  const planCapitalized = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <Html>
      <Head />
      <Preview>Your weekly ATR Resto usage summary</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your weekly usage summary</Heading>
          <Text style={greeting}>Hi {tenantName},</Text>
          <Text style={text}>Here&apos;s a look at your ATR Resto usage this week.</Text>

          <Section style={statsBox}>
            <Row>
              <Column style={statCell}>
                <Text style={statValue}>{formatTokens(tokensUsed)}</Text>
                <Text style={statLabel}>LLM tokens used</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statValue}>{projectCount}</Text>
                <Text style={statLabel}>Active projects</Text>
              </Column>
              <Column style={statCell}>
                <Text style={statValue}>{kbStorageMb.toFixed(1)} MB</Text>
                <Text style={statLabel}>KB storage</Text>
              </Column>
            </Row>
          </Section>

          <Text style={planText}>
            Current plan: <strong>{planCapitalized}</strong>
          </Text>

          <Section style={buttonSection}>
            <Button href={`${appUrl}/analytics`} style={button}>
              View analytics
            </Button>
            <Button href={`${appUrl}/billing`} style={buttonSecondary}>
              Manage billing
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            ATR Resto — AI-powered restaurant consulting
            <br />
            You&apos;re receiving this because you have weekly digests enabled.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "24px",
  maxWidth: "560px",
  borderRadius: "8px",
};
const h1 = { fontSize: "20px", fontWeight: "bold", color: "#111827", marginBottom: "4px" };
const greeting = { fontSize: "15px", color: "#374151", marginBottom: "4px" };
const text = { fontSize: "15px", color: "#374151", lineHeight: "1.6" };
const statsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};
const statCell = { textAlign: "center" as const, padding: "0 8px" };
const statValue = { fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0" };
const statLabel = { fontSize: "12px", color: "#6b7280", margin: "4px 0 0" };
const planText = { fontSize: "14px", color: "#6b7280" };
const buttonSection = { marginTop: "24px", display: "flex", gap: "12px" };
const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  marginRight: "8px",
};
const buttonSecondary = {
  backgroundColor: "#ffffff",
  color: "#111827",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
  border: "1px solid #e5e7eb",
};
const hr = { borderColor: "#e5e7eb", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" };
