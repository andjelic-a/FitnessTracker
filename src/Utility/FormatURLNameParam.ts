export function getURLNameParam(name: string) {
  return name.replace(/ /g, "·").toLowerCase();
}

export function getNameFromURLParam(name: string) {
  return name.replace(/·/g, " ").toLowerCase();
}
