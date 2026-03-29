---

database-plugin: basic

---

<%%
name: new database
description: new description
columns:
  column1:
    input: "text"
    key: "column1"
    accessorKey: "column1"
    label: "Column 1"
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
    accessorKey: "Título"
    key: "Título"
    label: "Título"
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
      - { label: "idea", backgroundColor: "hsl(40, 95%, 90%)"}
      - { label: "publicado", backgroundColor: "hsl(34, 95%, 90%)"}
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
    label: "Fecha_Publicación"
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
      - { label: "aprendizaje, cerebro digital", backgroundColor: "hsl(89, 95%, 90%)"}
      - { label: "cerebro digital", backgroundColor: "hsl(197, 95%, 90%)"}
      - { label: "aprendizaje", backgroundColor: "hsl(187, 95%, 90%)"}
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
    label: "Texto_markdown_+_html"
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
  position:
    input: "text"
    accessorKey: "position"
    key: "position"
    label: "position"
    position: 100
    skipPersist: false
    isHidden: true
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  __created__:
    key: "__created__"
    input: "calendar_time"
    label: "Created"
    accessorKey: "__created__"
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  __modified__:
    key: "__modified__"
    input: "calendar_time"
    label: "Modified"
    accessorKey: "__modified__"
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: true
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: true
  __tasks__:
    key: "__tasks__"
    input: "task"
    label: "Task"
    accessorKey: "__tasks__"
    isMetadata: true
    isDragDisabled: false
    skipPersist: false
    csvCandidate: false
    isHidden: false
    sortIndex: -1
    config:
      enable_media_view: true
      media_width: 100
      media_height: 100
      isInline: false
      task_hide_completed: false
config:
  remove_field_when_delete_column: false
  cell_size: normal
  sticky_first_column: false
  group_folder_column: 
  show_metadata_created: true
  show_metadata_modified: true
  show_metadata_tasks: true
  source_data: query
  source_form_result: root
  source_destination_path: /
  frontmatter_quote_wrap: false
  row_templates_folder: /
  current_row_template: 
  pagination_size: 10
filters:
  enabled: false
  conditions:
    - {field: Estado, operator: EQUAL, value: publicado}
    - {field: Minutos, operator: GREATER_THAN, value: 15}
%%>