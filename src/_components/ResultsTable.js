import React from 'react';
import empty from 'is-empty';
import {Tabs,Tab,Form,Alert} from 'react-bootstrap';

class ResultsTable extends React.Component {
    constructor(props) { 
        super(props);
    }


    render() {
        let trResults=[];
        let results = this.props.results;
        let races = (empty(this.props.raceId) ?  results : results.filter((r) => r.id==this.props.raceId));
        
        if(!empty(races))
        {
        
            for(let i=0;i<races.length;i++)
            {
                let resultsRaces = races[i].resultsByRacesId ? races[i].resultsByRacesId.nodes : [];
                if(resultsRaces.length>0)
                {
                    if(empty(this.props.raceId)){
                        trResults.push(<tr className="tr-results" key={Math.random()}>
                                        <td colSpan="5">Carrera: {races[i].raceNumber}</td>
                                    </tr>);

                    } else {
                        trResults.push(<tr className="tr-results" key={Math.random()}>
                                        <td colSpan="5" className={'text-center'}><b>Resultados</b></td>
                                    </tr>);
                    }
                    
                    trResults.push(<tr key={Math.random()}><td><b>Pos.</b></td><td><b>#</b></td><td><b>Caballo</b></td><td><b>Win</b></td><td><b>Place</b></td><td><b>Show</b></td></tr>);
                }
                for(let k=0;k<resultsRaces.length;k++)
                {
                    trResults.push(<tr key={Math.random()}>
                        <td>{resultsRaces[k].position}</td>
                        <td><span className={`horse-${resultsRaces[k].horsesRaceByHorsesRacesId.programNumber}`}>{resultsRaces[k].horsesRaceByHorsesRacesId.programNumber}</span></td>
                        <td>{resultsRaces[k].horsesRaceByHorsesRacesId.horseByHorsesId.horseName}</td>
                        <td>{resultsRaces[k].win}</td>
                        <td>{resultsRaces[k].place}</td>
                        <td>{resultsRaces[k].show}</td>
                        </tr>);
                }
                let exoticNodes = races[i].resultsExoticsByRacesId ? races[i].resultsExoticsByRacesId.nodes : [];
                if(exoticNodes.length>0)
                {
                    trResults.push(<tr key={Math.random()}><td colSpan="3"><b>Apuesta</b></td><td><b>Combinación ganadora</b></td><td><b>Dividendo</b></td><td><b>Base</b></td></tr>);
                }
                for(let k=0;k<exoticNodes.length;k++)
                {
                    trResults.push(<tr key={Math.random()}>
                        <td colSpan="3">{exoticNodes[k].wagerTypeByWagerTypeId.name}</td>
                        <td>{exoticNodes[k].winningNumber}</td>
                        <td>{exoticNodes[k].payoffAmount}</td>
                        <td>{exoticNodes[k].baseAmount}</td>
                        </tr>);
                }
            }
        }

        return (
                <div className="table-responsive">
                    {(!empty(trResults) ? 
                        <table className="table">
                            <tbody>
                                {trResults}
                            </tbody>
                        </table>
                        : <><Alert key={Math.random()} variant="primary" className="alertRaceResult">Esperando Resultados..</Alert></>
                    )}
               </div>
        );
    }
    
}

// Export the class
export default ResultsTable;