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

interface ChecklistCompleteEmailProps {
  projectName: string;
  itemTitle: string;
  appUrl: string;
  projectId: string;
}

export function ChecklistCompleteEmail({
  projectName,
  itemTitle,
  appUrl,
  projectId,
}: ChecklistCompleteEmailProps) {
  const projectUrl = `${appUrl}/projects/${projectId}`;

  return (
    <Html>
      <Head />
      <Preview>Checklist item completed: {itemTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Checklist item completed ✓</Heading>
          <Text style={text}>
            <strong>{itemTitle}</strong> in project <strong>{projectName}</strong> was just marked
            complete.
          </Text>
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
const h1 = { fontSize: "20px", fontWeight: "bold", color: "#111827", marginBottom: "8px" };
const text = { fontSize: "15px", color: "#374151", lineHeight: "1.6" };
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
