import React from 'react';

class FormQuickSell extends React.Component {

  render () {
       return (
      <div className="form-group row mb-0">
          <div className="col-2 m-0 p-0">
              <label className="m-0 p-0"><strong>No</strong></label>
              <input type="text" className="form-control form-control-sm" id="txt_numHorse" placeholder="99" />
          </div>
          <div className="col-4 m-0 p-0">
              <label className="m-0 p-0"><strong>Ejemplar</strong></label>
              <input type="text" className="form-control form-control-sm" id="txt_name" placeholder="Rucio Moro" disabled />
          </div>
          <div className="col-2 m-0 p-0">
              <label className="m-0 p-0"><strong>Win</strong></label>
              <input type="text" className="form-control form-control-sm" id="txt_win" placeholder="999" />
          </div>
          <div className="col-2 m-0 p-0">
              <label className="m-0 p-0"><strong>Place</strong></label>
              <input type="text" className="form-control form-control-sm" id="txt_pla" placeholder="999" />
          </div>
          <div className="col-2 m-0 p-0">
              <label className="m-0 p-0"><strong>Show</strong></label>
              <input type="text" className="form-control form-control-sm" id="txt_sho" placeholder="999" />
          </div>     
    </div>
  )
   }
}

export default FormQuickSell;

