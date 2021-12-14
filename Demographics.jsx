import { useState, useEffect, React } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";
import MapViewAsTable from "../../tables/MapViewAsTable";
import * as mapService from "../../../services/mapService";
import { MapContainer, GeoJSON } from "react-leaflet";
//import { onEachSeccionDemographics } from "./MapGeoJsonOptions";
import "leaflet/dist/leaflet.css";
import "./maps.css";
import SectionPopulationInfo from "./SectionPopulationInfo";

import debug from "sabio-debug";
const _logger = debug.extend("Demographics");

const Demographics = () => {
  const [layer, setLayer] = useState("2");
  const [distritos, setDistritos] = useState({});
  const [secciones, setSecciones] = useState({});
  const [center, setCenter] = useState();
  const [selectBy, setSelectBy] = useState({
    stateId: 26,
    regionTypeId: 3,
    year: 2017,
  });
  const [populationInfo, setPopulationInfo] = useState();

  useEffect(() => {
    if (layer === "1") {
      mapService
        .getStateDistrictsByRegionByYear(
          selectBy.stateId,
          selectBy.regionTypeId,
          selectBy.year
        )
        .then(onGetDistrictsSuccess);
    } else if (layer === "2") {
      mapService
        .getBySectionByStateId(selectBy.stateId)
        .then(onGetSectionSuccess);
    }
  }, [layer, selectBy.stateId]);

  const onGetDistrictsSuccess = (response) => {
    let center = [response.item.centerLat, response.item.centerLong];
    _logger(response.item, "District");
    setCenter(center);
    setDistritos(response.item);
  };

  const onGetSectionSuccess = (response) => {
    let center = [response.item.centerLat, response.item.centerLong];
    _logger(response.item, "Section Result");
    setCenter(center);
    setSecciones(response.item);
  };

  const onLayerChange = (e) => {
    let currentTarget = e.currentTarget;
    let newValue = currentTarget.value;

    setLayer(newValue);
  };

  const onStateChange = (e) => {
    let currentTarget = e.currentTarget;
    let newValue = currentTarget.value;

    setSelectBy({ ...selectBy, stateId: newValue });
  };

  let sectionColumns = [
    { id: "id", name: "Municipality ID" },
    { id: "municipality.name", name: "Municipality Name" },
    { id: "municipality.state.id", name: "State ID" },
    { id: "municipality.state.name", name: "State Name" },
  ];

  const mapSeccion = (seccion) => {
    return (
      <GeoJSON
        key={`${seccion.properties.population.total}-${seccion.properties.population.male}-${seccion.properties.population.femaleOver18}-${seccion.properties.population.male}-${seccion.properties.population.maleOver18}`}
        style={{
          color: "white",
          fillColor: "darkseagreen",
          weight: 2,
          fillOpacity: 1,
        }}
        data={seccion}
        onEachFeature={onEachSeccionDemographics}
      />
    );
  };

  const getLayer = () => {
    let layerGEOJSON = null;

    switch (layer) {
      case "1":
        layerGEOJSON = distritos.features?.map(mapDistrito);
        break;

      default:
        break;
    }

    switch (layer) {
      case "2":
        layerGEOJSON = secciones.features?.map(mapSeccion);
        break;

      default:
        break;
    }

    return layerGEOJSON;
  };
  const onEachSeccionDemographics = (seccion, layer) => {
    if (seccion.properties) {
      const seccionName = seccion.properties.population.section;

      layer.bindPopup(`seccion: ${seccionName} <br>`);
    }

    layer.on("mouseover", () => {
      layer.setStyle({ fillColor: "blue", fillOpacity: 1, weight: 1 });
      layer.openPopup();
    });
    layer.on("mouseout", () => {
      layer.closePopup();

      layer.setStyle({ fillColor: "darkseagreen", fillOpacity: 1, weight: 1 });
    });
    layer.on("click", () => {
      _logger(layer);
      layer.setStyle({ weight: 6 });
      let populationInfo = layer.feature.properties;
      setPopulationInfo(populationInfo);
      layer.closePopup();
    });
  };
  const returnToMap = () => {
    let populationInfo = 0;
    setPopulationInfo(populationInfo);
  };

  return (
    <Grid item xs={12} lg={12} xl={12}>
      <Card className="card-box mb-4-spacing overflow-visible">
        <div className="card-header">
          <h1>Election Map</h1>
        </div>
        <CardContent className="p-3">
          <label className="selectOptions">
            Select View:
            <select
              className="selectDesign"
              value={layer}
              onChange={onLayerChange}
            >
              {/* <option className="optionDesign" value={1}>
                Distritos
              </option> */}
              <option value={2}>Secciones</option>
            </select>
          </label>
          <br />

          <label className="selectOptions">
            Select State:
            <select
              className="selectDesign"
              value={selectBy.stateId}
              onChange={onStateChange}
            >
              <option value={1}>Aguascalientes</option>
              <option value={10}>Durango</option>
              <option value={13}>Hildago</option>
              <option value={26}>Sonora</option>
            </select>
          </label>

          <Grid container alignItems="center" justify="center" spacing={0}>
            <Grid item xs={15} className="py-4">
              <Grid container alignItems="center" justify="center">
                {populationInfo && (
                  <SectionPopulationInfo
                    populationInfo={populationInfo}
                    returnToMap={returnToMap}
                  />
                )}
                {center && (
                  <MapContainer
                    center={center}
                    zoom={6}
                    scrollWheelZoom={true}
                    id="mapid"
                    style={{
                      height: "550px",
                      width: "450px",
                      backgroundColor: "white",
                    }}
                  >
                    {/* <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  /> */}
                    {layer && getLayer()}
                  </MapContainer>
                )}
              </Grid>
              <MapViewAsTable
                endpoint="demographics"
                layer={layer}
                selectBy={selectBy}
                sectionColumns={sectionColumns}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Demographics;
