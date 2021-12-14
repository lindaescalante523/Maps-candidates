import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { getAllPaginated, search } from "../../services/candidateService";
import { onGlobalError } from "../../services/serviceHelpers";
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import LocaleInfo from "rc-pagination/es/locale/en_US";
import debug from "sabio-debug";
import { Formik, Form } from "formik";
import CandidateCard from "./CandidateCard";
import "rc-pagination/assets/index.css";
import AddRoundedIcon from "@material-ui/icons/AddRounded";

const _logger = debug.extend("CandidatesPage");

export default function Candidates(props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
    totalCount: 0,
  });

  const [activePage, setActivePage] = useState(0);

  const [candidates, setCandidates] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchStatus, setSearchStatus] = useState(false);

  useEffect(() => {
    getAllPaginated(pagination.pageIndex, pagination.pageSize)
      .then(onPaginatedSuccess)
      .catch(onGlobalError);
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchStatus(false);
      getAllPaginated(pagination.pageIndex, pagination.pageSize)
        .then(onPaginatedSuccess)
        .catch(onGlobalError);
    } else {
      setSearchStatus(true);
      search(searchQuery, pagination.pageIndex, pagination.pageSize)
        .then(onPaginatedSuccess)
        .catch(onGlobalError);
    }
  }, [searchQuery]);

  let onPaginatedSuccess = (res) => {
    _logger(res);
    let candidatesReturned = [];
    let totalCount = 0;

    candidatesReturned = res.item.pagedItems;
    totalCount = res.item.totalCount;

    setCandidates(candidatesReturned);
    setPagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
    });
    if (activePage === 0) {
      setActivePage(1);
    }
  };

  let onPageChange = (pageNumber) => {
    _logger(`active page is ${pageNumber}`);

    if (searchStatus) {
      search(searchQuery, pageNumber - 1, pagination.pageSize)
        .then(onPaginatedSuccess)
        .catch(onGlobalError);
    } else {
      getAllPaginated(pageNumber - 1, pagination.pageSize)
        .then(onPaginatedSuccess)
        .catch(onGlobalError);
    }
    setActivePage(pageNumber);
  };

  let handleSearchChange = (e) => {
    setSearchQuery(e.currentTarget.value);
  };

  let mapCandidate = (candidate) => (
    <CandidateCard
      key={`candidate_${candidate.id}`}
      candidate={candidate}
      {...props}
    />
  );

  return (
    <>
      <div className="container">
        <div className="d-flex align-items-center ml-2 mr-2">
          <div className="d-flex flex-row mr-auto mt-1">
            <Pagination
              className="mt-2"
              total={pagination.totalCount}
              pageSize={pagination.pageSize}
              current={activePage}
              onChange={onPageChange}
              locale={LocaleInfo}
            />
            <div className="d-inline-flex ml-3 mr-auto">
              <Button
                variant="contained"
                component={Link}
                className="bg-light"
                to="/candidates"
              >
                Back to Candidates Main Page
              </Button>
            </div>
          </div>
          <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <Formik initialValues={searchStatus} enableReinitialize={true}>
              <Form>
                <TextField
                  className="app-search-input mr-3"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  inputProps={{ "aria-label": "search" }}
                  placeholder="Search…"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="app-search-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Form>
            </Formik>
          </div>
          <div className="text-end">
            <Button
              component={Link}
              to="/candidates/new"
              color="primary"
              variant="contained"
              className="rounded-circle p-3"
            >
              <AddRoundedIcon />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Grid container className="m-3" alignItems="center">
          {candidates.map(mapCandidate)}
        </Grid>
      </div>
    </>
  );
}
