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
    isHidden: false
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
    input: "text"
    accessorKey: "Estado"
    key: "Estado"
    label: "Estado"
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
  Fecha:
    input: "text"
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
config:
  remove_field_when_delete_column: false
  cell_size: wide
  sticky_first_column: false
  group_folder_column: 
  show_metadata_created: false
  show_metadata_modified: false
  show_metadata_tasks: false
  source_data: tag
  source_form_result: viajes
  source_destination_path: /
  frontmatter_quote_wrap: false
  row_templates_folder: /
  current_row_template: 
  pagination_size: 10
filters:
  enabled: false
  conditions:
%%>