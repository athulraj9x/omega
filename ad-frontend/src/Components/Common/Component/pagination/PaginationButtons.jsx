import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { PAGINATION } from "../../../../Constant";

const PaginationButtons = ({ currentPage, totalPages, handlePageChange }) => {
  const visibleButtons = Math.min(PAGINATION.button, totalPages);
  const halfVisibleButtons = Math.floor(visibleButtons / 2);
  let startPage = Math.max(1, currentPage - halfVisibleButtons);
  // let endPage = startPage + visibleButtons - 1;
  let endPage = Math.min(startPage + visibleButtons - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  // Adjust the endPage if it exceeds the totalPages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visibleButtons + 1);
  }
  return (
    <nav aria-label="Page navigation example">
      <Pagination
        className="pagination justify-content-end pagination-primary"
        aria-label="Page navigation example"
      >
        {/* {currentPage > 1 && ( */}
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
            {"Previous"}
          </PaginationLink>
        </PaginationItem>
        {/* )} */}
        {pageNumbers.map((page, index) => (
          <PaginationItem
            key={index}
            active={currentPage === page}
            disabled={
              currentPage === totalPages && index === pageNumbers.length
            }
          >
            <PaginationLink onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* {currentPage < totalPages && ( */}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
            {"Next"}
          </PaginationLink>
        </PaginationItem>
        {/* )} */}
      </Pagination>
    </nav>
  );
};

export default PaginationButtons;
