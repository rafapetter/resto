import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface AutonomyDecisionEmailProps {
  actionType: string;
  decision: "approved" | "denied";
  projectName: string;
  appUrl: string;
  projectId: string;
}

export function AutonomyDecisionEmail({
  actionType,
  decision,
  projectName,
  appUrl,
  projectId,
}: AutonomyDecisionEmailProps) {
  const projectUrl = `${appUrl}/projects/${projectId}`;
  const approved = decision === "approved";
  const heading = approved ? "Autonomy action approved ✓" : "Autonomy action denied";
  const preview = `${actionType} was ${decision} for ${projectName}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={approved ? h1Approved : h1Denied}>{heading}</Heading>
          <Text style={text}>
            The action <strong>{actionType}</strong> was{" "}
            <strong>{decision}</strong> for project <strong>{projectName}</strong>.
          </Text>
          {approved && (
            <Text style={subtext}>The agent is proceeding with the approved action.</Text>
          )}
          <Section style={buttonSection}>
            <Button href={projectUrl} style={button}>
              View project
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>ATR Resto — AI-powered restaurant consulting</Text>
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
const h1Approved = { fontSize: "20px", fontWeight: "bold", color: "#059669", marginBottom: "8px" };
const h1Denied = { fontSize: "20px", fontWeight: "bold", color: "#dc2626", marginBottom: "8px" };
const text = { fontSize: "15px", color: "#374151", lineHeight: "1.6" };
const subtext = { fontSize: "13px", color: "#6b7280", lineHeight: "1.5" };
const buttonSection = { marginTop: "24px" };
const button = {
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  display: "inline-block",
};
const hr = { borderColor: "#e5e7eb", margin: "24px 0" };
const footer = { fontSize: "12px", color: "#9ca3af" };
