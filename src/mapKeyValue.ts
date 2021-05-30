
type KeyDescriptor = { alias?: string }

type KeyValueTable = { [key: string]: string | string[] | KeyDescriptor }

const mapKeyValue: KeyValueTable = {
  "rendObj": ["ROBJ_DTEXT", "ROBJ_STEXT", "ROBJ_FRAME", "ROBJ_SOLID", "ROBJ_BOX"],
  "flow": ["FLOW_HORIZONTAL", "FLOW_VERTICAL"],
  "halign": ["ALIGN_LEFT", "ALIGN_CENTER", "ALIGN_RIGHT"],
  "hplace": { alias: "halign" },
  "valign": ["ALIGN_TOP", "ALIGN_CENTER", "ALIGN_BOTTOM"],
  "vplace": { alias: "halign" },
  "size": ["SIZE_TO_CONTENT", "flex()"],
  "minWidth": ["hdpx()", "sw()", "pw()", "SIZE_TO_CONTENT"],
  "maxWidth": { alias: "minWidth" },
  "minHeight": ["hdpx()", "sh()", "ph()", "SIZE_TO_CONTENT"],
  "maxHeight": { alias: "minWidth" },
  "behavior": ["Behavior.Button", "Behavior.TextArea"], // TODO add delimiter and brackets to allow multiple choice
  "color": "::Color()",
  "pos": "[0, 0]",
  "watch": "[]",
}

export {
  mapKeyValue,
  KeyDescriptor
}