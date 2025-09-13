import { useState, useMemo } from 'react';
import { APP_CONFIG } from '../utils/constants';

export function usePagination(data, pageSize = APP_CONFIG.PAGINATION_SIZE) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const paginatedData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = () => setCurrentPage(0);

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    resetPage
  };
}