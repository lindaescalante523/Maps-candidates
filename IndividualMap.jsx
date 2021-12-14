import { useState, useEffect, React } from "react";
import { Grid /*, Card, CardContent*/ } from "@material-ui/core";
import { MapContainer, GeoJSON } from "react-leaflet";
import * as mapService from "../../../services/mapService";
import { onEachState } from "./MapGeoJsonOptions";
// import MapViewAsTable from "../../tables/MapViewAsTable";
import "./map.css";
import "leaflet/dist/leaflet.css";

import debug from "sabio-debug";
import { staticMapOptions } from "./helperMapOptions";

const _logger = debug.extend("Maps");

const IndividualMap = () => {
  // const [layer, setLayer] = useState("1");
  const [distritos, setDistritos] = useState({});
  const [center, setCenter] = useState();
  const [selectBy /*, setSelectBy*/] = useState({
    stateId: "2",
    year: "2017",
  });

  useEffect(() => {
    mapService
      .getGovernorResultsByYearByStateId(selectBy.year, selectBy.stateId)
      .then(onGetResultsSuccess);
  }, [selectBy.stateId, selectBy.year]);

  const onGetResultsSuccess = (response) => {
    let center = [response.item.centerLat, response.item.centerLong];
    _logger(response.item, `Center: ${center}`);
    setCenter(center);
    setDistritos(response.item);
  };

  // const onLayerChange = (e) => {
  //   let currentTarget = e.currentTarget;
  //   let newValue = currentTarget.value;

  //   setLayer(newValue);
  // };

  // const onYearChange = (e) => {
  //   let currentTarget = e.currentTarget;
  //   let newValue = currentTarget.value;

  //   setSelectBy({ ...selectBy, year: newValue });
  // };

  // const onStateChange = (e) => {
  //   let currentTarget = e.currentTarget;
  //   let newValue = currentTarget.value;

  //   setSelectBy({ ...selectBy, stateId: newValue });
  // };

  const mapState = (state) => {
    _logger(state, "Mapper");
    return (
      <GeoJSON
        key={`${state.properties.state.name}-${state.properties.state.id}`}
        style={{ color: "white", weight: 0.4, fillOpacity: 1 }}
        data={state}
        onEachFeature={onEachState}
      />
    );
  };

  return (
    <Grid item xs={12} lg={12} xl={12}>
      {/* <Card className="card-box mb-4-spacing overflow-visible">
        <div className="card-header">
          {/* <h1>Election Map</h1> */}
      {/* </div>
        <CardContent className="p-3"> */}
      {/* <label className="selectOptions">
            Select View:
            <select
              className="selectDesign"
              value={layer}
              onChange={onLayerChange}
            >
              <option className="optionDesign" value={1}>
                Distritos
              </option>
              <option value={2}>Secciones</option>
            </select>
          </label>
          <br /> */}
      {/* <label className="selectOptions">
            Select Year:
            <select
              className="selectDesign"
              value={selectBy.year}
              onChange={onYearChange}
            >
              <option value={2017}>2017</option>
              <option value={2021}>2021</option>
            </select>
          </label>
          <br /> */}

      {/* <label className="selectOptions">
            Select State:
            <select
              className="selectDesign"
              value={selectBy.stateId}
              onChange={onStateChange}
            >
              <option value={1}>Aguascalientes</option>
              <option value={3}>Baja California Sur</option>
              <option value={10}>Durango</option>
              <option value={13}>Hildago</option>
              <option value={26}>Sonora</option>
            </select>
          </label> */}

      <Grid container alignItems="center" justify="center" spacing={0}>
        <Grid item xs={10} className="py-4">
          {center && (
            <MapContainer
              {...staticMapOptions}
              center={center}
              zoom={6.48}
              id="indMapId"
            >
              {distritos.features?.map(mapState)}
            </MapContainer>
          )}
        </Grid>
      </Grid>
      {/* </CardContent>
      </Card> */}
    </Grid>
  );
};

export default IndividualMap;
