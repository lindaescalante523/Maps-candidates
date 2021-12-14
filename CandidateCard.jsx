import React from "react";
import { Card, Grid, Avatar } from "@material-ui/core";
import { deleteById } from "../../services/candidateService";
import { onGlobalError } from "../../services/serviceHelpers";
import { formatDate } from "../../services/dateService";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import debug from "sabio-debug";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import ListRoundedIcon from "@material-ui/icons/ListRounded";
import IconButton from "@material-ui/core/IconButton";
import StarIcon from "@material-ui/icons/Star";
import candidateCardProps from "./candidateProps";
import "./candidate.css";

const _logger = debug.extend("CandidatesPage");

export default function CandidateCard(props) {
  let onDeleteCandidateSuccess = (res) => {
    _logger(res);

    swal("Candidate deleted", {
      icon: "success",
    });
  };

  let onDeleteButtonClicked = () => {
    swal({
      title: "Confirm",
      text: "Are you sure you want to delete this candidate?",
      icon: "warning",
      buttons: {
        cancel: true,
        confirm: {
          text: "Confirm",
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteById(props.candidate.id)
          .then(onDeleteCandidateSuccess)
          .catch(onGlobalError);
      }
    });
  };

  let linkWithId = `/candidates/${props.candidate.id}/edit`;

  let avatarUrl = props.candidate.avatarUrl;

  if (!avatarUrl) {
    avatarUrl =
      "https://cdn.pixabay.com/photo/2016/06/16/04/51/mexico-1460659_1280.jpg";
  }

  let electionDate = formatDate(props.candidate.electionDate);

  return (
    <>
      <Grid
        id={props.candidate.id}
        container
        item
        xs={12}
        sm={6}
        md={4}
        xl={2}
        justify="center"
      >
        <Card className="card mb-3">
          <div className="flex-column h-25">
            <div className="card-badges">
              <span
                className="shadow-none badge badge-light d-inline-block text-truncate"
                style={{ maxWidth: 80 }}
              >
                {props.candidate.party.code}
              </span>
            </div>
            <img
              alt="Candidate party logo"
              className="image card-img-top"
              src={props.candidate.party?.logo}
            />
            <div className="px-3">
              <div className="avatar-icon-wrapper-sm">
                <Avatar
                  alt="candidate avatar"
                  src={avatarUrl}
                  className="avatar"
                />
              </div>
            </div>
            <div className="d-flex mt-5">
              <div className="editIconContainer mr-1 rounded-circle">
                <IconButton
                  component={Link}
                  to={linkWithId}
                  size="small"
                  className="editIcon mx-auto"
                >
                  <ListRoundedIcon />
                </IconButton>
              </div>
              <div className="deleteIconContainer rounded-circle">
                <IconButton
                  onClick={onDeleteButtonClicked}
                  size="small"
                  color="secondary"
                  className="deleteIcon mx-auto"
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>
          <div className="cardContent px-3 pb-3">
            <h3 className="font-size-lg font-weight-bold">
              {`${props.candidate.givenName} ${props.candidate.surnames}`}
            </h3>
            <p className="text-black-50 mt-2 mb-0">
              <span>
                <strong>Age:</strong> {props.candidate.age}{" "}
              </span>
              <span className="float-right">
                <strong>Gender:</strong> {props.candidate.genderType?.name}
              </span>
            </p>
            <p className="text-black-50 mt-2 mb-0">
              <strong>Election Date:</strong>
              <br /> {electionDate}
            </p>
            <p className="text-black-50 mt-2 mb-0">
              <strong>Election Type:</strong>
              <br /> {props.candidate.electionType?.name}
            </p>
            <p className="text-black-50 mt-2 mb-0">
              <strong>Election Status:</strong>
              <br />{" "}
              {props.candidate.isElected ? (
                <>
                  <span>Elected</span>
                  <span className="float-right">
                    <StarIcon />
                  </span>
                </>
              ) : (
                <span>Not Elected</span>
              )}
            </p>
          </div>
        </Card>
      </Grid>
    </>
  );
}

CandidateCard.propTypes = candidateCardProps;
