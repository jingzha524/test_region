import { Container, Grid,Table, Header,Label, Menu,  Loader, Icon} from 'semantic-ui-react'
import React, { useEffect, useState } from "react";
import { scaleQuantile } from "d3-scale";
import _ from "lodash";
import {
  VictoryChart,
  VictoryBoxPlot,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryContainer,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryLegend,
  VictoryLine,
  VictoryLabel,
  VictoryScatter,
  VictoryPie
} from "victory";
import ReactTooltip from "react-tooltip";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// import allStates from "./data/allstates.json";

const geoUrl =
  "https://raw.githubusercontent.com/JZCS2018/ga_county_zipcode_map/master/county_topo/region_us.json";

const colorPalette = [
  "#e1dce2",
  "#d3b6cd",
  "#bf88b5",
  "#af5194",
  "#99528c",
  "#633c70"
];

export default function Test_region(props) {
  const [colorScale, setColorScale] = useState();
  const [data, setData] = useState();
  const [regions, setRegions] = useState('');
  const countyColor = "#f2a900";

  const metric = "Delta_B.1.617.2";

  useEffect(() => {
    fetch("/data/static.json")
      .then(res => res.json())
      .then(x => {
        setData(x);
        const cs = scaleQuantile()
          .domain(
            _.map(
              _.filter(
                _.map(x, (d, k) => {
                  d.regionCode = k;
                  return d;
                }),
                (d) => d[metric] > 0 && d.regionCode.length > 0
              ),
              (d) => d[metric]
            )
          )
          .range(colorPalette);

        let scaleMap = {};
        _.each(x, (d) => {
          if (d[metric] >= 0) {
            scaleMap[d["regionCode"]] = cs(d[metric]);
          }
        });

        setColorScale(scaleMap);
        // console.log(scaleMap);
      });
  }, []);
  if (data) {
    return (
      <div>
      <Container style={{marginTop: '8em', minWidth: '1260px'}}>
      <Grid>     
      <Grid.Column> 
      <ComposableMap  projection="geoAlbersUsa">
        <Geographies data-tip = 'map' data-for='map' geography={geoUrl}>
          {({ geographies }) => (geographies.map(geo =>
            <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                      stroke: "#607D8B",
                      strokeWidth: 0.95,
                      outline: "none",
                  },
                  pressed: {
                      outline: "none",}
              }}
              onMouseEnter={() => {
                setRegions(geo.properties.regionCode);
                // console.log(colorScale["1"]);
                // console.log(regions);
                // console.log(geo.properties.regionCode)
              }}
                    fill={
                    (regions === geo.properties.regionCode)
                      ? countyColor
                      : colorScale[geo.properties.regionCode]
                        
                      }
                />     
            
          ))}
        </Geographies>
      </ComposableMap>
      </Grid.Column>
      </Grid>
      </Container>
      <ReactTooltip id='map'backgroundColor='white'><Grid>
                            <Grid.Row>
                            <VictoryChart domainPadding={20}>
                            <VictoryBoxPlot
                              // boxWidth={5}
                              width={40} height={40}

                              data={[
                                { x: 1, y: [1, 2, 3, 5] },
                                { x: 2, y: [3, 2, 8, 10] },
                                { x: 3, y: [2, 8, 6, 5] },
                                { x: 4, y: [1, 3, 2, 9] }
                              ]}
                            />
                            </VictoryChart>
                            </Grid.Row>
                            <Grid.Row>
                            <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
        <Table.HeaderCell>Header</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      <Table.Row>
        <Table.Cell>
          <Label ribbon>First</Label>
        </Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
      </Table.Row>
      <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
  </Grid.Row>      
  </Grid>   
                            
                            </ReactTooltip>
                            </div>
    );
    
  }
  else {
            return <Loader active inline='centered' />
        }
}