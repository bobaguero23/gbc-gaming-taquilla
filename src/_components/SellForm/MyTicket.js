import React from "react";
import { connect } from "redux-zero/react";
import { Card, Row, Col, Badge, Image } from "react-bootstrap";
import empty from "is-empty";
import actions from "../../_actions";
import { calculateTicketValue, formatNumber } from "../../_helpers/lib";

class MyTicket extends React.Component {
    raceText(races) {
        let raceArray = [];
        let raceText = [];
        for (let race of races) {
            if (
                !empty(
                    raceArray[
                        race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber
                    ]
                )
            ) {
                raceArray[
                    race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber
                ].push(race.horsesRaceByHorsesRacesId.programNumber);
            } else {
                raceArray[
                    race.horsesRaceByHorsesRacesId.raceByRacesId.raceNumber
                ] = [race.horsesRaceByHorsesRacesId.programNumber];
            }
        }

        for (let raceNumber in raceArray) {
            let horses = raceArray[raceNumber].toString();
            raceText.push(
                <>
                    {raceNumber}) <b>{horses}</b>{" "}
                </>
            );
        }

        return raceText;
    }

    render() {
        const {
            tracks,
            ticketoffice,
            sellform,
            races,
            racesIdActive,
            currencyCode,
            wagertypes,
            valueUnits,
            user,
            usersGamification
        } = this.props;

        if (empty(ticketoffice) || empty(sellform)) {
            return null;
        }

        let buttonFreeBets = false;

        let freeBets = !empty(usersGamification) ? usersGamification[0] : null;

        if(!empty(freeBets) && freeBets.freeBet >0 && [1,2,3].includes(sellform.wagerTypeId)){
            buttonFreeBets = true;
        }

        let centers_id =  (!empty(user)) ? user.centers_id : '';

        let { ticketValue, ticketCombinations } = calculateTicketValue(
            sellform,
            valueUnits
        );
        

        let track = !empty(tracks)
            ? tracks.filter((t) => t.id == sellform.tracksId)
            : null;
        let trackText = !empty(track) ? `${track[0].trackName}` : null;

        let race = !empty(races)
            ? races.filter((r) => r.id == racesIdActive)
            : null;
        let raceText = !empty(race)
            ? `Carrera Nro. ${race[0].raceNumber}`
            : null;
        let raceHorses = !empty(race)
            ? race[0].horsesRacesByRacesId.nodes
            : null;

        let wagertype = !empty(wagertypes)
            ? wagertypes.filter((w) => w.id == sellform.wagerTypeId)
            : null;
        let wagertypeText = !empty(wagertype) ? `${wagertype[0].name}` : null;

        let amountText = !empty(ticketValue)
            ? `${formatNumber(currencyCode, ticketValue)}`
            : `${formatNumber(currencyCode, 0)}`;

        let horses = Array.from(sellform.horsesRacesId);

        let horsesText = [];
        for (let horse of horses) {
            if (!empty(horse)) {
                for (let h of horse) {
                    if (!empty(h)) {
                        let horseRaceFilter = raceHorses.filter(
                            (rh) => rh.id == h.horsesRacesId
                        );
                        let horseText = !empty(horseRaceFilter) ? (
                            <tr
                                key={
                                    h.position +
                                    "--" +
                                    horseRaceFilter[0].programNumber
                                }
                            >
                                <td>{h.position}</td>
                                <td>
                                    <span
                                        className={`horse-${horseRaceFilter[0].programNumber}`}
                                    >
                                        {horseRaceFilter[0].programNumber}
                                    </span>
                                </td>
                                <td>
                                    {
                                        horseRaceFilter[0].horseByHorsesId.horseName
                                    }
                                </td>
                            </tr>
                        ) : null;
                        horsesText.push(horseText);
                    }
                }
            }
        }

        let tableHorses = !empty(horsesText) ? (
            <table>
                <thead>
                    <tr key={"ticket-hr"}>
                        <th style={{ width: "40px" }}>Posición</th>
                        <th style={{ width: "40px" }}>Nro.</th>
                        <th>Caballo</th>
                    </tr>
                </thead>
                <tbody>{horsesText}</tbody>
            </table>
        ) : null;

        return (
            <Row>
                <Col xl={12} className={"p-0"}>
                    <Card className={"my-ticket"}>
                        <Card.Body>
                            <Row>

                                <Col xl={6}>
                                    <h1>{trackText}</h1>
                                </Col>

                                <Col xl={6}>
                                    <h1 className={"text-right"}>
                                        <Badge pill variant="primary">
                                            {wagertypeText}
                                        </Badge>
                                    </h1>
                                </Col>

                                <Col xl={6}>
                                    <h2>{raceText}</h2>
                                </Col>

                                <Col xl={12}>{tableHorses}</Col>

                                <Col xl={6} className={"mt-10"}>
                                    <h1>{"Total de Ticket"}</h1>
                                </Col>

                                <Col xl={6} className={"mt-10"}>
                                    <h1 className={"text-right"}>
                                        <Badge pill variant="light">
                                            {amountText}
                                        </Badge>
                                    </h1>
                                </Col>
                            </Row>
                            {buttonFreeBets===true && ticketCombinations==1 ? 
                                <Row>
                                    <Col xl={6}>
                                        <button
                                            disabled={!empty(ticketValue) ? false : true}
                                            type="button"
                                            className="btn btn-sm btn-success btn-sell"
                                            onClick={(e) =>
                                                this.props.confirmSubmit(
                                                    this.props.races,
                                                    this.props.racesIdActive,
                                                    e
                                                )
                                            }
                                        >
                                            Apostar
                                        </button>
                                    </Col>
                                    <Col xl={6}>
                                        <button
                                            disabled={!buttonFreeBets}
                                            type="button"
                                            className="btn btn-sm btn-success btn-sell"
                                            onClick={(e) =>
                                                this.props.confirmSubmitFree(
                                                    this.props.races,
                                                    this.props.racesIdActive,
                                                    e
                                                )
                                            }
                                        >
                                            Apuesta Gratis
                                        </button> 
                                    </Col>
                                </Row>    
                                : 
                                <Row>
                                    <Col xl={12}>
                                        <button
                                        disabled={!empty(ticketValue) ? false : true}
                                        type="button"
                                        className="btn btn-sm btn-success btn-sell"
                                        onClick={(e) =>
                                            this.props.confirmSubmit(
                                                this.props.races,
                                                this.props.racesIdActive,
                                                e
                                            )
                                        }
                                    >
                                        Apostar
                                    </button>
                                    </Col>
                                </Row>
                                
                                }
                            
                            
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

const mapToProps = ({ tickets,user }) => ({
    tickets,
    user
});
const connectedMyTickets = connect(mapToProps, actions)(MyTicket);
export { connectedMyTickets as MyTicket };
