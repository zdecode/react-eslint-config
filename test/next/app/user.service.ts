// 故意违反 Service 层架构规则：未 async、无 try-catch、命名未以 Service 结尾
export async function getUserService(id: string) {
  try {
    return fetch(`/api/user/${id}`)
  } catch{
    return '1'
  }
}
