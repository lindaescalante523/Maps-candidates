import React from "react";
import PropTypes from "prop-types";
import { Box, LinearProgress, Button, Divider } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Card } from "@material-ui/core";

const SectionPopulationInfo = (props) => {
  const { populationInfo, returnToMap } = props;

  return (
    <Card className=" h-10 mb-2 p-2 mr-4 ml-4">
      <div className="card-header-alt d-flex justify-content-between p-4">
        <div>
          <h1 className="font-weight-bold font-size-lg mb-1 text-primary">
            {populationInfo.state.name}
          </h1>
          <h6 className="font-weight-bold  mb-1 text-black">
            Municipality {populationInfo.municipality.name}
          </h6>
          <p className="text-rblack-50 mb-0 font-weight-bold"></p>
          <p className="font-weight-bold font-size-md mb-1 text-secondary">
            Seccion {populationInfo.population.section}
          </p>
        </div>
        <Box className="d-flex align-items-center"></Box>
      </div>
      <div className="mx-4 divider" />
      <div className="mx-4 divider" />
      <div className="p-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <div className="p-5 mb-4 rounded bg-secondary">
              <div className="mb-4">
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Total Population
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.total}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {populationInfo.population.total}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Male Population
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.male}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {populationInfo.population.male}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Female Population
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.female}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {" "}
                    {populationInfo.population.female}
                  </div>
                </div>
              </div>
              <div>
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Population Over 18
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.over18}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {populationInfo.population.over18}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Male Population Over 18
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.maleOver18}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {populationInfo.population.maleOver18}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="line-height-1">
                  <span className="font-size-lg font-weight-bold pr-3 text-light">
                    Female Population Over 18
                  </span>
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="flex-grow-1">
                    <LinearProgress
                      value={populationInfo.population.femaleOver18}
                      color="primary"
                      variant="determinate"
                    />
                  </div>
                  <div className="text-light font-weight-bold pl-3">
                    {populationInfo.population.femaleOver18}
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Divider />
        <Divider />
      </div>
      <div className="text-center mb-4">
        <Button onClick={returnToMap} color="primary" variant="contained">
          <span className="btn-wrapper--label">Return to Map</span>
          <span className="btn-wrapper--icon">
            <FontAwesomeIcon icon={["fas", "arrow-right"]} />
          </span>
        </Button>
      </div>
    </Card>
  );
};
SectionPopulationInfo.propTypes = {
  populationInfo: PropTypes.shape({
    municipality: PropTypes.shape({
      name: PropTypes.string,
    }),
    population: PropTypes.shape({
      section: PropTypes.number,
      total: PropTypes.string,
      female: PropTypes.string,
      male: PropTypes.string,
      over18: PropTypes.string,
      femaleOver18: PropTypes.string,
      maleOver18: PropTypes.string,
    }),
    state: PropTypes.shape({
      name: PropTypes.name,
    }),
  }),
  returnToMap: PropTypes.func,
};

export default SectionPopulationInfo;
