import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSelect = (page) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(
        <li className="page-item" key={1}>
          <button className="page-link" onClick={() => handlePageSelect(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <li className="page-item disabled" key="start-ellipsis">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li className={`page-item ${currentPage === i ? 'active' : ''}`} key={i}>
          <button className="page-link" onClick={() => handlePageSelect(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <li className="page-item disabled" key="end-ellipsis">
            <span className="page-link">...</span>
          </li>
        );
      }
      pageNumbers.push(
        <li className="page-item" key={totalPages}>
          <button className="page-link" onClick={() => handlePageSelect(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
