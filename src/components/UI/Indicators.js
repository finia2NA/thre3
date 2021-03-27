import React from "react"
import CheckCircle from "@material-ui/icons/CheckCircle"
// import AddCircleOutline from "@material-ui/icons/AddCircleOutline" // could use this rotated by 45 degrees (if figured out how to do that :thinking:)
import Close from "@material-ui/icons/Close"
import { LinearProgress } from "@material-ui/core"

const Indicators = (props) => {

  return(
    <div>
      <b>Status Display</b>
      <div>
      {props.matrix_ready&&
      <CheckCircle style={{color:"green"}}/>}
      {!props.matrix_ready&&
        <Close style={{color:"red"}}/>
      } Matrix Radiosity Status
    </div>

      <div>
      {props.prog_ready&&
      <CheckCircle style={{color:"green"}}/>}
      {!props.prog_ready&&
        <Close style={{color:"red"}}/>
      } Progressive Radiosity Status

      {props.working&&
      <div>
        Calculating Radiosity...
      <LinearProgress />
      </div>
      }


      </div>

      </div>
  )
}

export default Indicators