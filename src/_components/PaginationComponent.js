import React from 'react';
import Pagination from 'react-paginating';
import { LIMIT, PAGE_COUNT } from '../_helpers/Pagination';
import {Button,ButtonToolbar} from 'react-bootstrap';
import { CSVLink } from "react-csv";
import empty from 'is-empty';
import { history } from '../_helpers/history';

class PaginationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: (!empty(this.props.match.params.page)) ? parseInt(this.props.match.params.page) : 1
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

    handlePageChange(page) {
      this.setState({
        currentPage: page
      });

      this.props.history.push(`${this.props.url}${page}${this.props.location.search}`)
    };

    render() {
      const { currentPage } = this.state;
      const { totalResults } = this.props;
      if(totalResults==0)
      {
        return (<div></div>);
      }

      let limit = LIMIT;
      let currentPageRecords = 0;
      if(!empty(this.props.exportCsvData)){
        currentPageRecords = this.props.exportCsvData.length;
      }

      if(!empty(this.props.limit)){
        limit = this.props.limit;
      }

      return (
        <div>
          <Pagination
            total={totalResults}
            limit={limit}
            pageCount={PAGE_COUNT}
            currentPage={currentPage}
          >
            {({
              pages,
              currentPage,
              hasNextPage,
              hasPreviousPage,
              previousPage,
              nextPage,
              totalPages,
              getPageItemProps
            }) => (
              <ButtonToolbar className="pagination-toolbar">

                {((!empty(this.props.exportCsvData)) && (!empty(this.props.exportCsvHeaders))) ?
                <CSVLink data={this.props.exportCsvData} 
                        headers={this.props.exportCsvHeaders} 
                        filename={!empty(this.props.exportCsvFileName) ? this.props.exportCsvFileName: 'data.csv' } 
                        className="btn btn-primary">
                        Exportar Excel
                </CSVLink> : ''}

                <Button className="btn-pagination-first"
                  {...getPageItemProps({
                    pageValue: 1,
                    onPageChange: this.handlePageChange
                  })}
                >
                  Primero
                </Button>
  
                {hasPreviousPage && (
                  <Button
                    {...getPageItemProps({
                      pageValue: previousPage,
                      onPageChange: this.handlePageChange
                    })}
                  >
                    {'<'}
                  </Button>
                )}
  
                {pages.map(page => {
                  let activePage = null;
                  if (currentPage === page) {
                    activePage = { 
                      backgroundColor: "#5f5e5e",
                      color: "#fff",
                      borderColor: "#5f5e5e" };
                  }
                  return (
                    <Button className="btn-pagination-number"
                      key={page}
                      style={activePage}
                      {...getPageItemProps({
                        pageValue: page,
                        onPageChange: this.handlePageChange,
                      })}
                    >
                      {page}
                    </Button>
                  );
                })}
  
                {hasNextPage && (
                  <Button 
                    {...getPageItemProps({
                      pageValue: nextPage,
                      onPageChange: this.handlePageChange
                    })}
                  >
                    {'>'}
                  </Button>
                )}
  
                <Button variant="info" className="btn-pagination-last"
                  {...getPageItemProps({
                    pageValue: totalPages,
                    onPageChange: this.handlePageChange
                  })}
                >
                  Ultimo
                </Button>

                <span className="pagination-records">
                  Mostrando {currentPageRecords} de {totalResults} registro(s)
                </span>

              </ButtonToolbar>
            )}
          </Pagination>
        </div>)
    }
}


export default PaginationComponent;
