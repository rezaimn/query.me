import { useState, useEffect } from 'react'

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch(err) {
    return null;
  }
}

function parseValue(value: any, objectMode: boolean) {
  if (!value) return null;
  return objectMode ? JSON.parse(value) : value;
}

function formatValue(value: any, objectMode: boolean) {
  return objectMode ? JSON.stringify(value) : value;
}

export function useStorage(key: string, initialValue: any, objectMode: boolean) {
  const [value, setValue] = useState(() => parseValue(getItem(key), objectMode) ?? initialValue);
  useEffect(() => {
    if (value === undefined) return;
    localStorage.setItem(key, formatValue(value, objectMode));
  }, [key, value]);
  return [value, setValue];
}
