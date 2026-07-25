// Fungsi untuk format tanggal menjadi hh-bb-tttt
export const formatDateToHHBBTTTT = (dateString) => {
  if (!dateString) return ""
  
  try {
    const date = new Date(dateString)
    // Jika format ISO (YYYY-MM-DD)
    if (dateString.includes('-')) {
      const parts = dateString.split('-')
      if (parts.length === 3) {
        // Format: YYYY-MM-DD -> DD-MM-YYYY
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }
    
    // Fallback: gunakan Date object
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}-${month}-${year}`
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}