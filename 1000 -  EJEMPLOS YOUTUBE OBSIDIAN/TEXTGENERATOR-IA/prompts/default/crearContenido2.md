---
PromptInfo:
 promptId: getParagraph
 name: ✍️ Write paragraphs 
 description: select a content contiens items, a paragraph for each item will be generated. 
 required_values: titl
 author: Noureddine
 tags: writing
 version: 0.0.1
 commands:
 - generate

---



content: 
{{context}}
prompt:
Write brainstorm content using {{title}}
