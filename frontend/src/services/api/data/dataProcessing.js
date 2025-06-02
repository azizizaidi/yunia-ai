/**
 * Data Processing Functions
 * Handles data transformation, filtering, and processing
 */

/**
 * Filter data by date range
 * @param {Array} data - Array of data objects
 * @param {string} dateField - Field name containing date
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Filtered data
 */
export const filterByDateRange = (data, dateField, startDate, endDate) => {
  try {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });
  } catch (error) {
    console.error('Error filtering by date range:', error);
    return data;
  }
};

/**
 * Sort data by field
 * @param {Array} data - Array of data objects
 * @param {string} field - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted data
 */
export const sortData = (data, field, order = 'asc') => {
  try {
    return [...data].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  } catch (error) {
    console.error('Error sorting data:', error);
    return data;
  }
};

/**
 * Group data by field value
 * @param {Array} data - Array of data objects
 * @param {string} field - Field to group by
 * @returns {Object} Grouped data
 */
export const groupDataBy = (data, field) => {
  try {
    return data.reduce((groups, item) => {
      const key = item[field];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  } catch (error) {
    console.error('Error grouping data:', error);
    return {};
  }
};

/**
 * Paginate data
 * @param {Array} data - Array of data objects
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {Object} Paginated result with data and metadata
 */
export const paginateData = (data, page = 1, pageSize = 10) => {
  try {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error paginating data:', error);
    return {
      data: [],
      pagination: {
        currentPage: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};

/**
 * Search data by multiple fields
 * @param {Array} data - Array of data objects
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered data
 */
export const searchData = (data, query, fields) => {
  try {
    if (!query || query.trim() === '') {
      return data;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return data.filter(item => {
      return fields.some(field => {
        const fieldValue = item[field];
        if (fieldValue === null || fieldValue === undefined) {
          return false;
        }
        return fieldValue.toString().toLowerCase().includes(searchTerm);
      });
    });
  } catch (error) {
    console.error('Error searching data:', error);
    return data;
  }
};

/**
 * Calculate statistics for numeric field
 * @param {Array} data - Array of data objects
 * @param {string} field - Numeric field to calculate stats for
 * @returns {Object} Statistics object
 */
export const calculateFieldStats = (data, field) => {
  try {
    const values = data
      .map(item => item[field])
      .filter(value => typeof value === 'number' && !isNaN(value));

    if (values.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        min: 0,
        max: 0
      };
    }

    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count: values.length,
      sum,
      average: Math.round(average * 100) / 100,
      min,
      max
    };
  } catch (error) {
    console.error('Error calculating field stats:', error);
    return {
      count: 0,
      sum: 0,
      average: 0,
      min: 0,
      max: 0
    };
  }
};

/**
 * Transform data using a mapping function
 * @param {Array} data - Array of data objects
 * @param {Function} transformer - Function to transform each item
 * @returns {Array} Transformed data
 */
export const transformData = (data, transformer) => {
  try {
    return data.map(transformer);
  } catch (error) {
    console.error('Error transforming data:', error);
    return data;
  }
};
