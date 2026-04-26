import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface OutreachEmailProps {
  leadName: string;
  senderName: string;
  customMessage?: string;
}

export const OutreachEmail = ({
  leadName,
  senderName,
  customMessage,
}: OutreachEmailProps) => (
  <Html>
    <Head />
    <Preview>Propuesta Estratégica para {leadName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>SABUESO_ATAQUE_</Heading>
        <Text style={text}>Hola {leadName},</Text>
        <Text style={text}>
          {customMessage || 
            "He estado analizando tu perfil y veo un potencial enorme para optimizar tus procesos actuales. En Buildung Buildings no buscamos clientes, buscamos socios estratégicos para escalar operaciones de alto impacto."}
        </Text>
        <Section style={section}>
          <Text style={text}>
            ¿Tenés 15 minutos esta semana para una llamada rápida?
          </Text>
          <Link href="https://calendly.com/gentleman" style={button}>
            AGENDAR_LLAMADA_
          </Link>
        </Section>
        <Text style={footer}>
          Enviado por {senderName} | Buildung Buildings - Piso 01
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OutreachEmail;

const main = {
  backgroundColor: "#050505",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #333",
};

const h1 = {
  color: "#fff",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  letterSpacing: "2px",
  borderBottom: "2px solid #fff",
  paddingBottom: "10px",
};

const text = {
  color: "#ccc",
  fontSize: "16px",
  lineHeight: "26px",
};

const section = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const button = {
  backgroundColor: "#fff",
  borderRadius: "0px",
  color: "#000",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "1px solid #fff",
};

const footer = {
  color: "#666",
  fontSize: "12px",
  marginTop: "40px",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
