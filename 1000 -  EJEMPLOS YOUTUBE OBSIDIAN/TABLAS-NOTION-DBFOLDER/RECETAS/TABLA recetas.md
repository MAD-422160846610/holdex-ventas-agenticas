---

database-plugin: basic

---

<%%
name: new database
description: new description
columns:
  __file__:
    key: "__file__"
    input: "markdown"
    label: "File"
    accessorKey: "__file__"
    isMetadata: true
    skipPersist: false
    isDragDisabled: false
    csvCandidate: true
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: true
      task_hide_completed: true
  Título_receta:
    input: "text"
    key: "Título_receta"
    accessorKey: "Título_receta"
    label: "Título receta"
    position: 0
    skipPersist: false
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Dificultad:
    input: "select"
    accessorKey: "Dificultad"
    key: "Dificultad"
    label: "Dificultad"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "✔✔✔✔✔", backgroundColor: "hsl(164, 95%, 90%)"}
      - { label: "✔✔✔✔", backgroundColor: "hsl(116.26090116279072,42.35562427325818%,77.170366%)"}
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Fecha:
    input: "calendar"
    accessorKey: "Fecha"
    key: "Fecha"
    label: "Fecha"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Duración_minutos:
    input: "number"
    accessorKey: "Duración_minutos"
    key: "Duración_minutos"
    label: "Duración minutos"
    position: 100
    isSorted: true
    isSortedDesc: false
    sortIndex: 1
    skipPersist: false
    isHidden: false
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Tipo:
    input: "tags"
    accessorKey: "Tipo"
    key: "Tipo"
    label: "Tipo"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "arroz", backgroundColor: "hsl(17, 95%, 90%)"}
      - { label: "favorito", backgroundColor: "hsl(224, 95%, 90%)"}
      - { label: "pollo", backgroundColor: "hsl(179, 95%, 90%)"}
      - { label: "ensaladas", backgroundColor: "hsl(119, 95%, 90%)"}
      - { label: "entrante", backgroundColor: "hsl(276, 95%, 90%)"}
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
config:
  remove_field_when_delete_column: false
  cell_size: normal
  sticky_first_column: false
  group_folder_column: 
  show_metadata_created: false
  show_metadata_modified: false
  show_metadata_tasks: false
  source_data: current_folder
  source_form_result: root
  source_destination_path: /
  frontmatter_quote_wrap: false
  row_templates_folder: /
  current_row_template: 
  pagination_size: 10
filters:
  enabled: false
  conditions:
%%>