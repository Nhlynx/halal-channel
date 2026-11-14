/**
 * usePublicData.js
 * Custom hook untuk fetch data dari endpoint publik API Halal Channel.
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * @param {string} endpoint  - path relatif dari baseURL, misal '/public/wisata'
 * @param {object} [params]  - query params tambahan
 */
const usePublicData = (endpoint, params = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get(endpoint, { params });
      if (res?.success) {
        setData(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res?.message || 'Gagal memuat data.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server. Pastikan backend aktif.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
};

export default usePublicData;
