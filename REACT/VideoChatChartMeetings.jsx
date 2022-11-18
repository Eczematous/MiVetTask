import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import debug from "sabio-debug";

function VideoChatChartMeetings(props) {
  const { options, series, width, type, height } = props;
  const _logger = debug.extend("VideoChatChartMeetings");
  const location = useLocation();
  _logger(location.pathname);
  const renderTitle = () => {
    if (location.pathname === "/dashboard/vet") {
      return (
        <h4 className="mb-0" size={10}>
          Your Meeting Sessions
        </h4>
      );
    } else {
      return (
        <h3 className="mb-0" size={10}>
          Vet Meeting Sessions
        </h3>
      );
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12} lg={12} md={12} className="mb-4">
          <Card className="h-100">
            <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
              {renderTitle()}
            </Card.Header>
            <Row className="mt-3 text-center">
              <Col className="mx-3">
                <strong>Number of Meetings:</strong>
                <center>
                  <hr className="chart-line-meetings col-2" />
                </center>
              </Col>
              <Col className="mx-3">
                <strong>Total Minutes In Meetings:</strong>
                <center>
                  <hr className="chart-line-minutes col-2" />
                </center>
              </Col>
            </Row>
            <Card.Body>
              <Chart
                options={options}
                series={series}
                type={type}
                width={width}
                height={height}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
export default VideoChatChartMeetings;

VideoChatChartMeetings.propTypes = {
  options: PropTypes.shape({}),
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number.isRequired),
      colors: PropTypes.arrayOf(PropTypes.string.isRequired),
    })
  ),
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};
