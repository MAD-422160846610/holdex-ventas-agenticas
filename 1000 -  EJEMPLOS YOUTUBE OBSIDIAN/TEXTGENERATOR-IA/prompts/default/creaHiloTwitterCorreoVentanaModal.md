---
PromptInfo:
 promptId: creaHiloTwitterCorreo
 name: ✍️ Write paragraphs 
 description: crea un hilo en Twitter según la temática título
 required_values: title, temas-tratar
 author: Marcos de Emowe
 tags: writing
 version: 0.0.1
 commands:
 - generate
 - model

---


content: 
{{context}}
prompt:
Crear un correo de unas 500 palabras y un hilo de Twitter según la temática del {{title}} y los {{temas-tratar}}

