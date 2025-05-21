import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import dataFile from './assets/data.json';

const columns = [
  { Header: "Id",
    accessor: "id" },

  { Header: "Name",
    accessor: "name" },

  { Header: "Gender",
    accessor: "gender" },

  { Header: "Salary",
   accessor: "salary" }
];

const App = () => {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return dataFile.data;
    return dataFile.data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
    pageCount
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageSize: 5 }
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="container">
      <h2>Employee List</h2>

      <input
        type="text"
        placeholder="Search from here"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()} key={hg.id}>
              {hg.headers.map(header => (
                <th
                  {...header.getHeaderProps(header.getSortByToggleProps())}
                  key={header.id}
                >
                  {header.render("Header")}
                  {header.isSorted ? (header.isSortedDesc ? " ⬇️ " : " ⬆️ ") : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
        <span>{pageIndex + 1} of {pageCount}</span>
        <button disabled={!canNextPage} onClick={nextPage}>Next</button>
      </div>
    </div>
  );
};

export default App;
