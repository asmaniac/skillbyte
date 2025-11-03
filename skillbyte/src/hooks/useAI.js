import { useState, useCallback } from 'react';
import { analyzeWithOpenAI } from '../services/aiService';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (text) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeWithOpenAI(text);
      return result;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
}
