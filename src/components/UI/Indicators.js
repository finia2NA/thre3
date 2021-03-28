import React from "react"
import CheckCircle from "@material-ui/icons/CheckCircle"
// import AddCircleOutline from "@material-ui/icons/AddCircleOutline" // could use this rotated by 45 degrees (if figured out how to do that :thinking:)
import Close from "@material-ui/icons/Close"
import { LinearProgress } from "@material-ui/core"

const Indicators = (props) => {

  return(
    <div>
      <div>
      {props.matrix_ready&&
      <CheckCircle style={{color:"green"}}/>}
      {!props.matrix_ready&&
        <Close style={{color:"red"}}/>
      } Matrix Radiosity {!props.matrix_ready && <b>not</b>} available
    </div>

      <div>
      {props.prog_ready&&
      <CheckCircle style={{color:"green"}}/>}
      {!props.prog_ready&&
        <Close style={{color:"red"}}/>
      } Progressive Radiosity {!props.prog_ready && <b>not</b>} available

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