export function convertToUTC9(isoString: string): string {
    // ISO 문자열을 Date 객체로 변환
    const date = new Date(isoString);
  
    // UTC+9 오프셋을 적용하여 시간 계산 (밀리초 기준 9시간 추가)
    const utc9Date = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  
    // 날짜 포맷 (예: YYYY-MM-DD HH:MM:SS)
    const year = utc9Date.getUTCFullYear();
    const month = String(utc9Date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utc9Date.getUTCDate()).padStart(2, '0');
    const hours = String(utc9Date.getUTCHours()).padStart(2, '0');
    const minutes = String(utc9Date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(utc9Date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }