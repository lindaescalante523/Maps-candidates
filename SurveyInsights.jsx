import React, { Fragment } from "react";
import SurveyExample from "../../assets/images/surveyinsightphotos/SurveyExample.png";
import SurveyPercentage from "../../assets/images/surveyinsightphotos/SurveyPercentage.png";
import SurveyQuestions from "../../assets/images/surveyinsightphotos/SurveyQuestion.png";

import { Grid, Container, Card } from "@material-ui/core";
//import { width } from "dom-helpers";

export default function SurveyInsights() {
  return (
    <Fragment>
      <div className="py-3 py-xl-5 ">
        <Container className="mt-10 py-3 py-xl-5">
          <div className="divider border-2 mx-auto mx-xl-0 my-5 border-light w-43 " />
          <Grid container spacing={3} className="pb-4">
            <h1 className="display-3 my-4 pb-4 font-weight-bold text-secondary mx-auto">
              Find a Survey That fits what you are looking for
            </h1>
            <Grid
              item
              xs={12}
              lg={6}
              className="d-flex align-items-center text-center text-xl-left px-5"
            >
              <div className="mb-5 mb-xl-0">
                <div className="mb-4">
                  <h1 className="display-3 mt-3 font-weight-light"></h1>
                  <h1 className="display-3 mt-3 font-weight-bold text-secondary">
                    Partipate in Surveys created by other users
                  </h1>
                  <div className="divider border-2 mx-auto mx-xl-0 my-3 border-light w-43" />
                  <p className="font-size-lg text-black-50 mt-15">
                    You can look on the existing survey for information that you
                    are interested on. You can also help other users by
                    answering active surveys
                  </p>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Card
                className="shadow-xxl"
                style={{ height: "350px", width: "100%" }}
              >
                <img src={SurveyExample}></img>
              </Card>
            </Grid>
            <div className="divider border-2 mx-auto mx-xl-0 my-3 border-light w-43" />
          </Grid>
          <Grid container spacing={4} className="pb-4">
            <Grid item xs={12} lg={6}>
              <Card
                className="shadow-xxl"
                style={{ height: "340px", width: "100%" }}
              >
                <img src={SurveyPercentage}></img>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              className="d-flex align-items-center text-center text-xl-right"
            >
              <div className="mb-5 mb-xl-0">
                <div className="mb-4">
                  <h1 className="display-3 mt-3 font-weight-bold text-secondary text-center">
                    Obtain results
                  </h1>
                  <div className="divider border-2 mx-auto mx-xl-0 my-3 border-light w-43" />
                  <p className="font-size-lg text-black-50 text-left ">
                    Review your Survey results in nice Pie Graphics that
                    includes the answers in percentages.
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
          <div className="divider border-2 mx-auto mx-xl-0 my-3 border-light w-43" />
          <Grid container spacing={4} className="pb-4">
            <Grid
              item
              xs={12}
              lg={6}
              className="mb-10 d-flex align-items-center text-center text-xl-left"
            >
              <div className="mb-10 mb-xl-0">
                <div className="mb-3">
                  <h1 className="display-3 mt-3 font-weight-bold text-secondary">
                    Create your own Survey
                  </h1>
                  <div className="divider border-2 mx-auto mx-xl-0 my-3 border-light w-43" />
                  <p className="font-size-lg text-black-50">
                    Created yout own survey and allow other users help you out
                    predict future elections.
                  </p>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Card>
                <img
                  src={SurveyQuestions}
                  style={{ height: "350px", width: "100%" }}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </Fragment>
  );
}
