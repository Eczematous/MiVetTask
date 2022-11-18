import React from "react";
import { Card, Button, OverlayTrigger, Tooltip, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import service from "services/stripeService";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

function VetDashboardSubscriptionLevel({ subscription }) {
  const _logger = debug.extend("VetDashboardSubscriptionLevel");
  _logger("subscription is passed --->", subscription);
  const navigate = useNavigate();

  const renderSubscription = () => {
    if (subscription.productId === "prod_MWqqW4uZyPFvD5") {
      return (
        <React.Fragment>
          <h4 className="subscription-bronze">
            <strong className="darken-font">Subscription Tier: </strong>{" "}
            Standard
          </h4>
          Want more customers? Help more animals in need? Upgrade your
          subscription tier to Advanced or Ultimate!
          <Row className="justify-content-end">
            <OverlayTrigger
              key="top1"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Advanced:{" "}
                  <ul>
                    <li>$2,400</li>
                    <li>Up to 250 customers</li>
                  </ul>
                </Tooltip>
              }
            >
              <Button className="mx-1 col-1 px-1" onClick={upgradeToAdvanced}>
                Advanced
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              key="top2"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Ultimate:
                  <ul>
                    <li>$4,200</li>
                    <li>Up to 500 customers</li>
                  </ul>
                </Tooltip>
              }
            >
              <Button className="mx-1 col-1 px-1" onClick={upgradeToUltimate}>
                Ultimate
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              key="top3"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">View All Subscriptions</Tooltip>
              }
            >
              <Button
                className="mx-1 col-1 px-1"
                onClick={viewAllSubscriptions}
              >
                View All
              </Button>
            </OverlayTrigger>
          </Row>
        </React.Fragment>
      );
    } else if (subscription.productId === "prod_MWqsyKDNQtSNe6") {
      return (
        <React.Fragment>
          <h4 className="subscription-silver">
            <strong className="darken-font">Subscription Tier: </strong>{" "}
            Advanced
          </h4>
          Want more customers? Help more animals in need? Upgrade your
          subscription tier to Ultimate!
          <Row className="justify-content-end">
            <OverlayTrigger
              key="top4"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Ultimate:
                  <ul>
                    <li>$4,200</li>
                    <li>Up to 500 customers</li>
                  </ul>
                </Tooltip>
              }
            >
              <Button className="mx-1 col-1 px-1" onClick={upgradeToUltimate}>
                Ultimate
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              key="top5"
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">View All Subscriptions</Tooltip>
              }
            >
              <Button
                className="mx-1 col-1 px-1"
                onClick={viewAllSubscriptions}
              >
                View All
              </Button>
            </OverlayTrigger>
          </Row>
        </React.Fragment>
      );
    } else if (subscription.productId === "prod_MWqwfeeqMVuHgC") {
      return (
        <React.Fragment>
          <h4 className="subscription-gold">
            <strong className="darken-font">Subscription Tier: </strong>{" "}
            Ultimate
          </h4>
          Congrats! You have the best Subscription Tier there is! Helping as
          many customers as you can, you are the best!
        </React.Fragment>
      );
    } else {
      return;
    }
  };
  const viewAllSubscriptions = () => {
    navigate("/subscriptions");
  };
  const upgradeToAdvanced = () => {
    const advanced = "prod_MWqsyKDNQtSNe6";
    let payload = {
      priceId: "price_1LnnB1IdaJH1yFA5tS2zP8sJ",
      customer: {
        customer: "Mivet Customer",
      },
      productId: advanced,
    };

    service
      .createCustomer(payload)
      .then(onCreateCustomerSuccess)
      .catch(onCreateCustomerError);
  };
  const upgradeToUltimate = () => {
    const ultimate = "prod_MWqwfeeqMVuHgC";
    let payload = {
      priceId: "price_1LnnEDIdaJH1yFA5rka4XQKM",
      customer: {
        customer: "Mivet Customer",
      },
      productId: ultimate,
    };

    service
      .createCustomer(payload)
      .then(onCreateCustomerSuccess)
      .catch(onCreateCustomerError);
  };

  const onCreateCustomerSuccess = (response) => {
    _logger("onCreateCustomerSuccess, RESPONSE", response);

    let stripeCustomer = { userId: 0, customerId: response.data.item.id };
    let price = response.priceId;
    let productId = response.productId;
    let payload = {
      priceId: price,
      customerId: stripeCustomer.customerId,
      productId: productId,
    };

    service
      .subscriptionService(payload)
      .then(onSubscribeSuccess)
      .catch(onSubscribeError);
  };
  const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_API_KEY;
  const stripePromise = loadStripe(PUBLIC_KEY);
  const onCreateCustomerError = (error) => {
    _logger("onCreateCustomerError", error);
  };
  const onSubscribeSuccess = async (response) => {
    _logger("ProductIdPRODUCT", response);

    const stripe = await stripePromise;

    stripe.redirectToCheckout({ sessionId: response.data.item });
  };

  const onSubscribeError = (error) => {
    _logger("onSubscribeError", error);
  };

  return (
    <Card>
      <Card.Header>
        <h4>Subcription</h4>
      </Card.Header>
      <Card.Body>{renderSubscription()}</Card.Body>
    </Card>
  );
}

export default VetDashboardSubscriptionLevel;

VetDashboardSubscriptionLevel.propTypes = {
  subscription: PropTypes.shape({ productId: PropTypes.string }),
};
