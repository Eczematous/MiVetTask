import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Image } from "react-bootstrap";
import StatRightChart from "./VetDashboardCharts";
import ApexCharts from "../analytics/ApexCharts";
import InvoicesData from "./invoicesData";
import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import BestSellingServicesData from "./bestSellingServicesData";
import { chartData } from "./vetDashboardMainData";
import VideoChatChartMeetings from "components/videochat/VideoChatChartMeetings";
import videoChatService from "services/videoChatService";
import debug from "sabio-debug";
import { formatDateTime } from "../../../utils/dateFormater";
import netUserService from "services/userService";
import "../../videochat/videochat.css";
import VetDashboardSubscriptionLevel from "./VetDashboardSubscriptionLevel";
import subscriptionService from "services/subscriptionService";
import toastr from "toastr";
import "../../../toastr/build/toastr.css";

function VetDashboardMain() {
  const [meetings, setMeetings] = useState({
    meetingArray: [],
    userId: 0,
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

  const [subscription, setSubscription] = useState({
    productId: "",
  });

  const _logger = debug.extend("VetDashboardMain");

  useEffect(() => {
    netUserService
      .getCurrentUser()
      .then(onGetCurrentUserSuccess)
      .catch(onGetCurrentUserFailed);
  }, []);

  const onGetCurrentUserSuccess = (response) => {
    _logger("GetCurrentUser Success", response);
    const currentUserId = response.item.id;
    videoChatService
      .getRoomsByHostId(currentUserId)
      .then(getRoomsByHostIdSuccess)
      .catch(getRoomsByHostIdFailed);
    subscriptionService
      .getSubscriptionByUserId(currentUserId)
      .then(getSubscriptionByUserIdSuccess)
      .catch(getSubscriptionByUserIdFailed);
  };

  const getSubscriptionByUserIdSuccess = (response) => {
    _logger(
      "getSubscriptionByUserId Success",
      response.items[0].productId[0].stripeProductId
    );
    const productId = response.items[0].productId[0].stripeProductId;
    setSubscription((prevState) => {
      const copySubscription = { ...prevState };
      copySubscription.productId = productId;
      return copySubscription;
    });
  };

  const getSubscriptionByUserIdFailed = (err) => {
    _logger("getSubscriptionByUserId Failed", err);
    toastr["error"]("Get Meetings Failed");
  };

  const onGetCurrentUserFailed = (err) => {
    _logger("GetCurrentUser Failed", err);
  };

  const getRoomsByHostIdSuccess = (response) => {
    _logger("GetRoomsByHostId Success", response);
    const data = response.items;

    setMeetings((prevState) => {
      const copyMeetings = { ...prevState };
      return copyMeetings;
    });

    for (let index = 0; index < data.length; index++) {
      const month = data[index];
      const timeStamp = month.dateCreated;
      const convert = formatDateTime(timeStamp);
      const splitting = convert.split(" ");
      const firstPart = splitting[0];

      const duration = Math.floor(month.duration / 60);

      if (firstPart === "Dec") {
        meetings.chartData.december.minutes =
          meetings.chartData.december.minutes + duration;
        meetings.chartData.december.meetings++;
      } else if (firstPart === "Nov") {
        _logger("November Data", meetings.chartData.november);
        meetings.chartData.november.minutes =
          meetings.chartData.november.minutes + duration;
        meetings.chartData.november.meetings++;
      } else if (firstPart === "Oct") {
        meetings.chartData.october.minutes =
          meetings.chartData.october.minutes + duration;
        meetings.chartData.october.meetings++;
      } else if (firstPart === "Sep") {
        meetings.chartData.september.minutes =
          meetings.chartData.september.minutes + month.duration;
        meetings.chartData.september.meetings++;
      } else if (firstPart === "Aug") {
        meetings.chartData.august.minutes =
          meetings.chartData.august.minutes + duration;
        meetings.chartData.august.meetings++;
      } else if (firstPart === "Jul") {
        meetings.chartData.july.minutes =
          meetings.chartData.july.minutes + duration;
        meetings.chartData.july.meetings++;
      } else if (firstPart === "Jun") {
        meetings.chartData.june.minutes =
          meetings.chartData.june.minutes + duration;
        meetings.chartData.june.meetings++;
      } else if (firstPart === "May") {
        meetings.chartData.may.minutes =
          meetings.chartData.may.minutes + duration;
        meetings.chartData.may.meetings++;
      } else if (firstPart === "Apr") {
        meetings.chartData.april.minutes =
          meetings.chartData.april.minutes + duration;
        meetings.chartData.april.meetings++;
      } else if (firstPart === "Mar") {
        meetings.chartData.march.minutes =
          meetings.chartData.march.minutes + duration;
        meetings.chartData.march.meetings++;
      } else if (firstPart === "Feb") {
        meetings.chartData.february.minutes =
          meetings.chartData.february.minutes + duration;
        meetings.chartData.february.meetings++;
      } else if (firstPart === "Jan") {
        meetings.chartData.january.minutes =
          meetings.chartData.january.minutes + duration;
        meetings.chartData.january.meetings++;
      } else {
        return;
      }
    }
  };

  const getRoomsByHostIdFailed = (err) => {
    _logger("GetRoomsByHostId Success", err);
  };

  const meetingChartOptions = {
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

  const meetingChartSeries = [
    {
      name: "Number Of Meetings",
      data: [
        meetings.chartData.january.meetings,
        meetings.chartData.february.meetings,
        meetings.chartData.march.meetings,
        meetings.chartData.april.meetings,
        meetings.chartData.may.meetings,
        meetings.chartData.june.meetings,
        meetings.chartData.july.meetings,
        meetings.chartData.august.meetings,
        meetings.chartData.september.meetings,
        meetings.chartData.october.meetings,
        meetings.chartData.november.meetings,
        meetings.chartData.december.meetings,
      ],
      colors: ["#754ffe"],
    },
    {
      name: "Total Minutes In Meetings",
      data: [
        meetings.chartData.january.minutes,
        meetings.chartData.february.minutes,
        meetings.chartData.march.minutes,
        meetings.chartData.april.minutes,
        meetings.chartData.may.minutes,
        meetings.chartData.june.minutes,
        meetings.chartData.july.minutes,
        meetings.chartData.august.minutes,
        meetings.chartData.september.minutes,
        meetings.chartData.october.minutes,
        meetings.chartData.november.minutes,
        meetings.chartData.december.minutes,
      ],
    },
  ];

  const bestSellingMapper = (item, index) => {
    return (
      <tr key={index}>
        <td className="align-middle border-top-0 ">
          <Link to="#">
            <div className="d-lg-flex align-items-center">
              <Image src={item.image} alt="" className="rounded img-4by3-lg" />
              <h5 className="mb-0 ms-lg-3 mt-lg-0 mt-2 text-primary-hover">
                {item.title}
              </h5>
            </div>
          </Link>
        </td>
        <td className="align-middle border-top-0">{item.sales}</td>
        <td className="align-middle border-top-0">${item.amount} </td>
        <td className="align-middle border-top-0">
          <ActionMenu />
        </td>
      </tr>
    );
  };

  const invoiceMapper = (item, index) => {
    return (
      <tr key={index}>
        <td className="align-middle border-top-0 ">
          <Link to="#">
            <div className="d-lg-flex align-items-center">
              <Image src={item.image} alt="" className="rounded img-4by3-lg" />
              <h5 className="mb-0 ms-lg-3 mt-lg-0 mt-2 text-primary-hover">
                {item.title}
              </h5>
            </div>
          </Link>
        </td>
        <td className="align-middle border-top-0">
          <p>{item.horseName}</p>
        </td>
        <td className="align-middle border-top-0">${item.amount} </td>
        <td className="align-middle border-top-0">
          <p>{item.paid}</p>
        </td>
        <td className="align-middle border-top-0">
          <ActionMenu />
        </td>
      </tr>
    );
  };

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col className="mb-4 mb-lg-0 ">
          <StatRightChart
            title="Appointments"
            value="10"
            summaryValue="2 Today"
            summaryIcon=""
            isSummaryIconShown={false}
            classValue=""
            chartName="Appointments"
            chartData={chartData}
          ></StatRightChart>
        </Col>
      </Row>

      <Row className="my-4">
        <Col>
          <VetDashboardSubscriptionLevel subscription={subscription} />
        </Col>
      </Row>

      {/* <!-- Card --> */}
      <Card className="my-4">
        <Card.Header>
          <h3 className="h4 mb-0">Total Clients</h3>
        </Card.Header>
        <Card.Body>
          <ApexCharts
            options={chartData.totalClient.TotalClientChartOptions}
            series={chartData.totalClient.TotalClientChartSeries}
            height={200}
            type="line"
          />
        </Card.Body>
      </Card>

      {/* <!-- Card --> */}
      <Card className="my-4">
        <Card.Header>
          <h3 className="h4 mb-0">New Clients</h3>
        </Card.Header>
        <Card.Body>
          <ApexCharts
            options={chartData.newClient.NewClientChartOptions}
            series={chartData.newClient.NewClientChartSeries}
            height={200}
            type="bar"
          />
        </Card.Body>
      </Card>

      {/* <!-- Meetings Card --> */}

      <VideoChatChartMeetings
        options={meetingChartOptions}
        series={meetingChartSeries}
        type="line"
      />

      {/* Invoices card */}
      <Card className="mt-4">
        <Card.Header>
          <h3 className="mb-0 h4">Invoices</h3>
        </Card.Header>
        <Card.Body className="p-0 ">
          <div className="table-responsive border-0 ">
            <Table className="mb-0 text-nowrap ">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="border-0">
                    Services
                  </th>
                  <th scope="col" className="border-0">
                    HorseName
                  </th>
                  <th scope="col" className="border-0">
                    AMOUNT
                  </th>
                  <th scope="col" className="border-0">
                    Status
                  </th>
                  <th scope="col" className="border-0"></th>
                </tr>
              </thead>
              <tbody>{InvoicesData.map(invoiceMapper)}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      {/* <!-- Card --> */}
      <Card className="mt-4">
        <Card.Header>
          <h3 className="mb-0 h4">Best Selling Services</h3>
        </Card.Header>
        <Card.Body className="p-0 ">
          <div className="table-responsive border-0 ">
            <Table className="mb-0 text-nowrap ">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="border-0">
                    Services
                  </th>
                  <th scope="col" className="border-0">
                    SALES
                  </th>
                  <th scope="col" className="border-0">
                    AMOUNT
                  </th>
                  <th scope="col" className="border-0"></th>
                </tr>
              </thead>
              <tbody>{BestSellingServicesData.map(bestSellingMapper)}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default VetDashboardMain;
