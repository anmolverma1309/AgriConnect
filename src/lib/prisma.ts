// Using localStorage for data persistence instead of Prisma
// This file is kept for future database integration

export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(key) || '[]');
    }
    return [];
  },
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};
