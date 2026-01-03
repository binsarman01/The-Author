export function saveToStorage<T>(key: string, value: T){
  if(typeof window === 'undefined') return
  try{ localStorage.setItem(key, JSON.stringify(value)) }catch(e){}
}

export function loadFromStorage<T>(key: string): T | null{
  if(typeof window === 'undefined') return null
  try{
    const raw = localStorage.getItem(key)
    if(!raw) return null
    return JSON.parse(raw) as T
  }catch(e){ return null }
}
