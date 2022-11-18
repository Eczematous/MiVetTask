import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import VideoChatRoom from "./VideoChatRoom";
import { Col, Row, Table, Card, Button } from "react-bootstrap";
import videoChatService from "services/videoChatService";
import debug from "sabio-debug";
import VideoChatChartMeetings from "./VideoChatChartMeetings";
import { formatDateTime } from "../../utils/dateFormater";
import toastr from "toastr";
import "../../toastr/build/toastr.css";

function VideoChatLobby({ createCall, checker }) {
  const [rooms, setRooms] = useState({
    roomArray: [],
    roomComponents: [],
    chartData: {
      january: { meetings: 0, minutes: 0 },
      february: { meetings: 0, minutes: 0 },
      march: { meetings: 0, minutes: 0 },
      april: { meetings: 0, minutes: 0 },
      may: { meetings: 0, minutes: 0 },
      june: { meetings: 0, minutes: 0 },
      july: { meetings: 0, minutes: 0 },
      august: { meetings: 0, minutes: 0 },
      september: { meetings: 0, minutes: 0 },
      october: { meetings: 0, minutes: 0 },
      november: { meetings: 0, minutes: 0 },
      december: { meetings: 0, minutes: 0 },
    },
  });

  const _logger = debug.extend("VideoChatLobby");

  const createACall = () => {
    createCall().then((url) => {
      checker(url);
    });
  };

  useEffect(() => {
    videoChatService
      .getAllRooms()
      .then(onGetRoomsSuccess)
      .catch(onGetRoomsFailed);
  }, []);

  const onGetRoomsSuccess = (response) => {
    _logger("Get rooms success", response);
    toastr["success"]("Get Meetings Success");
    const data = response.items;

    setRooms((prevState) => {
      const copyRooms = { ...prevState };
      copyRooms.roomArray = data;
      copyRooms.roomComponents = data.map(mappingRooms);
      return copyRooms;
    });

    for (let index = 0; index < data.length; index++) {
      const month = data[index];
      const timeStamp = month.dateCreated;
      const convert = formatDateTime(timeStamp);
      const splitting = convert.split(" ");
      const firstPart = splitting[0];

      const duration = Math.floor(month.duration / 60);

      if (firstPart === "Dec") {
        rooms.chartData.december.minutes =
          rooms.chartData.december.minutes + duration;
        rooms.chartData.december.meetings++;
      } else if (firstPart === "Nov") {
        _logger("November Data", rooms.chartData.november);
        rooms.chartData.november.minutes =
          rooms.chartData.november.minutes + duration;
        rooms.chartData.november.meetings++;
      } else if (firstPart === "Oct") {
        rooms.chartData.october.minutes =
          rooms.chartData.october.minutes + duration;
        rooms.chartData.october.meetings++;
      } else if (firstPart === "Sep") {
        rooms.chartData.september.minutes =
          rooms.chartData.september.minutes + month.duration;
        rooms.chartData.september.meetings++;
      } else if (firstPart === "Aug") {
        rooms.chartData.august.minutes =
          rooms.chartData.august.minutes + duration;
        rooms.chartData.august.meetings++;
      } else if (firstPart === "Jul") {
        rooms.chartData.july.minutes = rooms.chartData.july.minutes + duration;
        rooms.chartData.july.meetings++;
      } else if (firstPart === "Jun") {
        rooms.chartData.june.minutes = rooms.chartData.june.minutes + duration;
        rooms.chartData.june.meetings++;
      } else if (firstPart === "May") {
        rooms.chartData.may.minutes = rooms.chartData.may.minutes + duration;
        rooms.chartData.may.meetings++;
      } else if (firstPart === "Apr") {
        rooms.chartData.april.minutes =
          rooms.chartData.april.minutes + duration;
        rooms.chartData.april.meetings++;
      } else if (firstPart === "Mar") {
        rooms.chartData.march.minutes =
          rooms.chartData.march.minutes + duration;
        rooms.chartData.march.meetings++;
      } else if (firstPart === "Feb") {
        rooms.chartData.february.minutes =
          rooms.chartData.february.minutes + duration;
        rooms.chartData.february.meetings++;
      } else if (firstPart === "Jan") {
        rooms.chartData.january.minutes =
          rooms.chartData.january.minutes + duration;
        rooms.chartData.january.meetings++;
      } else {
        return;
      }
    }
  };

  const onGetRoomsFailed = (err) => {
    _logger("Get rooms failed", err);
    toastr["error"]("Get Meetings Failed");
  };

  const mappingRooms = (room) => {
    return <VideoChatRoom room={room} key={room.id} />;
  };

  const sessionChartOptions = {
    chart: {
      toolbar: { show: !1 },
      height: 200,
      type: "line",
      zoom: { enabled: !1 },
    },
    dataLabels: { enabled: !1 },
    stroke: { width: [4, 3, 3], curve: "smooth", dashArray: [0, 5, 4] },
    legend: { show: !1 },
    colors: ["#754ffe", "#19cb98", "#ffaa46"],
    markers: { size: 0, hover: { sizeOffset: 6 } },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      labels: {
        style: {
          colors: ["#5c5776"],
          fontSize: "12px",
          fontFamily: "Inter",
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#5c5776"],
          fontSize: "12px",
          fontFamily: "Inter",
          cssClass: "apexcharts-xaxis-label",
        },
        offsetX: -12,
        offsetY: 0,
      },
    },
    tooltip: {
      y: [
        {
          title: {
            formatter: function (e) {
              return e + ":";
            },
          },
        },
        {
          title: {
            formatter: function (e) {
              return e + ":";
            },
          },
        },
        {
          title: {
            formatter: function (e) {
              return e;
            },
          },
        },
      ],
    },
    grid: { borderColor: "#f1f1f1" },
    responsive: [
      { breakpoint: 480, options: { chart: { height: 300 } } },
      { breakpoint: 1441, options: { chart: { height: 360 } } },
      { breakpoint: 1980, options: { chart: { height: 400 } } },
      { breakpoint: 2500, options: { chart: { height: 470 } } },
      { breakpoint: 3000, options: { chart: { height: 450 } } },
    ],
  };

  const sessionChartSeries = [
    {
      name: "Number Of Meetings",
      data: [
        rooms.chartData.january.meetings,
        rooms.chartData.february.meetings,
        rooms.chartData.march.meetings,
        rooms.chartData.april.meetings,
        rooms.chartData.may.meetings,
        rooms.chartData.june.meetings,
        rooms.chartData.july.meetings,
        rooms.chartData.august.meetings,
        rooms.chartData.september.meetings,
        rooms.chartData.october.meetings,
        rooms.chartData.november.meetings,
        rooms.chartData.december.meetings,
      ],
      colors: ["#754ffe"],
    },
    {
      name: "Total Minutes In Meetings",
      data: [
        rooms.chartData.january.minutes,
        rooms.chartData.february.minutes,
        rooms.chartData.march.minutes,
        rooms.chartData.april.minutes,
        rooms.chartData.may.minutes,
        rooms.chartData.june.minutes,
        rooms.chartData.july.minutes,
        rooms.chartData.august.minutes,
        rooms.chartData.september.minutes,
        rooms.chartData.october.minutes,
        rooms.chartData.november.minutes,
        rooms.chartData.december.minutes,
      ],
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xxl={2} lg={3} md={12} xs={12} className="mb-4">
          <Button onClick={createACall}>Start A Call</Button>
        </Col>
      </Row>

      <VideoChatChartMeetings
        options={sessionChartOptions}
        series={sessionChartSeries}
        type="line"
      />

      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Card>
            <Card.Header>
              <h2 className="mb-0">Meetings</h2>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive border-0 overflow-y-hidden">
                <Table hover>
                  <thead className="lightheader-room">
                    <tr>
                      <th>
                        <strong>Id</strong>
                      </th>
                      <th>
                        <strong>Date</strong>
                      </th>
                      <th>
                        <strong>Duration</strong>
                      </th>
                      <th>
                        <strong>Participants</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>{rooms.roomComponents}</tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
export default VideoChatLobby;

VideoChatLobby.propTypes = {
  createCall: PropTypes.func,
  checker: PropTypes.func,
};
