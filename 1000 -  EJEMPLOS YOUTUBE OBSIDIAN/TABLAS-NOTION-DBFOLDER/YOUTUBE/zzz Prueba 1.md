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
  Título:
    input: "text"
    key: "Título"
    accessorKey: "Título"
    label: "Título"
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
  Estado:
    input: "select"
    accessorKey: "Estado"
    key: "Estado"
    label: "Estado"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "idea", backgroundColor: "hsl(174.00000000000017,3.8076437890169137%,73.053992%)"}
      - { label: "guion", backgroundColor: "hsl(88.65168539325839,45.473662000713595%,68.3639125%)"}
      - { label: "publicado", backgroundColor: "hsl(37.4285714285714,54.395014933793654%,78.247992%)"}
      - { label: "elegido", backgroundColor: "hsl(191.60973837209298,90.72713194827597%,86.5198125%)"}
      - { label: "progreso", backgroundColor: "hsl(323, 95%, 90%)"}
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  URL:
    input: "text"
    accessorKey: "URL"
    key: "URL"
    label: "URL"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: false
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Descripción:
    input: "text"
    accessorKey: "Descripción"
    key: "Descripción"
    label: "Descripción"
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
  Fecha_Publicación:
    input: "calendar"
    accessorKey: "Fecha_Publicación"
    key: "Fecha_Publicación"
    label: "Fecha Publicación"
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
  Tema:
    input: "tags"
    accessorKey: "Tema"
    key: "Tema"
    label: "Tema"
    position: 100
    skipPersist: false
    isHidden: false
    sortIndex: -1
    options:
      - { label: "aprendizaje", backgroundColor: "hsl(198, 95%, 90%)"}
      - { label: "cerebro digital", backgroundColor: "hsl(79, 95%, 90%)"}
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  Minutos:
    input: "number"
    accessorKey: "Minutos"
    key: "Minutos"
    label: "Minutos"
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
  Texto_markdown_+_html:
    input: "text"
    accessorKey: "Texto_markdown_+_html"
    key: "Texto_markdown_+_html"
    label: "Texto markdown + html"
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
config:
  remove_field_when_delete_column: false
  cell_size: normal
  sticky_first_column: true
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
    - {field: Estado, operator: NOT_EQUAL, value: idea}
    - {field: Minutos, operator: LESS_THAN, value: 20}
%%>