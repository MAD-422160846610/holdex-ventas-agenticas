---
aliases: [Sabueso Master Suite, Roadmap de Integración IA, Arquitectura de Ventas 2026]
tags: [#piso-01 #sabueso #architecture #research]
version: 1.0
---

# 🐺 SABUESO: Master Suite de Ventas Inteligente

Este documento detalla la investigación y el roadmap para transformar el proyecto Sabueso en una suite integral de ventas que extraiga y consolide las mejores funciones de las herramientas líderes del mercado (Apollo, Gong, Clay, etc.) bajo una arquitectura propia en **Vercel** y **Neon**.

## 🎯 El Objetivo
Construir un sistema soberano para un equipo de ~8 vendedores, eliminando el "caos técnico" y la fragmentación de datos, centralizando la inteligencia en el **Model Context Protocol (MCP)** y **APIs directas**.

## 🛠️ Ingeniería Inversa: Funciones Clave por Categoría

### 1. Prospección y Enriquecimiento (Estilo Apollo/Clay)
- **Función:** Scraping de LinkedIn, validación de emails y orquestación de flujos.
- **Lógica a extraer:** La metodología de "recolección de OSINT" (Open Source Intelligence).
- **Repositorio para estudiar:** [browser-use](https://github.com/browser-use/browser-use) (GitHub). Permite crear agentes que navegan como humanos.
- **Implementación Sabueso:** Integrar la API de Proxycurl para enriquecer perfiles de LinkedIn automáticamente cuando entra un lead.

### 2. Inteligencia de Conversación (Estilo Gong/Fireflies)
- **Función:** Transcripción, análisis de sentimientos y detección de puntos de dolor.
- **Lógica a extraer:** Clasificación de objeciones y "next steps" automáticos.
- **Repositorio para estudiar:** [Deepgram](https://deepgram.com/) (SDK) para transcripción ultra rápida en Vercel Edge Functions.
- **Implementación Sabueso:** Procesar el texto transcrito con un prompt de "Análisis de Sentimiento y Extracción de Entidades" usando Antigravity.

### 3. CRM y Gestión de Objetos (Estilo Twenty/Salesforce)
- **Función:** Base de datos relacional robusta con visualización de pipeline.
- **Lógica a extraer:** Arquitectura de "Custom Objects" y relaciones polimórficas.
- **Repositorio para estudiar:** [Twenty.com](https://github.com/twentyhq/twenty) (GitHub). El estándar de oro en CRM Open Source.
- **Implementación Sabueso:** Drizzle ORM + Neon Postgres.

### 4. Redacción y Personalización (Estilo Lavender/Copy.ai)
- **Función:** Scoring de efectividad de emails y prompts psicológicos.
- **Lógica a extraer:** Frameworks de ventas (AIDA, PAS) aplicados a generación de texto.
- **Implementación Sabueso:** Templates de React Email (ya implementados) + Inyección de contexto dinámico del lead.

## 🏗️ Arquitectura Propuesta (Stack Sabueso V2)

### Capa de Datos (Neon DB)
- **Extensión:** `pgvector`.
- **Uso:** Almacenar transcripciones y correos como embeddings para búsqueda semántica (RAG).

### Capa de Lógica (Vercel Functions)
- **APIs Directas:** Para tareas de fondo (Resend para emails, Webhooks para captación).
- **Edge Runtime:** Para máxima velocidad en el procesamiento de leads inicial.

### Capa de Interacción (MCP)
- **Función:** Permitir que los vendedores consulten el sistema en lenguaje natural: *"¿Qué leads de la industria tech están calientes hoy?"*.

## 📋 Lista de Tareas para la Suite
- [ ] Implementar búsqueda semántica con `pgvector` en Neon.
- [ ] Estudiar el esquema de base de datos de **Twenty.com** para refactorizar `lib/db/schema.ts`.
- [ ] Integrar un agente de scraping (browser-use) para automatizar la prospección.
- [ ] Configurar **Helicone** para monitorear el uso de tokens por vendedor.

---
*Documento dinámico generado por Antigravity bajo la visión de GlitchMan.*
