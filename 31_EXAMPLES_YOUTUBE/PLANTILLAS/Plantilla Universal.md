---
tags: ['#nota']
created: 2021-04-17
updated: 2021-04-17
status: active
priority: medium
---
<%* if (tp.file.title.startsWith("VIDEO ")) { %>
<%tp.file.cursor(1)%>
<%tp.file.include("901 - PLANTILLAS/plantilla VIDEO YOUTUBE")%>
<%* } %>

<%* if (tp.file.title.startsWith("LIBRO ")) { %>
<%tp.file.cursor(1)%>
<%tp.file.include("901 - PLANTILLAS/plantilla LIBRO")%>
<%* } %>

<%* if (tp.file.title.charAt(4) == "-") { %>
<%tp.file.cursor(1)%>
<%tp.file.include("901 - PLANTILLAS/plantilla_diario")%>
<%* } %>
