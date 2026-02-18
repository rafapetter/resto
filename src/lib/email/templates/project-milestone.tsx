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

interface ProjectMilestoneEmailProps {
  projectName: string;
  event: "created" | "status_changed";
  newStatus?: string;
  appUrl: string;
  projectId: string;
}

export function ProjectMilestoneEmail({
  projectName,
  event,
  newStatus,
  appUrl,
  projectId,
}: ProjectMilestoneEmailProps) {
  const projectUrl = `${appUrl}/projects/${projectId}`;
  const isCreated = event === "created";
  const heading = isCreated ? "New project created" : "Project status updated";
  const preview = isCreated
    ? `Project created: ${projectName}`
    : `${projectName} is now ${newStatus}`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          {isCreated ? (
            <Text style={text}>
              Your new project <strong>{projectName}</strong> has been created and is ready to
              configure.
            </Text>
          ) : (
            <Text style={text}>
              Project <strong>{projectName}</strong> status has been updated to{" "}
              <strong>{newStatus}</strong>.
            </Text>
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
