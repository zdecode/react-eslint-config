// 故意违反 Service 层架构规则：未 async、无 try-catch、命名未以 Service 结尾
export function getUser(id: string) {
  return fetch(`/api/user/${id}`)
}
